import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    themes: {
      light: {
        primary: "#2980b9",
        secondary: "#5cbd6a",
        third:'#e67e22',
        fourth:'#3498db',
        accent: '#8c9eff',
        error: '#b71c1c',
      },
    },
  }
});
