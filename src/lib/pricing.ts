// Starting prices in pence (integer maths avoids rounding errors).
export const SERVICE_PRICES: Record<string, number> = {
  "Premium Valet": 7999,
  "Signature Detail": 17999,
  "Maintenance Valet": 7999,
};
export const ADD_ON_PRICES: Record<string, number> = {
  "Paint Decontamination": 4999,
  "Deep Interior Extraction": 3999,
  "Engine Bay Refresh": 2999,
};

export const formatPounds = (pence: number) => `£${(pence / 100).toFixed(2)}`;

export function estimate(service: string, addOns: string[]) {
  const lines: { name: string; pence: number }[] = [];
  if (SERVICE_PRICES[service] !== undefined) lines.push({ name: service, pence: SERVICE_PRICES[service] });
  for (const a of addOns) if (ADD_ON_PRICES[a] !== undefined) lines.push({ name: a, pence: ADD_ON_PRICES[a] });
  return { lines, total: lines.reduce((s, l) => s + l.pence, 0) };
}
