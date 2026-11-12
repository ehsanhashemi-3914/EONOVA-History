/**
 * Loading the territory outlines for the map.
 *
 * The polygons live in /public/geo/territories.json and are fetched by the
 * browser only when a map is actually shown (they are not part of the page's
 * JavaScript). The promise is cached at module level, so several maps on one
 * page — or the same map after a style change — share a single download.
 */
import { getEntity } from "@/data";
import type { TerritoryProperties } from "@/data/schema";

/** Flat copies of the nested provenance fields, in a form map expressions can read. */
export interface MapTerritoryProperties {
  id: string;
  /** Primary entity id. */
  primaryEntity: string;
  /** "|id-a|id-b|" — lets a style filter test membership with a substring check. */
  entityKey: string;
  color: string;
  validFrom: number;
  validTo: number;
  snapshotYear: number;
  representation: TerritoryProperties["representation"];
  labelFa: string;
  labelEn: string;
}

export interface TerritoryFeature {
  type: "Feature";
  properties: MapTerritoryProperties;
  geometry: { type: "MultiPolygon"; coordinates: number[][][][] };
}

export interface TerritoryCollection {
  type: "FeatureCollection";
  features: TerritoryFeature[];
}

interface RawFeature {
  type: "Feature";
  properties: TerritoryProperties;
  geometry: { type: "MultiPolygon"; coordinates: number[][][][] };
}

const FALLBACK_COLOR = "#c6a463";

let cache: Promise<TerritoryCollection> | null = null;

export function loadTerritories(): Promise<TerritoryCollection> {
  cache ??= fetch("/geo/territories.json")
    .then((response) => {
      if (!response.ok) throw new Error(`territories.json: HTTP ${response.status}`);
      return response.json() as Promise<{ features: RawFeature[] }>;
    })
    .then((raw) => ({
      type: "FeatureCollection" as const,
      features: raw.features.map((feature) => {
        const p = feature.properties;
        return {
          type: "Feature" as const,
          geometry: feature.geometry,
          properties: {
            id: p.id,
            primaryEntity: p.entityIds[0],
            entityKey: `|${p.entityIds.join("|")}|`,
            // Colour is presentation, so it comes from the entity record, not from the geodata.
            color: getEntity(p.entityIds[0])?.color ?? FALLBACK_COLOR,
            validFrom: p.validFrom,
            validTo: p.validTo,
            snapshotYear: p.snapshotYear,
            representation: p.representation,
            labelFa: p.label.fa,
            labelEn: p.label.en,
          },
        };
      }),
    }))
    .catch((error) => {
      cache = null; // allow a retry on the next attempt
      throw error;
    });
  return cache;
}

export type Bounds = [[number, number], [number, number]];

/** Smallest box containing every given point; null when there are no points. */
export function boundsOfPoints(points: Iterable<readonly [number, number] | number[]>): Bounds | null {
  let west = Infinity;
  let south = Infinity;
  let east = -Infinity;
  let north = -Infinity;
  for (const [lng, lat] of points) {
    if (lng < west) west = lng;
    if (lng > east) east = lng;
    if (lat < south) south = lat;
    if (lat > north) north = lat;
  }
  if (!Number.isFinite(west)) return null;
  return [
    [west, south],
    [east, north],
  ];
}

export function* pointsOfFeatures(features: Iterable<TerritoryFeature>): Generator<number[]> {
  for (const feature of features) {
    for (const polygon of feature.geometry.coordinates) {
      // Outer ring only: holes cannot extend the bounds.
      yield* polygon[0] ?? [];
    }
  }
}
