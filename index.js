// Export Vue Blocks as a Vue Plugin.

import VueBlocks from './vue-component-framework';


/**
 * VueBlocks Vue Plugin
 * 
 * @usage
 * Vue.use(VueBlocks)
 * 
 * @param options (object) keys:
 *      async (boolean, default true)
 *          delay mounting of Vue app until all async components have been loaded.
 *          this is necessary when using <template src="url"> tags.
 * 
 *      registerRoutes (boolean, default false)
 *          should we perform VueBlocks.collectRoutes and register these 
 *          with the VueRouter instance you supplied for you?
 * 
 */
VueBlocks.install = function (Vue, options) {
    // set default options
    options = {
        async: true, 
        registerRoutes: false, 
        ...options
    };

    VueBlocks.setRegistrar(Vue.component.bind(Vue));
    VueBlocks.loadModules();

    var promise = VueBlocks.loadVueComponents();

    // This is necessary for resolving template[src] stuff.
    
    var pendingMount = null;
    var originalMount = null;


    if (options.async) { 
        pendingMount = null;
        originalMount = Vue.prototype.$mount;

        Vue.prototype.$mount = function (...args) {
            var self = this;
            if (options.registerRoutes) { 
                if (self.$router) { 
                    self.$router.addRoutes(VueBlocks.collectRoutes());
                } 
            }
            pendingMount = function() {
                Vue.prototype.$mount = originalMount;
                self.$mount(...args);
            };
        }

        promise = promise.then(done => {
            pendingMount && pendingMount();
            originalMount && (Vue.prototype.$mount = originalMount);

        })
    } 

    // not that anyone does anything.
    return promise;
};

window.VueBlocks = VueBlocks;

export default VueBlocks;