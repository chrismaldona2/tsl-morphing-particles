const specialCases: Record<string, string> = {
  r2d2: "R2D2",
};

export function capitalize(str: string): string {
  if (!str) return str;

  const lower = str.toLowerCase();
  if (specialCases[lower]) {
    return specialCases[lower];
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
}
