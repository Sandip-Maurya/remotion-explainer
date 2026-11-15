import { Config } from '@remotion/cli/config';
import { enableTailwind } from '@remotion/tailwind';

// Output codec and quality
Config.setVideoImageFormat('jpeg');
Config.setCodec('h264');

// Hardware acceleration for Windows
Config.setChromiumOpenGlRenderer('angle');

// Render concurrency
Config.setConcurrency(4);

// Enable Tailwind CSS processing in Webpack
Config.overrideWebpackConfig((currentConfiguration) => {
  return enableTailwind(currentConfiguration);
});
