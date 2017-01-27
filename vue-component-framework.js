
/**
 * Vue Component Framework
 * Enables components to be loaded inside templates.
 **/


/**
 * Voor het laden van template[module] tags.
 * Maakt gebruik van de domComponentCollector.
 **/
function loadModules(context) {
    var modules = $('template[module]', context).get();

    modules.forEach(function (comp) {

        var moduleName = comp.getAttribute('module');
        var object = domComponentCollectorRaw.call(comp);

        window[moduleName] = object.then(object => {
        	// console.log(object, "Set " + moduleName)
        	window[moduleName] = object;
        })

        $(domCollectorStriptags(comp.innerHTML)).appendTo('body');
    });
}

/**
 * Construct an object from some template tag. Used by domComponentCollector and loadModules
 * to extract application pieces from the supplied document.
 *
 * Rules:
 * <script src=""> are loaded via jQuery.getScript to prevent deprecated synchronous loading in main thread. 
 * <link rel="Stylesheets"> works
 * <script> tags are may do export default { }
 **/
function domComponentCollectorRaw() {
    var template = this.content;
    var script = template.querySelector('script:not([src]):not([type^="text"])');   
    var loadScripts = template.querySelectorAll('script[src]');   

    var getObject = function () {
    	var object = {};
    	if (script) {
    		var code = script.innerHTML.replace(/export default/,'module.exports = ');

    		var matches = [];

            var require_regex = /require\s*\(['"]([A-Za-z0-9\-\./]+)['"]\)/ig; /* fix syntax highlight: ' */

    		code.replace(require_regex, (...match) => {
    			matches.push(window[match[1]]);
    		});
    		
    		if (matches) {
    			return Promise.all(matches).then(done => {
    				console.log("All matches have been resolved.");
    				return commonJsExec(code);
    			})
    		} else {
    			return commonJsExec(code);
    		}

    		
    	}
    	return object;
    }
  
    if (loadScripts.length) {
    	return new Promise((resolve, reject) => {
	    	var p = Promise.resolve();

	        Array.prototype.forEach.call(loadScripts, script => {
	            // alert("Load " + script.getAttribute('src'));
	            
	            var url = script.getAttribute('src');
	            p = p.then(res => { return $.getScript(url) }).then(x => {
	            	//console.log("Loaded " + url);
	            })
	        })  

	        p.then(
	            done => {
	            	// console.log("DONE?");
                	resolve(getObject());    
	            },
	            error => {
	                // A primitive solution, but otherwise no errors are shown, 
	                // and the user will be unaware that something went wrong (besides the
	                // fact that some part of the application does not seem to be responding)
	                reject(error);
	            }
	        )
	
    	})
    }

    return Promise.resolve(getObject());
}

function domCollectorStriptags(html) {

    // Replace all script tags.
    html =  html.replace(/<script[\s\S.]*?<\/script>/gi, '');

    // Also replace spaces from the template.
    html = html.replace(/(^\s+|\s+$)/g,'');	

    return html;	
}

function domComponentCollector(componentName) {
    componentName = componentName || '';

    var promise = domComponentCollectorRaw.call(this);

	var props = (this.getAttribute('props')||'').split(/\s?,\s?/).filter(Boolean);


    var html;

    // support one script type="text/template" support.
    var containedTemplate = this.content.querySelector('script[type="text/template"]');

    if (containedTemplate) {
        html = containedTemplate.innerHTML;
    } else {
        html = this.innerHTML;
    }


    // Return a vue resolvable component definition.
    return function (resolve, reject) {
    	promise.then(object => {
	    	object.name = componentName

	    	html = domCollectorStriptags(html);

            if (object.template) {
                if (html > '') {
                    console.log("Warning: " + componentName + " has both a two template definitions. The javascript template is selected.")
                }
            } else {
               // Always wrap component name as class name for convenience.
	   		   object.template = html
            }

            if (object.ready) {
                object.mounted = function () {
                    console.error("Vue 2.0 migration warning: Replace ready function with mounted function in `" + componentName + "`");
                    object.ready();
                }
            }

		    if (object.props && props && props.length) {
		        console.log("Error: export props and attribute props mixed at " + componentName + " definition.");
		    } else if (!object.props && props) {
		    	object.props = props
		    }

    		resolve(object);
    	}).catch(reject);
    };
}


function loadVueComponents(context) {

    var components = $('template[component]', context).get();

    components.forEach(function (comp) {
        var componentName = comp.getAttribute('component');
        var object = domComponentCollector.call(comp, componentName)

        Vue.component(componentName, object);           
    });

    loadVueFiles();
}

function loadVueFiles(context) {
    var components = $('template[src]', context).get();

    components.forEach(function(comp) {
        var url = comp.getAttribute('src');

        if (url.match(/\.vue$/)) {
            var componentName = url.split('/').pop().replace('.vue','');

            // console.log(componentName);

            Vue.component(componentName, function(resolve, reject) {
                $.get(url).then(source => {

                    // console.log(source);
                    source = source.replace(/<\/?template.*?>/g,'')

                    source = '<template>' + source + '</template>';

                    var object = domComponentCollector.call($(source)[0], componentName);

                    object(resolve);

                    // console.log(object.toString());
                })
            })
            
        }
    })
}


function collectRoutes(context, handled) {
    var routes = [];
    handled = handled || []

    var lookup = {};

    $('template[url]',context).each(function () {
        if (handled.indexOf(this) !== -1) {
            //already handled.
            return;
        }
        var url = this.getAttribute('url');       

        var routeObject = {}
        $.each(this.attributes, (key, value) => {
            // skip url
            if (value.nodeName && value.nodeValue && (value.nodeName !== 'url')) {
                if (value.nodeValue.match(/true|false/i)) {
                    routeObject[value.nodeName] = !!value.nodeValue.match(/true/i)
                } else { 
                    routeObject[value.nodeName] = value.nodeValue
                }
            }
        })


        var componentName = 'url-handler-' + url.replace(/^\//, 'index').replace(/[^a-z0-9_]/, '-');

        routeObject.component = domComponentCollector.call(this, componentName)

        routeObject.path = url;
        routes.push(routeObject)

        handled.push(this);

        routeObject.children = collectRoutes(this, handled);

        lookup[url] = routeObject
    })

    $('template[sub-url]',context).each(function () {

        var subUrl = this.getAttribute('sub-url');
        var foundParent = false
        
        var parentUrl;

        for (parentUrl in lookup) {
            if (parentUrl !== '/' && subUrl.indexOf(parentUrl) === 0) {
                foundParent = parentUrl
                //break;
            }
        }

        if (!foundParent) {
            throw new Error('sub-url could not find parent for url `' + subUrl + '`');
        }

        // console.log("Found parent " + foundParent + " for sub url " + subUrl)       

        if (!lookup[foundParent].children) {
            lookup[foundParent].children = []
        }

        var childRelativeUrl = subUrl.substr(foundParent.length + 1);
        var childComponent = {path: childRelativeUrl, component: domComponentCollector.call(this) };       

        lookup[foundParent].children.push(childComponent)

        if (subUrl.substr(foundParent.length).length > 1 && !(subUrl in lookup)) {
            lookup[subUrl] = childComponent;
        }

    })



    return routes;
}


var oldRequire;
if (typeof require !== 'undefined') {
	oldRequire = require
} else { 
	oldRequire = window.require
}

function require_script(name) {
    if (window[name]) {
        return window[name];
    } if (oldRequire) {
        return oldRequire(name)
    }

    throw new Error("Cannot require asynchronously: " + name);  
};

function commonJsExec(code) {
	try { 
	    var moduleJsFn = new Function('module,exports,require', code);
	    
	    /* work in progress... dynamic module resolve.
	    moduleJs.match(/\W?require\(.+?\)/g).forEach(function (req) {
	        req = req.match(/["'].+?["']/);
	        
	        console
	    })*/
	    
	    var module = {exports:{}};
	  


	    // Run it
	    moduleJsFn(module, module.exports, require_script);
	    
	    // and return the exports:
	    return module.exports;    

	} catch (error) {
		console.error(error.stack);
		console.info('in code: ' + code);
	}
}

module.exports = {
	commonJsExec: commonJsExec,
	loadModules: loadModules,
	loadVueComponents: loadVueComponents,
	collectRoutes: collectRoutes
}
