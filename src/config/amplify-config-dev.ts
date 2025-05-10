export const amplifyConfig = {
  Auth: {
    Cognito: {
      region: 'us-east-1',
      userPoolId: 'us-east-1_hnNI7XgTH',
      userPoolClientId: '72fcbj8ki3qthmt792mv2p73hi',
      oauth: {
        domain: '',
        scope: ['openid', 'email', 'phone','aws.cognito.signin.user.admin' ],
        responseType: 'code',
        redirectSignIn: 'myapp://callback',
        redirectSignOut: 'myapp://',
      }
    }
  }
}; 