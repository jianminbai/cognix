# Spring Cloud 系列课程 · 第 5 课

**进度：5/30**

## 负载均衡：Spring Cloud LoadBalancer 实战

### 🎯 学习目标
- 理解客户端负载均衡与服务端负载均衡的区别
- 掌握 Spring Cloud LoadBalancer 的三种内置负载策略
- 学会自定义负载均衡策略
- 理解 LoadBalancer 与 Nacos 的集成原理

### 📖 核心内容

#### 1. 为什么需要客户端负载均衡？
- **服务端负载均衡**（Nginx）：所有请求经过一个中心节点，存在单点和瓶颈
- **客户端负载均衡**（LoadBalancer）：每个消费者从注册中心获取服务列表，在本地做负载均衡决策，消除单点

#### 2. LoadBalancer 三种内置策略

| 策略 | 类名 | 说明 | 适用场景 |
|------|------|------|---------|
| 轮询 | RoundRobinLoadBalancer | 依次循环，默认策略 | 所有实例性能相近 |
| 权重 | WeightedLoadBalancer | 按权重比例分发 | 异构实例（不同配置） |
| 一致性哈希 | ... | 相同请求发到同一实例 | 有状态服务、缓存亲和性 |

#### 3. 自定义负载策略

```java
@Component
public class CustomLoadBalancer implements ReactorServiceInstanceLoadBalancer {
    @Override
    public Mono<Response<ServiceInstance>> choose(Request request) {
        // 自定义逻辑：按响应时间、按地区、按租户等
    }
}
```

#### 4. 与 Nacos 集成
- LoadBalancer 通过 DiscoveryClient 获取 Nacos 中的服务实例列表
- Nacos 的健康检查自动剔除故障实例
- LoadBalancer 周期性刷新服务列表

### 💡 最佳实践
- 灰度发布场景：用权重策略逐步放量
- 有状态服务：一致性哈希避免 session 丢失
- 开启 `spring.cloud.loadbalancer.health-check` 进行主动健康探测

