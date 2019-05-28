<template>
  <div :class="[
    type === 'textarea' ? 'el-textarea' : 'el-input',
    inputSize ? 'el-input--' + inputSize : '',
    {
      'is-disabled': inputDisabled,
      'is-exceed': inputExceed,
      'el-input-group': $slots.prepend || $slots.append,
      'el-input-group--append': $slots.append,
      'el-input-group--prepend': $slots.prepend,
      'el-input-prefix': $slots.prefix || prefixIcon,
      'el-input-suffix': $slots.suffix || suffixIcon || clearable || showPassword
    }
    ]"
       @mouseenter="hovering = true"
       @mouseleave="hovering = false">
    <template v-if="type !== 'textarea'">
      <div class="el-input-group__prepend"
           v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </div>
      <input :tabindex="tabindex"
             class="el-input__inner"
             v-bind="$attrs"
             :type="showPassword ? (passwordVisible ? 'text' : 'password') : type"
             :disabled="inputDisabled"
             :readonly="readOnly"
             :autocomplete="autocomplete || autoComplete"
             ref="input"
             @compositionstart="handleCompositionStart"
             @compositionend="handleCompositionEnd"
             @input="handleInput"
             @focus="handleFocus"
             @blur="handleBlur"
             @change="handleChange"
             :aria-label="label">
      <span class="el-input-prefix"
            v-if="$slots.prefix || prefixIcon">
        <slot name="prefix"></slot>
        <i class="el-input__icon"
           v-if="prefixIcon"
           :class="prefixIcon"></i>
      </span>
      <span class="el-input__suffix"
            v-if="getSuffixVisiable()">
        <span class="el-input__suffix-inner">
          <template v-if="!showClear || !showPwdVisiable || !isWordLimitVisible">
            <slot name="suffix"></slot>
            <i class="el-input__icon"
               v-if="suffixIcon"
               :class="suffixIcon"></i>
          </template>
          <i v-if="showClear"
             class="el-input__icon el-icon-circle-close el-input__clear"
             @click="clear">
          </i>
          <i v-if="showPwdVisible"
             class="el-input__icon el-icon-view el-input__claer"
             @click="handlePasswordVisible"></i>
          <span v-if="isWordLimitVisible"
                class="el-input__count">
            <span class="el-input__count-inner">
              {{ textLength }}/{{ upperLimit }}
            </span>
          </span>
        </span>
        <i class="el-input__icon"
           v-if="validateState"
           :class="['el-input__validation', validateState]"></i>
      </span>

      <div class="el-input-group__append"
           v-if="$slots.append">
        <slot name="append"></slot>
      </div>
    </template>
    <textarea v-else
              :tabindex="tabindex"
              class="el-textarea__inner"
              @compositionstart="handleCompositionStart"
              @compositionend="handleCompositionEnd"
              @input="handleInput"
              ref="textarea"
              v-bind="$attrs"
              :disabled="inputDisabled"
              :readonly="readOnly"
              :autocomplete="autocomplete || autoComplete"
              :style="textareaStyle"
              @focus="handleFocus"
              @blur="handleBlur"
              @change="handleChange"
              :aria-label="label"></textarea>
    <span v-if="isWordLimitVisible && type === 'textarea'"
          class="el-input__count">{{ textLength }}/{{ upperLimit }}</span>
  </div>
