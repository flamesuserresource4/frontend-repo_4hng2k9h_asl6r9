// Simple SRT parser and helpers
export function parseSRT(srtText) {
  const entries = [];
  if (!srtText) return entries;
  const lines = srtText.replace(/\r/g, '').split('\n');
  let i = 0;
  while (i < lines.length) {
    // Skip index line if present
    if (/^\d+$/.test(lines[i].trim())) i++;
    if (i >= lines.length) break;

    // Time line
    const timeLine = lines[i++];
    const match = timeLine && timeLine.match(/(\d{2}:\d{2}:\d{2},\d{3})\s+-->\s+(\d{2}:\d{2}:\d{2},\d{3})/);
    if (!match) continue;
    const start = srtTimeToSeconds(match[1]);
    const end = srtTimeToSeconds(match[2]);

    // Text lines until blank
    const textLines = [];
    while (i < lines.length && lines[i].trim() !== '') {
      textLines.push(lines[i]);
      i++;
    }
    // skip blank
    while (i < lines.length && lines[i].trim() === '') i++;

    const text = textLines.join('\n');
    entries.push({ start, end, text });
  }
  return entries;
}

export function cuesToSRT(cues) {
  const blocks = cues.map((c, idx) => `${idx + 1}\n${secondsToSrtTime(c.start)} --> ${secondsToSrtTime(c.end)}\n${c.text}\n`);
  return blocks.join('\n');
}

export function srtTimeToSeconds(t) {
  const [h, m, rest] = t.split(':');
  const [s, ms] = rest.split(',');
  return parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s) + parseInt(ms) / 1000;
}

export function secondsToSrtTime(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  const ms = Math.floor((sec - Math.floor(sec)) * 1000);
  const pad = (n, l = 2) => n.toString().padStart(l, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)},${pad(ms, 3)}`;
}

export function findActiveCue(cues, time) {
  if (!cues || cues.length === 0) return null;
  // Linear search is fine for small lists; could be optimized
  for (let i = 0; i < cues.length; i++) {
    const c = cues[i];
    if (time >= c.start && time <= c.end) return c;
  }
  return null;
}
