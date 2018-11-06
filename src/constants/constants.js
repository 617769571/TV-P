module.exports = {
  PATTERN: {
    tel: {
      'reg': '[^A-Za-z\u4e00-\u9fa5]{0,50}$',
      'msg': '请输入小于等于50个字符'
    },
    password: {
      'reg': '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$',
      'msg': '请输入一个包含数字和字母，长度8~16位的密码'
    },
    url: {
      'reg': '/^((?:http|ftp)s?:\/\/)(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::\d+)?(?:\/?|[\/?]\S+)$/i',
      'msg': '请输入正确网址，否则页面将无法跳转！'
    }
  },
  PAGE: {
    itemsPerPage: 20
  },
  POPUP: {
    itemsPerPage: 12
  },
  TAB: {
    itemsPerPage: 10
  },
  PERMISSIONS: [{
    id: 'HUIDA',
    name: '慧达'
  }, {
    id: 'CORP',
    name: '集团'
  }, {
    id: 'STORE',
    name: '门店'
  }],
  NOTIFICATION_ACTION: {
    CREATE: '版本新增',
    UPDATE: '内容更新',
    ENABLE: '版本恢复',
    DISABLE: '版本停用'
  },
  NOTIFICATION_ACTION_TARGET: {
    STORE_EDITION: '门店版本',
    ORGANIZATION_EDITION: '集团版本'
  },
  ROLES: [{
    permission: 'ADMIN',
    role: 'ADMIN',
    roleName: '系统管理员'
  }, {
    permission: 'HUIDA',
    role: 'HUIDA_OPERATOR',
    roleName: '慧达管理员'
  }, {
    permission: 'HUIDA',
    role: 'HUIDA_TECHNICIAN',
    roleName: '慧达技术员'
  }, {
    permission: 'HUIDA',
    role: 'HUIDA_SALES',
    roleName: '慧达销售'
  }, {
    permission: 'HUIDA',
    role: 'HUIDA_MARKET',
    roleName: '慧达运营'
  }, {
    permission: 'HUIDA',
    role: 'HUIDA_MAINTAIN',
    roleName: '慧达运维'
  }, {
    permission: 'HUIDA',
    role: 'HUIDA_WAITER',
    roleName: '慧达服务台'
  }, {
    permission: 'HUIDA',
    role: 'HUIDA_SCHEME',
    roleName: '慧达方案'
  }, {
    permission: 'HUIDA',
    role: 'HUIDA_PRODUCT',
    roleName: '慧达产品'
  }, {
    permission: 'CORP',
    role: 'CORP_OPERATOR',
    roleName: '集团管理员'
  }, {
    permission: 'CORP',
    role: 'CORP_MARKET',
    roleName: '运营'
  }, {
    permission: 'CORP',
    role: 'CORP_FINANCE',
    roleName: '财务'
  }, {
    permission: 'STORE',
    role: 'CORP_DISTRICT_MANAGER',
    roleName: '区域经理'
  }, {
    permission: 'STORE',
    role: 'STORE_MANAGER',
    roleName: '店长'
  }, {
    permission: 'STORE',
    role: 'STORE_CLERK',
    roleName: '运营'
  }, {
    permission: 'STORE',
    role: 'STORE_FINANCE',
    roleName: '财务'
  }],
  imageSize: {
    'APP_LARGE': {
      'width': 600,
      'height': 600,
      'size': '800KB'
    },
    'APP_BANNER': {
      'width': 900,
      'height': 300,
      'size': '800KB'
    },
    'APP_SMALL': {
      'width': 300,
      'height': 300,
      'size': '800KB'
    },
    'APP_NORMAL': {
      'width': 450,
      'height': 300,
      'size': '800KB'
    },
    'APP_SMALL_BANNER': {
      'width': 600,
      'height': 300,
      'size': '800KB'
    },
    'BACKGROUND': {
      'width': 2000,
      'height': 1300,
      'size': '1M'
    },
    'LOGO': {
      'width': 900,
      'size': '800KB'
    },
    'LOGO_SMALL': {
      'width': 300,
      height: '300',
      'size': '800KB'
    },
    'AD_IMAGE': {
      'width': 900,
      'size': '800KB'
    }
  },
  promptImage: {
    'APP_SMALL_BANNER': 'images/app_small_banner.png',
    'APP_SMALL': 'images/app_small.png',
    'APP_NORMAL': 'images/app_normal.png',
    'APP_BANNER': 'images/app_banner.png',
    'APP_LARGE': 'images/app_large.png',
    'BACKGROUND': 'images/background.png',
    'AD_IMAGE': 'images/ads.jpg',
    'LOGO': 'images/logo_ad.png'
  },
  CONTENT_TYPES: {
    APP: ['APP_LARGE', 'APP_BANNER', 'APP_SMALL', 'APP_NORMAL',
      'APP_SMALL_BANNER'
    ],
    PROMOTION: ['PROMOTION_LARGE', 'PROMOTION_BANNER', 'PROMOTION_SMALL',
      'PROMOTION_NORMAL', 'PROMOTION_SMALL_BANNER'
    ],
    LOGO: ['LOGO', 'LOGO_SMALL'],
    AD: ['AD_IMAGE'],
    BACKGROUND: ['BACKGROUND']
  },
  imageType: ['jpg', 'png', 'gif'],
  PAGES: {
    'login': {
      'name': '登录页',
      'url': '/portal_management/login_type_editor'
    },
    'mobileLogin': {
      'name': '手机号认证',
      'url': '/portal_management/login_page_editor',
      'previewState': 'portalManagement.portalPreview.loginPage',
      'editorState': 'portalManagement.loginPageEditor',
      'sliderInterval': 2000
    },
    'customizedLogin': {
      'name': '自定义认证',
      'url': '/portal_management/login_page_editor',
      'previewState': 'portalManagement.portalPreview.customizedLoginPage',
      'editorState': 'portalManagement.loginPageEditor',
      'sliderInterval': 2000
    },
    'wechatLogin': {
      'name': '微信登录页',
      'url': '/portal_management/wechat_login_page_editor',
      'previewState': 'portalManagement.portalPreview.wechatLoginPage',
      'editorState': 'portalManagement.wechatLoginPageEditor',
      'sliderInterval': 2000
    },
    'wxwifiLogin': {
      'name': '微信连Wi-Fi',
      'url': '/portal_management/wxwifi_login_page_editor',
      'previewState': 'portalManagement.portalPreview.wxwifiLoginPage',
      'editorState': 'portalManagement.wxwifiLoginPageEditor',
      'sliderInterval': 1000
    },
    'secfreeLogin': {
      'name': '二次免认证',
      'url': '/portal_management/secfree_login_page_editor',
      'previewState': 'portalManagement.portalPreview.secfreeLoginPage',
      'editorState': 'portalManagement.secfreeLoginPageEditor',
      'sliderInterval': 1000
    },
    'pmsLogin': {
      'name': 'PMS认证',
      'url': '/portal_management/pms_login_page_editor',
      'previewState': 'portalManagement.portalPreview.pmsLoginPage',
      'editorState': 'portalManagement.pmsLoginPageEditor',
      'sliderInterval': 2000
    },
    'freeLogin': {
      'name': '免认证',
      'url': '/portal_management/free_login_page_editor',
      'previewState': 'portalManagement.portalPreview.freeLoginPage',
      'editorState': 'portalManagement.freeLoginPageEditor',
      'sliderInterval': 2000
    },
    'advertisement': {
      'name': '广告页',
      'url': '/portal_management/middle_page_editor',
      'previewState': 'portalManagement.portalPreview.middlePage',
      'editorState': 'portalManagement.middlePageEditor'
    },
    'index': {
      'name': '首页',
      'url': '/portal_management/index_page_editor',
      'previewState': 'portalManagement.portalPreview.indexPage',
      'editorState': 'portalManagement.indexPageEditor',
      'sliderInterval': 2000
    }
  },
  ERRORS: {
    required: '此项为必填项',
    maxLength: function(maxNumber) {
      return '最长不超过' + maxNumber + '个字符'
    }
  },
  PAGES_DISPLAY_ITEMS: [{
    type: 'A',
    contents: [{
      name: '登录页',
      description: '可选择登录认证方式',
      previewImage: 'images/login_page_preview.jpg',
      pages: 'login'
    }, {
      name: '广告页',
      description: '可加入需要运营的广告图',
      previewImage: 'images/advertisement_page_preview.jpg',
      pages: 'advertisement'
    }, {
      name: '首页',
      description: '可加入多种应用、图片',
      previewImage: 'images/index_page_preview.jpg',
      pages: 'index'
    }]
  }, {
    type: 'B',
    contents: [{
      name: '登录页',
      description: '可选择登录认证方式',
      previewImage: 'images/login_page_preview.jpg',
      pages: 'login'
    }, {
      name: '首页',
      description: '可加入多种应用、图片',
      previewImage: 'images/index_page_preview.jpg',
      pages: 'index'
    }]
  }, {
    type: 'C',
    contents: [{
      name: '首页',
      description: '可加入多种应用、图片',
      previewImage: 'images/index_page_preview.jpg',
      pages: 'index'
    }, {
      name: '登录页',
      description: '可选择登录认证方式',
      previewImage: 'images/login_page_preview.jpg',
      pages: 'login'
    }]
  }, {
    type: 'D',
    contents: [{
      name: '登录页',
      description: '可选择登录认证方式',
      previewImage: 'images/login_page_preview.jpg',
      pages: 'login'
    }]
  }],
  APP_TYPE: [{
    value: 'LIFE',
    name: '生活类'
  }, {
    value: 'SOCIAL',
    name: '社交类'
  }, {
    value: 'TRAVEL',
    name: '旅游类'
  }, {
    value: 'GAME',
    name: '游戏类'
  }, {
    value: 'BUSINESS',
    name: '商务类'
  }, {
    value: 'ENTERTAINMENT',
    name: '娱乐类'
  }, {
    value: 'NEWS',
    name: '新闻类'
  }, {
    value: 'HEALTH',
    name: '医疗健康'
  }, {
    value: 'FINANCE',
    name: '金融理财'
  }, {
    value: 'TOOLS',
    name: '工具'
  }, {
    value: 'EDUCATION',
    name: '教育类'
  }],
  INDUSTRY: [{
    value: 'HOTEL',
    name: '酒店'
  }, {
    value: 'FINANCE',
    name: '金融'
  }, {
    value: 'FOOD',
    name: '餐饮'
  }, {
    value: 'GOVERNMENT',
    name: '政府'
  }, {
    value: 'SCENIC',
    name: '景区'
  }, {
    value: 'TRANSPORTATION',
    name: '交通'
  }, {
    value: 'ENTERTAINMENT',
    name: '娱乐'
  }, {
    value: 'HEALTH',
    name: '健康'
  }, {
    value: 'STORE',
    name: '商场'
  }, {
    value: 'CAR',
    name: '汽车'
  }, {
    value: 'EDUCATION',
    name: '教育'
  }, {
    value: 'COMPLEX',
    name: '综合'
  }, {
    value: 'OTHER',
    name: '其他'
  }],
  PARTNERSHIP_STATUS: [{
    name: '测试',
    value: 'TEST'
  }, {
    name: '演示',
    value: 'DEMO'
  }, {
    name: '试用',
    value: 'TRIAL'
  }, {
    name: '正式合作',
    value: 'FORMAL'
  }, {
    name: '暂停合作',
    value: 'PAUSE_RELATION'
  }, {
    name: '终止合作',
    value: 'STOP_RELATION'
  }],
  BUSINESS_TYPE: [{
    name: '数码房',
    value: 'DIGITAL_ROOM'
  }, {
    name: '门户',
    value: 'PORTAL'
  }, {
    name: 'OTT',
    value: 'OTT'
  }, {
    name: '智慧电视',
    value: 'SMART_TV'
  }],
  TEMPLATE_TYPE: [
    ['mobileLogin', '手机号认证'],
    ['wxwifiLogin', '微信连Wi-Fi'],
    ['customizedLogin', '自定义认证'],
    ['pmsLogin', 'PMS认证'],
    ['secfreeLogin', '二次免认证'],
    ['freeLogin', '免认证']
  ],
  ENTRANCE_PATH: {
    'template': '/entrance-template',
    'edition': '/entrance-edition',
    'store': '/store',
    'organization': '/organization'
  },
  PORTAL_EDITOR_PATH: {
    'template': '/entrance-template/{id}',
    'edition': '/entrance-edition/{id}/template',
    'store': '/store/{id}/entrance-edition',
    'store_sections': '/store/store/entrance-edition/template',
    'bulk_update_store_edition': '/entrance-edition/{id}/bulk-update-store-edition'
  },
  STATUS: {
    'ENABLED': '已启用',
    'DISABLED': '已禁用'
  },
  WHITE_LIST_TYPES: {
    'DEVICE': '设备',
    'WEB_PAGE': '网页'
  },
  STATUS_BUTTON: {
    'ENABLED': '禁用',
    'DISABLED': '启用'
  },
  ORG_ADMIN_PERMISSION: {
    'CORP_OPERATOR': '集团管理员',
    'CORP_MARKET': '运营',
    'CORP_FINANCE': '财务'
  },
  STORE_ADMIN_PERMISSION: {
    'STORE_MANAGER': '店长',
    'STORE_CLERK': '运营',
    'STORE_FINANCE': '财务'
  },
  API_PATH: {
    'EXCHANGE_STORE': '/exchange/store',
    'EXCHANGE_STORE_STATUS': '/exchange/store/status',
    'EXCHANGE_STORE_CLERK': '/exchange/clerk',
    'SYSTEM_ACCOUNT': '/system-account',
    'NOTIFICATION': '/notification/new',
    'PERSONAL': '/personal'
  },
  EXCHANGE: {
    TIME_STATUS: {
      'PENDING': '未开始',
      'ON_GOING': '进行中',
      'FINISHED': '已结束'
    }
  },
  LOGIN_ERROR: [{
    ERROR_STATUS: 401,
    ERROR_CODE: 'INVALID_ACCESS_TOKEN',
    ERROR_MESSAGE: '登录无效，请重新登录'
  }, {
    ERROR_STATUS: 403,
    ERROR_CODE: 'USER_CODE_DISABLED',
    ERROR_MESSAGE: '账号已禁用，请联系管理员'
  }, {
    ERROR_STATUS: 401,
    ERROR_CODE: 'VERIFY_CODE_ERROR',
    ERROR_MESSAGE: '验证码错误，请重新输入'
  }, {
    ERROR_STATUS: 401,
    ERROR_CODE: 'AUTHENTICATION_NOT_EXISTED',
    ERROR_MESSAGE: '用户名错误，请重新输入'
  }, {
    ERROR_STATUS: 401,
    ERROR_CODE: 'VERIFY_CODE_EXPIRE',
    ERROR_MESSAGE: '验证码已失效，请刷新后重试'
  }, {
    ERROR_STATUS: 403,
    ERROR_CODE: 'WRONG_PASSWORD',
    ERROR_MESSAGE: '密码错误，请重新输入'
  }, {
    ERROR_STATUS: 403,
    ERROR_CODE: 'TOKEN_CANCELED_BY_OTHERS',
    ERROR_MESSAGE: '该账号已在其他地方登录，请重试'
  }, {
    ERROR_STATUS: 403,
    ERROR_CODE: 'NOT_PERMITTED',
    ERROR_MESSAGE: '登录无效，请重新登录'
  }, {
    ERROR_STATUS: 403,
    ERROR_CODE: 'ACCOUNT_ROLE_NOT_ALLOW_LOGIN',
    ERROR_MESSAGE: '该账号未进行权限配置，请联系管理员'
  }, {
    ERROR_STATUS: 410,
    ERROR_CODE: 'TOKEN_EXPIRED',
    ERROR_MESSAGE: '登录已过期，请重新登录'
  }, {
    ERROR_STATUS: 403,
    ERROR_CODE: 'TOKEN_REVOKED',
    ERROR_MESSAGE: '密码被重置或账号信息变更，请重新登录'
  }, {
    ERROR_STATUS: 403,
    ERROR_CODE: 'NO_STORE_IN_MANAGEMENT',
    ERROR_MESSAGE: '请联系管理员添加管辖门店'
  }, {
    ERROR_STATUS: 403,
    ERROR_CODE: 'USER_POWER_CHANGE',
    ERROR_MESSAGE: '账号权限更新，请重新登录'
  }, {
    ERROR_STATUS: 403,
    ERROR_CODE: 'RESET_PASSWORD',
    ERROR_MESSAGE: '密码已重置，请重新登录'
  }],
  AUTH_TYPE: {
    'ACCOUNT': '自定义认证',
    'MOBILE': '手机号认证',
    'NO_AUTH': '免认证',
    'WECHATLOGIN': '微信一键Wi-Fi',
    'WE_CHAT_WIFI': '微信连Wi-Fi',
    'SECOND_NO_AUTH': '二次免认证'

  },
  TERMINAL: {
    'DESKTOP': 'PC',
    'MOBILE': '手机',
    'TABLET': '平板'
  },
  OPERATOR: {
    'CHINA_MOBILE': '移动',
    'CHINA_UNICOM': '联通',
    'CHINA_TELCOM': '电信',
    'VIRTUAL': '虚拟'
  },
  REPORT: {
    'DECIMAL_PLACE': 2
  }
}
