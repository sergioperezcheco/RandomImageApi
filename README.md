# RandomImageApi
通过输入的若干图片URL生成随机图片API

## 用法
2、3两步任选即可
1. 下载项目源码并根据实际情况修改`.env`
```
git clone https://github.com/sergioperezcheco/RandomImageApi.git
cd RandomImageApi
cp .env.example .env
nano .env
```

2. docker运行 

修改.env文件之后执行
```
docker compose up -d
```

3. 直接运行
```
npm install
npm start
```
## 界面展示
![](https://picgo.checo.cc/20241015100446.png)

## 后续
1. 提供Clouldflare部署，无需服务器