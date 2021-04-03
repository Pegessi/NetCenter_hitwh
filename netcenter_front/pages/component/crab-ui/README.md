# Crab-UI 文档

## card


### 概述

+ 基于 [iView-UI](https://weapp.iviewui.com/components/card)
+ 增加 `titlestyle` 、 `imgstyle` 、 `icon` 属性


### 使用指南

+ 在 `.json` 中引入组件：

```json
"usingComponents": {
  "crab-card": "/crab-ui/card/index",
}
```

+ 示例：

```html
<crab-card title="居中标题" titlestyle="text-align: center; font-size: 18px;">
  <view slot="content">你好啊</view>
  <view slot="footer">尾部内容</view>
</crab-card>
```


### API

| 属性 | 说明 | 类型 | 默认值 |
| :------:| :------: | :------: | :------: |
| icon | iconfont形式的图标 | String | "" |
| titlestyle | 卡片title的自定义style | String | "" |
| imgstyle | 卡片icon和thumb的自定义style | String | "" |


## 注：
+ 重构的组件只是记录了和原组件中不一致的地方。