export function convertToSeconds(time: string): number {
  const parts = time.split(":");
  const hours = parseInt(parts[0]);
  const minutes = parseInt(parts[1]);
  const seconds = parseInt(parts[2]);

  return hours * 3600 + minutes * 60 + seconds;
}