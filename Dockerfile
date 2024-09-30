# 使用 Alpine 作为基础镜像
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装构建工具和依赖
RUN apk add --no-cache python3 make g++ && \
    npm install && \
    apk del python3 make g++

# 复制应用代码
COPY . .

# 暴露应用端口
EXPOSE 3210

# 运行应用
CMD ["node", "index.js"]