export function sinifLabel(sinif: number): string {
  return sinif === 0 ? 'Hazırlık' : `${sinif}. Sınıf`;
}
