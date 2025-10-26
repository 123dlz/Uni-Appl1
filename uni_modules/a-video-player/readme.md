一个视频播放器

支持开源、一起构建开源生态

# 功能
已完成
- [x] 全屏，小屏切换，退出
- [x] 倍速选择、播放
- [x] 进度条拖动
- [x] 锁屏
- [x] 兼容app，微信小程序

待完成
- [ ] 弹幕
- [ ] 自定义页面图标的点击事件
- [ ] 编写使用文档
- [ ] 选集播放
- [ ] 切换清晰度
- [ ] 声音控制

基础版1.0，如果有需要完善里面的功能的，请留言，优先开发

# 使用 
```vue
<template>
  <view>
    <view class="cu-card">
      app需要使用nvue
    </view>
    <uni-section title="基础用法" type="line" padding>
      <view class="example-body">
        <AVideoPalyer src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-uni-app-doc/3c1782e0-60ab-11eb-8ff1-d5dcf8779628.m4v"></AVideoPalyer>
      </view>
    </uni-section>
  </view>
</template>

<script>
  import AVideoPalyer from '@/uni_modules/a-video-player/components/a-video-player/a-video-player.nvue'
  export default {
    components:{
      AVideoPalyer
    },
    data() {
      return {

      };
    },
  }
</script>

<style lang="scss" scoped>
</style>

```
