# MINA GULP WORKFLOW

MINA: 保留 MINA (微信小程序官方框架)
GULP: Gulp 构建

### 工程结构

```
mina-gulp
├── dist         // 编译后目录
├── node_modules // 项目依赖
├── src
│    ├── npm        // 页面引用的npm包资源
│    ├── components // 微信小程序自定义组件
│    ├── images     // 页面中的图片和icon
│    ├── pages      // 小程序page文件
│    ├── styles     // ui框架，公共样式
│    ├── template   // 模板
│    ├── utils      // 公共js文件
│    ├── app.js
│    ├── app.json
│    ├── app.less
│    ├── project.config.json // 项目配置文件
│    └── api.config.js       // 项目api接口配置
├── .editorconfig.js
├── .eslintrc.js
├── .gitignore
├── gulpfile.js    // gulp配置文件
├── package-lock.json
├── package.json
└── README.md
```

### 功能特性

1. Less 支持
2. Eslint 支持
3. Imagemin 图片压缩支持
4. Async await 支持
5. NPM 支持
6. 命令行快速创建页面,组件,模板支持

### 创建页面,组件,模板

- gulp auto -p mypage 创建名为 mypage 的 page 文件
- gulp auto -t mytpl 创建名为 mytpl 的 template 文件
- gulp auto -c mycomponent 创建名为 mycomponent 的 component 文件
- gulp auto -s index -p mypage 复制 pages/index 中的文件创建名称为 mypage 的页面

###

1. NPM 现在只支持手动copy到npm/*.js中
