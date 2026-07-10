// uno.config.ts
import {
    defineConfig,
    presetUno,
    presetIcons,
    presetAttributify,
    presetWebFonts,
    transformerDirectives
} from 'unocss'

export default defineConfig({
    shortcuts: [
        {
            'bg-base': 'bg-[var(--c-bg)]',
            'bg-surface': 'bg-[var(--c-surface)]',
            'border-base': 'border-[var(--c-border)]',
            'container-main': 'max-w-240 mx-auto px-5 md:px-8 py-10',
            'container-wide': 'max-w-300 mx-auto px-5 md:px-8 py-10',
        },
        [/^btn-(\w+)$/, ([_, color]) => `op50 px2.5 py1 transition-all duration-200 ease-out no-underline! hover:(op100 text-${color} bg-${color}/10) border border-base! rounded`],
    ],
    theme: {
        colors: {
            'brand': {
                'primary': 'hsl(217, 65%, 55%)',
                'subtle': 'hsl(217, 65%, 55% / 0.08)',
            },
            'surface': {
                DEFAULT: 'var(--c-surface)',
                hover: 'var(--c-surface-hover)',
                elevated: 'var(--c-surface-elevated)',
            },
        },
    },
    rules: [
        [/^slide-enter-(\d+)$/, ([_, n]) => ({
            '--enter-stage': n,
        })],
        [/^text-(.*)$/, ([, c], { theme }) => {
            if (theme.colors[c])
                return { color: theme.colors[c] }
        }],
    ],
    presets: [
        presetIcons({
            extraProperties: {
                'display': 'inline-block',
                'height': '1.2em',
                'width': '1.2em',
                'vertical-align': 'text-bottom',
            },
        }),
        presetAttributify(),
        presetUno(),
        presetWebFonts({
            provider: 'none',
            fonts: {
                sans: 'Inter:400,600,800',
                mono: 'DM Mono:400,600',
                condensed: 'Roboto Condensed',
                wisper: 'Bad Script',
            },
        }),
    ],
    transformers: [
        transformerDirectives(),
    ],
    safelist: [
        'i-ri-menu-2-fill',
        'container-main',
        'container-wide',
        'i-mdi-cellphone-cog',
        'i-mdi-sparkles',
        'i-mdi-folder-text',
        'i-mdi-folder',
    ],
})