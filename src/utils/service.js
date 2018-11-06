export default {
  development: {
    api: 'http://192.168.16.174:8080',
    imageServer: 'http://192.168.6.171:8081',
    debug: true,
    cdn: ''
  },
  test: {
    api: '',
    imageServer: '',
    debug: false,
    cdn: ''
  },
  uat: {
    api: '',
    imageServer: '',
    debug: false,
    cdn: ''
  },
  qat: {
    api: 'http://172.16.14.85:8888',
    imageServer: 'http://172.16.14.85:1210',
    debug: false,
    cdn: ''
  },
  prod: {
    api: 'http://192.168.16.174:8080',
    imageServer: '',
    debug: false,
    cdn: 'http://portal.weherepost.com/client/clientv0.26'
  }
};
