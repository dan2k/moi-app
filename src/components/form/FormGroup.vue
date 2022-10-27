<template>
	<div class="form-group">
		<label
			:for="label"
			:class="{
				'text-danger': v.$error,
				'text-success': !v.$error && v.$anyDirty,
			}"
			><b>{{ label }}</b></label
		>
		<slot></slot>
		<div v-if="v.$error" class="text-danger">
			{{ v.$errors[0].$message }}
		</div>
	</div>
</template>

<script>
export default {
	props: {
		label: {
			type: String,
			default: "",
		},
		v: {
			type: Object,
			required: true,
		},
	},
};
</script>

<style scoped>
div.text-danger {
	font-size: 12px;
	margin: 5px;
}
</style>
