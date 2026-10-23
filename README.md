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

## 临时分享本机网页

安装 Cloudflare 官方工具 `cloudflared` 后，在网页服务运行时执行：

```
cloudflared tunnel --url http://127.0.0.1:3210
```

将输出的 https://…trycloudflare.com 地址发给朋友。地址在重启后可能变化；电脑、Dify、网页服务和隧道均需持续运行。隧道只代理客服网页，不代理 Dify 管理后台。持有分享链接的人可以使用工作流，模型调用会消耗你的额度。服务限制同时最多 3 个上游调用。

也可使用本机自带 SSH（本次已采用）：

```
ssh -o ServerAliveInterval=30 -R 80:127.0.0.1:3210 nokey@localhost.run
```

分享终端输出的 HTTPS 链接；免费临时域名可能失效或随连接重建而变化。

## Vercel

导入本仓库，框架选择 Other。静态资源位于 public/，API 入口为 api/product.mjs 和 api/run.mjs。配置 DIFY_BASE_URL、DIFY_API_KEY 和至少 16 字符的随机 SITE_ACCESS_CODE（仅通过服务端环境变量配置）。访问码只用于调用问答接口，页面和示例商品资料仍公开可见；不要在默认资料中保存敏感信息。访问码不会写入浏览器持久存储。

未设置访问码或访问码错误时，不调用 Dify。内存并发限制只适用于单个函数实例，不是全局限流；规模化使用需另配平台防火墙或共享限流存储。Vercel 无法访问开发电脑 localhost，需云端 Dify 或另行受保护的公网桥接；不能将本机密钥用于云端应用。默认域名在大陆移动网络的可达性需实测。

生产地址：https://chao-liu-ke-fu.vercel.app 。已验证云端 Dify 调用与访问码保护。当前通过 CLI 部署；GitHub 自动部署关联尚未完成。
