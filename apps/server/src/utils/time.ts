export function addMinutesToDate(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

export function isPastDate(date: Date): boolean {
  return date.getTime() <= Date.now();
}
