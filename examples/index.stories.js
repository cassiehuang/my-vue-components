/* eslint-disable react/react-in-jsx-scope, react/no-this-in-sfc */

import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { withKnobs, select, boolean, text } from '@storybook/addon-knobs';

import MButton from '../packages/button/index';

const story = storiesOf('Button', module);
story.addDecorator(withKnobs)
  .add(
    'MButton',
    () => ({
      components: { MButton },
      props: {
        size: {
          default: select(
            'size',
            {
              sm: 'mini',
              md: 'small',
              lg: 'medium',
            },
            'small'
          )
        },
        type: {
          default: select(
            'type',
            {
              primary: 'primary',
              success: 'success',
              warning: 'warning',
              danger: 'danger',
              info: 'info',
              text: 'text'
            },
            'primary'
          )
        },
        loading: {
          default: boolean('loading', false, ''),
        },
        plain: {
          default: boolean('plain', false, ''),
        },
        round: {
          default: boolean('round', false, ''),
        },
        circle: {
          default: boolean('circle', false, ''),
        },
        disabled: {
          default: boolean('disabled', false, ''),
        },
        icon: {
          default: text('icon', 'el-icon-delete'),
        }
      },
      template: `
        <div>
          <m-button :type="type" :size="size" :loading="loading" :round="round" :circle="circle" :disabled="disabled" :plain="plain" :icon="icon">button</m-button>
        </div>
        `
    })
  )
