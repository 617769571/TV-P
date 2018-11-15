

# token 和 EVA-ACCESS-TOKEN 的区别
|key              |          value          |       接口平台        |     环境接口<process.env>
---------------------------------------------------------------------------------------------------
|token            |      ad2a234df5234      |       tv-portal        |     BASE_API
---------------------------------------------------------------------------------------------------
|ENV-ACCESS-TOKEN |      aSDAd2as23d4d      |       ott          |     GAIA_API

# headers书写规范
key一律用`'`包装
例如，
'ENV-ACCESS-TOKEN': 'ENV-ACCESS-TOKEN'
'token': 'token-value'

# 打包

开发环境：npm run dev
测试包：npm run tb
线上包：npm run build

> 注意：
assetsPublicPath: '/tv/', // 虚拟目录设置必须得这样设置

> 测试环境包：
运行`npm run tb`，然后，将打包后的`dist`文件名修改为`tv-portal-test`，然后，压缩成rar包

> 生产环境包：
运行`npm run build`，然后，将打包后的`dist`文件名修改为`tb-portal-product`，然后，压缩成rar包
