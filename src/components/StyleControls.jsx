import React from 'react';

const fonts = ['Inter', 'Manrope', 'IBM Plex Sans', 'Geist', 'Mona Sans'];

export default function StyleControls({ styleOptions, setStyleOptions }) {
  const update = (key, value) => setStyleOptions((s) => ({ ...s, [key]: value }));

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white/60 backdrop-blur p-4 md:p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-3">Tampilan Subtitle</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="space-y-1">
          <label className="text-sm text-slate-600">Ukuran</label>
          <input
            type="range"
            min={14}
            max={64}
            value={parseInt(styleOptions.fontSize)}
            onChange={(e) => update('fontSize', `${e.target.value}px`)}
            className="w-full"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-slate-600">Warna</label>
          <input
            type="color"
            value={styleOptions.color}
            onChange={(e) => update('color', e.target.value)}
            className="h-10 w-full rounded"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-slate-600">Font</label>
          <select
            value={styleOptions.fontFamily}
            onChange={(e) => update('fontFamily', e.target.value)}
            className="w-full h-10 rounded border border-slate-200 bg-white"
          >
            {fonts.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-3">
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={styleOptions.bold} onChange={(e) => update('bold', e.target.checked)} />
            Bold
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={styleOptions.shadow} onChange={(e) => update('shadow', e.target.checked)} />
            Shadow
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={styleOptions.background} onChange={(e) => update('background', e.target.checked)} />
            Background
          </label>
        </div>
      </div>
    </div>
  );
}
