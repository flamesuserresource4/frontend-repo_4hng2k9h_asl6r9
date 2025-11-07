import React from 'react';
import UploadArea from './components/UploadArea';
import PreviewPlayer from './components/PreviewPlayer';
import SubtitleEditor from './components/SubtitleEditor';
import ExportPanel from './components/ExportPanel';
import { parseSRT } from './components/utils';

export default function App() {
  const [video, setVideo] = React.useState(null);
  const [cues, setCues] = React.useState([]);
  const [styleOptions] = React.useState({
    color: '#ffffff',
    fontSize: '36px',
    fontFamily: 'Inter',
    bold: true,
    shadow: true,
    background: true,
  });

  const handleSrtImported = (text) => {
    const parsed = parseSRT(text);
    setCues(parsed);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-sky-50 to-teal-50">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/60 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-slate-900 text-white grid place-items-center font-bold">Sb</div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Subtitle Burn-in</h1>
              <p className="text-xs text-slate-500">Buat subtitle dan tempel langsung ke video</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <UploadArea onVideoSelected={setVideo} onSrtImported={handleSrtImported} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PreviewPlayer video={video} cues={cues} styleOptions={styleOptions} />
          <SubtitleEditor cues={cues} setCues={setCues} />
        </div>

        <ExportPanel video={video} cues={cues} styleOptions={styleOptions} />

        <footer className="pt-6 text-center text-xs text-slate-500">
          Dibuat untuk proses subtitle cepat di browser Anda. Unggah video, tambahkan SRT, pratinjau, lalu ekspor burn-in.
        </footer>
      </main>
    </div>
  );
}
