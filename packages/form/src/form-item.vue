<template>
  <div class="el-form-item" :class="[{
      'el-form-item--feedback': mForm && mForm.statusIcon,
      'is-error': validateState === 'error',
      'is-validating': validateState === 'validating',
      'is-success': validateState === 'success',
      'is-required': isRequired || required,
      'is-no-asterisk': mForm && mForm.hideRequiredAsterisk
    },
    sizeClass ? 'el-form-item--' + sizeClass : ''
  ]">
    <label-wrap :is-auto-width="labelStyle && labelStyle.width === 'auto'"
      :updaye-all="form.labelWidth === 'auto'">
      <label :for="labelFor" class="el-form-item__label"
        :style="labelStyle"
        v-if="label || $slots.label">
        <slot name="label">{{label + form.labelSuffix}}</slot>
      </label>
    </label-wrap>
    <div class="el-form-item__content" :style="contentStyle">
      <slot></slot>
      <transition name="el-zoom-in-top">
        <slot v-if="validateState === 'error' && showMessage && form.showMessage"
          name="error"
          :error="validateMessage">
          <div class="el-form-item__error"
            :class="{
              'el-form-item__error--inline': typeof inlineMessage === 'boolean'
                ? inlineMessage
                : (mForm && mForm.inlineMessage || false)
            }">
            {{validateMessage}}
          </div>
        </slot>
      </transition>
    </div>
  </div>
