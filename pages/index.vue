<script setup lang="ts">
const clickTimes: number[] = []
const adminMsg = ref('')

function triggerAdmin() {
  const now = Date.now()
  clickTimes.push(now)
  const recent = clickTimes.filter(t => now - t < 3000)
  clickTimes.length = 0
  clickTimes.push(...recent)

  if (recent.length >= 5) {
    const skip = localStorage.getItem('plv_skip_analytics')
    if (skip) {
      localStorage.removeItem('plv_skip_analytics')
      adminMsg.value = '访客统计已开启'
    } else {
      localStorage.setItem('plv_skip_analytics', '1')
      adminMsg.value = '访客统计已关闭（仅供站长）'
    }
    setTimeout(() => { adminMsg.value = '' }, 3000)
  }
}

const { data: allPosts } = await useAsyncData('home-posts-count', () =>
  queryContent('/posts').find()
)

const { count, ready } = useVisitCount()

const postCount = computed(() => allPosts.value?.length ?? 0)
</script>

<template>
  <div class="home">
    <div class="prompt">
      <span class="prompt-path">~/blog</span>
      <span class="prompt-symbol">$</span>
      <span class="prompt-text">cat about.md</span>
      <span class="cursor">▊</span>
    </div>

    <div class="hr" />

    <div class="hero">
      <div class="hero-logo" @click="triggerAdmin">
        <RouterLink to="/info">
          <img src="/plv.png" alt="PLV" class="hero-logo-img" />
        </RouterLink>
      </div>

      <div class="hero-body">
        <p class="hero-subtitle" @click="triggerAdmin">码农 / 技术笔记</p>
        <div class="hero-stats">
          <client-only>
            <span v-if="ready" class="stat-row">
              <span class="stat-prompt">&gt;</span>
              <span class="stat-label">访客</span>
              <span class="stat-value">{{ count.toLocaleString() }}</span>
              <span class="stat-unit">人次</span>
              <span class="text-[var(--c-text-tertiary)]" >[自2026-07-10起]</span>
            </span>
          </client-only>
          <span class="stat-row">
            <span class="stat-prompt">&gt;</span>
            <span class="stat-label">文章</span>
            <span class="stat-value">{{ postCount }}</span>
            <span class="stat-unit">篇</span>
          </span>
        </div>

        <p v-if="adminMsg" class="admin-msg">{{ adminMsg }}</p>
      </div>
    </div>

    <div class="hr" />

    <div class="greeting">
      <p>你好，欢迎来到我的博客。</p>
      <p>这里记录了我在技术路上的学习与思考，主要关注全栈开发、AI 工具实践。</p>
    </div>

    <div class="hr" />

    <div class="content prose !max-w-none">
      <ContentDoc path="/" />
    </div>

    <section class="section">
      <h2 class="section-title">── 技术栈 ──</h2>
      <div class="tech-group">
        <span class="tech-label">前端</span>
        <div class="tech-tags">
          <span class="tech-tag">Nuxt</span>
          <span class="tech-dot">·</span>
          <span class="tech-tag">Vue3</span>
          <span class="tech-dot">·</span>
          <span class="tech-tag">TypeScript</span>
          <span class="tech-dot">·</span>
          <span class="tech-tag">UnoCSS</span>
          <span class="tech-dot">·</span>
          <span class="tech-tag">Node.js</span>
        </div>
      </div>
      <div class="tech-group">
        <span class="tech-label">后端</span>
        <div class="tech-tags">
          <span class="tech-tag">Java</span>
          <span class="tech-dot">·</span>
          <span class="tech-tag">Spring Boot</span>
          <span class="tech-dot">·</span>
          <span class="tech-tag">Spring Cloud</span>
          <span class="tech-dot">·</span>
          <span class="tech-tag">LangChain4j</span>
        </div>
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">── 关于我 ──</h2>
      <div class="section-list">
        <p class="about-text">吖飘PLV · 码农 · QQ: 837965182</p>
        <p class="about-link">
          <a href="https://github.com/plvLY" target="_blank" class="about-link-item">
            <span class="about-link-label">GitHub</span>
            <span class="about-link-arrow">→</span>
            <span class="about-link-url">github.com/plvLY</span>
          </a>
        </p>
        <p class="about-link">
          <a href="https://gitee.com/plv-coding" target="_blank" class="about-link-item">
            <span class="about-link-label">Gitee</span>
            <span class="about-link-arrow">→</span>
            <span class="about-link-url">gitee.com/plv-coding</span>
          </a>
        </p>
      </div>
    </section>

    <div class="hr" />
  </div>
</template>

<style scoped>
.home {
  max-width: 64rem;
  margin: 0 auto;
  padding: 3rem 1.5rem 5rem;
  font-family: 'DM Mono', ui-monospace, SFMono-Regular, 'Cascadia Code', 'JetBrains Mono', Menlo, Consolas, monospace;
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--c-text-primary);
}

/* ── Prompt ── */
.prompt {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--c-text-tertiary);
  margin-bottom: 0.75rem;
  user-select: none;
}

