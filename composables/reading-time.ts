function calcMinutes(text: string): number {
  const chinese = (text.match(/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/g) || []).length
  const latin = text
    .replace(/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/g, ' ')
    .split(/\s+/)
    .filter(w => /[a-zA-Z]/.test(w))
    .length
  return Math.max(Math.ceil(chinese / 300 + latin / 200), 1)
}

export function estimateReadingTime(raw: string): string {
  const body = raw
    .replace(/^---[\s\S]*?---\n*/m, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_~`>|]/g, '')
    .replace(/^[-+*]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/\n{2,}/g, '\n')
    .trim()
  return `${calcMinutes(body)}min`
}

type AstNode =
  | { type: 'text'; value: string }
  | { type: 'element'; tag?: string; children?: AstNode[] }
  | { type: 'root'; children?: AstNode[] }
  | { [key: string]: unknown }

export function extractText(node: AstNode): string {
  if (node.type === 'text' && 'value' in node) return node.value
  if ('children' in node && Array.isArray(node.children)) {
    return node.children.map(extractText).join(' ')
  }
  return ''
}

export function estimateReadingTimeFromText(text: string): string {
  return `${calcMinutes(text)}min`
}

export function injectDuration(body: string): string {
  const fm = body.match(/^---\n([\s\S]*?)\n---\n*/)
  if (!fm) return body

  const duration = estimateReadingTime(body)
  const frontmatter = fm[1]
  const hasDuration = /^duration:/m.test(frontmatter)

  const newFrontmatter = hasDuration
    ? frontmatter.replace(/^duration:.*$/m, `duration: ${duration}`)
    : frontmatter + `\nduration: ${duration}`

  return body.replace(fm[0], `---\n${newFrontmatter}\n---\n\n`)
}
