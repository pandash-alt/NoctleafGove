
## 应用启动
### n8n

```bash
docker run -it --rm \
 --name n8n \
 -p 5678:5678 \
 -e GENERIC_TIMEZONE="Asia/Shanghai" \
 -e TZ="Asia/Shanghai" \
 -e N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true \
 -e N8N_RUNNERS_ENABLED=true \
 -v n8n_data:/home/node/.n8n \
 n8nio/n8n
```

1. 官方推荐每次运行都将保留用户数据输出，并且每次创建的 container 都将在使用结束后删除
2. `YOUR_TIMEZONE` 输入示例 `Asia/Shanghai`

```
docker run -it --rm --name n8n -p 5678:5678 -e GENERIC_TIMEZONE="Asia/Shanghai" -e TZ="Asia/Shanghai" -e N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true -e N8N_RUNNERS_ENABLED=true -v n8n_data:/home/node/.n8n n8nio/n8n
```
