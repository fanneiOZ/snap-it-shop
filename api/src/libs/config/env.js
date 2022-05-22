const dotenv = require('dotenv')
const path = require('path')
const fs = require('fs')

exports.loadEnvConfig = () => {
  const configPath = path.resolve(
    process.cwd(),
    fs.existsSync(path.resolve(process.cwd(), 'config')) ? '' : 'src',
  )
  const envFile = path.resolve(configPath, 'config/.env')
  if (!fs.existsSync(envFile)) {
    fs.copyFileSync(path.resolve(configPath, 'config', '.env.example'), envFile)
  }

  dotenv.config({
    path: path.resolve(
      process.cwd(),
      fs.existsSync(path.resolve(process.cwd(), 'config')) ? '' : 'src',
      'config/.env',
    ),
    override: true,
  })
}

exports.mapEnvConfig = () => {
  return {
    aws: {
      region: process.env['AWS_REGION'],
      s3: {
        bucket: process.env['S3_BUCKET_NAME'],
      },
      cognito: {
        clientId: process.env['COGNITO_CLIENT_ID'],
        userPoolId: process.env['COGNITO_USER_POOL_ID'],
      },
      sns: {
        topic: process.env['SNS_TOPIC_ARN'],
      },
      rekognition: {
        projectVersionArn: process.env['REKOGNITION_PROJECT_VERSION_ARN'],
      },
    },
  }
}
