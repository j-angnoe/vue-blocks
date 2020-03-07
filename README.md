# Vue Blocks

Please review the examples/index.html, or check it out online: http://fluxfx.nl/vue-blocks/examples/index.html

dist/vue-blocks.js bundles Vue 2.1.8 and Vue router 2.1.1. 

# Quick start:

```
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

