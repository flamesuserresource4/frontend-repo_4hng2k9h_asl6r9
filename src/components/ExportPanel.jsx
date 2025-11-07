import React from 'react';

export default function ExportPanel({ video, cues, styleOptions }) {
  const [progress, setProgress] = React.useState(null);
  const [downloading, setDownloading] = React.useState(false);

  const burnIn = async () => {
    if (!video?.file || !cues?.length) return;
    setDownloading(true);
    setProgress('Menyiapkan encoder...');

    // Lazy-load ffmpeg.wasm only when needed to keep initial bundle small
    const { createFFmpeg, fetchFile } = await import('@ffmpeg/ffmpeg');
    const ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load();

    setProgress('Mengunggah berkas ke encoder...');
    const inputName = 'input.mp4';
    await ffmpeg.FS('writeFile', inputName, await fetchFile(video.file));

    // Prepare a .ass subtitle file to preserve styling as burn-in
    const assContent = cuesToASS(cues, styleOptions);
    const assName = 'subs.ass';
    await ffmpeg.FS('writeFile', assName, new TextEncoder().encode(assContent));

    setProgress('Memproses video (burn-in)...');
    const outName = 'output.mp4';
    // Use libx264 + burn-in via subtitles filter
    await ffmpeg.run(
      '-i', inputName,
      '-vf', `ass=${assName}`,
      '-c:v', 'libx264',
      '-preset', 'veryfast',
      '-crf', '23',
      '-c:a', 'copy',
      outName
    );

    setProgress('Menyiapkan unduhan...');
    const data = ffmpeg.FS('readFile', outName);
    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'video_subtitled.mp4';
    a.click();
    URL.revokeObjectURL(url);

    setProgress(null);
    setDownloading(false);
  };

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white/60 dark:bg-slate-900/40 backdrop-blur p-4 md:p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-3">Ekspor</h2>
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={burnIn}
          disabled={!video?.file || !cues?.length || downloading}
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white disabled:opacity-50 hover:bg-emerald-700"
        >
          Burn-in ke Video
        </button>
        {progress && <span className="text-sm text-slate-600 dark:text-slate-300">{progress}</span>}
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Proses burn-in berjalan di perangkat Anda menggunakan WebAssembly.</p>
    </div>
  );
}

function escapeASS(text) {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/{/g, '\\{')
    .replace(/}/g, '\\}')
    .replace(/\n/g, '\\N');
}

function secondsToAssTime(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  const cs = Math.floor((sec - Math.floor(sec)) * 100); // centiseconds
  const pad = (n, l = 2) => n.toString().padStart(l, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}.${pad(cs)}`;
}

function toAssColor(hex) {
  // SSA/ASS uses BGR with alpha: &HAA BB GG RR
  // We build without alpha (opaque) => &H00BBGGRR
  const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex);
  if (!m) return '&H00FFFFFF';
  const r = m[1];
  const g = m[2];
  const b = m[3];
  return `&H00${b}${g}${r}`.toUpperCase();
}

function cuesToASS(cues, style) {
  const fontname = style.fontFamily || 'Inter';
  const fontsize = parseInt(style.fontSize) || 36;
  const primaryColour = toAssColor(style.color || '#ffffff');
  const bold = style.bold ? -1 : 0;
  const shadow = style.shadow ? 3 : 0;
  const outline = style.background ? 2 : 0;

  const header = `[
Script Info]
ScriptType: v4.00+
WrapStyle: 2
ScaledBorderAndShadow: yes
YCbCr Matrix: TV.601

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,${fontname},${fontsize},${primaryColour},&H00FFFFFF,&H00000000,&H64000000,${bold},0,0,0,100,100,0,0,1,${outline},${shadow},2,20,20,30,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text`;

  const events = cues
    .map((c) => `Dialogue: 0,${secondsToAssTime(c.start)},${secondsToAssTime(c.end)},Default,,0,0,0,,${escapeASS(c.text)}`)
    .join('\n');

  return `${header}\n${events}\n`;
}
