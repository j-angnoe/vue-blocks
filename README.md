# Vue Blocks

Please review the examples/index.html.

dist/vue-blocks.js bundles Vue 1.0.28 and Vue router 0.7.13. 
When including vue-blocks make sure you have jQuery (3+) available.


# Quick start:

```
<html>
	<head>
		<title>Vue Blocks Framework</title>
		<script
  src="https://code.jquery.com/jquery-3.1.1.min.js"
  integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8="
  crossorigin="anonymous"></script>
<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
		<script src="path/to/vue-blocks/dist/vue-blocks.js"></script>
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
			<a v-link="{path: '/'}">Home</a>
			<a v-link="{path: '/page1'}">Page 1</a>
		</template><template url="/">
			<div>Welcome to my awesome app</div>
		</template>
		<template url="/page1">
			<div>Page 1</div>
		</template>
	</body>
</head>
```
