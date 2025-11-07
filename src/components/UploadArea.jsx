import React from 'react';

export default function UploadArea({ onVideoSelected }) {
  const fileInputRef = React.useRef(null);

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onVideoSelected({ file, url });
  };

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white/60 dark:bg-slate-900/40 backdrop-blur p-4 md:p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-3">Unggah Video</h2>
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
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
        Subtitle dibuat otomatis, tidak perlu file SRT. Untuk hasil terbaik gunakan MP4/WebM.
      </p>
    </div>
  );
}
