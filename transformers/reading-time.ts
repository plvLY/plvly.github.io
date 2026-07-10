import { extractText, estimateReadingTimeFromText } from '../composables/reading-time'

export default {
  name: 'reading-time',
  extensions: ['.md'],
  transform(content: Record<string, unknown>) {
    if (!(content._id as string)?.startsWith('content:posts:')) return content
    const body = content.body as { type: string; children: unknown[] }
    const text = body?.children ? extractText(body) : ''
    content.duration = estimateReadingTimeFromText(text)
    return content
  }
}
