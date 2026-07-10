---
title: Agentic Dashboard 技术文档
description: BI + Agent 双引擎驱动的领导决策支持系统
date: 2026-07-07
lang: AI Agent
collection: project-doc
author: plv
---

## 目录

- [1. 项目概述](#1-项目概述)
- [2. 技术栈详解](#2-技术栈详解)
- [3. 架构设计](#3-架构设计)
- [4. 核心流程](#4-核心流程)
- [5. 数据库设计](#5-数据库设计)
- [6. 安全机制](#6-安全机制)
- [7. 可观测性](#7-可观测性)
- [8. 部署指南](#8-部署指南)
- [9. API 文档](#9-api-文档)
- [10. 开发指南](#10-开发指南)

---

## 1. 项目概述

### 1.1 项目定位

传统领导驾驶舱面临三大痛点：

- **找数难**：指标藏在深层菜单
- **理解慢**：图表无法解释异常原因
- **交互弱**：只能点选不能提问

Agentic Dashboard 将大模型对话能力与政务数据驾驶舱深度融合，实现：

- **自然语言直达**：一句话调出任意指标图表
- **智能异常归因**：Agent 自动关联政策、事件、上下游指标给出归因分析
- **跨域知识融合**：结构化数据与非结构化知识无缝串联
- **可信决策溯源**：每个结论可追溯至原始数据、SQL 语句、引用文档

### 1.2 技术亮点

| 特性              | 描述                                                  |
| ----------------- | ----------------------------------------------------- |
| **六边形架构**    | Ports & Adapters 模式，领域与基础设施解耦             |
| **多 Agent 系统** | 3 个 LangChain4j @AiService Agent，各自专注不同业务域 |
| **三层安全防御**  | 输入过滤 → SQL 沙箱 → 输出合规                        |
| **多级缓存**      | L1 Caffeine + L2 pgvector 语义缓存                    |
| **全链路可观测**  | Prometheus + Grafana + Tempo 分布式追踪               |
| **8 主题系统**    | CSS 变量 + data-theme 切换，Google Fonts 动态加载     |

---

## 2. 技术栈详解

### 2.1 后端技术栈

| 分类           | 技术                                       | 版本          | 用途                          |
| -------------- | ------------------------------------------ | ------------- | ----------------------------- |
| **运行时**     | JDK                                        | 21+           | Virtual Threads 支持          |
| **框架**       | Spring Boot                                | 4.0.6         | 应用框架                      |
| **Web**        | Spring Web + WebFlux                       | 4.x           | REST + SSE 流式               |
| **AI 集成**    | LangChain4j                                | 1.15.0-beta25 | @AiService, @Tool, Agent 编排 |
| **LLM 提供商** | DashScope (Qwen)                           | -             | 阿里云通义千问 (qwen-plus)    |
| **数据库**     | PostgreSQL + pgvector                      | 18            | 业务数据 + 向量检索           |
| **缓存**       | Caffeine + pgvector + Redis                | -             | 多级缓存 + 会话记忆           |
| **DB 迁移**    | Flyway                                     | -             | 16 个版本迁移脚本             |
| **安全**       | Spring Security + JWT (RSA)                | -             | 认证授权、RBAC                |
| **SQL 安全**   | JSqlParser                                 | 5.1           | AST 级 SQL 沙箱               |
| **可观测**     | Micrometer + Prometheus + Actuator         | -             | 指标、健康检查                |
| **链路追踪**   | Micrometer Tracing + Brave + Grafana Tempo | -             | 分布式追踪                    |
| **WebSocket**  | Spring WebSocket + STOMP                   | -             | 实时推送                      |

### 2.2 前端技术栈

| 分类          | 技术                           | 版本          | 用途                  |
| ------------- | ------------------------------ | ------------- | --------------------- |
| **框架**      | Vue                            | 3.5.13        | 响应式 UI             |
| **路由**      | Vue Router                     | 4.5.0         | SPA 路由（懒加载）    |
| **状态管理**  | Pinia                          | 3.0.4         | 状态管理              |
| **构建工具**  | Vite                           | 6.3.0         | 开发服务器 + 生产构建 |
| **样式**      | Tailwind CSS                   | 4.1.0         | 原子化 CSS            |
| **图表**      | ECharts                        | 5.6.0         | 数据可视化（SVG）     |
| **SSE**       | @microsoft/fetch-event-source  | 2.0.1         | AI 对话流式响应       |
| **WebSocket** | @stomp/stompjs + sockjs-client | 7.3.0 / 1.6.1 | 实时数据推送          |
| **国际化**    | vue-i18n                       | 9.14.5        | 中/英双语             |
| **虚拟滚动**  | @tanstack/vue-virtual          | 3.13.29       | 万级数据高性能渲染    |
| **导出**      | xlsx + jspdf + html2canvas     | -             | Excel / PDF / PNG     |
| **Markdown**  | marked                         | 18.0.5        | 聊天 Markdown 渲染    |
| **拖拽布局**  | gridstack                      | 12.6.0        | 自定义仪表盘          |

### 2.3 基础设施

| 服务           | 镜像                   | 用途                  |
| -------------- | ---------------------- | --------------------- |
| **PostgreSQL** | pgvector/pgvector:pg18 | 业务库 + 向量嵌入     |
| **Redis**      | redis:7-alpine         | 会话内存 + 分布式限流 |
| **Prometheus** | prom/prometheus        | 指标抓取 + 存储       |
| **Grafana**    | grafana/grafana        | 监控面板              |
| **Tempo**      | grafana/tempo          | 分布式链路存储        |

---

## 3. 架构设计

### 3.1 六边形架构

```
┌──────────────────────────────────────────────────────┐
│                    Frontend (Vue 3)                    │
│  HomeView → TerminalDashboard → EnhancedChat → Dash  │
└──────────────┬───────────────────────────────────────┘
               │ HTTP / SSE / WebSocket
               ▼
┌──────────────────────────────────────────────────────┐
│           Inbound Adapters (Controllers)               │
│   ChatController (SSE)  TerminalDashboardController    │
│   InputSanitizerFilter  SecurityHeaderFilter           │
│   OutputComplianceChecker  GlobalExceptionHandler      │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────┐
│           Application Layer (Services)                 │
│   ChatOrchestrator → CacheService → RateLimitService   │
│   IntentRoutingService                                  │
└────────┬─────────────────────────────────────────────┘
               │
     ┌─────┴─────┐
     ▼                  ▼
┌──────────┐ ┌──────────┐
│  Domain  │ │  Domain  │
│  Intent  │ │  Agents  │
│ Router   │ │ Indicator│
│          │ │ Policy   │
│          │ │ Terminal │
└────┬─────┘ └────┬─────┘
     │            │
     ▼            ▼
┌──────────────────────────────────────────────────────┐
│           Outbound Adapters                            │
│  IndicatorToolHandler  TerminalToolHandler              │
│  SemanticCacheRepository  CompositeContentRetriever    │
│  AuditListeners  MicrometerMetricsAdapter              │
└──────────────────────────────────────────────────────┘
```

### 3.2 分层职责

| 层级               | 职责                     | 关键类                         |
| ------------------ | ------------------------ | ------------------------------ |
| **Infrastructure** | 框架适配、外部资源访问   | Controllers, Filters, Config   |
| **Application**    | 业务编排、流程控制       | ChatOrchestrator, CacheService |
| **Domain**         | 核心业务逻辑、Agent 定义 | Agents, IntentRouter, Models   |

### 3.3 关键设计模式

| 模式                  | 应用场景                          |
| --------------------- | --------------------------------- |
| **Ports & Adapters**  | 六边形架构，领域与基础设施解耦    |
| **Agent Pattern**     | 3 个 LangChain4j @AiService Agent |
| **Strategy Pattern**  | IntentRouter 正则匹配策略         |
| **Decorator Pattern** | 多级缓存装饰器                    |
| **Observer Pattern**  | AuditListener 审计监听            |

---

## 4. 核心流程

### 4.1 AI 对话流

```
用户输入 "禅城区终端使用情况"
       │
       ▼
┌─ EnhancedChatView.vue ──────────────────────────────┐
│  handleSend() → fetch /api/v1/chat/stream?message=   │
└────────────────────────┬────────────────────────────┘
                         │ HTTP GET
                         ▼
┌─ 安全防御 (第1层) ──────────────────────────────────┐
│  SecurityHeaderFilter.java                           │
│    → 设置 CSP / XSS-Protection 响应头                │
│  InputSanitizerFilter.java                           │
│    → SensitiveWordDict.java → 注入/敏感词检测         │
└────────────────────────┬────────────────────────────┘
                         │
                         ▼
┌─ 接入层 ────────────────────────────────────────────┐
│  ChatController.java: stream(message, sessionId)     │
│    → ChatOrchestrator.java: process(sid, msg)        │
└────────────────────────┬────────────────────────────┘
                         │
                         ▼
┌─ 编排层 ────────────────────────────────────────────┐
│  ChatOrchestrator.java                               │
│    ├─ RateLimitService.java → TokenBucket (Redis)    │
│    ├─ CacheService.java → SemanticCacheRepository    │
│    │     L1 Caffeine → L2 pgvector 语义缓存          │
│    └─ IntentRoutingService.java: route(sid, msg)     │
└────────────────────────┬────────────────────────────┘
                         │
                         ▼
┌─ 领域路由 ──────────────────────────────────────────┐
│  IntentRoutingService.java                           │
│    → IntentRouter.java: 10组正则匹配                 │
│    → 匹配: IntentType.TERMINAL_QUERY                 │
└────────────────────────┬────────────────────────────┘
                         │
                         ▼
┌─ Agent 调用 ────────────────────────────────────────┐
│  IntentRoutingService.java                           │
│    → TerminalAgent (@AiService)                      │
│        LangChain4j → Qwen LLM                        │
│    → TerminalToolHandler.java: @Tool                 │
│        queryTerminalStats(sql)                       │
└────────────────────────┬────────────────────────────┘
                         │
                         ▼
┌─ SQL 安全 (第2层) ──────────────────────────────────┐
│  SqlSafetyUtil.java: validateAndInjectTenant(sql)    │
│    ├─ JSqlParser AST → 仅允许 SELECT                  │
│    ├─ 表名白名单 (8张表)                              │
│    ├─ 禁用函数检测                                    │
│    └─ 自动注入 tenant_id                              │
└────────────────────────┬────────────────────────────┘
                         │ 安全 SQL
                         ▼
┌─ 数据查询 ──────────────────────────────────────────┐
│  TerminalToolHandler.java → JdbcTemplate             │
│    → queryForList() → PostgreSQL                     │
│    → 结果集 List<Map>                                │
└────────────────────────┬────────────────────────────┘
                         │
                         ▼
┌─ 审计 & 可观测 ────────────────────────────────────┐
│  StartedAuditListener: 记录开始时间                  │
│  ToolAuditListener: 捕获 Tool 调用参数              │
│  CompletedAuditListener: 异步写入 audit_log         │
│  CompletedAuditListener: 异步写入语义缓存           │
└────────────────────────┬────────────────────────────┘
                         │
                         ▼
              LLM 组织结果 → 自然语言 + Chart JSON
                         │
                         ▼
┌─ 输出安全 ──────────────────────────────────────────┐
│  OutputComplianceChecker.java                        │
│    → SensitiveWordDict.java → 输出合规正则匹配        │
└────────────────────────┬────────────────────────────┘
                         │ SSE 流式推送 (逐 token)
                         ▼
┌─ 前端渲染 ──────────────────────────────────────────┐
│  EnhancedChatView.vue                                │
│    ├─ reader.read() 逐块拼接                         │
│    ├─ ChatMessage.vue → 流式渲染文本 + 闪烁光标       │
│    ├─ tryExtractChart() → chartStore.js              │
│    └─ ChartContainer.vue → ECharts 渲染              │
└─────────────────────────────────────────────────────┘
```

### 4.2 REST 查询流

```
用户访问页面
       │
       ▼
┌─ HomeView / DashboardView / TerminalDashboard ──────┐
│  onMounted → 并行 7 个 GET 请求                      │
│                                                      │
│  ├─ GET /api/v1/terminal/overview                    │
│  ├─ GET /api/v1/terminal/district-stats              │
│  ├─ GET /api/v1/terminal/matter-categories           │
│  ├─ GET /api/v1/terminal/trend                       │
│  ├─ GET /api/v1/terminal/device-list                 │
│  ├─ GET /api/v1/terminal/districts                   │
│  └─ GET /api/v1/terminal/device-types                │
└────────────────────────┬────────────────────────────┘
                         │ HTTP GET
                         ▼
┌─ TerminalDashboardController.java ──────────────────┐
│  参数化 SQL → PostgreSQL → JSON Response             │
└────────────────────────┬────────────────────────────┘
                         │ JSON
                         ▼
┌─ 数据绑定 → 组件渲染 ─────────────────────────────┐
│  HomeView/DashboardView/TerminalDashboard           │
│    ├─ KPICard.vue                                   │
│    │   设备总数 / 正常 / 故障 / 月使用量             │
│    │   animateValue() 数字滚动动画                  │
│    ├─ ChartContainer.vue                            │
│    │   使用趋势折线图 / 区域分布饼图 / 事项分类柱状图 │
│    │   echarts.init() SVG 渲染                      │
│    ├─ DataTable.vue                                 │
│    │   设备列表 (排序 / 搜索 / 分页)                 │
│    └─ 点击行 → 侧边详情抽屉                         │
└────────────────────────┬────────────────────────────┘
                         │
                         ▼
                 完整驾驶舱页面
```

### 4.3 WebSocket 实时推送流

```
┌─ 后端定时任务 ──────────────────────────────────────┐
│  @Scheduled                                         │
│    ├─ 每 10s: 推送 Prometheus 指标                   │
│    ├─ 每 30s: 推送终端概览数据                       │
│    ├─ 每 60s: 推送趋势/区域数据                      │
│    └─ 每 60s: 评估告警规则并推送                     │
└────────────────────────┬────────────────────────────┘
                         │ STOMP over WebSocket
                         ▼
┌─ 前端 WebSocket 连接 ──────────────────────────────┐
│  useWebSocket.js                                   │
│    ├─ @stomp/stompjs → 订阅 /topic/xxx             │
│    ├─ 更新 Pinia Store                             │
│    └─ 触发组件响应式更新                            │
└─────────────────────────────────────────────────────┘
```

---

## 5. 数据库设计

### 5.1 核心表结构

| 表名                   | 用途         | 关键字段                                                |
| ---------------------- | ------------ | ------------------------------------------------------- |
| `fs_terminal_device`   | 终端设备主表 | id, device_code, district, status, tenant_id            |
| `fs_terminal_usage`    | 使用记录     | id, device_id, usage_date, duration, matter_type        |
| `fs_terminal_fault`    | 故障记录     | id, device_id, fault_type, fault_time, repair_status    |
| `fs_terminal_district` | 区划信息     | id, district_code, district_name                        |
| `gov_indicator`        | 政务指标     | id, indicator_name, value, period, district             |
| `policy_document`      | 政策文件     | id, title, content, embedding(vector)                   |
| `semantic_cache`       | 语义缓存     | id, query_hash, query_text, response, embedding(vector) |
| `audit_log`            | 审计日志     | id, session_id, intent, tool_calls, sql, latency_ms     |
| `chat_history`         | 对话历史     | id, session_id, role, content, created_at               |
| `alert_rule`           | 告警规则     | id, rule_name, condition, threshold, enabled            |
| `alert_history`        | 告警历史     | id, rule_id, triggered_at, message, level               |

### 5.2 向量索引

```sql
-- pgvector 向量索引 (HNSW)
CREATE INDEX idx_policy_embedding 
  ON policy_document 
  USING hnsw (embedding vector_cosine_ops);

CREATE INDEX idx_cache_embedding 
  ON semantic_cache 
  USING hnsw (embedding vector_cosine_ops);
```

### 5.3 Flyway 迁移

项目包含 16 个版本迁移脚本（V1-V16），覆盖：

- V1-V5: 核心业务表 + 初始数据
- V6-V8: 缓存版本 + 审计增强
- V9-V11: RBAC 权限模型 + 初始用户
- V12-V16: 对话历史 + 仪表盘 + 告警系统

---

## 6. 安全机制

### 6.1 三层安全防御

| 层级        | 位置             | 文件                           | 机制                                                         |
| ----------- | ---------------- | ------------------------------ | ------------------------------------------------------------ |
| **L1 输入** | FilterChain 入口 | `InputSanitizerFilter.java`    | 正则匹配 Prompt 注入、敏感词                                 |
| **L2 SQL**  | Tool 调用        | `SqlSafetyUtil.java`           | JSqlParser AST 校验 SELECT 白名单 + 危险函数检测 + tenant_id 自动注入 |
| **L3 输出** | 响应返回         | `OutputComplianceChecker.java` | 输出合规检查、敏感内容脱敏                                   |

### 6.2 SQL 沙箱

```java
// SqlSafetyUtil.java 核心逻辑
public static String validateAndInjectTenant(String sql, String tenantId) {
    // 1. JSqlParser 解析 AST
    Statement stmt = CCJSqlParserUtil.parse(sql);
    
    // 2. 仅允许 SELECT
    if (!(stmt instanceof Select)) {
        throw new SecurityException("Only SELECT allowed");
    }
    
    // 3. 表名白名单校验
    Set<String> allowedTables = Set.of(
        "fs_terminal_device", "fs_terminal_usage", "fs_terminal_fault",
        "fs_terminal_district", "gov_indicator", "policy_document",
        "semantic_cache", "audit_log"
    );
    
    // 4. 禁用危险函数
    Set<String> blockedFunctions = Set.of(
        "pg_read_file", "pg_write_file", "lo_import", "lo_export"
    );
    
    // 5. 自动注入 tenant_id
    injectTenantFilter(stmt, tenantId);
    
    return stmt.toString();
}
```

### 6.3 JWT 认证

```yaml
# application.yml JWT 配置
agentic:
  jwt:
    issuer: agentic-dashboard
    access-token-expiration: 3600      # 1 小时
    refresh-token-expiration: 604800   # 7 天
    rsa-private-key: ${JWT_PRIVATE_KEY}
    rsa-public-key: ${JWT_PUBLIC_KEY}
```

### 6.4 RBAC 权限模型

```
User → Role → Permission
  │      │        │
  │      │        └─ dashboard:view, chat:use, admin:manage
  │      └─ admin, operator, viewer
  └─ admin, user001, user002...
```

---

## 7. 可观测性

### 7.1 审计日志

```sql
-- audit_log 表结构
CREATE TABLE audit_log (
    id BIGSERIAL PRIMARY KEY,
    session_id VARCHAR(64),
    intent VARCHAR(32),
    tool_calls JSONB,
    sql TEXT,
    latency_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 7.2 Prometheus 指标

| 指标名称                       | 类型      | 描述                |
| ------------------------------ | --------- | ------------------- |
| `http_server_requests_seconds` | Histogram | HTTP 请求耗时       |
| `chat_intent_total`            | Counter   | 意图分类计数        |
| `chat_cache_hit_total`         | Counter   | 缓存命中计数        |
| `agent_tool_calls_total`       | Counter   | Agent Tool 调用计数 |
| `agent_tool_latency_seconds`   | Histogram | Tool 调用耗时       |

### 7.3 分布式追踪

架构：应用 → Zipkin 协议 → Tempo 存储 → Grafana 查询

```
┌─────────────────┐     Zipkin 协议      ┌──────────────┐     查询      ┌─────────┐
│  Spring Boot    │ ──────────────────→  │    Tempo     │ ←─────────── │ Grafana │
│  (Brave/Zipkin) │     port: 9411       │  (存储后端)   │              │ (UI)    │
└─────────────────┘                      └──────────────┘              └─────────┘
```

```yaml
# TracingConfig.java - 应用配置
# 使用 Zipkin reporter 发送 span 到 Tempo
zipkin:
  url: ${ZIPKIN_URL:http://localhost:9411/api/v2/spans}

# application.yml - Spring Boot 配置
management:
  tracing:
    sampling:
      probability: 1.0  # 100% 采样
    baggage:
      correlation:
        fields:
          - x-trace-id
          - x-tenant-id
```

```yaml
# docker-compose.yml - Tempo 服务
tempo:
  image: grafana/tempo:latest
  ports:
    - "${TEMPO_ZIPKIN_PORT:-9411}:9411"  # 接收 Zipkin 格式 span
    - "${TEMPO_QUERY_PORT:-3200}:3200"   # Tempo 查询 API
```

```yaml
# infrastructure/monitoring/tempo/tempo.yml
server:
  http_listen_port: 3200
distributor:
  receivers:
    zipkin:
      endpoint: 0.0.0.0:9411  # 监听 Zipkin 协议
storage:
  trace:
    backend: local
    local:
      path: /tmp/tempo/blocks
```

### 7.4 Grafana 预置面板

- **HTTP 请求监控**: 请求量、错误率、延迟分布
- **AI Agent 监控**: 意图分类、Tool 调用、LLM 延迟
- **缓存监控**: L1/L2 命中率、缓存大小
- **业务监控**: 终端设备状态、使用趋势

---

## 8. 部署指南

### 8.1 环境要求

| 组件       | 最低版本 | 推荐版本 |
| ---------- | -------- | -------- |
| JDK        | 21       | 21.0.2   |
| Node.js    | 18       | 20 LTS   |
| PostgreSQL | 16       | 18       |
| Redis      | 7        | 7.2      |
| Docker     | 24       | 25+      |

### 8.2 一键启动

```bash
# 1. 构建后端
.\mvnw package -DskipTests

# 2. 运行 start.cmd
.\start.cmd
```

### 8.3 分步启动

```bash
# 1. 启动基础设施
docker compose --profile dev up -d

# 2. 启动后端
java -jar target\AgenticDashboard-0.6.0.jar

# 3. 启动前端
cd frontend
npm install
npm run dev
```

### 8.4 Docker Compose 服务

```yaml
services:
  postgres:      # PostgreSQL + pgvector (port: 5433)
  redis:         # Redis 缓存 (port: 6378)
  prometheus:    # 指标抓取 (port: 9090)
  grafana:       # 监控面板 (port: 3000)
  tempo:         # 链路追踪存储 (port: 9411 接收span, 3200 查询)
```

### 8.5 环境变量

```bash
# 必填项
DB_USER=<your-db-user>
DB_PASS=<your-db-password>
REDIS_PASSWORD=<your-redis-password>
QWEN_API_KEY=<your-qwen-api-key>
JWT_PRIVATE_KEY=<your-rsa-private-key>
JWT_PUBLIC_KEY=<your-rsa-public-key>
ADMIN_INIT_PASSWORD=<admin-password>

# 可选项（有默认值）
DB_HOST=localhost
DB_PORT=5433
REDIS_HOST=localhost
REDIS_PORT=6378
SERVICE_PORT=9999
ZIPKIN_URL=http://localhost:9411/api/v2/spans  # Tempo 接收地址
```

---

## 9. API 文档

### 9.1 对话接口

```http
GET /api/v1/chat/stream
Content-Type: text/event-stream

Params:
  message   - 用户输入文本 (必填)
  sessionId - 会话 ID (可选，自动生成)

Response: SSE 流式响应
  data: {"type":"text","content":"..."}
  data: {"type":"chart","chartType":"line","data":{...}}
  data: {"type":"done"}
```

### 9.2 终端数据接口

| 端点                                 | 方法 | 参数                                 | 返回                        |
| ------------------------------------ | ---- | ------------------------------------ | --------------------------- |
| `/api/v1/terminal/overview`          | GET  | `district` (可选)                    | 设备总数/正常/故障/月使用量 |
| `/api/v1/terminal/district-stats`    | GET  | `district` (可选)                    | 各区设备数/使用量/平均时长  |
| `/api/v1/terminal/matter-categories` | GET  | `period`, `district`                 | 事项分类统计                |
| `/api/v1/terminal/trend`             | GET  | `months`, `district`                 | 月度趋势数据                |
| `/api/v1/terminal/device-list`       | GET  | `district`, `status`, `page`, `size` | 设备列表（分页）            |
| `/api/v1/terminal/districts`         | GET  | -                                    | 区划列表                    |
| `/api/v1/terminal/device-types`      | GET  | -                                    | 设备类型字典                |

### 9.3 认证接口

| 端点                    | 方法 | 说明              |
| ----------------------- | ---- | ----------------- |
| `/api/v1/auth/login`    | POST | 登录获取 Token    |
| `/api/v1/auth/refresh`  | POST | 刷新 Access Token |
| `/api/v1/auth/register` | POST | 注册新用户        |

### 9.4 告警接口

| 端点                    | 方法 | 说明             |
| ----------------------- | ---- | ---------------- |
| `/api/v1/alert/rules`   | GET  | 获取告警规则列表 |
| `/api/v1/alert/rules`   | POST | 创建告警规则     |
| `/api/v1/alert/history` | GET  | 获取告警历史     |

---

## 10. 开发指南

### 10.1 项目结构

```
agentic-dashboard/
├── frontend/                    # Vue 3 前端
│   └── src/
│       ├── components/          # 可复用组件
│       ├── composables/         # 组合式函数
│       ├── stores/              # Pinia 状态
│       └── views/               # 页面视图
│
├── src/main/java/com/plv/dashboard/
│   ├── application/             # 应用层（编排 + 服务）
│   │   ├── port/                # 六边形端口
│   │   └── service/             # 业务服务
│   ├── domain/                  # 领域层（Agent + 模型）
│   └── infrastructure/          # 基础设施层
│       ├── adapter/             # 适配器
│       └── config/              # 配置类
│
├── src/main/resources/
│   ├── db/migration/            # Flyway 迁移
│   ├── prompts/                 # Agent 提示词
│   └── application.yml          # 主配置
│
├── infrastructure/              # DevOps 基础设施
│   └── monitoring/              # 监控配置
│
├── docker-compose.yml           # Docker 编排
├── Dockerfile                   # 多阶段构建
└── pom.xml                      # Maven 配置
```

### 10.2 新增 Agent

```java
// 1. 定义 Agent 接口
@AiService
public interface NewAgent {
    @SystemMessage("{{systemPrompt}}")
    String chat(@MemoryId String sessionId, @UserMessage String message);
}

// 2. 实现 Tool 方法
@Component
public class NewToolHandler {
    @Tool("查询新功能数据")
    public String queryNewData(@P("SQL查询语句") String sql) {
        // SQL 安全校验
        String safeSql = SqlSafetyUtil.validateAndInjectTenant(sql, tenantId);
        // 执行查询
        return jdbcTemplate.queryForList(safeSql).toString();
    }
}

// 3. 在 IntentRouter 添加匹配规则
// 4. 在 IntentRoutingService 注册路由
```

### 10.3 新增前端页面

```vue
<!-- 1. 创建视图组件 -->
<template>
  <div class="page-container">
    <!-- Loading State -->
    <LoadingSkeleton v-if="loading" />
    <!-- Empty State -->
    <EmptyState v-else-if="!data" />
    <!-- Normal State -->
    <div v-else>
      <!-- 内容 -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNewApi } from '@/composables/useNewApi'

const { data, loading, fetchData } = useNewApi()

onMounted(() => {
  fetchData()
})
</script>
```

### 10.4 测试

```bash
# 前端测试
cd frontend
npm run test

# 后端构建
./mvnw package -DskipTests
```

---

## 附录

### A. 错误码定义

| 错误码 | 描述           |
| ------ | -------------- |
| 200    | 成功           |
| 400    | 请求参数错误   |
| 401    | 未认证         |
| 403    | 无权限         |
| 404    | 资源不存在     |
| 429    | 请求过于频繁   |
| 500    | 服务器内部错误 |

### B. 配置文件索引

| 文件                 | 路径                               | 说明               |
| -------------------- | ---------------------------------- | ------------------ |
| `application.yml`    | `src/main/resources/`              | Spring Boot 主配置 |
| `pom.xml`            | 项目根目录                         | Maven 依赖配置     |
| `package.json`       | `frontend/`                        | 前端 NPM 依赖      |
| `vite.config.js`     | `frontend/`                        | Vite 构建配置      |
| `docker-compose.yml` | 项目根目录                         | Docker 编排配置    |
| `.env.example`       | 项目根目录                         | 环境变量模板       |
| `tempo.yml`          | `infrastructure/monitoring/tempo/` | Tempo 链路追踪配置 |
| `TracingConfig.java` | `src/main/java/.../config/`        | 链路追踪 Bean 配置 |

### C. 参考资料

- [Spring Boot 4.0 文档](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [LangChain4j 文档](https://docs.langchain4j.dev/)
- [Vue 3 文档](https://vuejs.org/guide/introduction.html)
- [ECharts 文档](https://echarts.apache.org/zh/option.html)
- [pgvector 文档](https://github.com/pgvector/pgvector)
- [Grafana Tempo 文档](https://grafana.com/docs/tempo/latest/)
- [Micrometer Tracing 文档](https://micrometer.io/docs/tracing)

---

**文档版本**: v1.0  
**最后更新**: 2026-07-07  
**维护者**: 吖飘·PLV