Vue.component('ljm-toc', {
  props: ['targets', 'ordered', 'offset', 'title', 'divider'],
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
          top: el.offset().top - (this.offset ? this.offset : 0),
          left: 0,
          behavior: 'smooth'
        });
      }
    },
    updatePosition(y) {
      if (!this.targets) return;
      this.current = this.targets[0];
      for (target of this.targets) {
        if ($('#' + target.id)[0]) {
          if (this.getOffsetTopToWindow($('#' + target.id)[0]) > +this.offset + y) break;
          this.current = target;
        }
      }
    },
    getOffsetTopToWindow(elm) {
      let offset = 0;
      while (elm) {
        offset += elm.offsetTop;
        elm = elm.offsetParent;
      }
      return offset;
    }
  },
  template: `
    <div class="toc" v-scroll="updatePosition">
      <h2 v-if="title" style="margin: 20px;"> {{ title }} </h2>
      <component :is="ordered !== undefined ? 'ol' : 'ul'">
        <template v-for="(target, i) in targets">
          <li v-if="divider !== undefined && i != 0" class="toc-divider">
            <el-divider direction="vertical"></el-divider>
          </li>
          <li>
            <el-link
              style="font-size: 18px;"
              :underline="false"
              @click="scrollTo(target.id);">
              <b v-if="current == target">{{ target.text }}</b>
              <span v-else>{{ target.text }}</span>
            </el-link>
          </li>
        </template>
      </component>
    </div>
  `
});
