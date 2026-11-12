"use client";

/**
 * AtlasMap — the interactive map.
 *
 * RESPONSIBILITY
 * Draw what it is told to draw for a given year. It contains no historical
 * facts: outlines come from /geo/territories.json, places and colours from the
 * data layer, and "which outline applies in which year" from src/lib/atlas.
 *
 * HOW REACT AND MAPLIBRE SHARE THE WORK
 * MapLibre owns a <canvas> and its own internal state; React must not re-create
 * it on every render. So:
 *   1. one effect creates the map once and destroys it on unmount;
 *   2. small effects push prop changes INTO the existing map
 *      (new year → new layer filter, new selection → new paint, …).
 * Callback props are kept in refs so that changing them never rebuilds the map.
 *
 * Place names are HTML elements (MapLibre "Markers"), not map text layers:
 * the browser then shapes Persian script correctly and no font server is needed.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AttributionControl,
  Map as MapLibreMap,
  Marker,
  NavigationControl,
  setWorkerUrl,
  type FilterSpecification,
  type ExpressionSpecification,
  type GeoJSONSourceSpecification,
  type MapMouseEvent,
} from "maplibre-gl";
import { RotateCcw, TriangleAlert, WifiOff } from "lucide-react";
import { useI18n } from "@/i18n/LocaleProvider";
import { fill } from "@/i18n";
import { entities, events, getEntity, places, placesOfEntity, territories } from "@/data";
import { geoLabels } from "@/data/geo-labels";
import { entitiesActiveIn, placesVisibleIn, resolveTerritory } from "@/lib/atlas";
import { formatYear } from "@/lib/dates";
import { cn } from "@/lib/cn";
import { isOnlineBasemapReachable, offlineStyle, onlineStyle, ONLINE_SOURCE_ID } from "./basemap";
import { boundsOfPoints, loadTerritories, pointsOfFeatures, type Bounds, type TerritoryCollection } from "./territory-data";

export interface AtlasMapProps {
  /** Selected year (astronomical numbering). */
  year: number;
  selectedEntityId?: string | null;
  selectedPlaceId?: string | null;
  /** Draw nearest-in-time outlines as dotted reference lines for entities that have none this year. */
  showReference?: boolean;
  /** Restrict the map to one entity (used by the profile mini-map). */
  focusEntityId?: string;
  /** false = a static picture: no panning, zooming or clicking. */
  interactive?: boolean;
  /** Require Ctrl/two fingers to zoom, so the map does not hijack page scrolling. */
  cooperativeGestures?: boolean;
  onSelectEntity?: (entityId: string) => void;
  onSelectPlace?: (placeId: string) => void;
  className?: string;
}

/** The whole Old World, from the Atlantic to the Yellow Sea. */
const HOME_BOUNDS: Bounds = [
  [-11, 9],
  [127, 56],
];

const LAYER = {
  fill: "territory-fill",
  line: "territory-line",
  influenceLine: "territory-line-influence",
  reference: "territory-reference",
} as const;

const NOTHING: FilterSpecification = ["==", ["get", "id"], "__none__"];

/** Which labels win when two would overlap: lower number = kept first. */
const LABEL_RANK: Record<string, number> = { capital: 0, city: 1, battlefield: 1, site: 2 };

/**
 * Hide place labels that would overlap a more important one.
 * Plain DOM measurement, run after the map stops moving: with a few dozen
 * markers this is far cheaper than it looks, and it needs no React re-render.
 */
function declutterLabels(container: HTMLElement) {
  const markers = [...container.querySelectorAll<HTMLElement>(".atlas-marker")];
  const labelOf = (marker: HTMLElement) => marker.querySelector<HTMLElement>(".atlas-marker__label");
  // 1. show everything again, so every label can be measured
  for (const marker of markers) labelOf(marker)?.removeAttribute("data-clash");
  // 2. most important first
  markers.sort(
    (a, b) =>
      Number(b.dataset.active === "true") - Number(a.dataset.active === "true") ||
      (LABEL_RANK[a.dataset.kind ?? ""] ?? 3) - (LABEL_RANK[b.dataset.kind ?? ""] ?? 3),
  );
  // 3. keep a label only if it touches none of the labels already kept
  const kept: DOMRect[] = [];
  for (const marker of markers) {
    const label = labelOf(marker);
    if (!label) continue;
    const box = label.getBoundingClientRect();
    if (box.width === 0) continue; // already hidden by the zoom-based density rule
    const clashes = kept.some((other) => box.left < other.right + 4 && box.right > other.left - 4 && box.top < other.bottom + 1 && box.bottom > other.top - 1);
    if (clashes) label.setAttribute("data-clash", "true");
    else kept.push(box);
  }
}

