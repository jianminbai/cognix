# Spring Cloud 系列课程 · 第 6 课

**进度：6/30**

## 服务熔断降级：Sentinel 核心概念与入门

### 🎯 学习目标
- 理解熔断降级的必要性与 Sentinel 的核心思想
- 掌握 Sentinel 的基础配置与 `@SentinelResource` 注解
- 理解流量控制的基本原理（QPS/并发线程数）
- 能够区分 Sentinel 与 Hystrix 的差异

### 📖 核心内容

#### 1. 为什么需要熔断降级？
微服务架构中，一个服务故障可能级联传播，最终导致整个系统崩溃（雪崩效应）。

| 问题 | 说明 | 后果 |
|------|------|------|
| 慢调用 | 响应变长，积压线程 | 连接池耗尽，无法响应新请求 |
| 异常 | 调用第三方服务失败 | 调用方自身也异常 |
| 超量请求 | 流量突增 | 服务被打垮 |
| 级联故障 | 一个故障传播到依赖链 | 系统整体宕机 |

#### 2. Sentinel 核心概念

Sentinel 的核心理念：**流量定义规则，规则保护资源。**

- **资源（Resource）**：被保护的对象（方法、接口、代码块）
- **规则（Rule）**：保护资源的策略（流控、降级、热点）
- **上下文（Context）**：调用链路的上下文

#### 3. @SentinelResource 注解

```java
@RestController
public class OrderController {

    @GetMapping("/order/create")
    @SentinelResource(value = "order:create",
                      fallback = "createOrderFallback",
                      blockHandler = "createOrderBlockHandler")
    public Result createOrder(@RequestParam Long userId,
                               @RequestParam Long productId) {
        // 业务逻辑
        return orderService.create(userId, productId);
    }

    // 业务异常降级（fallback）
    public Result createOrderFallback(Long userId, Long productId,
                                       Throwable t) {
        log.error("业务异常：", t);
        return Result.error("服务异常，请稍后重试");
    }

    // 流控/限流处理（blockHandler）
    public Result createOrderBlockHandler(Long userId, Long productId,
                                           BlockException e) {
        log.warn("被限流了：{}", e.getMessage());
        return Result.error("系统繁忙，请稍后再试");
    }
}
```

#### 4. 引入 Sentinel

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
</dependency>
```

#### 5. 应用配置

```yaml
spring:
  cloud:
    sentinel:
      transport:
        dashboard: localhost:8080  # 控制台地址（可选）
      eager: true                   # 启动即注册
```

### 🔑 关键技术点
1. **fallback vs blockHandler** — fallback 处理业务异常，blockHandler 处理流控异常
2. **资源命名规范** — 推荐 `service:method` 格式，如 `order:create`
3. **默认不开启懒加载** — 首次调用资源才注册，设置 `eager: true` 避免

### 📚 课后思考
1. Sentinel 的 fallback 和 blockHandler 同时配置时，触发优先级是怎样的？
2. 如果被熔断的方法是 private 的，@SentinelResource 还能生效吗？

