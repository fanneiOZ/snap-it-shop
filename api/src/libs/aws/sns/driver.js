const { SNS } = require('aws-sdk')
const AWS = require('aws-sdk')

class SNSDriver {
  static #instance = undefined

  static get instance() {
    if (!(this.#instance && this.#instance instanceof SNSDriver)) {
      this.#instance = new SNSDriver('arn:aws:sns:us-west-2:839956791745:inferred-product')
    }

    return this.#instance
  }

  #SNS = undefined
  #topicArn = ''
  #platformAppArn = ''

  constructor(topicArn) {
    this.#SNS = new SNS({ apiVersion: '2010-03-31', region: 'us-west-2' })
    this.#topicArn = topicArn
    this.#platformAppArn = 'arn:aws:sns:us-west-2:839956791745:app/GCM/snap-it-shop-fcm'
  }

  async checkTopic() {
    return await this.#SNS.listTopics().promise()
  }

  async publish(target, message) {
    //{
    //   "GCM":"{ \"notification\": { \"body\": \"Sample message for Android endpoints\", \"title\":\"TitleTest\" } }"
    // }
    const params = { Message: message, TopicArn: this.#topicArn, TargetArn: target }
    return await this.#SNS.publish(params).promise()
  }

  async push(target, notification) {
    const params = { Message: message, TopicArn: this.#topicArn, TargetArn: target }
    return await this.#SNS.publish(params).promise()
  }

  async registerDeviceToken(token, customUserData = {}) {
    const params = {
      PlatformApplicationArn: this.#platformAppArn,
      Token: token,
      CustomUserData: JSON.stringify(customUserData),

    }

    return await this.#SNS.createPlatformEndpoint(params).promise()
  }
}

module.exports = { SNSDriver }