</template>
<script>
import emitter from '@/mixins/emitter';
import LabelWrap from './label-wrap.vue';
import AsyncValidator from 'async-validator';
import { noop, getPropByPath } from '@/utils/util.js';
export default {
  name: 'MFormItem',
  componentName: 'MFormItem',

  mixins: [emitter],

  provide() {
    return {
      mFormItem: this,
    }
  },

  inject: ['mForm'],

  props: {
    label: String,
    labelWidth: String,
    prop: String,
    required: {
      type: Boolean
    },
    rules: [Object, Array],
    error: String,
    validateStatus: String,
    for: String,
    inlineMessage: {
      type: [String, Boolean],
      default: '',
    },
    showMessage: {
      type: Boolean,
      default: true,
    },
    size: String,
  },
  components: {
    LabelWrap
  },
  watch: {
    error: {
      immediate: true,
      handler(value) {
        this.validateMessage = value;
        this.validateState = value ? 'error' : '';
      }
    },
    validateStatus(value) {
      this.validateState = value;
    },
    validateState(value) {
      this.showMessage
    }
  },

  computed: {
    labelFor() {
      return this.for || this.prop;
    },
    labelStyle() {
      const ret = {};
      if (this.form.labelPostion === 'top') return ret;
      const labelWidth = this.labelWidth || this.form.labelWidth;
      if (labelWidth) {
        ret.width = labelWidth;
      }
      return ret;
    },

    contentStyle() {
      const ret = {};
      const label = this.label;
      if (this.form.labelPostion === 'top' || this.form.inline) return ret;
      // ??
      if (!label && !this.labelWidth && this.isNested) return ret;

      const labelWidth = this.labelWidth || this.form.labelWidth;
      if (labelWidth === 'auto') {
        if (this.labelWidth === 'auto') {
          ret.marginLeft = this.computedLabelWidth;
        } else if (this.form.labelWidth === 'auto') {
          ret.marginLeft = this.mForm.autoLabelWidth;
        }
      } else {
        ret.marginLeft = labelWidth;
      }

      return ret;
    },
    form() {
      // why not use mForm?
      let parent = this.$parent;
      let parentName = parent.$options.componentName;
      while (parentName !== 'MForm') {
        if (parentName === 'MFormItem') {
          this.isNested = true;
        }
        parent = parent.$parent;
        parentName = parent.$options.componentName;
      }
      return parent;
    },
    fieldValue() {
      // 绑定在form上的model存放表单所有值，如果没有在form上设置model，则所有验证在form都会取不到值
      // 因为要在form上绑定rule做表单验证，所以表单所有域用一个对象来绑定,然后将其传入form表单，在input等输入上绑定对象的一个属性，可以通过form获取到所有域的值
      // 如果绑定在输入元素或者form-item上，就需要多个值，无法将其从外部组件传入form
      const model = this.form.model;
      if (!model || !this.prop) { return; }

      let path = this.prop;
      if (path.indexOf(':') !== -1) {
        path = path.replace(/:/, '.');
      }

      return getPropByPath(model, path, true).v;
    },
    isRequired() {
      let rules = this.getRules();
      let isRequired = false;

      if (rules && rules.length) {
        rules.every(rule => {
          if (rule.required) {
            isRequired = true;
            return false;
          }
          return true;
        })
      }
      return isRequired;
    },

    _formSize() {
      return this.mForm.size;
    },
    elFormItemSize() {
      return this.size || this._formSize;
    },
    sizeClass() {
      return this.elFormItemSize || (this.$MUI || {}).size;
    }
  },

  data() {
    return {
      validateState: '',
      validateMessage: '',
      validateDisabled: false,
      validator: {},
      isNested: false,
      computedLabelWidth: '',
    }
  },
  methods: {
    validate(trigger, callback = noop) {
      this.validateDisabled = false;
      const rules = this.getFilteredRule(trigger);
      if ((!rules || rules.length === 0) && this.required === undefined) {
        callback();
        return true;
      }

      this.validateState = 'validating';
      const descriptor = {};
      if (rules && rules.length > 0) {
        rules.forEach(rule => {
          delete rule.trigger;
        })
      }
      descriptor[this.prop] = rules;

      const validator = new AsyncValidator(descriptor);
      const model = {};

      model[this.prop] = this.fieldValue;
      validator.validate(model, { firstFields: true }, (errors, invalidFields) => {
        this.validateState = !errors ? 'success' : 'error';
        this.validateMessage = errors ? errors[0].message : '';
        callback(this.validateMessage, invalidFields);
        this.mForm && this.mForm.$emit('validate', this.prop, !errors, this.validateMessage || null);
      });
    },
    clearValidate() {
      this.validateState = '';
      this.validateMessage = '';
      this.validateDisabled = false;
    },
    resetField() {
      this.validateState = '';
      this.validateMessage = '';

      let model = this.form.model;
      let value = this.fieldValue;

      let prop = getPropByPath(model, this.prop, true);

      this.validateDisabled = true;
      if (Array.isArray(value)) {
        prop.o[prop.k] = [].concat(this.initialValue);
      } else {
        prop.o[prop.k] = this.initialValue;
      }

      this.broadcast('ElTimeSelect', 'fieldReset', this.initialValue);
    },

    getRules() {
      let formRules = this.form.rules;
      const selfRules = this.rules;
      const requiredRule = this.required !== undefined ? { required: !!this.required } : [];

      const prop = getPropByPath(formRules, this.prop || '');
      formRules = formRules ? (prop.o[this.prop || ''] || prop.v) : [];

      return [].concat(selfRules || formRules || []).concat(requiredRule);
    },

    getFilteredRule(trigger) {
      // 筛选出匹配trigger的规则
      const rules = this.getRules();

      return rules.filter(rule => {
        if (!rule.trigger || trigger === '') return true;

        if (Array.isArray(rule.trigger)) {
          return rule.trigger.indexOf(trigger) > -1;
        } else {
          return rule.trigger === trigger;
        }
      }).map(rule => Object.assign({}, rule))
    },

    onFieldBlur() {
      this.validate('blur');
    },

    onFieldChange() {
      if (this.validateDisabled) {
        this.validateDisabled = false;
        return;
      }

      this.validate('change');
    },

    updateComputedLabelWidth(width) {
      this.computedLabelWidth = width ? `${width}px` : '';
    },

    addValidateEvents() {
      const rules = this.getRules();

      if (rules.length || this.required !== undefined) {
        this.$on('el.form.blur', this.onFieldBlur);
        this.$on('el.form.change', this.onFieldChange);
      }
    },

    removeValidateEvents() {
      this.$off();
    }
  },

  mounted() {
    // prop需要验证的字段名
    if (this.prop) {
      this.dispatch('MForm', 'el.form.addField', this);

      let initialValue = this.fieldValue;
      if (Array.isArray(initialValue)) {
        initialValue = [].concat(initialValue);
      }
      Object.defineProperty(this, 'initialValue', {
        value: initialValue
      });

      this.addValidateEvents();
    }
  }
}
</script>
