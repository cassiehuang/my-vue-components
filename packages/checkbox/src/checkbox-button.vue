<template>
 <label class="el-checkbox-button"
  :class="[
    size ? 'el-checkbox-button--' + size : '',
    { 'is-disabled': isDisabled },
    { 'is-checked': isChecked },
    { 'is-focus': focus },
  ]"
  role="checkbox"
  aria-checked="isChecked"
  aria-disabled="isDisabled">
  <input v-if="trueLabel || falseLabel"
    class="el-checkbox-button__original"
    type="checkbox"
    :name="name"
    :disabled="isDisabled"
    :true-label="trueLabel"
    :false-label="falseLabel"
    v-model="model"
    @change="handleChange"
    @focus="focus = true"
    @blur="focus = false">
  <input
      v-else
      class="el-checkbox-button__original"
      type="checkbox"
      :name="name"
      :disabled="isDisabled"
      :value="label"
      v-model="model"
      @change="handleChange"
      @focus="focus = true"
      @blur="focus = false">
  <span class="el-checkbox-button__inner"
    v-if="$slots.default || label"
    :style="isChecked ? activeStyle : null">
    <slot>{{label}}</slot>
  </span>
 </label>
</template>
<script>
import Emitter from '@/mixins/emitter';

export default {
  name: 'MCheckboxButton',
  mixins: [Emitter],
  inject: {
    mForm: {
      default: ''
    },
    mFormItem: {
      default: ''
    }
  },

  props: {
    value: {},
    label: {},
    disabled: Boolean,
    checked: Boolean,
    name: String,
    trueLabel: [String, Number],
    falseLabel: [String, Number]
  },

  computed: {
    model: {
      get() {
        return this._checkedboxGroup
          ? this._checkedboxGroup.value : this.value !== undefined
            ? this.value : this.selfModel;
      },

      set(val) {
        if (this._checkedboxGroup) {
          this.isLimitExceeded = false;
          (this._checkedboxGroup.min !== undefined &&
            val.length < this._checkedboxGroup.min &&
            (this.isLimitExceeded = true));

          (this._checkedboxGroup.max !== undefined &&
            val.length > this._checkedboxGroup.max &&
            (this.isLimitExceeded = true));

          this.isLimitExceeded === false &&
          this.dispatch('MCheckboxGroup', 'input', val);
        } else if (this.value !== undefined) {
          this.$emit('input', val);
        } else {
          this.selfModel = val;
        }
      }
    },

    isChecked() {
      if ({}.toString.call(this.model) === '[obejct Boolean]') {
        return this.model;
      } else if (Array.isArray(this.model)) {
        return this.model.indexOf(this.label) > -1;
      } else if (this.model !== null && this.model !== undefined ) {
        return this.model === this.trueLabel;
      }
    },

    _checkedboxGroup() {
      let parent = this.$parent;
      while (parent) {
        if (parent.$options.componentName !== 'MCheckboxGroup') {
          parent = parent.$parent;
        } else {
          return parent;
        }
      }
      return false;
    },

    activeStyle() {
      return {
        backgroundColor: this._checkedboxGroup.fill || '',
        borderColor: this._checkedboxGroup.fill || {},
        color: this._checkedboxGroup.textColor || {},
        'box-shadow': '-1px 0 0 0' + this._checkedboxGroup.fill
      }
    },

    _elFormItemSize() {
      return (this.mFormItem || {}).elFormItemSize;
    },

    size() {
      return this._checkedboxGroup.checkboxGroupSize || this._elFormItemSize || (this.$MUI || {}).size;
    },

    isDisabled() {
      return (this._checkedboxGroup ? this._checkedboxGroup.disabled : false) || this.disabled || (this.mForm || {}).disabled;
    }
  },

  methods: {
    addToStore() {
      if (Array.isArray(this.model) && this.model.indexOf(this.label) === -1) {
        this.model.push(this.label);
      } else {
        this.model = this.trueLabel || true;
      }
    },
    handleChange(ev) {
      if (this.isLimitExceeded) return;
      let value;
      if (ev.target.checked) {
        value = this.trueLabel === undefined ? true : this.trueLabel;
      } else {
        value = this.falseLabel === undefined ? false : this.falseLabel;
      }
      this.$emit('change', value, ev);
      this.$nextTick(() => {
        if (this._checkedboxGroup) {
          this.dispatch('MCheckboxGroup', 'change', this._checkedboxGroup.value)
        }
      })
    }
  },
  created() {
    this.checked && this.addToStore();
  }
}
</script>
