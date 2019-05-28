<script>
export default {
  props: {
    isAutoWidth: Boolean,
    updateAll: Boolean,
  },

  inject: ['mForm', 'mFormItem'],

  render() {
    const slots = this.$slots.default;
    if (!slots) return null;
    if (this.isAutoWidth) {
      const autoLabelWidth = this.mForm.autoLabelWidth;
      const style = {};

      if (autoLabelWidth && autoLabelWidth !== 'auto') {
        const marginLeft = parseInt(autoLabelWidth, 10) - this.computedWidth;
        if (marginLeft) {
          style.marginLeft = marginLeft + 'px';
        }
      }
      return (
        <div class="el-form-item__label-wrap" style={style}>
          {slots}
        </div>
      )
    } else {
      return slots[0]
    }
  },

  methods: {
    getLabelWidth() {
      if (this.$el && this.$el.firstElementChild) {
        const computedWidth = window.getComputedStyle(this.$el.firstElementChild).width;
        return Math.ceil(parseFloat(computedWidth));
      } else {
        return 0;
      }
    },

    updateLabelWidth(action = 'update') {
      if (this.$slots.default && this.isAutoWidth && this.$el.firstElementChild) {
        if (action === 'update') {
          const oldVal = this.computedWidth;
          const val = this.getLabelWidth();
          if (val === oldVal) {
            return;
          }
          // 如果计算出的label宽度改变，就更新
          this.computedWidth = this.getLabelWidth();
          if (this.updateAll) {
            this.mForm.registerLabelWidth(val, oldVal);
            this.mFormItem.updateComputedLabelWidth(val);
          }
        } else if (action === 'remove') {
          this.mForm.deregisterLabelWidth(this.computedWidth);
        }
      }
    }
  },

  data() {
    return {
      computedWidth: 0
    };
  },

  mounted() {
    this.updateLabelWidth('update');
  },

  update() {
    this.updateLabelWidth('update');
  },
  beforeDestroy() {
    this.updateLabelWidth('remove');
  }
}
</script>
