export const amplifyConfig = {
  Auth: {
    Cognito: {
      region: 'REGION',
      userPoolId: 'USER_POOL_ID',
      userPoolClientId: 'USER_POOL_CLIENT_ID',
      oauth: {
        domain: 'COGNITO_DOMAIN',
        scope: ['phone', 'openid', 'email'],
        responseType: 'code',
        redirectSignIn: 'APP_REDIRECT_SIGNIN',
        redirectSignOut: 'APP_REDIRECT_SIGNOUT',
      }
    }
  }
}; 