
/**
 * Vue Component Framework
 * Enables components to be loaded inside templates.
 **/


/**
 * Voor het laden van template[module] tags.
 * Maakt gebruik van de domComponentCollector.
 **/
function loadModules(context) {
    context = context || document;

    var modules = context.querySelectorAll('template[module]');

    [...modules].forEach(function (comp) {

        var moduleName = comp.getAttribute('module');
        var object = domComponentCollectorRaw.call(comp);

        window[moduleName] = object.then(object => {
        	// console.log(object, "Set " + moduleName)
        	window[moduleName] = object;
        })

        document.body.innerHTML += domCollectorStriptags(comp.innerHTML);
    });
}

/**
 * Construct an object from some template tag. Used by domComponentCollector and loadModules
 * to extract application pieces from the supplied document.
 *
 * Rules:
 * <script src=""> are loaded via fetch to prevent deprecated synchronous loading in main thread. 
 * <link rel="Stylesheets"> works
 * <script> tags are may do export default { }
 **/

function domComponentCollectorRaw(scriptVariables) {
  scriptVariables = scriptVariables || {};
    var template = this.content;
    var script = template.querySelector('script:not([src]):not([type^="text"])');   
    var loadScripts = template.querySelectorAll('script[src]');   

    var getObject = function () {
    	var object = {};
    	if (script) {
            
            var code = script.innerHTML.replace(/export default/,'module.exports = ');
            var process = comp => comp;

            if (code.match("('short';|return class vue)")) {
                if (code.match('return class vue')) { 
                    code = code.replace(/return\s+class\s+vue\s*\{/, 'module.exports = class {');
                } else { 
                    code = code.replace(/return\s+class\s+\{/, 'module.exports = class {');
                }
                
                code = code.replace(/\sconstructor\s*\(/, 'mounted(');
                code = code.replace(/\sdestructor\s*\(/, 'destroyed(');
                process = function(obj) {                    
                    var data = new obj;
                    var {props, watch, computed, components, directives, filters, ...data} = data;
                    var lifeCycleMethods = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'activated', 'deactivated', 'beforeUnmount', 'unmounted', 'errorCaptured', 'renderTracked', 'renderTriggered','destroyed','beforeDestroy'];
                    var methods = {};
                    var lifeCycle = {};
                    for (var method of Object.getOwnPropertyNames(obj.prototype)) {
                        if (method == 'constructor') continue;
                        if (typeof obj.prototype[method] == 'function') {
                            if (~lifeCycleMethods.indexOf(method)) { 
                                lifeCycle[method] = obj.prototype[method];
                            } else {
                                methods[method] = obj.prototype[method];
                            }
                            delete data[method];
                        } 
                    }

                    var comp = {
                        data() {
                            return JSON.parse(JSON.stringify(data));
                        },
                        props,
                        watch,
                        computed, 
                        components,
                        directives,
                        ...lifeCycle,
                        filters,
                        methods
                    }
                    return comp;
                }
            }
    		var matches = [];

            var require_regex = /require\s*\(['"]([^'"]+)['"]\)(\.)?/ig;

    		code.replace(require_regex, (...match) => {
                if (!window[match[1]]) {
                    var returnDefault = match[2] ? false : true;
                    matches.push(preload_module(match[1], returnDefault));
                } else {
                    matches.push(window[match[1]]);
                }
    		});
    		
    		if (matches) {
    			return Promise.all(matches).then(done => {
    				return process(commonJsExec(code, scriptVariables));
    			})
    		} else {
    			return process(commonJsExec(code, scriptVariables));
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
	            p = p.then(res => { return fetch(url).then(r => r.text()) }).then(x => {
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

function domComponentCollector(componentName, scriptVariables) {
    componentName = componentName || '';

    var promise = domComponentCollectorRaw.call(this, scriptVariables);

	var props = (this.getAttribute('props')||'').split(/\s?,\s?/).filter(Boolean);

    var scopedStyle = '';
    var html;

    // support one script type="text/template" support.
    var containedTemplate = this.content.querySelector('script[type="text/template"]');
    [...this.content.querySelectorAll('style')].forEach(s => {
        
        if (s.hasAttribute('scoped')) { 
            s.parentNode.removeChild(s);
            scopedStyle += s.innerHTML;
        } else {
            document.head.appendChild(s);
        }
    });


    if (containedTemplate) {
        html = containedTemplate.innerHTML;
    } else {
        html = this.innerHTML;
    }

    if (scopedStyle) {
        scopedStyle = scopedStyle.replace(/([^\}]+?)\{/g, (full, selectors) => {
            if (full.match(/^\s*@/)) {
                return full;
            }
            return selectors.split(',').map(x => {
                // :scope will point to self.
                return '*[scoped-css-' + componentName + '] ' + x.replace(/:(scope|root)/, '').replace(/^\s+/,'');
            }).join(',') + '{';
        });
        // console.log(scopedStyle, 'scoped Style');
        var scopedStyleElem = document.createElement('style');
        scopedStyleElem.innerHTML = scopedStyle;
        document.head.append(scopedStyleElem);
    }
    // Return a vue resolvable component definition.
    return function (resolve, reject) {
    	promise.then(object => {
	    	object.name = componentName;

	    	html = domCollectorStriptags(html);

            html = html.replace(/([^<]+?)>/, (n,pre) => {
                return pre + ' scoped-css-'+componentName+'>';
            });

            if (object.template) {
                if (html > '') {
                    console.log("Warning: " + componentName + " has both a two template definitions. The javascript template is selected.")
                }
            } else {
               // Always wrap component name as class name for convenience.
	   		   object.template = html;
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


function loadVueComponents(context, registrar, scriptVariables) {
    context = context || document;
    var components = [...context.querySelectorAll('template[component]')];

    components.forEach(function (comp) {
        
        var componentName = comp.getAttribute('component');
        var object = domComponentCollector.call(comp, componentName, scriptVariables)

        if (registrar) {
          registrar(componentName, object);
        } else {
          defaultRegistrar(componentName, object);
        }
    });

    return loadVueFiles(context, registrar, scriptVariables);
}

function loadVueFiles(context, registrar, scriptVariables) {
    context = context || document;
    var components = [...context.querySelectorAll('template[src]')];

    return Promise.all(components.map(function(comp) {
        var url = comp.getAttribute('src');

        if (!registrar) {
            registrar = defaultRegistrar;
        }

        if (url.match(/\.vue$/)) {
            var componentName = url.split('/').pop().replace('.vue','');

            // console.log(componentName);

            
            registrar(componentName, function(resolve, reject) {

                fetch(url).then(r => r.text()).then(source => {
                    // console.log(source);
                    source = source.replace(/<\/?template.*?>/g,'')
                    // source =  '<template>' + source + '</template>';
                    var el = document.createElement('template');
                    el.innerHTML = source;

                    var object = domComponentCollector.call(el, componentName, scriptVariables);

                    object(resolve);
                });
            })
        } else {
            if (context.relativeBase) {
                if (~url.indexOf('://')) {
                    // do nothing
                } else if (url.substr(0,1) === '/') {
                    url = context.absoluteBase + url;
                } else {
                    url = context.relativeBase + url;
                }
            }
            return fetch(url).then(r => r.text()).then(source => {
                var el = document.createElement('template');
                var anchor = document.createElement('a');
                anchor.href = url;
                el.content.relativeBase = anchor.protocol + '//' + anchor.host + anchor.pathname.replace(/\/[^\/]+$/,'/');
                el.content.absoluteBase = anchor.protocol + '//' + anchor.host;
                el.innerHTML = source;
                return loadVueComponents(el.content, function (c, obj) {
                    registrar(c, obj);
                }, scriptVariables);
            });
        }
    }));
}


function collectRoutes(context, handled) {
    var routes = [];
    handled = handled || []

    var lookup = {};
    context = context || document;
    [...context.querySelectorAll('template[url]')].forEach(function (el) {
        if (handled.indexOf(this) !== -1) {
            //already handled.
            return;
        }
        var url = el.getAttribute('url');       

        var routeObject = {}
        for (let key in el.attributes) {
            let value = el.attributes[key];
            if (value.nodeName && value.nodeValue && (value.nodeName !== 'url')) {
                if (value.nodeValue.match(/true|false/i)) {
                    routeObject[value.nodeName] = !!value.nodeValue.match(/true/i)
                } else { 
                    routeObject[value.nodeName] = value.nodeValue
                }
            }
        }

        var componentName = ('url-handler-' + url.replace(/^\/$/, 'index')).replace(/[^a-z0-9_]+/ig, '-');

        routeObject.component = domComponentCollector.call(el, componentName)

        routeObject.path = url;
        routes.push(routeObject)

        handled.push(el);

        routeObject.children = collectRoutes(el, handled);

        lookup[url] = routeObject
    });

    [...context.querySelectorAll('template[sub-url]')].forEach(function (el) {

        var subUrl = el.getAttribute('sub-url')
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
        var childComponent = {path: childRelativeUrl, component: domComponentCollector.call(el) };       

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
        return window[name] ;
    } if (oldRequire) {
        return oldRequire(name)
    }

    throw new Error("Cannot require asynchronously: " + name);  
};

function preload_module(name, returnDefault) {
    var fn = 'resolveImport' + Math.round(Math.random()*(new Date).getTime()).toString(16).substr(0,8);

    if (name.match(/\.css(\?.+)*$/)) {
        return new Promise(resolve => {
            url = name;
            if (!name.match(/^https?:\/\//)) {
                url = 'https://unpkg.com/' + name;
            }
            var link = document.createElement('link');
            link.setAttribute('rel','stylesheet');
            link.setAttribute('href', url);
            document.body.appendChild(link);

            window[name] = {};
            resolve();
        });
    }
    
    return new Promise(resolve => {
        window[fn] = resolve;
        var script = document.createElement('script');

        var url = name;
        if (!name.match(/^https?:\/\//)) {
            url = 'https://jspm.dev/' + name;
        }
        script.type = 'module';
        script.innerHTML = 'import * as md from "' + url + '"; window.' + fn + '(md);';
        document.body.appendChild(script);
    }).then(result => {
        delete window[fn];
        var ret = result;
        if (returnDefault) {
            ret = result.default && result.default.default || result.default;;
        }
        window[name] = ret;
    });
}
function commonJsExec(code, scriptVariables) {
	try {
      var module = {exports:{}};
      // Context variables will be available in the scope of the evaluated script.
      scriptVariables = scriptVariables || {};
      scriptVariables['module'] = module;
      scriptVariables['exports'] = module.exports,
      scriptVariables['require'] = require_script;

	    var moduleJsFn = new Function(Object.keys(scriptVariables).join(','), code);

	    /* work in progress... dynamic module resolve.
	    moduleJs.match(/\W?require\(.+?\)/g).forEach(function (req) {
	        req = req.match(/["'].+?["']/);
	        
	        console
	    })*/

      // Run it
      // Assume Object.values returns in the same order as Object.keys
	    moduleJsFn(...Object.values(scriptVariables));

	    // and return the exports:
	    return module.exports;    

	} catch (error) {
        console.error(error);
		console.error(error.stack);
		console.info('in code: ' + code);
	}
}

var defaultRegistrar = function (componentName, definition) {
    if (window.Vue) {
        window.Vue.component(componentName, definition);
    } else { 
        console.error('Could not register ' + componentName);
        console.error('Please call VueBlocks.setRegistrar(Vue.component.bind(Vue))');
    }
};

module.exports = {
	commonJsExec: commonJsExec,
	loadModules: loadModules,
	loadVueComponents: loadVueComponents,
    collectRoutes: collectRoutes,
    setRegistrar(registrar) {
        defaultRegistrar = registrar;
    }
}
