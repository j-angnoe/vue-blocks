<template>
	<nav>
		<ul class="nav nav-tabs">
			<li :class="{active:isActive('index.html')}">
				<a href="index.html" >Home</a>
			</li>

			<slot></slot>

			<li :class="{active:isActive('try-it.html')}">
				<a href="try-it.html" >Try it</a>
			</li>
			<li :class="{active:isActive('nested-routes.html')}">
				<a href="nested-routes.html">Nested routes</a>
			</li>
			<li :class="{active:isActive('vue-files.html')}">
				<a href="vue-files.html">Vue files</a>
			</li>
		</ul>
	</nav>
</template>

<script>
export default {
	methods: {
		isActive: function (page) {
			return location.pathname.indexOf(page) !== -1;
		}
	}			
}
</script>
