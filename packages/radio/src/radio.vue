<template>
  <label class="el-radio"
    :class="[
      border && radioSize ? 'el-radio--' + radioSize : '',
      { 'is-disabled': isDisabled },
      { 'is-checked': isChecked },
    ]"></label>
</template>
