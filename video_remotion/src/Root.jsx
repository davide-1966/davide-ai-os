import {Composition} from 'remotion';
import {PizzaPip} from './PizzaPip';
export const Root = () => (
  <Composition id="PizzaPip" component={PizzaPip} durationInFrames={240} fps={30} width={1080} height={1920}
    defaultProps={{titolo: 'RADDOPPIATO, QUINDI È PRONTO?', verdetto: 'FALSO.'}} />
);
