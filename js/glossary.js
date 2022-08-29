LJM_GLOSSARY_JSON_PATH = 'assets/data/glossary.json';

Vue.component('ljm-glossary', {
  data() {
    return {
      tableData: null
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
      // TODO: some default things
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
    }
  },
  template: `
    <div>
      <ljm-search
        ref="search"
        @startCalculate="$refs.table.startLoad();"
        @calculated="updateTable"></ljm-search>
      <ljm-table ref="table""></ljm-table>
    </div>
  `
});
