Vue.component('ljm-toc', {
  props: ['targets', 'ordered', 'offset', 'title'],
  data() {
    return {
      current: null
    }
  },
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
    },
    updatePosition(y) {
      if (!this.targets) return;
      this.current = this.targets[0];
      for (target of this.targets) {
        if ($('#' + target.id)[0].offsetTop > +this.offset + y) break;
        this.current = target;
      }
    }
  },
  template: `
    <div class="toc" v-scroll="updatePosition">
      <h2 style="margin: 20px;"> {{ title }} </h2>
      <component :is="ordered !== undefined ? 'ol' : 'ul'">
        <li v-for="target in targets">
          <el-link
            style="font-size: 18px;"
            :underline="false"
            @click="scrollTo(target.id);">
            <b v-if="current == target">{{ target.text }}</b>
            <span v-else>{{ target.text }}</span>
          </el-link>
        </li>
      </component>
    </div>
  `
});
