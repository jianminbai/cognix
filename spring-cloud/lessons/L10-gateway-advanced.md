# Spring Cloud 系列课程 · 第 10 课

**进度：10/30**

## Gateway 进阶：断言工厂、自定义过滤器与限流

### 🎯 学习目标
- 掌握 Gateway 内置的 11 种断言工厂
- 学会编写自定义 GatewayFilter 和 GlobalFilter
- 实现基于 RequestRateLimiter 的网关限流
- 理解全局过滤器与局部过滤器的区别

### 📖 核心内容

#### 1. 内置断言工厂回顾

最常用的断言：
- **Path** — 路径匹配 `Path=/api/user/**`
- **Method** — HTTP 方法匹配 `Method=POST`
- **Header** — 请求头匹配 `Header=X-Request-Type, admin`
- **Cookie** — Cookie 匹配 `Cookie=sessionId, \d+`
- **Weight** — 灰度权重 `Weight=canary, 10`

#### 2. 自定义过滤器

**局部过滤器（GatewayFilter）：**
```java
@Component
public class CustomAuthGatewayFilterFactory
        extends AbstractGatewayFilterFactory<CustomAuthGatewayFilterFactory.Config> {

    public CustomAuthGatewayFilterFactory() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String token = exchange.getRequest().getHeaders()
                    .getFirst("Authorization");
            if (token == null || !token.startsWith("Bearer ")) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }
            return chain.filter(exchange);
        };
    }

    public static class Config {
        // 配置属性
    }
}
```

**全局过滤器（GlobalFilter）—— 对所有路由生效：**
```java
@Component
@Order(-1)
public class RequestLoggingGlobalFilter implements GlobalFilter {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        log.info("Incoming request: {} {}", request.getMethod(), request.getURI());
        return chain.filter(exchange);
    }
}
```

#### 3. 网关限流：RequestRateLimiter

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
            - name: RequestRateLimiter
              args:
                key-resolver: "#{@userKeyResolver}"
                redis-rate-limiter.replenishRate: 100
                redis-rate-limiter.burstCapacity: 200
```

基于 Redis +令牌桶算法实现。

### 💡 最佳实践
1. `@Order(-1)` 确保全局过滤器优先执行
2. 限流 key-resolver 根据实际场景选择（IP、用户ID、URL）
3. 生产环境 Redis RateLimiter 的令牌桶参数要根据压测结果调整

