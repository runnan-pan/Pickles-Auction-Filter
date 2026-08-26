简体中文 | [English](./README.md)

# Pickles 车辆过滤器 (Pickles Auction Vehicle Filter)

一个 Tampermonkey 用户脚本,用于在 [Pickles Auctions](https://www.pickles.com.au) 车辆列表页(Listing Page)上自动过滤车辆,只保留 `sellingPlatesStatus` 为 `"All"` 的车辆,隐藏其余车辆卡片。

## 📖 背景 / 为什么需要这个脚本

在 Pickles 网站的车辆列表页面上,每台车的详情数据中包含一个 `sellingPlatesStatus` 字段,用于标记该车辆的销售牌照状态。手动打开每台车的详情页逐一确认非常耗时。本脚本会在列表页上添加一个悬浮按钮,点击后自动:

1. 抓取当前页面所有车辆卡片;
2. 逐个请求对应的车辆详情页,提取其中的 `sellingPlatesStatus` 字段;
3. 根据字段值自动隐藏不符合条件(非 `"All"`)的车辆卡片,只保留符合条件的车辆。

## ✨ 功能特点

- 🖱️ **一键触发**:页面右侧悬浮按钮,点击即可运行过滤,无需打开控制台。
- 🔍 **自动诊断**:如果某个字段匹配不到,会在控制台打印详细诊断信息,方便排查页面结构变化。
- 🧩 **兼容转义格式**:详情页 HTML 中的字段可能以普通引号 `"` 或转义引号 `\"` 两种形式出现,脚本已做兼容处理。
- 📊 **结果统计**:过滤完成后按钮文字会显示保留 / 隐藏的车辆数量。

## 🔧 安装方法

1. 安装 [Tampermonkey](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) 浏览器插件(Chrome / Edge 均可)。
2. 在已安装 Tampermonkey 的浏览器中打开下面的 raw 链接:
   https://raw.githubusercontent.com/runnan-pan/Pickles-Auction-Filter/main/pickles_filter.user.js
3. Tampermonkey 会自动识别用户脚本并弹出安装页,点击 **安装** 即可。
4. 确认脚本已启用(Tampermonkey 管理面板中脚本开关为绿色/开启状态)。

通过 raw 链接安装后,Tampermonkey 之后也可以从这个仓库检查更新。

## 🚀 使用方法

1. 打开 Pickles 网站的车辆列表页面,例如:
   `https://www.pickles.com.au/used/search/cars...`
2. 等待页面加载完成(车辆卡片全部显示出来)。
3. 页面右侧会出现一个 **🚗 过滤车辆** 悬浮按钮。
4. 点击该按钮,脚本开始逐个请求车辆详情并过滤,过程中可打开浏览器控制台(F12 → Console)查看实时日志。
5. 过滤完成后,按钮文字会更新为类似 **✅ 已过滤 (保留 X / 隐藏 Y)** 的统计信息,不符合条件的车辆卡片将从页面中隐藏。

> ⚠️ 注意:脚本对每个车辆卡片会发起一次网络请求,车辆数量较多时执行时间会稍长,请耐心等待按钮文字更新为完成状态。

## 🧠 工作原理

脚本的核心逻辑如下:

```js
// 1. 抓取当前页面所有车辆卡片
document.querySelectorAll('main[class*="gridCard"]')

// 2. 提取每张卡片对应的详情页链接
card.querySelector('a[href*="/used/details/"]')

// 3. 请求详情页 HTML,并用正则提取 sellingPlatesStatus 字段
//    (兼容普通引号和转义引号两种格式)
/\\?"sellingPlatesStatus\\?"\s*:\s*(\\?"([^"\\]+)\\?"|null)/gi

// 4. 根据字段值决定显示或隐藏对应卡片
columnWrapper.style.display = (platesStatus === "all") ? "" : "none";
```

## 🐛 故障排查

| 现象 | 可能原因 | 解决方法 |
|---|---|---|
| 找不到卡片元素,脚本立即退出 | 页面结构或类名发生变化 | 检查 `main[class*="gridCard"]` 选择器是否仍然匹配当前页面结构 |
| 所有车辆都提示"未匹配到 sellingPlatesStatus" | 网站更新了字段名或数据格式 | 打开控制台查看诊断输出的 HTML 片段,确认字段名 / 转义格式是否变化,必要时调整正则 |
| 按钮点击后长时间无响应 | 车辆数量多,请求较慢,或个别请求被限流 | 打开控制台观察每张卡片的请求日志,确认是否有请求失败或超时 |

## ⚠️ 免责声明

本脚本仅用于个人辅助浏览、提高筛选效率,请遵守 Pickles 网站的服务条款及当地法律法规,避免高频率请求对目标网站造成不必要的负担。使用本脚本产生的任何后果由使用者自行承担。

## 📄 License

MIT License
