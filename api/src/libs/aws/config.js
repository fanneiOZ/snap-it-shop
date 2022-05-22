const aws = require('aws-sdk')
const { Config } = require('aws-sdk')
const { ConfigProvider } = require('../config/provider')

exports.setupAws = () => {
  const { aws: awsConfig } = ConfigProvider.instance.values
  aws.config.update(new Config({
    credentials: {
      secretAccessKey: awsConfig.secretAccessKey,
      accessKeyId: awsConfig.accessKeyId,
    },
  }))
}
