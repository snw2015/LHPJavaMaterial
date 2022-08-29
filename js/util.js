function getJSON(path) {
  return new Promise((resolve) => {
    $.getJSON(path, (data) => {
      resolve(data);
    });
  });
}

Vue.component('ljm-navbar', {
  props: ['current', 'title'],
  template: `
    <div class="main-header">
      <div class="logo-wrapper">
        <img src="https://www.lighthouseplan.net/img/common/logo_light.png"
             alt="logo" width="150">
      </div>

      <div class="title-wrapper">
        <h1 class="title">{{ title }}</h1>
      </div>

      <div class="header-nav-wrapper">
        <el-menu :default-active="current"
                  mode="horizontal"
                  background-color="#163867"
                  text-color="#FFFAFA"
                  active-text-color="#FFFAFA">
          <el-menu-item index="1">
            <el-link :underline="false" href="index.html" icon="el-icon-s-home">
              首页
            </el-link>
          </el-menu-item>
          <el-menu-item index="2">
            <el-link :underline="false" href="content.html" icon="el-icon-collection">
              教材
            </el-link>
          </el-menu-item>
          <el-menu-item index="3">
            <el-link :underline="false" href="glossary.html" icon="el-icon-collection">
              用语集
            </el-link>
          </el-menu-item>
        </el-menu>
      </div>
    </div>
  `
});

Vue.component('ljm-footer', {
  template: `
    <div class="main-footer">
      <span class="footer-text footer-text-left">
        © LighthouseIT. 2020-2022. All rights reserved.
      </span>
      <!-- <span class="footer-text footer-text-right">
         Last updated: 2022/8/27
      </span> -->
    </div>
  `
});
