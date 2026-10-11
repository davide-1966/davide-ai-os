import {AbsoluteFill, OffthreadVideo, Img, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';

export const PizzaPip = ({titolo, verdetto, foto}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const zoom = interpolate(frame, [0, 240], [1, 1.08]);
  const entra = spring({frame, fps, config: {damping: 14}});
  const timbro = spring({frame: frame - 18, fps, config: {damping: 9, mass: 0.6}});
  const pip = spring({frame: frame - 8, fps, config: {damping: 15}});
  return (
    <AbsoluteFill style={{backgroundColor: 'black', fontFamily: 'DejaVu Sans, sans-serif'}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        {foto ? <Img src={staticFile(foto)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          : <OffthreadVideo src={staticFile('pizza.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />}
      </AbsoluteFill>
      <div style={{position: 'absolute', top: 150, left: 70, right: 70, padding: '34px 40px', borderRadius: 28,
        background: 'rgba(15,15,15,0.78)', textAlign: 'center', transform: `translateY(${(1 - entra) * -80}px)`, opacity: entra}}>
        <div style={{color: 'white', fontSize: 66, fontWeight: 800, lineHeight: 1.15}}>{titolo}</div>
        <div style={{color: '#ff5c48', fontSize: 104, fontWeight: 900, marginTop: 12, transform: `scale(${timbro})`}}>{verdetto}</div>
      </div>
      <div style={{position: 'absolute', right: 60, bottom: 230, width: 400, height: 400, borderRadius: '50%', overflow: 'hidden',
        border: '10px solid white', boxShadow: '0 12px 40px rgba(0,0,0,0.55)', transform: `scale(${pip})`}}>
        <OffthreadVideo src={staticFile('avatar.mp4')} style={{width: 400, height: 711, objectFit: 'cover', marginTop: -40}} />
      </div>
    </AbsoluteFill>
  );
};
