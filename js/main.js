var app = new Vue({ el: '#app' });

if (!isMobile()) {
  luxy.init({ wrapperSpeed: 0.12 });
}