let workerConfigured = false;

function configureWorker() {
  if (workerConfigured) return;
  // See scripts/copy-map-worker.mjs for why the worker is served from /public.
  setWorkerUrl(`${window.location.origin}/vendor/maplibre-gl-worker.mjs`);
  workerConfigured = true;
}

type Status = "loading" | "ready" | "failed";

export default function AtlasMap({
  year,
  selectedEntityId = null,
  selectedPlaceId = null,
  showReference = false,
  focusEntityId,
  interactive = true,
  cooperativeGestures = false,
  onSelectEntity,
  onSelectPlace,
  className,
}: AtlasMapProps) {
  const { t, locale } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const dataRef = useRef<TerritoryCollection | null>(null);
  const markersRef = useRef<Marker[]>([]);

  const [status, setStatus] = useState<Status>("loading");
  const [basemap, setBasemap] = useState<"online" | "offline">("online");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Latest callbacks, readable from map event handlers without re-binding them.
  const onSelectEntityRef = useRef(onSelectEntity);
  const onSelectPlaceRef = useRef(onSelectPlace);
  useEffect(() => {
    onSelectEntityRef.current = onSelectEntity;
    onSelectPlaceRef.current = onSelectPlace;
  }, [onSelectEntity, onSelectPlace]);

  /* ── which reference outlines apply this year ── */
  const referenceIds = useMemo(() => {
    if (!showReference) return [];
    const candidates = focusEntityId ? entities.filter((e) => e.id === focusEntityId) : entitiesActiveIn(year, entities);
    return candidates
      .map((entity) => resolveTerritory(entity.id, year, territories).nearest?.id)
      .filter((id): id is string => Boolean(id));
  }, [showReference, focusEntityId, year]);

  /* ── push year / selection / reference state into the map ── */
  const applyState = useCallback(() => {
    const map = mapRef.current;
    if (!map || !map.getLayer(LAYER.fill)) return;

    const inYear: ExpressionSpecification[] = [
      ["<=", ["get", "validFrom"], year],
      [">=", ["get", "validTo"], year],
    ];
    if (focusEntityId) inYear.push(["in", `|${focusEntityId}|`, ["get", "entityKey"]]);

    map.setFilter(LAYER.fill, ["all", ...inYear]);
    map.setFilter(LAYER.line, ["all", ...inYear, ["!=", ["get", "representation"], "influence"]]);
    map.setFilter(LAYER.influenceLine, ["all", ...inYear, ["==", ["get", "representation"], "influence"]]);
    map.setFilter(LAYER.reference, referenceIds.length > 0 ? ["in", ["get", "id"], ["literal", referenceIds]] : NOTHING);

    map.setPaintProperty(LAYER.fill, "fill-opacity", [
      "case",
      ["==", ["get", "primaryEntity"], selectedEntityId ?? "__none__"],
      0.36,
      ["==", ["get", "representation"], "influence"],
      0.08,
      0.19,
    ]);
    map.setPaintProperty(LAYER.line, "line-width", [
      "case",
      ["==", ["get", "primaryEntity"], selectedEntityId ?? "__none__"],
      2.2,
      1.2,
    ]);
  }, [year, focusEntityId, referenceIds, selectedEntityId]);

  const applyStateRef = useRef(applyState);
  useEffect(() => {
    applyStateRef.current = applyState;
    applyState();
  }, [applyState]);

  /* ── create the map once ── */
  useEffect(() => {
    let cancelled = false;
    let map: MapLibreMap | null = null;

    const installOverlays = (target: MapLibreMap, data: TerritoryCollection) => {
      if (target.getSource("territories")) return;
      target.addSource("territories", { type: "geojson", data: data as unknown as GeoJSONSourceSpecification["data"] });
      target.addLayer({
        id: LAYER.fill,
        type: "fill",
        source: "territories",
        filter: NOTHING,
        paint: { "fill-color": ["get", "color"], "fill-opacity": 0.19 },
      });
      // Dashed edges: the visual language for "approximate", never a solid border.
      target.addLayer({
        id: LAYER.line,
        type: "line",
        source: "territories",
        filter: NOTHING,
        layout: { "line-join": "round" },
        paint: { "line-color": ["get", "color"], "line-width": 1.2, "line-opacity": 0.9, "line-dasharray": [4, 2.5] },
      });
      target.addLayer({
        id: LAYER.influenceLine,
        type: "line",
        source: "territories",
        filter: NOTHING,
        paint: { "line-color": ["get", "color"], "line-width": 1, "line-opacity": 0.75, "line-dasharray": [1, 3] },
      });
      target.addLayer({
        id: LAYER.reference,
        type: "line",
        source: "territories",
        filter: NOTHING,
        paint: { "line-color": ["get", "color"], "line-width": 1.3, "line-opacity": 0.65, "line-dasharray": [0.4, 2.6] },
      });
    };

    const start = async () => {
      configureWorker();
      const online = await isOnlineBasemapReachable();
      const container = containerRef.current;
      if (cancelled || !container) return;

      try {
        map = new MapLibreMap({
          container,
          style: online ? onlineStyle() : offlineStyle(),
          bounds: HOME_BOUNDS,
          fitBoundsOptions: { padding: 24 },
          minZoom: 1.1,
          maxZoom: 8,
          attributionControl: false,
          dragRotate: false,
          pitchWithRotate: false,
          touchPitch: false,
          interactive,
          cooperativeGestures,
        });
      } catch (error) {
        console.warn("EONOVA ATLAS: the map could not start (WebGL unavailable?)", error);
        setStatus("failed");
        return;
      }

      mapRef.current = map;
      setBasemap(online ? "online" : "offline");
      map.addControl(new AttributionControl({ compact: true }), "bottom-right");
      if (interactive) {
        map.addControl(new NavigationControl({ showCompass: false }), "top-right");
        map.touchZoomRotate.disableRotation();
        map.keyboard.disableRotation();
      }

      // If tiles start failing after a good start, fall back to the bundled basemap.
      let tileErrors = 0;
      let usingOffline = !online;
      map.on("error", (event) => {
        const sourceId = (event as unknown as { sourceId?: string }).sourceId;
        if (usingOffline || sourceId !== ONLINE_SOURCE_ID) return;
        tileErrors += 1;
        if (tileErrors >= 4 && map) {
          usingOffline = true;
          setBasemap("offline");
          map.setStyle(offlineStyle());
        }
      });

      // "style.load" fires for the first style AND after every setStyle(), which
      // wipes all layers — so the historical overlays are (re)installed here.
      map.on("style.load", () => {
        loadTerritories()
          .then((data) => {
            if (cancelled || !map) return;
            dataRef.current = data;
            installOverlays(map, data);
            applyStateRef.current();
            setStatus("ready");
          })
          .catch((error) => {
            console.warn("EONOVA ATLAS: territory outlines could not be loaded", error);
            if (!cancelled) setStatus("ready"); // the basemap and markers still work
          });
      });

      if (interactive) {
        const featureAt = (event: MapMouseEvent) =>
          map?.getLayer(LAYER.fill) ? map.queryRenderedFeatures(event.point, { layers: [LAYER.fill] })[0] : undefined;

        map.on("click", (event) => {
          const entityId = featureAt(event)?.properties?.primaryEntity as string | undefined;
          if (entityId) onSelectEntityRef.current?.(entityId);
        });
        map.on("mousemove", (event) => {
          const id = (featureAt(event)?.properties?.id as string | undefined) ?? null;
          if (map) map.getCanvas().style.cursor = id ? "pointer" : "";
          setHoveredId((current) => (current === id ? current : id));
        });
        map.on("mouseout", () => setHoveredId(null));
      }

      // Thin out labels when zoomed far out (set directly on the DOM: no re-render needed).
      const updateLabelDensity = () => {
        if (!map) return;
        const zoom = map.getZoom();
        container.dataset.labels = zoom < 2 ? "none" : zoom < 3.6 ? "capitals" : "all";
      };
      map.on("zoom", updateLabelDensity);
      map.on("moveend", () => declutterLabels(container));
      updateLabelDensity();
    };

    void start();

    return () => {
      cancelled = true;
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map?.remove();
      mapRef.current = null;
    };
    // The map is created exactly once; later prop changes are applied by the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── place markers and sea labels ── */
  const visiblePlaces = useMemo(
    () => (focusEntityId ? placesOfEntity(focusEntityId) : placesVisibleIn(year, places, entities, events)),
    [focusEntityId, year],
  );

  useEffect(() => {
    const map = mapRef.current;
    if (status !== "ready" || !map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    for (const label of geoLabels) {
      const element = document.createElement("div");
      element.className = "atlas-geo-label";
      element.textContent = label.name[locale];
      markersRef.current.push(new Marker({ element }).setLngLat(label.coordinates).addTo(map));
    }

    const activeIds = new Set(entitiesActiveIn(year, entities).map((entity) => entity.id));

    for (const place of visiblePlaces) {
      // Colour by the first of the place's entities that exists this year.
      const ownerId = (focusEntityId && place.entityIds.includes(focusEntityId) ? focusEntityId : undefined) ??
        place.entityIds.find((id) => activeIds.has(id)) ??
        place.entityIds[0];
      const kindLabel = t.placeKinds[place.kind];
      const element = document.createElement(interactive ? "button" : "div");
      element.className = "atlas-marker";
      element.dataset.kind = place.kind;
      element.dataset.approximate = String(place.approximateLocation);
      element.dataset.active = String(place.id === selectedPlaceId);
      element.style.setProperty("--marker-color", getEntity(ownerId)?.color ?? "#c6a463");
      element.setAttribute(
        "aria-label",
        `${place.name[locale]} — ${kindLabel}${place.approximateLocation ? ` (${t.common.approximateLocation})` : ""}`,
      );
      if (interactive) {
        (element as HTMLButtonElement).type = "button";
        element.addEventListener("click", (event) => {
          event.stopPropagation();
          onSelectPlaceRef.current?.(place.id);
        });
      }
      const dot = document.createElement("span");
      dot.className = "atlas-marker__dot";
      const text = document.createElement("span");
      text.className = "atlas-marker__label";
      text.textContent = place.name[locale];
      element.append(dot, text);
      markersRef.current.push(new Marker({ element }).setLngLat(place.coordinates).addTo(map));
    }

    // Wait one frame so the browser has laid the new labels out, then resolve overlaps.
    const container = containerRef.current;
    const frame = window.requestAnimationFrame(() => container && declutterLabels(container));
    return () => window.cancelAnimationFrame(frame);
  }, [status, visiblePlaces, locale, selectedPlaceId, interactive, focusEntityId, year, t]);

  /* ── camera: follow selections ── */
  const fitTo = useCallback((bounds: Bounds | null, maxZoom = 5.2) => {
    const map = mapRef.current;
    if (!map || !bounds) return;
    map.fitBounds(bounds, { padding: 56, maxZoom, duration: 700 });
  }, []);

  // Profile mini-map: frame the entity's outlines (or, failing that, its places).
  useEffect(() => {
    if (status !== "ready" || !focusEntityId) return;
    const data = dataRef.current;
    const shown = data
      ? data.features.filter(
          (f) => f.properties.entityKey.includes(`|${focusEntityId}|`) && f.properties.validFrom <= year && f.properties.validTo >= year,
        )
      : [];
    const bounds = shown.length > 0
      ? boundsOfPoints(pointsOfFeatures(shown))
      : boundsOfPoints(placesOfEntity(focusEntityId).map((place) => place.coordinates));
    const map = mapRef.current;
    if (map && bounds) map.fitBounds(bounds, { padding: 36, maxZoom: 4.6, duration: 0 });
  }, [status, focusEntityId, year]);

  // Main atlas: when an entity is selected, bring its outline (or its capital) into view.
  const selectionYearRef = useRef(year);
  useEffect(() => {
    selectionYearRef.current = year;
  }, [year]);

  useEffect(() => {
    if (status !== "ready" || focusEntityId || !selectedEntityId) return;
    const data = dataRef.current;
    const at = selectionYearRef.current;
    const shown = data
      ? data.features.filter(
          (f) => f.properties.entityKey.includes(`|${selectedEntityId}|`) && f.properties.validFrom <= at && f.properties.validTo >= at,
        )
      : [];
    if (shown.length > 0) {
      fitTo(boundsOfPoints(pointsOfFeatures(shown)));
    } else {
      const capitalIds = getEntity(selectedEntityId)?.capitals.map((capital) => capital.placeId) ?? [];
      const points = places.filter((place) => capitalIds.includes(place.id)).map((place) => place.coordinates);
      fitTo(boundsOfPoints(points), 4.2);
    }
  }, [status, focusEntityId, selectedEntityId, fitTo]);

  useEffect(() => {
    const map = mapRef.current;
    if (status !== "ready" || !map || !selectedPlaceId) return;
    const place = places.find((candidate) => candidate.id === selectedPlaceId);
    if (place) map.easeTo({ center: place.coordinates, zoom: Math.max(map.getZoom(), 4.4), duration: 700 });
  }, [status, selectedPlaceId]);

  const resetView = () => fitTo(HOME_BOUNDS, 8);

  /* ── hover caption ── */
  const hovered = hoveredId ? territories.find((territory) => territory.id === hoveredId) : undefined;

  return (
    // `className` supplies size and position (the lazy wrapper passes "absolute inset-0").
    <div className={cn("isolate overflow-hidden bg-[#0b1014]", className)}>
      <div
        ref={containerRef}
        role="application"
        aria-label={t.atlas.mapLabel}
        className={cn(
          // Width/height, not "absolute inset-0": MapLibre's own CSS sets position:relative on this element.
          "h-full w-full",
          "[&[data-labels=none]_.atlas-marker__label]:hidden [&[data-labels=none]_.atlas-geo-label]:hidden",
          "[&[data-labels=capitals]_.atlas-marker:not([data-kind=capital])_.atlas-marker__label]:hidden",
        )}
      />

      {status === "loading" ? (
        <div className="absolute inset-0 grid place-items-center graticule bg-[#0b1014]" aria-live="polite">
          <p className="text-sm text-dust">{t.atlas.mapLoading}</p>
        </div>
      ) : null}

      {status === "failed" ? (
        <div className="absolute inset-0 grid place-items-center graticule bg-coal p-6 text-center" role="alert">
          <div>
            <TriangleAlert aria-hidden="true" className="mx-auto size-6 text-ember" />
            <p className="mt-3 text-parchment">{t.atlas.mapFailed}</p>
            <p className="mt-1 text-sm text-dust">{t.atlas.mapFailedHint}</p>
          </div>
        </div>
      ) : null}

      {status === "ready" && hovered ? (
        <div className="pointer-events-none absolute top-3 inset-x-0 flex justify-center px-14">
          <p className="rounded-md border border-line bg-ink/90 px-3 py-1.5 text-[12.5px] text-parchment shadow-panel text-center">
            <span className="font-medium">{hovered.label[locale]}</span>
            <span className="text-dust"> · {t.representation[hovered.representation]}</span>
            <span className="text-dust"> · {fill(t.atlas.outlineBasis, { year: formatYear(hovered.snapshotYear, locale, { approximate: true }) })}</span>
          </p>
        </div>
      ) : null}

      {status === "ready" && basemap === "offline" ? (
        <p className="absolute bottom-9 start-3 end-3 sm:end-auto sm:max-w-sm flex items-start gap-2 rounded-md border border-line bg-ink/90 px-3 py-2 text-[12px] text-sand">
          <WifiOff aria-hidden="true" className="size-3.5 mt-0.5 shrink-0 text-gold" />
          {t.atlas.basemapOffline}
        </p>
      ) : null}

      {status === "ready" && interactive ? (
        <button
          type="button"
          onClick={resetView}
          title={t.atlas.resetView}
          aria-label={t.atlas.resetView}
          className="absolute top-[84px] right-[10px] size-8 grid place-items-center rounded-md border border-line bg-coal text-sand hover:text-gold hover:bg-slate"
        >
          <RotateCcw aria-hidden="true" className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
