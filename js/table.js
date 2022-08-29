COLORS = ['#FFEFD5', '#FFE4E1', '#7FFFD4', '#E0FFFF', '#98FB98'];

Vue.component('ljm-table', {
  data() {
    return {
      rawData: null,
      tagColors: {},
      tagData: [],
      tableData: [],
      tableLoading: true
    };
  },

  methods: {
    updateTable() {
      const tableData = [];
      for (const entry of this.rawData.glossary) {
        const row = {};
        row.jp = entry.jp;
        row.en = entry.en;
        row.zh = entry.zh;
        if (entry.section) {
          row.section = '§ ' + entry.section.join('.');
          row.href = 'content.html#s-' + entry.section.join('-');
        } else {
          row.section = '§z';
        }
        row.tag = entry.tag;
        tableData.push(row);
      }
      this.tableData = tableData;
    },

    updateTag() {
      this.tagData = [];
      this.tagColors = {};
      let i = 0;
      for (const tag of this.rawData.tags) {
        this.tagData.push({text: tag, value: tag});
        this.tagColors[tag] = COLORS[i++];
      }
    },

    filterTag(value, row) {
      return value === row.tag;
    },

    startLoad() {
      this.tableLoading = true;
    },

    loadData(data) {
      this.rawData = data;
      if (this.rawData === null) return;
      this.updateTag();
      this.updateTable();
      this.tableLoading = false;
    }
  },

  template: `
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      :default-sort="{prop: 'section'}">
      <el-table-column
        prop="jp"
        label="日文"
        sortable>
        <template slot-scope="scope">
          <span v-for="(word, i) in scope.row.jp">
            <el-divider direction="vertical" v-if="i != 0"></el-divider>
            <el-tooltip
              v-if="word[0] !== word[1]"
              effect="light"
              :content="word[1]"
              :visible-arrow="false"
              :close-delay="0"
              placement="top">
              <span>{{ word[0] }}</span>
            </el-tooltip>
            <span v-else>{{ word[0] }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="en"
        label="英文"
        sortable>
        <template slot-scope="scope">
          <span v-for="(word, i) in scope.row.en">
            <el-divider direction="vertical" v-if="i != 0"></el-divider>
            {{ word }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="zh"
        label="中文"
        sortable>
        <template slot-scope="scope">
          <span v-for="(word, i) in scope.row.zh">
            <el-divider direction="vertical" v-if="i != 0"></el-divider>
            {{ word }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="section"
        label="出现章节"
        sortable>
        <template slot-scope="scope">
          <el-link v-if="scope.row.section !== '§z'" :href="scope.row.href"
            target="_blank">
            {{ scope.row.section }}<i class="el-icon-reading el-icon--right"></i>
          </el-link>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        label="类别"
        :filters="tagData"
        :filter-method="filterTag">
        <template slot-scope="scope">
          <el-tag
            :color="tagColors[scope.row.tag]"
            style="color: #606266;">
            {{ scope.row.tag }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  `
});
