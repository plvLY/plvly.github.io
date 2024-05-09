export default defineNuxtPlugin(nuxtApp => {
    // 在Vue实例挂载后添加百度统计脚本
    nuxtApp.hook('app:mounted',() => {
        const hm = document.createElement('script')
        hm.src = 'https://hm.baidu.com/hm.js?4a47a6a60103f0fdc4fe28035cef97c0'
        const s = document.getElementsByTagName('script')[0]
        s.parentNode.insertBefore(hm, s)
    })
})