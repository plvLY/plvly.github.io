export default defineNuxtPlugin(async nuxtApp => {
  // 在Vue实例挂载后添加百度统计脚本
  const ips = useState('ips', () => [])
  const ipFetch = await fetch('https://api.ipify.org?format=json');
  const { ip } = await ipFetch.json();
  ips.value.push(ip)
  // const { isClient, isServer } = use
  // console.log(isClient,isServer)
  // if(process.server){
  //   console.log(ip,ips.value.length)
  // }else{
  //   console.log(ip)
  // }

})