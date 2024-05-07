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
            'bg-base': 'bg-white dark:bg-black',
            'border-base': 'border-[#8884]',
        },
        [/^btn-(\w+)$/, ([_, color]) => `op50 px2.5 py1 transition-all duration-200 ease-out no-underline! hover:(op100 text-${color} bg-${color}/10) border border-base! rounded`],
    ],
    theme: {
        // ...
        colors: {
            'veryCool': '#0000ff', // class="text-very-cool"
            'brand': {
                'primary': 'hsl(var(--hue, 217) 78% 51%)', //class="bg-brand-primary"
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
    ],
})