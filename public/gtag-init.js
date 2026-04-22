// Google Analytics bootstrap. Split out of index.html so it's served from
// the same origin as the app — production CSP can then allow it via
// `script-src 'self'` without an inline-hash or 'unsafe-inline' escape.
window.dataLayer = window.dataLayer || [];
function gtag() {
  window.dataLayer.push(arguments);
}
window.gtag = gtag;

gtag("js", new Date());
gtag("config", "G-GKSKY44PBE");
