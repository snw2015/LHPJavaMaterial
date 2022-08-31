Vue.component('ljm-toc', {
  props: ['targets', 'ordered', 'offset', 'title'],
  methods: {
    scrollTo(id) {
      const el = $('#' + id);
      if (el.offset()) {
        window.scrollTo({
          top: el.offset().top - this.offset,
          left: 0,
          behavior: 'smooth'
        });
      }
    }
  },
  template: `
    <div class="toc">
      <h2 style="margin: 20px;"> {{ title }} </h2>
      <component :is="ordered !== undefined ? 'ol' : 'ul'">
        <li v-for="target in targets">
          <el-link style="font-size: 18px;" :underline="false" @click="scrollTo(target.id);">{{ target.text }}</el-link>
        </li>
      </component>
    </div>
  `
});
