export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/park/index',
    'pages/print-home/index',
    'pages/profile/index',
    'pages/onboarding/index'
  ],
  subPackages: [
    {
      root: 'packageGame',
      pages: [
        'pages/oral/index',
        'pages/flashcard/index',
        'pages/garden-exchange/index'
      ]
    },
    {
      root: 'packagePrint',
      pages: [
        'pages/params/index',
        'pages/preview/index',
        'pages/done/index'
      ]
    },
    {
      root: 'packageReport',
      pages: [
        'pages/report/index',
        'pages/calendar/index',
        'pages/settings/index'
      ]
    }
  ],
  tabBar: {
    color: '#999999',
    selectedColor: '#FF8A3C',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      { pagePath: 'pages/home/index', text: '首页' },
      { pagePath: 'pages/park/index', text: '学习乐园' },
      { pagePath: 'pages/print-home/index', text: '打印小铺' },
      { pagePath: 'pages/profile/index', text: '个人中心' }
    ]
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FFF7EF',
    navigationBarTitleText: '趣狗乐学',
    navigationBarTextStyle: 'black'
  },
  lazyCodeLoading: 'requiredComponents'
})
