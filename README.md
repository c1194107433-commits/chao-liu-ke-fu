# 潮玩客服

面向潮玩电商售前的客服网页，调用 Dify Workflow。只有商品资料有明确依据的参数问题才自动回答；物流、售后与拿不准进入待人工记录。

## 本地启动

需要 Node.js 20 或更高版本，无第三方依赖。

设置环境变量 `DIFY_API_KEY` 后运行 `npm start`，访问 http://127.0.0.1:3210 。默认连接 http://localhost/v1 。不要将密钥放入网页或提交到 Git。

## 服务器部署

设置 `DIFY_BASE_URL`（如 https://api.dify.ai/v1）、对应应用的 `DIFY_API_KEY`、`HOST=0.0.0.0`，按平台要求设置 `PORT`。启动命令为 `npm start`。

GitHub 存储源码，本项目包含服务端接口，不能仅用 GitHub Pages 实现完整功能。云端部署需使用公网可达的 Dify 服务，localhost 指向部署服务器而非开发电脑。

工作流输入为 question、product_info；自动回复输出 title（兼容 answer）；人工分支输出 reasoning_content（兼容 category）及 text。

默认商品资料位于 data/product_info.txt。每次问题独立调用，无对话记忆。商品资料可编辑。待人工记录仅保存在当前页面，刷新后清空；尚未接入真人或工单系统。
