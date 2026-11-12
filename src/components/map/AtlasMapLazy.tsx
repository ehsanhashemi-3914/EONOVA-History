"use client";

/**
 * Lazy wrapper around AtlasMap.
 *
 * MapLibre is by far the largest library in the app (~1 MB) and needs a real
 * browser (WebGL, window). `next/dynamic` with `ssr: false` therefore does two
 * things: it keeps the map out of the server render, and it moves the library
 * into a separate JavaScript file that is downloaded only when a map appears.
 */
import dynamic from "next/dynamic";
import type { AtlasMapProps } from "./AtlasMap";

const AtlasMap = dynamic(() => import("./AtlasMap"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 graticule bg-[#0b1014]" aria-hidden="true" />,
});

/**
 * `className` must give the wrapper a size AND a position (for example
 * "absolute inset-0" or "relative h-80"): the map fills it edge to edge.
 */
export function AtlasMapLazy({ className, ...props }: AtlasMapProps) {
  return (
    <div className={className}>
      <AtlasMap {...props} className="absolute inset-0" />
    </div>
  );
}
