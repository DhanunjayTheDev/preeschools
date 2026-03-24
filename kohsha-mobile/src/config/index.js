const ENV = {
  development: {
    API_URL: 'http://192.168.1.21:5000/api',
    BASE_URL: 'http://192.168.1.21:5000',
  },
  staging: {
    API_URL: 'https://staging-api.kohsha.com/api',
    BASE_URL: 'https://staging-api.kohsha.com',
  },
  production: {
    API_URL: 'https://api.kohsha.com/api',
    BASE_URL: 'https://api.kohsha.com',
  },
};

// Change this to 'staging' or 'production' when deploying
const CURRENT_ENV = __DEV__ ? 'development' : 'production';

export const config = {
  ...ENV[CURRENT_ENV],
  APP_NAME: 'Kohsha Academy',
  VERSION: '1.0.0',
};

export default config;
