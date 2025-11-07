import React from 'react';
import { findActiveCue } from './utils';

export default function PreviewPlayer({ video, cues, styleOptions }) {
  const videoRef = React.useRef(null);
  const [currentTime, setCurrentTime] = React.useState(0);

  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setCurrentTime(v.currentTime || 0);
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('seeked', onTime);
    return () => {
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('seeked', onTime);
    };
  }, []);

  const active = findActiveCue(cues, currentTime);

  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-black">
      {video?.url ? (
        <video
          ref={videoRef}
          src={video.url}
          controls
          className="w-full h-full object-contain bg-black"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full text-slate-400">Pratinjau video</div>
      )}
      {active && (
        <div className="pointer-events-none absolute inset-0 flex items-end justify-center p-6">
          <div
            className="w-full text-center"
            style={{
              color: styleOptions.color,
              fontSize: styleOptions.fontSize,
              fontWeight: styleOptions.bold ? 700 : 500,
              textShadow: styleOptions.shadow ? '0 2px 8px rgba(0,0,0,0.8)' : 'none',
              fontFamily: styleOptions.fontFamily,
            }}
          >
            {active.text.split('\n').map((line, i) => (
              <div key={i} className="leading-tight">
                <span
                  className={
                    styleOptions.background
                      ? 'bg-black/60 rounded px-2 py-1'
                      : ''
                  }
                >
                  {line}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
