<template>
  <transition name="el-alert-fade">
    <div class="el-alert"
         :class="[typeClass, center ? 'is-center' : '', 'is-' + effect]"
         v-show="visible"
         role="alert">
      <i class="el-alert__icon" :class="[iconClass, isBigIcon]" v-if="showIcon"></i>
      <div class="el-alert__content">
        <span class="el-alert__title" :class="[ isBoldTitle ]" v-if="title || $slot.title">
          <slot name="title">{{ title }}</slot>
        </span>
        <p class="el-alert__description" v-if="$slots.default && !description"><slot></slot></p>
        <p class="el-alert__description" v-if="!$slots.default && description">{{ description }}></p>
        <i class="el-alert__closebtn" :class="{ 'is-customed': colseText !== '', 'el-icon-close': closeText === '' }" v-show="closable" @click="close()">{{ closeText }}</i>
      </div>
    </div>
  </transition>
</template>
<script type="text/babel">
const TYPE_CLASS_MAP = {
  'success': 'el-icon-success',
  'warning': 'el-icon-warning',
  'error': 'el-icon-error'
};
export default {
  name: 'MAlert',

  props: {
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: true,
    },
    closable: {
      type: Boolean,
      default: true,
    },
    closeText: {
      type: String,
      default: '',
    },
    showIcon: Boolean,
    center: Boolean,
    effect: {
      type: String,
      default: 'light',
      validator: function(value) {
        return ['light', 'dark'].indexOf(value) !== -1;
      }
    }
  },

  data() {
    return {
      visible: true
    }
  },

  methods: {
    close() {
      this.visible = false;
      this.$emit('close');
    }
  },

  computed: {
    typeClass() {
      return `el-alert--${ this.type }`;
    },
    iconClass() {
      return TYPE_CLASS_MAP[this.type] || 'el-icon-info';
    },
    isBigIcon() {
      return this.description || this.$slots.default ? 'is-big' : '';
    },
    isBoldTitle() {
      return this.description || this.$slot.default ? 'is-bold' : '';
    }
  }
}
</script>
