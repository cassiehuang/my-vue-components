import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { withKnobs, select, boolean, text } from '@storybook/addon-knobs';


const story = storiesOf('Checkbox', module);
story.addDecorator(withKnobs)
  .add(
    'Checkbox1',
    () => ({
      data() {
        return {
          list: ['选项一', '选项三'],
        }
      },
      watch: {
        list(value) {
          console.log(value);
        }
      },
      methods: {
        handleChange(value) {
          console.log(value);
        },
      },
      template: `
        <div>
          <input type="checkbox" value="选项一" v-model="list">选项一<br>
          <input type="checkbox" value="选项二" v-model="list">选项二<br>
          <input type="checkbox" value="选项三" v-model="list">选项三<br>
        </div>
        `
    })
  )
