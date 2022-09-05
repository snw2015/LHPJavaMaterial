LOCALE_INFO_PATH = 'assets/lang/info.json'
LOCALE_PATH = 'assets/lang/'

getJSON(LOCALE_INFO_PATH).then((locales) => {
  const paths = locales.map(locale => LOCALE_PATH + locale + ".json");
  getJSON(paths).then(results => {
    const messages = {};
    for (let i = 0; i < locales.length; i++) {
      messages[locales[i]] = results[i];
    }
    const i18n = new VueI18n({ locale: getLocale(), messages });
    const app = new Vue({
      i18n,
      data: {
        tocTargets: null
      }
    }).$mount('#app');

    if (!isMobile()) {
      luxy.init({ wrapperSpeed: 0.12 });
    }
  });
});
