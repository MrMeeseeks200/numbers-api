import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'fetch-numbers',
      },
    },
  ],
  environment: {
    REDIS_HOST: { 'Fn::GetAtt': ['RedisCluster', 'PrimaryEndPoint.Address'] },
    REDIS_PORT: { 'Fn::GetAtt': ['RedisCluster', 'PrimaryEndPoint.Port'] },
  },
};
