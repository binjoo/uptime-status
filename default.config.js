export default {
  /**
   * 应用名称
   */
  title: 'Uptime Status',
  /**
   * 代理地址
   */
  proxyUrl: 'https://api.uptimerobot.com/v2',
  /**
   * API Key
   */
  apiKey: '',
  /**
   * 自动刷新时间（分钟）
   * 推荐默认时间，不建议频率过快
   */
  refresh: 5,
  links: [
    {
      title: 'Blog',
      url: 'https://digu.plus'
    },
    {
      title: 'Github',
      url: 'https://github.com/binjoo/uptime-status'
    }
  ],
  /**
   * 监控列表
   */
  monitors: [],
  /**
   * 统计天数
   * 建议填写大于30
   */
  days: 90,
  /**
   * 响应图表
   */
  chart: true,
};