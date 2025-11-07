import React from 'react';
import { parseSRT, cuesToSRT } from './utils';

export default function SubtitleEditor({ cues, setCues }) {
  const [raw, setRaw] = React.useState('');

  React.useEffect(() => {
    const srt = cuesToSRT(cues);
    setRaw(srt);
  }, [cues]);

  const handleParse = () => {
    const parsed = parseSRT(raw);
    setCues(parsed);
  };

  const downloadSrt = () => {
    const blob = new Blob([raw], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subtitle.srt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white/60 backdrop-blur p-4 md:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Editor Subtitle</h2>
        <div className="flex gap-2">
          <button onClick={handleParse} className="px-3 py-1.5 rounded-md bg-slate-900 text-white hover:bg-slate-800">Terapkan</button>
          <button onClick={downloadSrt} className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200">Unduh SRT</button>
        </div>
      </div>
      <textarea
        className="w-full h-48 md:h-64 p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300 font-mono text-sm bg-white/80"
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        spellCheck={false}
      />
      <p className="text-xs text-slate-500 mt-2">Tempel SRT atau edit manual lalu klik Terapkan.</p>
    </div>
  );
}
