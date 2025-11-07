import React from 'react';
import UploadArea from './components/UploadArea';
import PreviewPlayer from './components/PreviewPlayer';
import AutoSubtitle from './components/AutoSubtitle';
import ExportPanel from './components/ExportPanel';
import Spline from '@splinetool/react-spline';
import { Sun, Moon } from 'lucide-react';

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

  // Theme handling (dark/light)
  const [theme, setTheme] = React.useState('light');
  React.useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored || (prefersDark ? 'dark' : 'light');
    setTheme(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-sky-50 to-teal-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/60 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-slate-900 text-white grid place-items-center font-bold">ZA</div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Zulfan.AI</h1>
              <p className="text-xs text-slate-500 dark:text-slate-300">Pembuat subtitle otomatis & burn-in langsung di browser</p>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 transition"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </header>

      {/* Hero section with Spline cover */}
      <section className="relative w-full h-[420px] md:h-[520px]">
        <div className="absolute inset-0">
          <Spline scene="https://prod.spline.design/O-AdlP9lTPNz-i8a/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        </div>
        {/* Gradient overlay should not block interactions */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-slate-950" />
        <div className="relative z-10 max-w-6xl mx-auto h-full px-4 flex items-end pb-8">
          <div className="backdrop-blur-sm rounded-xl px-4 py-3 bg-white/30 dark:bg-slate-900/30">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white">Subtitle & Burn-in Studio</h2>
            <p className="text-sm md:text-base text-slate-700 dark:text-slate-300">Semua otomatis seperti CapCut. Unggah video, hasilkan subtitle, pratinjau, lalu ekspor burn-in.</p>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <UploadArea onVideoSelected={setVideo} />

        <AutoSubtitle video={video} setCues={setCues} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PreviewPlayer video={video} cues={cues} styleOptions={styleOptions} />
          <ExportPanel video={video} cues={cues} styleOptions={styleOptions} />
        </div>

        <footer className="pt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Zulfan.AI — Unggah video, buat subtitle otomatis, pratinjau, lalu ekspor burn-in.
        </footer>
      </main>
    </div>
  );
}
