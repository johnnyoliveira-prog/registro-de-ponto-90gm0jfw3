export function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3 // Earth radius in meters
  const toRadians = (deg: number) => (deg * Math.PI) / 180

  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

export function isOutsideGeofence(
  lat: number,
  lon: number,
  baseLat?: number,
  baseLon?: number,
  radius?: number,
): boolean {
  if (baseLat === undefined || baseLon === undefined || radius === undefined) return false
  const distance = getDistanceMeters(lat, lon, baseLat, baseLon)
  return distance > radius
}
