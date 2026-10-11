import {AbsoluteFill, OffthreadVideo, Img, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';

// Reel completo: foto o video vero della pizza a tutto schermo, avatar di Davide nel cerchio (con la voce),
// attacco con verdetto finché parla l'attacco, sottotitoli sincronizzati e un riquadro con il dato chiave.
const Box = ({children, style}) => (
  <div style={{position: 'absolute', left: 70, right: 70, padding: '28px 36px', borderRadius: 28,
    background: 'rgba(15,15,15,0.78)', textAlign: 'center', ...style}}>{children}</div>
);

export const ReelPip = ({foto, video, avatar, titolo, verdetto, colore, fineAttacco, sottotitoli, dato}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const t = frame / fps;
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.12]);
  const entra = spring({frame, fps, config: {damping: 14}});
  const timbro = spring({frame: frame - 12, fps, config: {damping: 9, mass: 0.6}});
  const pip = spring({frame: frame - 6, fps, config: {damping: 15}});
  const sub = sottotitoli.find((s) => t >= s.a && t < s.b);
  const datoOn = dato && t >= dato.a && t < dato.b;
  const datoIn = dato ? spring({frame: frame - Math.round(dato.a * fps), fps, config: {damping: 12}}) : 0;
  return (
    <AbsoluteFill style={{backgroundColor: 'black', fontFamily: 'DejaVu Sans, sans-serif'}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        {foto ? <Img src={staticFile(foto)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          : <OffthreadVideo src={staticFile(video)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />}
      </AbsoluteFill>
      {t < fineAttacco && (
        <Box style={{top: 150, transform: `translateY(${(1 - entra) * -80}px)`, opacity: entra}}>
          <div style={{color: 'white', fontSize: 66, fontWeight: 800, lineHeight: 1.15}}>{titolo}</div>
          <div style={{color: colore, fontSize: 104, fontWeight: 900, marginTop: 10, transform: `scale(${timbro})`}}>{verdetto}</div>
        </Box>
      )}
      {datoOn && (
        <Box style={{top: 170, transform: `scale(${datoIn})`}}>
          <div style={{color: 'white', fontSize: 80, fontWeight: 900}}>{dato.sopra}</div>
          <div style={{color: '#ffcf4a', fontSize: 54, fontWeight: 800, marginTop: 6}}>{dato.sotto}</div>
        </Box>
      )}
      {sub && (
        <div style={{position: 'absolute', left: 60, right: 500, bottom: 300, padding: '18px 22px', borderRadius: 20,
          background: 'rgba(15,15,15,0.8)', color: 'white', fontSize: 42, fontWeight: 800, lineHeight: 1.25}}>{sub.t}</div>
      )}
      <div style={{position: 'absolute', right: 50, bottom: 220, width: 400, height: 400, borderRadius: '50%', overflow: 'hidden',
        border: '10px solid white', boxShadow: '0 12px 40px rgba(0,0,0,0.55)', transform: `scale(${pip})`}}>
        <OffthreadVideo src={staticFile(avatar)} style={{width: 520, height: 924, marginLeft: -60, marginTop: -22}} />
      </div>
    </AbsoluteFill>
  );
};
