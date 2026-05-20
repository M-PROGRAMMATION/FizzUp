type Row = Record<string, string | number | boolean | null | undefined>;

function escapeCsvCell(value: string | number | boolean | null | undefined): string {
  const str = value == null ? '' : String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportCsv<T extends Row>(rows: T[], columns: { key: keyof T; label: string }[], filename: string) {
  const header = columns.map(c => escapeCsvCell(c.label)).join(',');
  const body = rows.map(row =>
    columns.map(c => escapeCsvCell(row[c.key])).join(',')
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
