Vue.component('ljm-aside', {
  props: ['title'],
  data() {
    return {
      on: true
    }
  },
  methods: {
    trigger(e) {
      this.on = !this.on;
      e.target.blur();
    }
  },
  template: `
    <div :class="{ 'aside-wrapper': true, 'aside-off': !on }">
      <div class="aside">
        <h1 v-if="title" class="aside-title"> {{ title }} </h1>
        <slot></slot>
      </div>
      <el-button class="aside-button" circle @click="trigger">
        <span :class="'el-icon-arrow-' + (on ? 'right' : 'left')"></span>
      </el-button>
    </div>
  `
});
