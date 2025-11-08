import type { AWS } from '@serverless/typescript';

import fetchNumbers from '@functions/fetchNumbers';

const serverlessConfiguration: AWS = {
  service: 'numbers-api',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },

    vpc: {
      securityGroupIds: [{ 'Fn::GetAtt': ['LambdaSecurityGroup', 'GroupId'] }],
      subnetIds: '${self:custom.subnetIds}' as any
    },
  },
  functions: { fetchNumbers },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node24',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    vpcId: '${ssm:/numbers-api/${opt:stage, "dev"}/vpc-id}',
    subnetIds: '${ssm:/numbers-api/${opt:stage, "dev"}/subnet-ids}'
  },
  resources: {
    Resources: {
      LambdaSecurityGroup: {
        Type: 'AWS::EC2::SecurityGroup',
        Properties: {
          GroupDescription: 'Security group for Lambda functions to access Redis',
          VpcId: '${self:custom.vpcId}',
          SecurityGroupIngress: [
            {
              IpProtocol: 'tcp',
              FromPort: 6379,
              ToPort: 6379,
              CidrIp: '0.0.0.0/0',
            },
          ],
        },
      },
      RedisSecurityGroup: {
        Type: 'AWS::EC2::SecurityGroup',
        Properties: {
          GroupDescription: 'Security group for Redis cluster',
          VpcId: '${self:custom.vpcId}',
          SecurityGroupIngress: [
            {
              IpProtocol: 'tcp',
              FromPort: 6379,
              ToPort: 6379,
              SourceSecurityGroupId: { 'Fn::GetAtt': ['LambdaSecurityGroup', 'GroupId'] },
            },
          ],
        },
      },
      RedisCluster: {
        Type: 'AWS::ElastiCache::ReplicationGroup',
        Properties: {
          ReplicationGroupId: `redis-cluster-${process.env.STAGE || 'dev'}`,
          Engine: 'redis',
          EngineVersion: '7.0', // Specify Redis version 7.x
          CacheNodeType: 'cache.t3.micro',
          NumCacheClusters: 1, // You can increase this if you want multi-node Redis
          AutoMinorVersionUpgrade: true,
          CacheParameterGroupName: 'default.redis7',
          ReplicationGroupDescription: 'Redis cluster for numbers-api',
          AutomaticFailoverEnabled: false,
          SecurityGroupIds: [{ 'Fn::GetAtt': ['RedisSecurityGroup', 'GroupId'] }],
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
