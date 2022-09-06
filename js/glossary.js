LJM_GLOSSARY_JSON_PATH = 'assets/data/glossary.json';

Vue.component('ljm-glossary', {
  data() {
    return {
      tableData: null,
      showToc: false,
      tocTargets: []
    };
  },
  mounted() {
    getJSON(LJM_GLOSSARY_JSON_PATH).then(data => {
      this.tableData = this.preproc(data);
      this.$refs.table.loadData(this.tableData);
      this.$refs.search.setData(this.tableData.glossary);
    });
  },
  methods: {
    changed(value) {
      this.$emit('value', this.input);
    },
    preproc(data) {
      data.glossary = data.glossary.map(entry => {
        entry.jp = entry.jp.map(word =>
          typeof word === 'string' ? [word, word] : word
        );
        return entry;
      });
      return data;
    },
    updateTable(data) {
      this.$refs.table.loadData({
        tags: this.tableData.tags,
        glossary: data
      })
    },
    setTargets(targets) {
      if (targets && targets.length > 0) {
        this.tocTargets = targets;
        this.showToc = true;
      } else {
        this.showToc = false;
      }
    }
  },
  template: `
    <div>
      <ljm-search
        ref="search"
        @startCalculate="$refs.table.startLoad();"
        @calculated="updateTable"></ljm-search>
      <ljm-toc
        :class="{'show-height': showToc, 'luxy-el': true, 'hidden-height': !showToc}"
        :targets="tocTargets"
        offset="170"
        sticky
        sticky-offset="-60"
        divider
        style="z-index:1; position: relative"></ljm-toc>
      <ljm-table
        ref="table"
        @targetChanged="setTargets"></ljm-table>
    </div>
  `
});
