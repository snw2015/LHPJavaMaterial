Vue.component('ljm-search', {
  data() {
    return {
      input: '',
      dict: [],
      data: []
    };
  },
  methods: {
    change(value) {
      this.$emit('calculated', this.filter());
    },

    filter() {
      if (this.input === '') return this.data;
      return this.data.filter(entry =>
          entry.jp.some(word => word[0].includes(this.input)) ||
          entry.en.some(word => word.includes(this.input)) ||
          entry.zh.some(word => word.includes(this.input))
      )
    },

    setData(data) {
      this.data = data;
      this.dict = new Set();
      this.data.forEach(entry => {
        entry.jp.forEach(word => this.dict.add(word[0]));
        entry.en.forEach(phrase => phrase.split(' ').forEach(this.dict.add, this.dict));
        entry.zh.forEach(this.dict.add, this.dict);
      });
      this.dict = [...this.dict];
      this.dict.sort();
    },

    querySearch(queryString, callback) {
      callback(this.dict.filter(word =>
        word.toLowerCase().startsWith(queryString.toLowerCase())
      ).map(word => {
         return {value: word};
      }));
    }
  },
  template: `
    <el-autocomplete
      :placeholder="$t('glossary.search-text')"
      prefix-icon="el-icon-search"
      v-model="input"
      :fetch-suggestions="querySearch"
      :trigger-on-focus="false"
      @change="change()"
      clearable
      class="search-box">
    </el-autocomplete>
  `
});
