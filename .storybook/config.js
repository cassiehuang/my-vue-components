import 'element-theme-chalk';
import { configure } from '@storybook/vue';
// automatically import all files ending in *.stories.js
const req = require.context('../examples', true, /\.stories\.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
