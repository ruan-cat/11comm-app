# 初始化 turbo 配置

请深度思考。

1. 安装 turbo 依赖。开发环境依赖即可。
2. 配置 turbo 任务。配置 turbo.json 任务依赖文件。
3. 定义位于根包的 `do-build` 任务。当前仓库中该任务仅依赖 `build:h5:prod`（GitHub CI 只跑 H5 生产构建）；`docs:build` 保留为独立 turbo 任务，供本地构建 VitePress 文档。
4. 运行 ci 任务，用于测试。
