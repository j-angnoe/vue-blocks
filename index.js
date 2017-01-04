var vuecf = require('./vue-component-framework')
var loadModules = vuecf.loadModules
var loadVueComponents = vuecf.loadVueComponents
var collectRoutes = vuecf.collectRoutes
var Vue = require('vue')
var VueRouter = require('vue-router')

// Start the application application
document.addEventListener('DOMContentLoaded', done => {
    loadModules()
    loadVueComponents()

    Vue.use(VueRouter)

    var router = new VueRouter()

    var routes = collectRoutes();

    // @todo remove this, (leak routes to window for debugging.)
    window.routes = routes
    router.map(routes);

    var app = Vue.options.components.app

    // app is a function(resolve)
    app(app => {
        router.start(app, 'app');    
    })
})

window.Vue = Vue