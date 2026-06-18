# Spring Cloud 系列课程 · 第 9 课

**进度：9/30**

## API 网关：Spring Cloud Gateway 路由基础

### 🎯 学习目标
- 理解 API 网关在微服务架构中的核心作用
- 掌握 Spring Cloud Gateway 的路由、断言（Predicate）和过滤器（Filter）三大概念
- 学会声明式与编程式两种路由配置方式
- 能够对比 Gateway 与 Zuul 的技术差异

### 📖 核心内容

#### 1. 为什么需要 API 网关？

API 网关作为系统的统一入口，解决：
- **暴露内部服务地址** — 安全性差
- **客户端逻辑耦合** — 前端要维护多个 base URL
- **无法统一处理** — 认证、限流、日志分别在每个服务里重复实现

#### 2. 核心三要素

| 概念 | 说明 | 类比 |
|------|------|------|
| **Route（路由）** | 包含 ID、目标 URI、断言集合、过滤器集合 | 快递路线 |
| **Predicate（断言）** | 匹配 HTTP 请求的条件 | 快递单上的地址规则 |
| **Filter（过滤器）** | 对请求/响应进行修改的拦截器（链式） | 包裹过安检/贴标签 |

协作关系：
```
请求到达 → Predicates匹配（Path=/user/**） → 命中Route → Filters链处理 → 转发到目标URI
```

#### 3. 快速入门：声明式配置（application.yml）

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://user-service
          predicates:
            - Path=/api/user/**
          filters:
            - StripPrefix=1
            - AddRequestHeader=X-Request-Source, Gateway

        - id: order-service
          uri: lb://order-service
          predicates:
            - Path=/api/order/**
          filters:
            - StripPrefix=1
```

**请求流转示例：**
```
请求：GET /api/user/123
  ↓
匹配 route: user-service（Path=/api/user/**）
  ↓
filters: StripPrefix=1 → 去掉 /api → 转发路径变为 /user/123
  ↓
转发到：lb://user-service/user/123
```

#### 4. 编程式配置（Java DSL）

```java
@Configuration
public class GatewayRoutesConfig {
    @Bean
    public RouteLocator customRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("user-service", r -> r
                .path("/api/user/**")
                .filters(f -> f.stripPrefix(1)
                                .addRequestHeader("X-Gateway", "Spring Cloud Gateway"))
                .uri("lb://user-service"))
            .build();
    }
}
```

#### 5. Gateway vs Zuul 1.x

| 对比维度 | Spring Cloud Gateway | Zuul 1.x |
|---------|---------------------|----------|
| 底层模型 | WebFlux + Netty（异步非阻塞） | Servlet + Tomcat（同步阻塞） |
| 性能 | 高并发下表现优异 | 连接数受限，易成瓶颈 |
| Websocket | 原生支持 | 不支持 |
| Spring Boot 兼容 | 2.x / 3.x | 已停止维护 |

**结论**：新项目一律选择 Spring Cloud Gateway。

#### 6. 全链路示意图

```
┌──────────────┐     ┌─────────────────────┐     ┌──────────────┐
│  客户端请求   │────▶│  DispatcherHandler   │────▶│ RouteLocator │
└──────────────┘     └─────────────────────┘     └──────┬───────┘
                                                         │
                                                         ▼
                                                ┌──────────────────┐
                                                │ Predicate 匹配    │
                                                └──────┬───────────┘
                                                         │ 命中
                                                         ▼
                                                ┌──────────────────┐
                                                │ Filter 链        │
                                                └──────┬───────────┘
                                                         │
                                                         ▼
                                                ┌──────────────────┐
                                                │  目标微服务       │
                                                │  (lb:// or http)  │
                                                └──────────────────┘
```

### 💡 踩坑提醒

1. **🚨 `spring-boot-starter-web` 冲突**：Gateway 基于 WebFlux，不能同时引入 spring-boot-starter-web
2. **路由顺序**：routes 列表中的顺序即匹配优先级，第一个命中即终止
3. **`lb://` 前缀**：配合 LoadBalancer（或 Nacos）实现客户端负载均衡
4. **Actuator 调试**：`/actuator/gateway/routes` 可查看所有已加载路由
