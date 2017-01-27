<template>
	<nav>
		<ul class="nav nav-tabs">
			<li :class="{active:isActive('index.html')}">
				<a href="index.html" >&#x1f3e0;</a>
			</li>

			<slot></slot>

			<li :class="{active:isActive('nested-routes.html')}">
				<a href="nested-routes.html">Nested routes</a>
			</li>
			<li :class="{active:isActive('inter-component-communication.html')}">
				<a href="inter-component-communication.html">Component communication</a>
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
