# Spring Cloud 系列课程大纲

## 概述
30 课系统学习 Spring Cloud 微服务架构，分为 6 个阶段，从基础到源码分析。

## 课程结构

### Phase 1：微服务基础与入门 (L1-L5)
| 课次 | 标题 | 核心内容 |
|------|------|---------|
| L1 | 微服务架构概述与 Spring Cloud 生态全景 | 单体 vs 微服务、Spring Cloud 组件选型、Alibaba 生态 |
| L2 | 服务注册与发现：Nacos 安装与入门 | Nacos 架构、安装部署、服务注册原理 |
| L3 | Nacos 实战：服务注册、发现与健康检查 | @EnableDiscoveryClient、心跳机制、自我保护 |
| L4 | 服务调用：OpenFeign 声明式 HTTP 客户端 | @FeignClient、负载均衡集成、请求拦截 |
| L5 | 负载均衡：Spring Cloud LoadBalancer 实战 | 轮询/权重/一致性哈希、自定义负载策略 |

### Phase 2：服务治理 (L6-L10)
| 课次 | 标题 | 核心内容 |
|------|------|---------|
| L6 | 服务熔断降级：Sentinel 核心概念与入门 | 流量控制、熔断降级、@SentinelResource |
| L7 | Sentinel 进阶：流控规则、降级规则与热点规则 | QPS/线程数控制、异常比例/慢调用降级 |
| L8 | Sentinel 控制台：监控与管理 | 控制台搭建、规则持久化（Nacos 数据源） |
| L9 | API 网关：Spring Cloud Gateway 路由基础 | 路由、断言、过滤器、Gateway 与 Zuul 对比 |
| L10 | Gateway 进阶：断言工厂、自定义过滤器与限流 | RequestRateLimiter、全局/局部过滤器 |

### Phase 3：配置与可观测性 (L11-L15)
| 课次 | 标题 | 核心内容 |
|------|------|---------|
| L11 | 配置中心：Nacos Config 基础与动态刷新 | @RefreshScope、DataId 命名规则、配置优先级 |
| L12 | Nacos Config 进阶：多环境/共享配置 | spring.profiles.active、shared-configs、extension-configs |
| L13 | 服务链路追踪：Micrometer Tracing + Zipkin | Trace/Span/Annotation、依赖拓扑图、慢调用定位 |
| L14 | 日志聚合：ELK + Spring Cloud 日志体系 | Logstash 采集、ES 存储、Kibana 可视化 |
| L15 | 指标监控：Prometheus + Grafana + Actuator | Micrometer 指标暴露、JVM/DB/HTTP 监控面板 |

### Phase 4：分布式与消息 (L16-L20)
| 课次 | 标题 | 核心内容 |
|------|------|---------|
| L16 | 分布式事务基础：CAP、BASE、Seata 介绍 | 两阶段提交、TCC、Saga、AT 模式对比 |
| L17 | Seata AT 模式实战 | @GlobalTransactional、undo_log 表、分支事务 |
| L18 | Seata TCC 模式与 Saga 模式实战 | Try-Confirm-Cancel、状态机编排 |
| L19 | 消息驱动：Spring Cloud Stream + RocketMQ | Binder、消息分区、@StreamListener |
| L20 | 消息驱动进阶：死信、重试、顺序消息 | 消费重试机制、死信队列处理 |

### Phase 5：安全与部署 (L21-L25)
| 课次 | 标题 | 核心内容 |
|------|------|---------|
| L21 | Spring Cloud Security + OAuth2 认证授权 | JWT Token、资源服务器、授权码模式 |
| L22 | Gateway 集成 OAuth2 统一鉴权 | 全局过滤器鉴权、白名单路由、Token 解析 |
| L23 | Docker 容器化部署 Spring Cloud 微服务 | Dockerfile 编写、多阶段构建、镜像瘦身 |
| L24 | Docker Compose 编排微服务集群 | Nacos、Sentinel、Gateway 一键编排 |
| L25 | K8s 部署 Spring Cloud 微服务实战 | Deployment/Service/ConfigMap、Ingress |

### Phase 6：实战与源码 (L26-L30)
| 课次 | 标题 | 核心内容 |
|------|------|---------|
| L26 | 实战：搭建企业级微服务脚手架 | 统一父工程、公共模块、异常/响应封装、代码生成 |
| L27 | 实战：微服务间通信设计与异常处理最佳实践 | Feign 降级策略、超时配置、重试机制、请求链路传递 |
| L28 | 实战：统一配置管理与灰度发布 | 配置中心分层设计、灰度路由策略、蓝绿部署 |
| L29 | 源码分析：Spring Cloud 自动配置原理 | @EnableAutoConfiguration、spring.factories、条件装配 |
| L30 | 总结：从 Spring Cloud 到云原生 | 架构演进路线、Service Mesh、未来趋势 |

## 当前进度
- 已推送：L1-L9
- 当前进度：10/30
- 运行方式：cron 每日 10:00 自动推送
- 跟踪文件：`.hermes/scripts/spring-cloud-course/next_lesson.py`
