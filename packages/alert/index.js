import MAlert from './src/alert.vue';

MAlert.install = function(Vue) {
  Vue.component(MAlert.name, MAlert);
}
// 暴露给babel-import-component，组件按需加载

export default MAlert;
