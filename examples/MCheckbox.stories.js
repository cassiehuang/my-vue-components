import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { withKnobs, select, boolean, text } from '@storybook/addon-knobs';

import MCheckbox from '../packages/checkbox/index';
import MCheckboxGroup from '../packages/checkbox-group/index';

const story = storiesOf('Checkbox', module);
story.addDecorator(withKnobs)
  .add(
    'Checkbox',
    () => ({
      components: { MCheckbox, MCheckboxGroup },
      data() {
        return {
          list: ['选项一', '选项三'],
          listCity: ['上海', '成都'],
          allChecked: false,
          indeterminate: false,
          allCity: ['上海', '成都', '北京', '深圳'],
          agree: false,
        }
      },
      methods: {
        checkAll(value) {
          this.listCity = value ? this.allCity : [];
        }
      },
      watch: {
        listCity: {
          immediate: true,
          handler: function handler(value) {
            if (value.length === 0) {
              this.indeterminate = false;
              this.allChecked = false;
            } else if (value.length === this.allCity.length) {
              this.indeterminate = false;
              this.allChecked = true;
            } else {
              this.indeterminate = true;
            }
          }
        }
      },
      template: `
      <div>
        <m-checkbox v-model="agree">同意</m-checkbox>
        <br>
        <br>
        <br>
        <br>
        <m-checkbox-group v-model="list">
          <m-checkbox label="选项一" value="hah"></m-checkbox>
          <m-checkbox label="选项二"></m-checkbox>
          <m-checkbox label="选项三"></m-checkbox>
        </m-checkbox-group>
        <br>
        <br>
        <m-checkbox :indeterminate="indeterminate" v-model="allChecked" @change="checkAll">全选</m-checkbox>
        <m-checkbox-group v-model="listCity">
          <m-checkbox :label="city" v-for="city in allCity" :key="city"></m-checkbox>
        </m-checkbox-group>
      </div>
        `
    })
  )
