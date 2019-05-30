<template>
  <div class="el-checkbox-group" role="group" aria-label="checkbox-group">
    <slot></slot>
  </div>
</template>
<script>
import Emitter from '@/mixins/emitter';

export default {
  name: 'MCheckboxGroup',
  componentName: 'MCheckboxGroup',

  mixins: [Emitter],
  inject: {
    mFormItem: {
      default: ''
    }
  },

  props: {
    value: {},
    disabled: Boolean,
    min: Number,
    max: Number,
    size: String,
    fill: String,
    textColor: String,
  },

  computed: {
    _elFormItemSize() {
      return (this.mFormItem || {}).elFormItemSize;
    },

    checkboxGroupSize() {
      return this.size || this._elFormItemSize || (this.$MUI || {}).size;
    }
  },

  watch: {
    // 所有的input都和form联动，当改变时要触发form.item的change事件
    value(value) {
      this.dispatch('MFormItem', 'el.form.change', value);
    }
  }
}
</script>