</template>
<script>
import calcTextareaHeight from './calcTextareaHeight.js';
import emitter from '@/mixins/emitter.js';
export default {
  name: 'MInput',
  componentName: 'MInput',
  inheritAttrs: false,
  inject: {
    mForm: {
      default: ''
    },
    mFormItem: {
      default: ''
    }
  },
  mixins: [emitter],
  data() {
    return {
      textareaCalcStyle: {},
      hovering: false,
      focused: false,
      isComposing: false,
      passwordVisible: false,
    }
  },

  props: {
    value: [String, Number],
    size: String,
    resize: String,
    form: String,
    disabled: Boolean,
    readOnly: Boolean,
    type: {
      type: String,
      default: 'text'
    },
    autosize: {
      type: [Boolean, Object],
      default: false,
    },
    autocomplete: {
      type: String,
      default: 'off'
    },
    validateEvent: {
      type: Boolean,
      default: true,
    },
    suffixIcon: String,
    prefixIcon: String,
    label: String,
    clearable: {
      type: Boolean,
      default: false,
    },
    showPassword: {
      type: Boolean,
      default: false,
    },
    showWordLimit: {
      type: Boolean,
      default: false,
    },
    tabindex: String,
  },

  computed: {
    _mFormItemSize() {
      return (this.mFormItem || {}).mFormItemSize;
    },
    validateState() {
      return this.mFormItem ? this.mFormItem.validateState : '';
    },
    needStatusIcon() {
      return this.mForm ? this.mForm.statusIcon : false;
    },
    validateIcon() {
      return {
        validating: 'el-icon-loading',
        success: 'el-icon-circle-check',
        error: 'el-icon-circle-close'
      }[this.validateState]
    },
    textareaStyle() {
      return Object.assign({}, this.textareaCalcStyle, { resize: this.resize })
    },
    inputSize() {
      return this.size || this._mFormItemSize || (this.$MUI || {}).size;
    },
    inputDisabled() {
      return this.disabled || (this.mForm || {}).disabled;
    },
    nativeInputValue() {
      return this.value === null || this.value === undefined ? '' : String(this.value)
    },
    showClear() {
      return this.clearable &&
        !this.inputDisabled &&
        !this.readOnly &&
        this.nativeInputValue &&
        (this.focused || this.hovering)
    },
    showPwdVisible() {
      return this.showPassword &&
        !this.inputDisabled &&
        !this.readOnly &&
        (!!this.nativeInputValue || this.focused)
    },
    isWordLimitVisible() {
      return this.showWordLimit &&
        this.$attrs.maxlength &&
        (this.type === 'text' || this.type === 'textarea') &&
        !this.inputDisabled &&
        !this.readOnly &&
        !this.showPassword;
    },
    upperLimit() {
      return this.$attrs.maxlength;
    },
    textLength() {
      if (typeof this.value === 'number') {
        return String(this.value).length;
      }

      return (this.value || '').length;
    },
    inputExceed() {
      return this.isWordLimitVisible &&
        (this.textLength > this.upperLimit);
    }
  },

  watch: {
    value(val) {
      this.$nextTick(this.resizeTextarea);

      if (this.validateEvent) {
        this.dispatch('MFormItem', 'el.form.change', [val]);
      }
    },
    nativeInputValue() {
      this.setNativeInputValue();
    },
    type() {
      this.$nextTick(() => {
        this.setNativeInputValue();
        this.resizeTextarea();
        this.updateIconOffset();
      })
    },
  },

  methods: {
    getInput() {
      return this.$refs.input || this.$refs.textarea;  //refs获取dom节点
    },
    focus() {
      this.getInput().focus();
    },
    blur() {
      this.getInput().blur();
    },
    handleBlur(event) {
      this.focused = false;
      this.$emit('blur', event);
      if (this.validateEvent) {
        this.dispatch('MFormItem', 'el.form.blur', [this.value]);
      }
    },
    select() {
      this.getInput().select();
    },
    resizeTextarea() {
      if (this.$isServer) return;
      const { autosize, type } = this;

      if (type !== 'textarea') return;
      if (!autosize) {
        this.textareaCalcStyle = {
          minHeight: calcTextareaHeight(this.$refs.textarea).minHeight
        };
        return;
      }

      const minRows = autosize.minRows;
      const maxRows = autosize.maxRows;

      this.textareaCalcStyle = calcTextareaHeight(this.$refs.textarea, minRows, maxRows);
    },

    setNativeInputValue() {
      /* i think it not neccesory*/
      const input = this.getInput();

      if (!input) return;
      if (input.value === this.nativeInputValue) return;
      input.value = this.nativeInputValue;
    },
    handleFocus(evevt) {
      this.focused = true;
      this.$emit('focus', event);
    },
    handleCompositionStart() {
      this.isComposing = true;
    },
    handleCompositionEnd() {
      this.isComposing = false;
      this.handleInput(event);
    },
    handleInput(event) {
      if (this.isComposing) return;
      if (event.target.value === this.nativeInputValue) return;

      this.$emit('input', event.target.value);

      this.$nextTick(this.setNativeInputValue);
    },
    handleChange(event) {
      this.$emit('change', event.target.value);
    },
    calcIconOffset(place) {
      let elList = [].slice.call(this.$el.querySelectorAll(`.el-input__${place}`) || []);
      if (!elList.length) return;
      let el = null;

      for (let i = 0; i < elList.length; i++) {
        if (elList[i].parentNode === this.$el) {
          el = elList[i];
          break;
        }
      }
      if (!el) return;

      const pendantMap = {
        suffix: 'append',
        prefix: 'prepend'
      };

      const pendant = pendantMap[place];
      if (this.$slots[pendant]) {
        el.style.transform = `translateX(${place === 'suffix' ? '-' : ''}${this.$el.querySelector(`.el-input-group__${pendant}.offsetWidth`)}px)`
      } else {
        el.removeAttribute('style');
      }
    },
    updateIconOffset() {
      this.calcIconOffset('prefix');
      this.calcIconOffset('suffix');
    },
    clear() {
      this.$emit('input', '');
      this.$emit('change', '');
      this.$emit('clear')
    },
    handlePasswordVisible() {
      this.passwordVisible = !this.passwordVisible;
      this.focus();
    },
    getSuffixVisiable() {
      return this.$slots.suffix ||
        this.suffixIcon ||
        this.showClear ||
        this.showPassword ||
        this.isWordLimitVisible ||
        (this.validateState && this.needStatusIcon)
    },
  },

  created() {
    this.$on('inputSelect', this.select);
  },

  mounted() {
    this.setNativeInputValue();
    this.resizeTextarea();
    this.updateIconOffset();
  },

  updated() {
    this.$nextTick(this.updateIconOffset);
  }
}
</script>

