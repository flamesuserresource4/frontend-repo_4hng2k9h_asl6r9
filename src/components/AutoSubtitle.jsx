import React from 'react';

export default function AutoSubtitle({ video, setCues }) {
  const [status, setStatus] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [language, setLanguage] = React.useState('auto');
  const [modelSize, setModelSize] = React.useState('tiny');

  const generate = async () => {
    if (!video?.file) return;
    setLoading(true);
    try {
      setStatus('Ekstrak audio dari video...');
      const pcm = await extractPCMWithFFmpeg(video.file);

      setStatus('Memuat model transkripsi... (pertama kali bisa agak lama)');
      const { pipeline } = await import('@xenova/transformers');
      const modelMap = {
        tiny: 'Xenova/whisper-tiny',
        base: 'Xenova/whisper-base',
        small: 'Xenova/whisper-small',
      };
      const modelId = modelMap[modelSize] || modelMap.tiny;

      const transcriber = await pipeline('automatic-speech-recognition', modelId);

      setStatus('Menganalisis audio...');
      const output = await transcriber(
        { audio: pcm.audio, sampling_rate: pcm.sampling_rate },
        {
          chunk_length_s: 30,
          return_timestamps: true,
          language: language === 'auto' ? undefined : language,
        }
      );

      const segments = output.segments || [];
      const cues = segments
        .map((seg) => ({
          start: Math.max(0, seg.start),
          end: Math.max(seg.start, seg.end),
          text: (seg.text || '').trim(),
        }))
        .filter((c) => c.text);

      const merged = mergeShortCues(cues, 0.6);
      setCues(merged);
      setStatus('Selesai. Subtitle otomatis dibuat.');
    } catch (e) {
      console.error(e);
      setStatus('Gagal membuat subtitle: ' + (e?.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white/60 dark:bg-slate-900/40 backdrop-blur p-4 md:p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
        <h2 className="text-lg font-semibold">Subtitle Otomatis</h2>
        <div className="flex items-center gap-2">
          <select
            value={modelSize}
            onChange={(e) => setModelSize(e.target.value)}
            className="h-10 rounded-md border border-slate-200 bg-white px-2 text-sm"
          >
            <option value="tiny">Whisper Tiny (cepat)</option>
            <option value="base">Whisper Base</option>
            <option value="small">Whisper Small (lebih akurat)</option>
          </select>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="h-10 rounded-md border border-slate-200 bg-white px-2 text-sm"
          >
            <option value="auto">Deteksi Otomatis</option>
            <option value="id">Indonesia</option>
            <option value="en">English</option>
          </select>
          <button
            onClick={generate}
            disabled={!video?.file || loading}
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 text-white px-4 py-2 disabled:opacity-50 hover:bg-slate-800"
          >
            {loading ? 'Memproses...' : 'Buat Subtitle Otomatis'}
          </button>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300">Subtitle dibuat 100% otomatis seperti CapCut, langsung di browser Anda.</p>
      {status && <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{status}</p>}
    </div>
  );
}

async function extractPCMWithFFmpeg(file) {
  // Use ffmpeg.wasm to produce 16kHz mono WAV, then decode to Float32Array
  const { createFFmpeg, fetchFile } = await import('@ffmpeg/ffmpeg');
  const ffmpeg = createFFmpeg({ log: false });
  await ffmpeg.load();

  const inputName = 'input_video';
  const outputName = 'audio.wav';
  await ffmpeg.FS('writeFile', inputName, await fetchFile(file));
  await ffmpeg.run(
    '-i', inputName,
    '-vn',
    '-ac', '1',
    '-ar', '16000',
    '-f', 'wav',
    outputName
  );
  const data = ffmpeg.FS('readFile', outputName);
  const wavBuffer = data.buffer;

  // Decode WAV to PCM Float32 using WebAudio
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const decoded = await audioCtx.decodeAudioData(wavBuffer.slice(0));
  const channel = decoded.getChannelData(0);
  // Clone to detach from AudioBuffer internal memory
  const pcm = new Float32Array(channel.length);
  pcm.set(channel);
  return { audio: pcm, sampling_rate: 16000 };
}

function mergeShortCues(cues, minDuration) {
  if (!cues.length) return cues;
  const out = [];
  let cur = { ...cues[0] };
  for (let i = 1; i < cues.length; i++) {
    const c = cues[i];
    if (cur.end - cur.start < minDuration) {
      cur.end = c.end;
      cur.text = `${cur.text} ${c.text}`.trim();
    } else {
      out.push(cur);
      cur = { ...c };
    }
  }
  out.push(cur);
  return out;
}
