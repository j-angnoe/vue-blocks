# Vue Blocks

This is a drop-in script that enables you to write multiple Vue components and routes 
in a html file. No external tooling required. It's the ease-of-use of 
.vue files without being limited to one component per file. It a weapon of choice for
quick and simple prototypes. For this purpose Vue and VueRouter are included.

Take a look at some examples: 
- Single page [TodoMVC example](https://fluxfx.nl/vue-blocks/examples/todomvc.html) ([source](./examples/todomvc.html))
- [Try it online](https://fluxfx.nl/vue-blocks/examples/try-it.html) ([source](./examples/try-it.html))

## Usage

Add `<script src="//unpkg.com/vue-blocks/dist/vue-blocks.js"></script>` to your HTML file 
and start writing your Vue application. Then you add `<app></app>` to body and define a app component.
You may copy-and-paste the [Quick Start HTML Template](#quick-start-html-template) provided 
below, are have a look at the [examples](./examples/index.html).

## Documentation
Can be found here: [./docs/index.md](./docs/index.md)

## Write components

Vue components can be defined by writing something like.

```html
<template component="my-component">
	<div>
		<!-- Your template HTML with Vue syntax here -->
		variable: {{my_variable}}

		<!-- reference your components -->
		<my-other-component></my-other-component>

	</div>
	<style scoped>
		/* css */
	</style>
	<script>
		// Vue component definition here (Like in .vue files)
		export default() {
			data() {
				return {
					my_variable: 'my_value'
				}
			},
			mounted() {
				// ... 
			},
			methods: {
				clickButton() {
					...
				}
			}
		}
	</script>
</template>
```


## Using the router
Begin by writing some routes:

```html
<template url="/">
	<div> 
		<!-- vue template for homepage... -->
	</div>
	<style> /* ... */ </style>
	<script>
		/* optional vue component definition */
		export default() {
			mounted() {
				alert("Homepage mounted");
			}
		}
	</script>
</template>
```

Please review the examples/index.html, or check it out online: http://fluxfx.nl/vue-blocks/examples/index.html

dist/vue-blocks.js bundles Vue 2.1.8 and Vue router 2.1.1. 

## Quick Start HTML Template

```html
<!DOCTYPE html>
<html>
	<head>
		<title>Vue Blocks Framework</title>
		<link  href="//unpkg.com/bootstrap@3.3.7/dist/css/bootstrap.min.css" rel="stylesheet">
		<script src="//unpkg.com/vue-blocks/dist/vue-blocks.js"></script>
	</head>
	<body>
		<app></app>
		<template component="app">
			<div>
				<!-- vue template -->

				<!-- <router-view></router-view> , if you intend to have urls on your page.-->
			</div>
			<script>
				export default() {
					mounted() {
						alert("It works.");
					}
				}
			</script>
		</template>
	</body>
</head>
```

##  Full Example 
This example includes some components and a few urls.

```html
<!DOCTYPE html>
<html>
	<head>
		<title>Vue Blocks Framework</title>
		<link  href="//unpkg.com/bootstrap@3.3.7/dist/css/bootstrap.min.css" rel="stylesheet">
		<script src="//unpkg.com/vue-blocks/dist/vue-blocks.js"></script>
	</head>
	<body>
		<app></app>
		<template component="app">
			<div class="container">
				<nav>
					<my-navigation></my-navigation>
				</nav>
				<router-view></router-view>
			</div>
		</template>
		<!-- reusable components -->
		<template component="my-navigation">
			<router-link to="/">Home</router-link>
			<router-link to="/page1">Page 1</router-link>
		</template>
		<!-- easy urls -->
		<template url="/">
			<div>Welcome to my awesome app</div>
		</template>
		<template url="/page1">
			<div>Page 1</div>
		</template>
		<!-- route with params -->
		<template url="/page2/:param">
			<div>Page 2: Param {{$route.params.param}}</div>
		</template>
	</body>
</head>
```

## Features
- Include Vue 2.6.12 and VueRouter 2.8 (check [package.json](./package.json) for most recent versions)

- Mutliple component
- Auto-mount `<app>` component
- `<template component="component" props="prop1, prop2">`
	component props syntax

- `<template url="/url/:param1/:param2">` 
	url with param auto register with VueRouter.

- `<template module="moduleName">` 
	define 'fake' javascript modules that can be require()'d later on.

- You may split html files and load them asynchronously
	`<template src="path/to/components.html"></template>`

- You may load .vue files:
	`<template src="path/to/vue-file.vue"></template>`

- Short syntax for Vue components:
	Less boilerplate, more focus on your idea.

	```html
	<template component="...">
		... 
		<script>
		return class vue {
			my_variable = 'my_value';
			computed = {
				// ...
			}
			watch = {
				// ...
			}
			mounted() {
				// mounted function
			}
			async clickButton() {
				// this will be a Vue method.
			}
		}
		</script>
	</template>
	```

- You can require every npm module, they will be loaded from https://jspm.dev.
	Less need for build tools, more focus on your idea.

	```html
	<template component="...">
		... 
		<script>
			var uniqid = require('uniqid');	// https://jspm.dev/uniqid will be loaded
			// var uniqid = require('https://jspm.dev/uniqid');  // Is equivalent.

			export default() {
				mounted() {
					alert("My unique id: " + uniqid())
				}
			}
		</script>
	</template>
	```
