<style lang="scss">
	.rect{
		width: 200rpx;
		height: 200rpx;
	}
	.test-rpx{
		font-size: 16rpx; /*rpx*/
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
		margin-top: 60rpx;
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
	.rect-list view{
		border-radius: 10rpx;
	}
	.size{
		width: 200rpx;
		height: 200rpx;
	}
</style>
<template>
	<view class="content">
			<view class="content-block">
				<view class="width-full">
					<view class="size pull-left bg-danger txt-center color-white">
						浮动元素
					</view>
					<view class="size bg-primary txt-center color-white" style="clear: both;">
						hello
					</view>
				</view>
			</view>
			<view class="content-block">
				<view class="txt-bold fs-32">hello</view>
				<view class="top-10 lh-1_8 color-text-sub">
					Lorem ipsum dolor sit amet, consectetur adipisicing elit.
				</view>
				<view class="top-10 lh-1_8 color-text-secondary">
					Lorem ipsum dolor sit amet, consectetur adipisicing elit.
				</view>
				<view class="top-10 lh-1_8 color-gray">
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. 
				</view>
				<view class="top-10 lh-1_8 color-success">
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. 
				</view>
				<view class="top-10 lh-1_8 color-danger">
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. 
				</view>
				<view class="top-10 lh-1_8 color-warning">
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. 
				</view>
				<view class="top-10 lh-1_8 color-link">
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. 
				</view>
				<view class="top-10 lh-1_8 color-primary">
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. 
				</view>
			</view>
			<image class="logo" src="/static/logo.png"></image>
			<view class="text-area flex-wrap">
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
				<view class="rect-list row top-30 gutter-15">
					<view class="col-6">
						测试边距
					</view>
					<view class="col-18">
						<view class="row justify-end gutter-15">
							<view class="col-6">测试边距</view>
							<view class="col-6">测试边距</view>
							<view class="col-6">测试边距</view>
						</view>
					</view>
				</view>
				<view class="content-block">
					<button type="default" @click="goTest()">路由测试</button>
				</view>
		</view>
	</view>
</template>

<script>
	import {test} from '../../api/testModule/test.js'
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {
			// storage.set({
			// 	key:'hello',
			// 	data:'sdfdsga',
			// 	expire: '2019/10/09 10:00:00'
			// })
			console.log(this.$$router,this)
		},
		methods: {
			goTest(){
				this.$$router.push({
					path:'/pages/test/test',
					query:{
						test:1,
						b:2
					}
				})
			}
		}
	}
</script>
