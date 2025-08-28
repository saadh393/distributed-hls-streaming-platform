export default function parseRange(rangeHeader?: string): { start: number; end?: number } | null {
  if (!rangeHeader) return null;
  const m = /^bytes=(\d+)-(\d+)?$/i.exec(rangeHeader.trim());
  if (!m) return null;
  const start = Number(m[1]);
  const end = m[2] !== undefined ? Number(m[2]) : undefined;
  if (!Number.isFinite(start) || (end !== undefined && !Number.isFinite(end))) return null;
  if (end !== undefined && end < start) return null;
  return { start, end };
}
