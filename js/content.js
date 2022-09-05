Vue.component('ljm-content', {
  props: ['value'],
  data() {
    return {
      contentData: [],
      contentLoading: true,
      currentKey: null
    };
  },
  mounted() {
    getJSON(this.$t('source.contents-path') + 'info.json').then(data => {
      this.contentData = this.handle(data);
      this.contentLoading = false;
      this.tryScroll();
    });
  },
  methods: {
    handle(data) {
      const contentData = [];
      let partNum = 1;
      tocTargets = [];
      for (const part of data) {
        const partData = {
          label: this.$t('toc.part-title', [partNum]) + part.title,
          children: [],
          id: `c-part-${partNum}`
        };

        tocTargets.push({
          text: part.title,
          id: partData.id
        });

        let chapterNum = 1;
        for (const chapter of part.chapters) {
          const chapterData = {
            label: `${partNum}.${chapterNum} ${chapter.title}`,
            children: [],
            text: this.$t('source.contents-path') + `${partNum}/${chapterNum}/class.pdf`,
            practice: !chapter.practice ? null : this.$t('source.contents-path') + `${partNum}/${chapterNum}/problems.pdf`,
            material: !chapter.material ? null : this.$t('source.contents-path') + `download/${partNum}.${chapterNum}.zip`
          };
          let sectionNum = 1;
          for (const section of chapter.sections) {
            const sectionData = {
              label: `${partNum}.${chapterNum}.${sectionNum} ${section.title}`,
              text: this.$t('source.contents-path') +
                `${partNum}/${chapterNum}/class.pdf#page=${section.page}`,
              id: `s-${partNum}-${chapterNum}-${sectionNum}`
            };
            chapterData.children.push(sectionData);
            sectionNum++;
          }
          partData.children.push(chapterData);
          chapterNum++;
        }
        contentData.push(partData);
        partNum++;
      }

      this.$emit('input', tocTargets);

      return contentData;
    },

    tryScroll() {
      if (window.location.href.includes('#')) {
        const id = window.location.href.split('#')[1];
        this.currentKey = id;
        const i = setInterval(function() {
          const el = $('#' + id);
          if (el.offset()) {
            setTimeout(function() {
              window.scrollTo({
                top: el.offset().top - 200,
                left: 0,
                behavior: 'smooth'
              });
            }, 400);
            clearInterval(i);
          }
        }, 100);
      }
    }
  },
  template: `
    <el-skeleton :loading="contentLoading" animated>
      <template>
        <el-tree
          :data="contentData"
          :expand-on-click-node="false"
          default-expand-all
          node-key="id"
          :current-node-key="currentKey"
          highlight-current>
          <span slot-scope="{ node, data }" :id="data.id">
            <span>{{ node.label }}</span>
            <span style="margin-left: 15px;">
              <el-link v-if="data.text" :href="data.text" icon="el-icon-reading"
                target="_blank">{{$t('toc.textbook')}}</el-link>
              <el-link v-if="data.practice" :href="data.practice" icon="el-icon-edit"
                target="_blank">{{$t('toc.practice')}}</el-link>
              <el-link v-if="data.material" :href="data.material" icon="el-icon-folder"
                target="_blank">{{$t('toc.material')}}</el-link>
            </span>
          </span>
        </el-tree>
      </template>
    </el-skeleton>
  `
});
