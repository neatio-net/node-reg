import Vue from 'vue'
import Router from 'vue-router'
const Layout = resolve => require(['@/components/layouts/Layout'], resolve);
const walletInfo = resolve => require(['@/components/pages/walletInfo'], resolve)

const editValidator = resolve => require(['@/components/pages/editValidator'], resolve)

const setCommission = resolve => require(['@/components/pages/setCommission'], resolve)



const claimReward = resolve => require(['@/components/pages/claimReward'], resolve)







Vue.use(Router)
const router = new Router({
    mode: 'history',
    routes: [{
        path: '/',
        // name: 'Layout',
        component: Layout,
        children: [{
            path: '',
            name: 'walletInfo',
            component: walletInfo,
            meta: []
        },





        {
            path: '/editValidator',
            name: 'editValidator',
            component: editValidator
        },
        {
            path: '/setCommission',
            name: 'setCommission',
            component: setCommission
        },

        {
            path: '/claimReward',
            name: 'claimReward',
            component: claimReward
        },



        ]
    }]
})

export default router
