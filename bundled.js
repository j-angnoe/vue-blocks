// Source for Vue Blocks
// This is the bundled version

import Vue from 'vue/dist/vue.common';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

initializeVueBlocks(Vue, VueRouter);

window.Vue = Vue;
window.VueRouter = VueRouter;
window.VueBlocks = require('./vue-component-framework');

function initializeVueBlocks(Vue, VueRouter) {
    // Start the application application
    document.addEventListener('DOMContentLoaded', done => {
        VueBlocks.loadModules()
        VueBlocks.setRegistrar(Vue.component.bind(Vue));

        Promise.resolve(VueBlocks.loadVueComponents()).then(done => {
            var routes = VueBlocks.collectRoutes();
            var router = null;

            if (routes.length && VueRouter) {
                var router = new VueRouter({
                    routes: routes
                })
            } else if (routes.length) {
                console.info("There are routes defined but VueRouter is not avaiable.");
            }
            
            var appInstance = new Vue({
                ...(window.createApp && window.createApp() || {}),
                router: router,
            }).$mount('app')
        })
    })

    var isVue2 = Vue.version.match(/^2/);

    if (!isVue2) {
        Vue1_to_2();
    }


    function Vue1_to_2() {
        Vue.component('router-link', {
            template: `<a v-link="{path: to}"><slot /></a>`,
            props: ['to']
        })
    }
}