export function delay(duration: number): Promise<any> {
  return new Promise((res) => setTimeout(res, duration, []));
}
