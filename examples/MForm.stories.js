import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { withKnobs, select, boolean, text } from '@storybook/addon-knobs';

import MForm from '../packages/form/index';
import MFormItem from '../packages/form-item/index';
import MInput from '../packages/input/index';

const story = storiesOf('MForm', module);
story.addDecorator(withKnobs)
  .add(
    'MForm',
    () => ({
      components: { MForm, MFormItem, MInput },
      // props: {
      //   showWordLimit: {
      //     default: boolean('showWordLimit', true, '')
      //   },
      //   type: {
      //     default: select('type', {
      //       input: 'input',
      //       textarea: 'textarea'
      //     }, 'input')
      //   }
      // },
      data() {
        return {
          name: '',
          rules: {
            name: [
              { required: true, message: '请输入名称', trigger: 'blur'},
              { min: 3, max: 10, message: '长度在3-10个字符', trigger: 'change'},
              { validator: this.validateRegExp, trigger: 'change'}
            ],
            age: [
              { required: true, trigger: 'blur' }
            ]
          },
          formParams: {
            name: '',
            age: '',
          },
          showMessage: true,
        }
      },
      methods: {
        validateRegExp(rule, value, callback) {
          const reg = /^(\w)+/;
          if (reg.test(value)) {
            callback();
          } else {
            callback('只能以字母或数字开头');
          }
        }
      },
      template: `
        <m-form :rules="rules" inline :model="formParams" status-icon :show-message="showMessage">
          <m-form-item label="名称" prop="name">
            <m-input v-model="formParams.name"></m-input>
          </m-form-item>
          <m-form-item label="年龄" prop="age">
            <m-input v-model="formParams.age"></m-input>
          </m-form-item>
        </m-form>
        `
    })
  )
