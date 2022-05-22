const { CognitoIdentityServiceProvider } = require('aws-sdk')
const { ConfigProvider } = require('../../config/provider')

class CognitoDriver {
  /**
   * @type {CognitoDriver}
   */
  static #instance

  static get instance() {
    if (!this.#instance) {
      const { aws: awsConfig } = ConfigProvider.instance.values
      this.#instance = new CognitoDriver(awsConfig.cognito.clientId, awsConfig.cognito.userPoolId)
    }

    return this.#instance
  }

  /**
   * @type {CognitoIdentityServiceProvider}
   */
  #cognito
  #clientId
  #userPoolId

  constructor(clientId, userPoolId) {
    this.#cognito = new CognitoIdentityServiceProvider({ region: 'us-west-2', apiVersion: '2016-04-18' })
    this.#clientId = clientId
    this.#userPoolId = userPoolId
  }

  async signUp({ username, email, fullName, password }) {
    let userDoesExisted = true
    try {
      await this.#cognito
        .adminGetUser({ UserPoolId: this.#userPoolId, Username: username })
        .promise()
    } catch (e) {
      userDoesExisted = false
    }
    if (userDoesExisted) {
      throw new Error(`Requesting username ${username} already existed.`)
    }

    const signUpParams = {
      ClientId: this.#clientId,
      Password: password,
      UserAttributes: [
        { Name: 'name', Value: fullName },
        { Name: 'email', Value: email },
      ],
      Username: username,
    }

    return await this.#cognito.signUp(signUpParams).promise()
  }

  async confirmEmail({ username, verificationCode }) {
    const params = {
      ClientId: this.#clientId,
      Username: username,
      ConfirmationCode: verificationCode,
    }

    return await this.#cognito.confirmSignUp(params).promise()
  }
}

module.exports = { CognitoDriver }
