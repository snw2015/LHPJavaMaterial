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
      this.dict = [];
      this.data.forEach(entry => {
        entry.jp.forEach(word => this.dict.push(word[0]));
        this.dict.push(...entry.en);
        this.dict.push(...entry.zh);
      });
      this.dict.sort();
    },

    querySearch(queryString, callback) {
      callback(this.dict.filter(word =>
        word.startsWith(queryString)
      ).map(word => {
         return {value: word};
      }));
    }
  },
  template: `
    <el-autocomplete
      placeholder="输入搜索内容：如“方法”"
      prefix-icon="el-icon-search"
      v-model="input"
      :fetch-suggestions="querySearch"
      :trigger-on-focus="false"
      @change="change()"
      style="margin-left: 10px; width: 250px;">
    </el-autocomplete>
  `
});
