import Vue from 'vue'
import {BootstrapVue, FormSelectPlugin, IconsPlugin } from 'bootstrap-vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App.vue'
import VueRouter from 'vue-router'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'mdb-vue-ui-kit/css/mdb.min.css';

Vue.config.productionTip = false
Vue.use(BootstrapVue);
Vue.use(FormSelectPlugin)
Vue.use(IconsPlugin)
Vue.use(VueAxios, axios);
Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        component: () => import('./components/MainPage')
    },
    {
        path: '/admin/employees',
        component: () => import('./components/admin/EmployeeList')
    },
]

const router = new VueRouter({
    routes: routes,
    linkActiveClass: "active",
    linkExactActiveClass: "active"
});

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')
