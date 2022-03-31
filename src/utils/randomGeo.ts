export function getRandomLatLng(from: number, to: number, fixed = 3): number {
  return +(Math.random() * (to - from) + from).toFixed(fixed);
  // .toFixed() returns string, so ' * 1' is a trick to convert to number
}
