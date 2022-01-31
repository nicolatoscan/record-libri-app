import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)

export default new Vuetify({
    theme: {
        dark: true,
        themes: {
            light: {
                primary: colors.teal,
            },
            dark: {
                primary: colors.teal.lighten1,
            },
        },
    },
})