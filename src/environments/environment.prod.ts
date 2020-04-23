/**
 * This file defines the variables needed for the application to work
 * in *production*
 */
import configurationInterface from './configurationInterface';

const envconf: configurationInterface = {
  production: true,
  baseCookieDomain: 'slydeck.io',
  //StripeClient: Stripe('pk_live_y2fIAEP86DorjK7Q9TxoqDkD009uIv41EC'),

  AwsApiId: '754mkar96b',
  AwsRegion: 'us-west-2',
  CognitoClientId: '1ao7t3qt39b1rnq0rrnsqukgm',
  CognitoIdentityPoolId: 'us-west-2:fbffd849-1d30-4186-b1a6-f0414f0b5eb5',
  CognitoUserPoolId: 'us-west-2_vqv7IVKl3',
  OriginalFilesBucketName: 'slydeck-production-stack-originalfilesbucket-1dacfopitkzyn',
  StageName: 'Production',
  UnauthWebsocketApiId: 'aynvi40x5e',
  UserFilesBucketName: 'slydeck-production-stack-userfilesbucket-15tyzhmg9ue4h'
};

export const environment: configurationInterface = {
  BaseApiUrl: `https://${envconf.AwsApiId}.execute-api.${envconf.AwsRegion}.amazonaws.com/${envconf.StageName}/`,
  UnauthWebSocketURL: `wss://${envconf.UnauthWebsocketApiId}.execute-api.${envconf.AwsRegion}.amazonaws.com/${envconf.StageName}`,
  CognitoLoginProviderURL: `cognito-idp.${envconf.AwsRegion}.amazonaws.com/${envconf.CognitoUserPoolId}`,
  ...envconf
};
