import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)

export default new Vuetify({
    icons: {
        iconfont: 'mdiSvg', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
    },
    theme: {
        dark: true,
        themes: {
            light: {
                primary: colors.teal,
                secondary: colors.teal.lighten3
            },
            dark: {
                primary: colors.teal.lighten1,
                secondary: colors.teal.darken4
            },
        },
    },
})