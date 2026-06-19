# 家族公司通讯录系统

一个现代化的家族公司员工通讯录管理系统，采用前后端分离架构，完全容器化部署。

## 🛠 技术栈

- **前端**: React 18 + Vite + Tailwind CSS + Ant Design
- **后端**: Python 3.11 + FastAPI + SQLAlchemy + uv
- **数据库**: MySQL 8.0 (utf8mb4 字符集)
- **容器化**: Docker + Docker Compose

## ✨ 功能特性

- 🔐 用户登录认证
- 👥 员工通讯录管理（增删改查）
- 🔍 按姓名、部门、职位搜索
- 🎨 现代化 UI 设计（渐变背景、卡片阴影、悬停效果）
- 📱 响应式布局，支持 PC 和移动端
- 🐳 100% 容器化，一键启动
- 🌐 中文支持，无乱码

## 🚀 启动指南

### 前置要求

- 已安装 Docker Desktop 并启动

### 一键启动

```bash
# 1. 进入项目目录
cd /Users/yuwangi/Documents/www/test/longmao/1038

# 2. 启动所有服务
docker compose up --build

# 3. 等待容器启动完成（约 2-3 分钟）
# 看到 "Application startup complete" 表示启动成功
```

## 🔗 服务地址

启动成功后，在浏览器中访问：

- **前端页面**: http://localhost:3038
- **后端 API 文档**: http://localhost:8038/docs
- **数据库**: localhost:3306 (用户名: root / 密码: root)

## 🧪 测试账号

系统已内置演示数据，默认管理员账号：

- **用户名**: admin
- **密码**: 123456

其他测试账号（密码均为 123456）：
- lisi（李四 - 财务总监）
- wangwu（王五 - 人事经理）
- zhaoliu（赵六 - 市场总监）
- sunqi（孙七 - 技术总监）

## 📦 项目结构

```
1038/
├── backend/              # FastAPI 后端
│   ├── app/
│   │   ├── models/      # 数据库模型
│   │   ├── schemas/     # Pydantic Schema（按模块独立）
│   │   ├── routers/     # API 路由（按模块独立）
│   │   ├── scripts/     # 数据库初始化脚本
│   │   ├── database.py  # 数据库连接配置
│   │   └── main.py      # FastAPI 应用入口
│   ├── pyproject.toml   # uv 依赖配置
│   └── Dockerfile
├── frontend/            # React 前端
│   ├── src/
│   │   ├── pages/       # 页面组件
│   │   ├── components/  # 通用组件
│   │   ├── services/    # API 服务（按模块独立）
│   │   └── App.tsx      # React 应用入口
│   ├── package.json
│   └── Dockerfile
└── docker-compose.yml   # Docker 编排配置
```

## 🎯 核心特性说明

### 模块化设计

- **后端**: Schema 和 Router 按功能模块独立（auth、contact），模块之间不耦合
- **前端**: 服务层按模块独立封装（auth.ts、contact.ts），组件化设计

### 数据库规范

- 使用 SQLAlchemy ORM，严禁拼接原始 SQL
- 统一使用 utf8mb4 字符集，避免中文乱码
- 自动初始化演示数据（包含中文内容）

### UI/UX 设计

- 登录页面采用左右布局（左侧品牌展示，右侧登录表单）
- 使用渐变背景、卡片阴影、圆角等现代设计元素
- 删除操作使用自定义对话框而非原生 confirm
- 所有操作提供 Toast 消息反馈
- 加载状态展示骨架屏或 Spinner

### Docker 部署

- 前端、后端、数据库全部容器化
- 使用 Docker 服务名进行容器间通信
- 配置健康检查确保服务启动顺序
- 数据库使用 Volume 实现数据持久化

## 🛑 常见问题

**Q: 端口冲突怎么办？**  
A: 项目使用 3038 和 8038 端口（根据文件夹名 1038），如有冲突请修改 docker-compose.yml 中的端口映射

**Q: 如何停止服务？**  
A: 在项目目录执行 `docker compose down`

**Q: 如何查看日志？**  
A: 执行 `docker compose logs -f` 查看所有服务日志

**Q: 如何重新构建？**  
A: 执行 `docker compose down -v && docker compose up --build` 清空数据并重新构建

**Q: 登录失败怎么办？**  
A: 确认后端服务已启动（访问 http://localhost:8038/docs），检查数据库是否初始化成功

## 📄 开发说明

本项目严格遵循 **Prompt2Repo 核心开发规范**：

- ✅ 100% 容器化部署
- ✅ 一键启动（docker compose up）
- ✅ 零 Mock 数据，真实数据库读写
- ✅ 现代 UI 组件库（Ant Design）
- ✅ 模块化设计，各模块独立不耦合
- ✅ 声明式编程，代码易理解
- ✅ 完整的错误处理和日志系统
- ✅ utf8mb4 字符集，中文无乱码

## 📝 License

MIT License
