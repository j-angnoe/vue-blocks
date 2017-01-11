<template>
	<div>
		<div>This is the html template for this tag, and may contain any html and vue code.</div>
		<div>A vue value: {{some_vue_value}}</div>
		<div>A simple counter: {{counter}} <button @click="addOneToCounter()">Add one to counter</button>
		</div>
	</div>
</template>


<script>
// Write your vue component object like usual.
export default {	
	data() {
		return {
			some_vue_value: 'value1',
			counter: 0
		}
	},
	mounted() {
		console.log("Component is ready")
	},
	methods: {
		addOneToCounter() {
			this.counter += 1;
		}
	}
}
</script>