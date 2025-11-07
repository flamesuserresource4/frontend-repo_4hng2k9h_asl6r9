import React from 'react';

export default function UploadArea({ onVideoSelected, onSrtImported }) {
  const fileInputRef = React.useRef(null);
  const srtInputRef = React.useRef(null);

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onVideoSelected({ file, url });
  };

  const handleSrtChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    onSrtImported(text);
  };

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white/60 backdrop-blur p-4 md:p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-3">Unggah Video & Subtitle</h2>
      <div className="flex flex-col md:flex-row gap-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 text-white px-4 py-2 hover:bg-slate-800 transition"
        >
          Pilih Video
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleVideoChange}
        />
        <button
          onClick={() => srtInputRef.current?.click()}
          className="inline-flex items-center justify-center rounded-lg bg-slate-100 text-slate-900 px-4 py-2 hover:bg-slate-200 transition"
        >
          Impor SRT (opsional)
        </button>
        <input
          ref={srtInputRef}
          type="file"
          accept=".srt"
          className="hidden"
          onChange={handleSrtChange}
        />
      </div>
      <p className="text-sm text-slate-500 mt-2">
        Dukungan burn-in langsung di browser. Untuk kualitas terbaik gunakan video MP4/WebM.
      </p>
    </div>
  );
}
