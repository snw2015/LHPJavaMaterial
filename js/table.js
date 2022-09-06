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
          text: this.$t('glossary.tag.' + tag),
          value: tag
        });
        this.tagColors[tag] = COLORS[i++];
      }
    },

    filterTag(value, row) {
      return row.special || value === row.tag;
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
      if (!order) {
        this.tableData = this.rawData.glossary;
        this.$emit('targetChanged', null);
        return;
      }
      this.tableLoading = true;

      let tableData = [];

      if (prop === 'section') {
        tableData = this.rawData.glossary;
      } else {
        for (const entry of this.rawData.glossary) {
          for (const word of entry[prop]) {
            const row = Object.assign({}, entry);
            row[prop] = [word].concat(entry[prop].filter(w => w !== word));
            tableData.push(row);
          }
        }
      }

      if (prop === 'zh' || prop === 'en') {
        tableData.sort((a, b) => a[prop][0].localeCompare(b[prop][0]));
      } else if (prop === 'jp') {
        tableData.sort((a, b) => a.jp[0][1].localeCompare(b.jp[0][1]));
      } else {
        tableData.sort((a, b) => {
          return arrCompare(a.section, b.section);
        });
      }

      if (order === 'descending') tableData.reverse();

      const tmp = tableData;
      const targets = [];
      if (['jp', 'en', 'section'].includes(prop)) {
        tableData = [];
        let typeId = -1;
        tmp.forEach(row => {
          type = prop === 'jp' ? initialJp(row.jp[0][1])
               : prop === 'en' ? initialEn(row.en[0])
               : row.section ? [row.section[0], this.$t('toc.part-title', [row.section[0]])]
               : [0, '-'];
          if (typeId != type[0]) {
            const id = 'special-' + type[0];
            tableData.push({special: type[1], id: id});
            targets.push({id: id, text: type[1]});
            typeId = type[0];
          }
          tableData.push(row);
        });
      }
      this.$emit('targetChanged', targets);

      this.tableData = tableData;
      this.tableLoading = false;
    },

    span(el) {
      return [1, el.row.special ? 5 : 1];
    },

    addRowClass(el) {
      return el.row.special ? 'table-row-special' : '';
    }
  },

  template: `
    <el-table
      v-loading.fullscreen.lock="tableLoading"
      :data="tableData"
      @sort-change="sortTable"
      :span-method="span"
      :row-class-name="addRowClass">
      <el-table-column
        prop="jp"
        :label="$t('glossary.japanese')"
        sortable="custom">
        <template
          slot-scope="scope">
          <b v-if="scope.row.special" :id="scope.row.id">
            {{ scope.row.special }}
          </b>
          <span v-else>
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
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="en"
        :label="$t('glossary.english')"
        sortable="custom">
        <template slot-scope="scope">
          <span v-if="scope.row.special"></span>
          <span v-else>
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
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="zh"
        :label="$t('glossary.chinese')"
        sortable="custom">
        <template slot-scope="scope">
          <span v-if="scope.row.special"></span>
          <span v-else>
            <span v-for="(word, i) in scope.row.zh">
              <el-divider direction="vertical" v-if="i != 0"></el-divider>
              <span
                v-if="sortedBy === 'zh' && i != 0"
                style="color: #C0C4CC;">{{ word }}</span>
              <span v-else >{{ word }}</span>
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="section"
        :label="$t('glossary.first-appear')"
        sortable="custom"
        width="130">
        <template slot-scope="scope">
          <span v-if="scope.row.special"></span>
          <span v-else>
            <el-link
              v-if="scope.row.section"
              :href="'content.html#s-' + scope.row.section.join('-')"
              target="_blank">
              {{ '§ ' + scope.row.section.join('.') }}
              <i class="el-icon-reading el-icon--right"></i>
            </el-link>
            <span v-else>-</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('glossary.category')"
        :filters="tagData"
        :filter-method="filterTag"
        width="140">
        <template slot-scope="scope">
          <span v-if="scope.row.special"></span>
          <span v-else>
            <el-tag
              :color="tagColors[scope.row.tag]"
              style="color: #606266;"
              @click="setTag(scope.row.tag);">
              {{ $t('glossary.tag.' + scope.row.tag) }}
            </el-tag>
          </span>
        </template>
      </el-table-column>
    </el-table>
  `
});
