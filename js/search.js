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
      // TODO: this.dict = dict;
      this.data = data;
    }
  },
  template: `
    <el-input
      placeholder="输入搜索内容：如“方法”"
      prefix-icon="el-icon-search"
      v-model="input"
      @change="change()"
      style="margin-left: 10px; width: 250px;">
    </el-input>
  `
});
