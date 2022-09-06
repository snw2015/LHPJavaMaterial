LOCALE_INFO_PATH = 'assets/lang/info.json'
LOCALE_PATH = 'assets/lang/'

getJSON(LOCALE_INFO_PATH).then((locales) => {
  const paths = locales.map(locale => LOCALE_PATH + locale + ".json");
  getJSON(paths).then(results => {
    const messages = {};
    for (let i = 0; i < locales.length; i++) {
      const locale = locales[i];
      messages[locale] = results[i];
    }
    const i18n = new VueI18n({ locale: getLocale(), messages });
    if (getLocale() !== 'zh') {
      ELEMENT.locale(ELEMENT.lang[getLocale()]);
    }
    const app = new Vue({
      i18n,
      data: {
        tocTargets: null
      }
    }).$mount('#app');

    if (!isMobile()) {
      $('.el-table__header-wrapper').addClass('luxy-el');
      $('.el-table__header-wrapper').css('z-index', 1);
      $('.el-table__header-wrapper').css('position', 'relative');
      $('.el-table__header-wrapper').attr('sticky', true);
      $('.el-table__header-wrapper').attr('sticky-offset', -60);

      luxy.init({ wrapperSpeed: 0.12 });
    }
  });
});
