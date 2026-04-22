import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Reset window scroll to the top on every route change. In an SPA the
 * browser keeps the scroll position across Link navigations, which feels
 * wrong when jumping between unrelated pages (e.g. Station Detail ->
 * Privacy Policy). This mirrors the default behavior of a full-page
 * navigation — an instant jump to the top, not a smooth scroll.
 *
 * Rendered once inside BrowserRouter, near the top of the tree.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Use instant, not smooth — the user explicitly wants this to feel
    // like a page load, not an animated effect.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}
