type CellValue = string | number | boolean | null | undefined;

function escapeCsvCell(value: CellValue): string {
  const str = value == null ? '' : String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportCsv<T extends object>(rows: T[], columns: { key: keyof T & string; label: string }[], filename: string) {
  const header = columns.map(c => escapeCsvCell(c.label)).join(',');
  const body = rows.map(row =>
    columns.map(c => escapeCsvCell(row[c.key] as CellValue)).join(',')
  );
  const csv = [header, ...body].join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
