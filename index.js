var vuecf = require('./vue-component-framework')
var loadModules = vuecf.loadModules
var loadVueComponents = vuecf.loadVueComponents
var collectRoutes = vuecf.collectRoutes
var Vue = require('vue/dist/vue')
var VueRouter = require('vue-router')
Vue.use(VueRouter)

// Start the application application
document.addEventListener('DOMContentLoaded', done => {
    loadModules()
    loadVueComponents()


    var routes = collectRoutes();
    var router = new VueRouter({
        routes: routes
    })
    

    // @todo remove this, (leak routes to window for debugging.)
    window.routes = routes

    var appInstance = new Vue({
        router: router
    }).$mount('app')
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


window.Vue = Vue