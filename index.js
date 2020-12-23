// Export Vue Blocks as a Vue Plugin.

import VueBlocks from './vue-component-framework';

VueBlocks.install = function (Vue, options) {
    options = {async: true, ...options};

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
            if (self.$router) { 
                self.$router.addRoutes(VueBlocks.collectRoutes());
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