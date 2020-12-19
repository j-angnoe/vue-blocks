# Docs - Inner workings

## Examples

- Nested routes: [../examples/nested-routes.html]()
- Different ways to define templates: [../examples/template-module-examples.html]()
- Support asynchronous loading of vue files [../examples/vue-files.html]()
- Scoped styles are supported: [../examples/scoped-styles.html]()
- A shorter syntax for vue components is possible: [../examples/shorter-syntax.html]()

## Using the built version:
When using the bundled version (../dist/vue-blocks.js) Vue Blocks
starts scanning the current HTML document when all content has been 
loaded (DOMEvent DOMContentLoaded) 

It scans the html document looking for:
- `<template component="...">` for Vue components
- `<template url="...">` for Vue routes
- `<template module="...">` for fake Javascript modules.

All components will be registered with Vue via `Vue.component()`.
It will collect all routes and pass them to Vue Router.
Finally it will look mount a Vue instance on an '<app></app>' element.


## Using VueBlocks programmatically:

Here is an example of using Vue Blocks programmatically 
to auto-register vue components defined in the html document.
This method is often used when embedding Vue Blocks inside an
existing project.

```js
// app.js
import Vue from 'vue/dist/vue.common';

window.Vue = Vue;

var VueBlocks = require("vue-blocks/vue-component-framework");

VueBlocks.loadModules();
VueBlocks.loadVueComponents();

// alternative 1: provide a context / root element
// VueBlocks.loadVueComponent(document.body)

/**
 * alternative 2: custom registering
 * 
 * VueBlocks.loadVueComponent(document.body, function(compName, compDef) {
 *      console.log("Vue Block registers " + componentName)
 *      Vue.component(componentName, componentDefinition);
 * });
 **/

import VueRouter from "vue-router";

var routes = VueBlocks.collectRoutes();
var router = new VueRouter({
  routes: routes
});

Vue.use(VueRouter);

const app = new Vue({
    el: "#my-app",
    router
});

```


