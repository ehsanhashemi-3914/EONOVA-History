/**
 * Basemap styles.
 *
 * A MapLibre "style" is a JSON document that says where map data comes from
 * (sources) and how to draw it (layers, bottom to top). We define two:
 *
 *   online  – vector tiles from OpenFreeMap (detailed coastlines at every zoom)
 *   offline – three small Natural Earth files bundled with the app
 *
 * Both draw only physical geography — land, water, rivers. Modern borders, roads
 * and city names are deliberately left out: they would be anachronisms on a map
 * of the ancient world.
 */
import type { StyleSpecification } from "maplibre-gl";

export const MAP_COLORS = {
  water: "#0b1014",
  land: "#22262a",
  ice: "#2a2f33",
  river: "#131d24",
} as const;

/** TileJSON endpoint: a small JSON file that tells MapLibre where the tiles are. */
export const ONLINE_TILEJSON_URL = "https://tiles.openfreemap.org/planet";

export const ONLINE_SOURCE_ID = "openmaptiles";

export function onlineStyle(): StyleSpecification {
  return {
    version: 8,
    name: "EONOVA dark (online)",
    sources: {
      [ONLINE_SOURCE_ID]: { type: "vector", url: ONLINE_TILEJSON_URL },
    },
    layers: [
      { id: "background", type: "background", paint: { "background-color": MAP_COLORS.land } },
      {
        id: "ice",
        type: "fill",
        source: ONLINE_SOURCE_ID,
        "source-layer": "landcover",
        filter: ["==", ["get", "class"], "ice"],
        paint: { "fill-color": MAP_COLORS.ice },
      },
      {
        id: "water",
        type: "fill",
        source: ONLINE_SOURCE_ID,
        "source-layer": "water",
        paint: { "fill-color": MAP_COLORS.water },
      },
      {
        id: "rivers",
        type: "line",
        source: ONLINE_SOURCE_ID,
        "source-layer": "waterway",
        filter: ["==", ["get", "class"], "river"],
        paint: {
          "line-color": MAP_COLORS.river,
          "line-width": ["interpolate", ["linear"], ["zoom"], 3, 0.6, 8, 1.8],
        },
      },
    ],
  };
}

export function offlineStyle(): StyleSpecification {
  const attribution = "Basemap: Natural Earth (public domain)";
  return {
    version: 8,
    name: "EONOVA dark (offline)",
    sources: {
      land: { type: "geojson", data: "/geo/basemap/land.json", attribution },
      lakes: { type: "geojson", data: "/geo/basemap/lakes.json" },
      rivers: { type: "geojson", data: "/geo/basemap/rivers.json" },
    },
    layers: [
      { id: "background", type: "background", paint: { "background-color": MAP_COLORS.water } },
      { id: "land", type: "fill", source: "land", paint: { "fill-color": MAP_COLORS.land } },
      { id: "lakes", type: "fill", source: "lakes", paint: { "fill-color": MAP_COLORS.water } },
      {
        id: "rivers",
        type: "line",
        source: "rivers",
        paint: { "line-color": MAP_COLORS.river, "line-width": ["interpolate", ["linear"], ["zoom"], 2, 0.5, 7, 1.6] },
      },
    ],
  };
}

/**
 * Can we reach the online tile server? Asked once before the map starts, with a
 * short timeout, so that an offline visitor gets the bundled basemap at once
 * instead of an empty map.
 */
export async function isOnlineBasemapReachable(timeoutMs = 4000): Promise<boolean> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(ONLINE_TILEJSON_URL, { signal: controller.signal, cache: "force-cache" });
    return response.ok;
  } catch {
    return false;
  } finally {
    window.clearTimeout(timer);
  }
}
