import MButton from '../packages/button';
import { locale } from 'core-js';

const components = [
  MButton,
];

const install = function(Vue, opts = {}) {
  // locale.use(opts.locale);
  // locale.i18n(opts.i18n);

  components.forEach(component => {
    Vue.component(component.name, component);
  })

  // Vue.use(Loading.directive);

  Vue.prototype.$MUI = {
    size: opts.size || '',
    zIndex: opts.zIndex || 2000
  };

  // Vue.prototype.$loading = Loading.service;
  // Vue.prototype.$msgbox = MessageBox;
}

//全局Vue下，自动安装， 否则暴露install方法
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}
export default {
  version: '2.8.2',
  install,
  MButton,
}
