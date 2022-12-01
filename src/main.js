import Vue from 'vue'
import {BootstrapVue, FormSelectPlugin, IconsPlugin } from 'bootstrap-vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App.vue'
import VueRouter from 'vue-router'
import VueSweetalert2 from 'vue-sweetalert2';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'mdb-vue-ui-kit/css/mdb.min.css';
import 'sweetalert2/dist/sweetalert2.min.css';

Vue.config.productionTip = false
Vue.use(BootstrapVue);
Vue.use(FormSelectPlugin)
Vue.use(IconsPlugin)
Vue.use(VueAxios, axios);
Vue.use(VueSweetalert2);
Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        component: () => import('./components/MainPage')
    },
    {
        path: '/admin',
        component: () => import('./components/admin/AdminPage')
    },
    {
        path: '/admin/employees',
        component: () => import('./components/admin/EmployeeList')
    },
    {
        path: '/admin/grades',
        component: () => import('./components/admin/GradeList')
    },
    {
        path: '/admin/lessons',
        component: () => import('./components/admin/LessonList')
    },
    {
        path: '/admin/positions',
        component: () => import('./components/admin/PositionList')
    },
    {
        path: '/admin/students',
        component: () => import('./components/admin/StudentList')
    },
    {
        path: '/admin/timetable',
        component: () => import('./components/admin/Timetable')
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
