# Spring Cloud 系列课程 · 第 8 课

**进度：8/30**

## Sentinel 控制台：监控与管理

### 🎯 学习目标
- 理解 Sentinel Dashboard 的架构与作用
- 能够独立搭建并配置 Sentinel 控制台
- 实现规则持久化：将规则存储在 Nacos 中

### 📖 核心内容

#### 1. Sentinel Dashboard 架构

每个微服务通过 Sentinel Transport（心跳/API）与控制台通信：
- **心跳**：每 10 秒上报一次，告诉控制台「我还活着」
- **规则同步**：控制台下发的规则推送到客户端
- **监控数据**：客户端实时采样并推送到控制台展示

#### 2. 搭建控制台

```bash
# Docker 方式
docker run --name sentinel-dashboard \
  -p 8080:8080 \
  -d bladex/sentinel-dashboard:1.8.8
```

访问 http://localhost:8080，默认用户名密码：sentinel/sentinel。

#### 3. 客户端接入

```yaml
spring:
  cloud:
    sentinel:
      transport:
        dashboard: localhost:8080
        port: 8719
      eager: true    # 启动立即注册
```

#### 4. 🔥 规则持久化：Nacos 数据源（生产必备）

**问题**：控制台添加的规则只存在内存中，重启丢失。

**解决方案**：使用 sentinel-datasource-nacos 将规则存储在 Nacos 配置中心。

```yaml
spring:
  cloud:
    sentinel:
      datasource:
        ds1-flow:
          nacos:
            server-addr: localhost:8848
            data-id: ${spring.application.name}-flow-rules
            group-id: SENTINEL_GROUP
            data-type: json
            rule-type: flow
        ds2-degrade:
          nacos:
            server-addr: localhost:8848
            data-id: ${spring.application.name}-degrade-rules
            group-id: SENTINEL_GROUP
            data-type: json
            rule-type: degrade
```

**流控规则 JSON 示例（Nacos 配置）**：
```json
[
    {
        "resource": "order:create",
        "limitApp": "default",
        "grade": 1,
        "count": 100,
        "strategy": 0,
        "controlBehavior": 0,
        "clusterMode": false
    }
]
```

**降级规则 JSON 示例**：
```json
[
    {
        "resource": "order:create",
        "grade": 0,
        "count": 10,
        "timeWindow": 60,
        "minRequestAmount": 5,
        "statIntervalMs": 1000,
        "slowRatioThreshold": 0.5
    }
]
```

#### 5. 验证持久化

1. 启动服务，观察日志：`[Sentinel] FlowRuleManager load rules from Nacos`
2. 修改 Nacos 中的 JSON，**客户端会在 1-2 秒内自动感知并应用新规则**
3. 控制台刷新也能看到更新后的规则

### 💡 注意事项

| 问题 | 解决方案 |
|------|---------|
| 监控数据仅保留5分钟 | 对接 InfluxDB / Prometheus 持久化 |
| 规则安全 | 控制台增加登录认证；Nacos 增加权限控制 |
| 控制台与 Nacos 单向绑定 | 控制台修改规则只影响内存，建议在 Nacos 中直接修改 |
| 生产环境密码 | 启动参数加 `-Dsentinel.dashboard.auth.password=YourStrongP@ss` |
