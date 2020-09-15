<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area flex-wrap">
			<text class="title">{{title+env}}</text>
			<text class="test-px line-bottom">测试px</text>
			<view class="rect bg-primary top-30 flex-center padding-beside-20">
				<text class="color-white fs-32 txt-ellipsis row-2">
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore sequi voluptates dolorem obcaecati accusantium pariatur corrupti accusamus earum fuga nostrum? Et iure doloremque labore doloribus nesciunt aut! Modi sequi optio.
				</text>
			</view>
			<view class="flex-center width-full top-30">
				<checkbox-group name="">
					<label>
						<checkbox value="1" /><text>hello</text>
					</label>
					<label class="left-10">
						<checkbox value="2" /><text>hello1</text>
					</label>
				</checkbox-group>
			</view>
			<view class="flex-center width-full top-30">
				<radio-group name="">
					<label>
						<radio value="1" /><text>hello</text>
					</label>
					<label class="left-10">
						<radio value="2" /><text>hello1</text>
					</label>
				</radio-group>
			</view>
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
	.rect{
		width: 300rpx;
		height: 300rpx;
	}
	.test-px{
		font-size: 16px;
		color: $color-text-gary;
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
