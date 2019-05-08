import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { withKnobs, select, boolean, text } from '@storybook/addon-knobs';

import MInput from '../packages/input/index';

const story = storiesOf('Input', module);
story.addDecorator(withKnobs)
  .add(
    'MInput',
    () => ({
      components: { MInput },
      props: {
        showWordLimit: {
          default: boolean('showWordLimit', true, '')
        },
        type: {
          default: select('type', {
            input: 'input',
            textarea: 'textarea'
          }, 'input')
        }
      },
      data() {
        return {
          value1: 'str',
          value2: '',
        }
      },
      template: `
        <div style="width: 300px;">
          <m-input v-model="value1" :type="type"></m-input>
          <m-input v-model="value2" type="textarea" :show-word-limit="showWordLimit" maxlength="40"></m-input>
        </div>
        `
    })
  )
