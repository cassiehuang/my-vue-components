<template>
  <transition name="m-zoom-in-top"
              @after-leave="doDestory">
    <div v-show="showPoper"
         class="m-autocomplete-suggestion m-popper"
         :class="{ 'is-loading': !parent.hideLoading && parent.loading }"
         :style="{ width: dropdownWIdth }"
         role="region">
      <m-scrollbar tag="ul"
                   wrap-class="m-autocomplete-suggestion__wrap"
                   view-class="m-autocomplete-suggestion__list">
        <li v-if="!parent.hideLoading && parent.loading"><i class="m-icon-loading"></i></li>
        <slot v-else></slot>
      </m-scrollbar>
    </div>
  </transition>
</template>
