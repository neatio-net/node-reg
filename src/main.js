// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueI18n from 'vue-i18n'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import './utils/iconfont'
import api from './utils/api';
import en from './lang/en'

Vue.use(VueI18n)
Vue.use(Element)
Vue.use(api);




locale.use(lang)

Vue.config.productionTip = false

const i18n = new VueI18n({
    locale: 'en',
    messages: {
        en
    }
})

/* eslint-disable no-new */
new Vue({
    el: '#app', 
    router,
    i18n,
    components: { App }, 
    template: '<App/>' 
})
