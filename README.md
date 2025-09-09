## 部署

### Cloudflare Worker

> 临时解决可以修改部署命令

```shell
npx wrangler deploy --assets=./dist --compatibility-date 2025-09-01
```

> 一劳永逸可以添加`wrangler.jsonc`配置文件

```json
{
  "name": "subweb",
  "compatibility_date": "2025-09-01",
  "assets": {
    "directory": "./dist"
  }
}
```
