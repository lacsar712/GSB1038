# 多阶段构建 - React Frontend
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm config set registry https://registry.npmmirror.com

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# 生产阶段 - 使用 Nginx 提供静态文件
FROM nginx:alpine

RUN apk add --no-cache curl

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 --start-period=10s \
    CMD curl -f http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
