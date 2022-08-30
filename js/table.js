COLORS = ['#FFEFD5', '#FFE4E1', '#7FFFD4', '#E0FFFF', '#98FB98'];

Vue.component('ljm-table', {
  data() {
    return {
      rawData: null,
      tagColors: {},
      tagData: [],
      tableData: [],
      tableLoading: true,
      sortedBy: null
    };
  },

  methods: {
    updateTag() {
      this.tagData = [];
      this.tagColors = {};
      let i = 0;
      for (const tag of this.rawData.tags) {
        this.tagData.push({
          text: tag,
          value: tag
        });
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
      this.tableData = this.rawData.glossary;
      this.tableLoading = false;
    },

    sortTable({ column, prop, order }) {
      this.sortedBy = order ? prop : null;
      if (!['jp', 'en', 'zh'].includes(prop)) return;
      this.tableLoading = true;

      const tableData = [];

      for (const entry of this.rawData.glossary) {
        for (const word of entry[prop]) {
          const row = Object.assign({}, entry);
          row[prop] = [word].concat(entry[prop].filter(w => w !== word));
          tableData.push(row);
        }
      }

      if (prop === 'zh' || prop === 'en') {
        tableData.sort((a, b) => a[prop][0].localeCompare(b[prop][0]));
      } else if (prop === 'jp') {
        tableData.sort((a, b) => a.jp[0][1].localeCompare(b.jp[0][1]));
      }

      if (order === 'descending') tableData.reverse();

      this.tableData = tableData;

      this.tableLoading = false;
    },

    sectionCompare(rowA, rowB) {
      const a = rowA.section, b = rowB.section;
      if (a == b) return 0;
      if (!a) return 1;
      if (!b) return -1;
      return a > b ? 1 : -1;
    }
  },

  template: `
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      :default-sort="{prop: 'section'}"
      @sort-change="sortTable">
      <el-table-column
        prop="jp"
        label="日文"
        sortable="custom">
        <template slot-scope="scope">
          <span v-for="(word, i) in scope.row.jp">
            <el-divider direction="vertical" v-if="i != 0"></el-divider>
            <span
              v-if="sortedBy === 'jp' && i != 0"
              style="color: #C0C4CC;">{{ word[0] }}</span>
            <el-tooltip
              v-else-if="word[0] !== word[1]"
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
        sortable="custom">
        <template slot-scope="scope">
          <span v-for="(word, i) in scope.row.en">
            <el-divider direction="vertical" v-if="i != 0"></el-divider>
            <span
              v-if="sortedBy === 'en' && i != 0"
              class="lang-en"
              style="color: #C0C4CC;">{{ word }}</span>
            <span
              v-else
              class="lang-en">{{ word }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="zh"
        label="中文"
        sortable="custom">
        <template slot-scope="scope">
          <span v-for="(word, i) in scope.row.zh">
            <el-divider direction="vertical" v-if="i != 0"></el-divider>
            <span
              v-if="sortedBy === 'zh' && i != 0"
              style="color: #C0C4CC;">{{ word }}</span>
            <span v-else >{{ word }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="section"
        label="出现章节"
        sortable
        :sort-method="sectionCompare"
        width="120">
        <template slot-scope="scope">
          <el-link
            v-if="scope.row.section"
            :href="'content.html#s-' + scope.row.section.join('-')"
            target="_blank">
            {{ '§ ' + scope.row.section.join('.') }}
            <i class="el-icon-reading el-icon--right"></i>
          </el-link>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        label="类别"
        :filters="tagData"
        :filter-method="filterTag"
        width="100">
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
