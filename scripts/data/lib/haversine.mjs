// Great-circle distance between two lat/lng pairs (statute miles).

const EARTH_RADIUS_MI = 3958.7613;

export function haversineMiles(latA, lngA, latB, lngB) {
  if (
    !Number.isFinite(latA) ||
    !Number.isFinite(lngA) ||
    !Number.isFinite(latB) ||
    !Number.isFinite(lngB)
  ) {
    return null;
  }
  const phiA = toRadians(latA);
  const phiB = toRadians(latB);
  const dPhi = toRadians(latB - latA);
  const dLambda = toRadians(lngB - lngA);

  const a =
    Math.sin(dPhi / 2) ** 2 + Math.cos(phiA) * Math.cos(phiB) * Math.sin(dLambda / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_MI * c;
}

function toRadians(deg) {
  return (deg * Math.PI) / 180;
}
