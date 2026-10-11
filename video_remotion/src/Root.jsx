import {Composition} from 'remotion';
import {PizzaPip} from './PizzaPip';
import {ReelPip} from './ReelPip';
export const Root = () => (
  <>
    <Composition id="PizzaPip" component={PizzaPip} durationInFrames={240} fps={30} width={1080} height={1920}
      defaultProps={{titolo: 'RADDOPPIATO, QUINDI È PRONTO?', verdetto: 'FALSO.'}} />
    <Composition id="ReelPip" component={ReelPip} durationInFrames={300} fps={30} width={1080} height={1920}
      calculateMetadata={({props}) => ({durationInFrames: Math.round(props.durata * 30)})}
      defaultProps={{foto: 'pizza.jpg', avatar: 'avatar.mp4', titolo: '', verdetto: '', colore: '#ff5c48',
        fineAttacco: 3, sottotitoli: [], dato: null, durata: 10}} />
  </>
);
