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
	// flex
	.container{
		@include grid(5,18,100rpx)
	}
	.size-100{
		background-color: blue;
		padding: 20rpx;
		color: white;
	}
</style>
<template>
	<view class="content no-padding no-margin">
		<hx-navbar ref="hxnb" :config="config" :navHeight.sync="navHeight" @clickBtn="onClickBtn" />
		<!-- <view :style="{height:(systemInfo.windowHeight-systemInfo.safeArea.top)+'px',backgroundColor:'red',width:'100%'}" class="over-hide">
			<view v-for="item of 100">{{item}}</view>
		</view>
		<view class="content-block">
			{{ JSON.stringify(systemInfo,null,4) }}
		</view> -->
		<view class="content-block width-full">
			<view class="container">
				<view class="size-100">11111</view>
				<view class="size-100"></view>
				<view class="size-100"></view>
				<view class="size-100"></view>
				<view class="size-100"></view>
				<view class="size-100"></view>
				<view class="size-100"></view>
			</view>
		</view>
		<view class="content-block">
			<view class="size pull-left bg-danger txt-center color-white">
				{{platform}} {{host}} {{navHeight}}
			</view>
			<view class="size bg-gray txt-center color-white" style="clear: both;">
				hello
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
		<!-- <image class="logo" src="/static/logo.png"></image> -->
		<view class="text-area flex-wrap">
			<view class="rect bg-primary top-30 row row-center padding-beside-20">
				<text class="color-white fs-32 txt-ellipsis row-2">
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore sequi voluptates dolorem obcaecati accusantium
					pariatur corrupti accusamus earum fuga nostrum? Et iure doloremque labore doloribus nesciunt aut! Modi sequi
					optio.
				</text>
			</view>
			<view class="row row-center top-30">
				<checkbox-group name="">
					<label>
						<checkbox value="1" /><text>hello</text>
					</label>
					<label class="left-10">
						<checkbox value="2" /><text>hello1</text>
					</label>
				</checkbox-group>
			</view>
			<view class="row row-center  top-30">
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
					<view class="row row-main-end gutter-15">
						<view class="col-6">测试边距</view>
						<view class="col-6">测试边距</view>
						<view class="col-6">测试边距</view>
						<view class="col-6">测试边距</view>
					</view>
				</view>
				<view class="col-6">
					测试边距
				</view>
			</view>
			<view class="content-block">
				<button type="default" @click="goTest()">路由测试</button>
			</view>
		</view>
		<!--  -->
		<view class="content-block row row-center flex-column">
			<text>state a/test: {{getTest}}</text>
			<text class="top-10">state root/test: {{getRootTest}}</text>
			<button @click="testAction()" type="default" class="top-10">点击改变模块a/test状态</button>
			<button @click="changeTest()" type="default" class="top-10">点击改变模块root/test状态</button>
		</view>
	</view>
</template>

<script>
	// import {
	// 	test
	// } from '../../api/testModule/test.js'
	import {mapGetters,mapActions,mapMutations} from 'vuex'
	export default {
		data() {
			return {
				navHeight:0,
				config:{
					title: '这里是新疆',
					color: '#ffffff',
					//背景颜色;参数一：透明度（0-1）;参数二：背景颜色（array则为线性渐变，string为单色背景）
					backgroundColor: [1,['#a9a1ff','#6970ff','#ff55ff','#ff9999']],
					// 滑动屏幕后切换颜色，注意颜色为数组时长度必须一样，还有使用滑动切换必须监听 onPageScroll 事件
					slideBackgroundColor: [.6,["#ff9999", "#ff55ff", "#6970ff", "#a9a1ff"]],
					// 状态栏 ，数组则为滑动变色, 不设则跟随导航条背景色
					statusBarBackground:['',''],
					rightButton:[{
						key: 'btn3',
						icon: '&#xe6eb;',
						position: 'left',
						color:'#ffffff'
					}],
				},
			}
		},
		async onLoad() {
			// const [err,data] = await to(test({a:1,b:5545}))
			await storage.set({
				key: 'ghshf13662',
				data: null,
				expire: '2019/12/10 10:00:00'
			})
			console.log(storage._info.currentSize + 'kb', storage._info.limitSize + 'kb')
		},
		onPageScroll(e) {
		        // 重点，用到滑动切换必须加上
		        this.$refs.hxnb.pageScroll(e);
		    },
		computed:{
			...mapGetters(['platform','host','systemInfo','getRootTest']), // 使用根的getter
			...mapGetters('a',['getTest'])  // 使用a模块的getter
		},
		methods: {
			...mapActions('a',['testAction']), // 使用a模块的action
			...mapMutations(['changeTest']), // 使用根的mutation
			onClickBtn(data){
				//console.log(data);
				uni.showToast({
					title: `key为 ${data.key} 的按钮`,
					icon:'none',
					duration: 1300
				});
			},
			goTest() {
				this.$$router.push({
					path: '/pages/test/test',
					query: {
						test: 1,
						b: 2
					}
				})
			}
		}
	}
</script>
