<script setup lang="ts">
import mermaid from 'mermaid'
import { onMounted, onUnmounted, ref } from 'vue'

const container = ref<HTMLElement | null>(null)
const showModal = ref(false)
const modalSvg = ref('')

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'Inter, system-ui, sans-serif',
  flowchart: {
    padding: 8,
    nodeSpacing: 30,
    rankSpacing: 40,
    useMaxWidth: true,
  },
})

function openModal(svg: string) {
  const scrollY = window.scrollY
  modalSvg.value = svg
  showModal.value = true
  document.body.style.position = 'fixed'
  document.body.style.top = `-${scrollY}px`
  document.body.style.width = '100%'
}

function closeModal() {
  const scrollY = parseInt(document.body.style.top || '0') * -1 || 0
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.width = ''
  window.scrollTo(0, scrollY)
  showModal.value = false
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeModal()
}

async function renderMermaid() {
  if (!container.value) return

  const codeBlocks = container.value.querySelectorAll('pre.language-mermaid')

  for (let i = 0; i < codeBlocks.length; i++) {
    const block = codeBlocks[i] as HTMLElement
    const code = block.querySelector('code')?.textContent || ''

    if (code) {
      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
        const { svg } = await mermaid.render(id, code)

        const wrapper = document.createElement('div')
        wrapper.className = 'mermaid-diagram'
        wrapper.innerHTML = svg
        wrapper.addEventListener('click', () => openModal(svg))
        block.parentNode?.replaceChild(wrapper, block)
      } catch (e) {
        console.error('Mermaid render failed:', e)
        block.innerHTML = '<div class="text-red-500 p-2 bg-red-50 rounded">Mermaid Syntax Error</div>'
      }
    }
  }
}

let observer: MutationObserver | null = null

onMounted(() => {
  renderMermaid()
  document.addEventListener('keydown', onKeydown)

  observer = new MutationObserver(() => {
    if (container.value?.querySelector('pre.language-mermaid')) {
      renderMermaid()
    }
  })

  if (container.value) {
    observer.observe(container.value, { childList: true, subtree: true })
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  observer?.disconnect()
})
</script>

<template>
  <div ref="container">
    <slot />
  </div>

  <Teleport to="body">
    <div v-if="showModal" class="mermaid-overlay" @click.self="closeModal">
      <button class="mermaid-close" @click="closeModal">✕</button>
      <div class="mermaid-modal-content" v-html="modalSvg" />
    </div>
  </Teleport>
</template>

<style scoped>
.mermaid-diagram {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
  overflow-x: auto;
  cursor: zoom-in;
  position: relative;
  transition: outline .15s ease;
}
.mermaid-diagram:hover {
  outline: 2px solid hsl(217, 65%, 55%, .35);
  outline-offset: 4px;
  border-radius: 4px;
}

:deep(.mermaid-diagram svg) {
  max-width: 100% !important;
  max-height: 55vh !important;
  height: auto !important;
  width: auto !important;
}

</style>

<style>
.mermaid-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, .65);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  animation: fadeIn .2s ease;
}

.mermaid-close {
  position: fixed;
  top: 1rem;
  right: 1.5rem;
  font-size: 1.5rem;
  color: #fff;
  cursor: pointer;
  background: none;
  border: none;
  z-index: 1;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  transition: background .15s ease;
}
.mermaid-close:hover {
  background: rgba(255, 255, 255, .15);
}

.mermaid-modal-content {
  max-width: 92vw;
  max-height: 90vh;
  overflow: auto;
  width: 100%;
}

.mermaid-modal-content svg {
  display: block;
  margin: 0 auto;
  max-width: 100%;
  max-height: 90vh;
  height: auto;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
