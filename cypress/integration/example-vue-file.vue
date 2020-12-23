<template>
    <div>
        Success: Showing example-vue-file
        <div class="red">With styling</div>
        {{message}}
    </div>
</template>
<style scoped>
    .red { 
        color: rgb(255, 0, 0);
    }
</style>
<script>
    export default {
        data() {
            return {
                message: 'Success: Vue component initialized'
            }
        }
    }
</script>