.prompt-path {
  color: var(--c-signal);
}

.prompt-symbol {
  opacity: 0.5;
}

.prompt-text {
  opacity: 0.6;
}

@keyframes blink {
  0%, 40% { opacity: 1; }
  50%, 90% { opacity: 0; }
  100% { opacity: 1; }
}

.cursor {
  color: var(--c-signal);
  animation: blink 1.2s step-end infinite;
  font-size: 0.75em;
  line-height: 1;
}

/* ── HR ── */
.hr {
  height: 1px;
  background: var(--c-border);
  margin-bottom: 3rem;
}

/* ── Hero ── */
.hero {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.hero-logo {
  flex-shrink: 0;
  /* width: 64px; */
  height: 64px;
  cursor: pointer;
  user-select: none;
}

.hero-logo a {
  display: block;
  width: 100%;
  height: 100%;
}

.hero-logo-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  transition: opacity 0.2s;
}

.hero-logo-img:hover {
  opacity: 0.8;
}

.hero-body {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-top: 0.15rem;
}

.hero-subtitle {
  color: var(--c-text-tertiary);
  margin: 0;
  font-size: 0.9375rem;
  cursor: pointer;
  user-select: none;
}

.hero-stats {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-size: 0.9375rem;
}

.stat-row {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  color: var(--c-text-secondary);
}

.stat-prompt {
  color: var(--c-signal);
  font-weight: 600;
  width: 1ch;
}

.stat-label {
  min-width: 3ch;
}

.stat-value {
  font-variant-numeric: tabular-nums;
  color: var(--c-text-primary);
  font-weight: 600;
}

.stat-unit {
  color: var(--c-text-tertiary);
  font-size: 0.85em;
}

.admin-msg {
  margin-top: 0.75rem;
  font-size: 0.8rem;
  color: var(--c-signal);
}

/* ── Content ── */
.content {
  margin-bottom: 3rem;
}

.content :deep(h2) {
  font-family: 'DM Mono', ui-monospace, SFMono-Regular, 'Cascadia Code', 'JetBrains Mono', Menlo, Consolas, monospace;
  font-size: 0.8125rem;
  font-weight: 400;
  letter-spacing: 0.15em;
  color: var(--c-text-tertiary);
  margin: 0 0 1rem 0;
  text-transform: none;
  border: none;
  padding: 0;
}

.content :deep(p) {
  margin: 0;
  color: var(--c-text-secondary);
  font-size: 0.9375rem;
  font-family: inherit;
  line-height: 1.7;
}

.content :deep(code) {
  font-family: inherit;
  font-size: 0.9375rem;
  color: var(--c-signal);
  background: transparent;
  padding: 0;
}

/* ── Sections ── */
.section {
  margin-bottom: 2.5rem;
}

.section-title {
  font-size: 0.8125rem;
  font-weight: 400;
  letter-spacing: 0.15em;
  color: var(--c-text-tertiary);
  margin: 0 0 1rem 0;
  user-select: none;
}

.section-list {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.about-text {
  margin: 0;
  padding: 0.3rem 0.5rem;
  color: var(--c-text-secondary);
  font-size: 0.9375rem;
}

/* ── Greeting ── */
.greeting {
  margin-bottom: 3rem;
}

.greeting p {
  margin: 0;
  color: var(--c-text-secondary);
  font-size: 0.9375rem;
  line-height: 1.8;
}

.greeting p:last-child {
  margin-top: 0.25rem;
  color: var(--c-text-tertiary);
}

/* ── Tech Tags ── */
.tech-group {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  padding: 0.3rem 0.5rem;
}

.tech-label {
  font-size: 0.8125rem;
  color: var(--c-text-tertiary);
  min-width: 3ch;
  flex-shrink: 0;
}

.tech-tags {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tech-tag {
  font-size: 0.9375rem;
  color: var(--c-text-secondary);
  font-variant-numeric: tabular-nums;
}

.tech-dot {
  color: var(--c-text-tertiary);
  font-size: 0.875rem;
}

/* ── About Links ── */
.about-link {
  margin: 0;
}

.about-link-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 0.5rem;
  text-decoration: none;
  color: var(--c-text-secondary);
  font-size: 0.9375rem;
  border-radius: 4px;
  transition: background 0.15s;
}

.about-link-item:hover {
  background: var(--c-bg-hover);
}

.about-link-label {
  color: var(--c-text-primary);
  font-weight: 500;
  min-width: 4ch;
}

.about-link-arrow {
  color: var(--c-signal);
  opacity: 0.6;
}

.about-link-url {
  color: var(--c-text-tertiary);
}

@media (max-width: 640px) {
  .home {
    padding: 2rem 1rem 4rem;
  }

  .hero {
    flex-direction: row;
    gap: 1rem;
    align-items: center;
  }

  .hero-logo-img {
    width: 56px;
    height: 56px;
  }

  .hero-body {
    padding-top: 0;
  }

  .hero-stats {
    font-size: 0.875rem;
  }

  .content :deep(p) {
    font-size: 0.875rem;
  }
}
</style>
