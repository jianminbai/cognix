# cogniX Web

这是 cogniX 认知科学知识库的 Next.js 展示站点。它从仓库上级目录读取 Markdown 内容，并生成首页、分类页和文章页。

## 本地开发

```bash
npm install
npm run dev
```

默认访问地址：

```text
http://localhost:3000
```

## 内容来源

站点通过 [lib/content.ts](./lib/content.ts) 扫描以下目录：

- `../cognitive-science`

每个 Markdown 文件的一级标题会作为文章标题；文件路径会转换为文章 slug。

## 常用命令

```bash
npm run build
npm run lint
```

## 说明

这个目录只负责展示认知科学内容，不再承载英语学习或技术主题内容。
