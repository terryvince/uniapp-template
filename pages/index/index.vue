<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title+env}}</text>
			<text class="test-px fs-48 line-bottom">测试px</text>
		</view>
	</view>
</template>

<script>
	import {test} from '../../api/testModule/test.js'
	export default {
		data() {
			return {
				title: 'Hello',
				env:process.my_env.STRAY_BASE_API
			}
		},
		onLoad() {
			test().then(res=>{
				console.log(res)
			}).catch(()=>{})
		},
		methods: {

		}
	}
</script>

<style lang="scss">
	.test-px{
		color: $color-gray;
	}
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
