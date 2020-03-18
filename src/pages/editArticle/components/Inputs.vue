<template>
	<input :placeholder="placeholder" :value="value" @input="onChange" class="component-input">
</template>
<script>
export default {
	name: "Inputs",
	props: {
		placeholder: {
			type: String,
			default: '请输入文章来源'
		},
		value: {
			type: String,
			default: ''
		}
	},
	methods: {
		onChange(e) {
			this.$emit('change', e.detail.value)
		}
	}
}
</script>
<style>
.component-input {
	height:88upx;
	background:rgba(245,245,246,1);
	border:1upx solid rgba(232,232,232,1);
	border-radius:10upx;
	margin-left: 30upx;
	margin-right: 30upx;
	margin-top: 20upx;
	text-align: center;
	font-weight:bold;
	font-size:28upx;
}
</style>
