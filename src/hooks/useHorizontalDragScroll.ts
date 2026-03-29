"use client";

import { useEffect, type RefObject } from "react";

/** Mouse drag-to-scroll on overflow-x rows; touch keeps native momentum scrolling. */
export function useHorizontalDragScroll(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let dragging = false;
    let startX = 0;
    let scrollLeft0 = 0;
    let activeId = -1;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      if (el.scrollWidth <= el.clientWidth + 1) return;
      dragging = true;
      activeId = e.pointerId;
      startX = e.clientX;
      scrollLeft0 = el.scrollLeft;
      el.classList.add("cursor-grabbing", "select-none");
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    };

    const end = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== activeId) return;
      dragging = false;
      activeId = -1;
      el.classList.remove("cursor-grabbing", "select-none");
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== activeId) return;
      el.scrollLeft = scrollLeft0 - (e.clientX - startX);
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
    el.addEventListener("pointermove", onPointerMove);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointerup", end);
      el.removeEventListener("pointercancel", end);
      el.removeEventListener("pointermove", onPointerMove);
    };
  }, [ref]);
}
