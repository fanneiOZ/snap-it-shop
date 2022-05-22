const proxyquire = require('proxyquire')
const sinon = require('sinon')
const { assert } = require('chai')

describe('CognitoDriver', () => {
  describe('Static factory', () => {
    let i = 0

    class MockSNS {
      constructor() {
        this.i = ++i
      }
    }

    it('should main singleton properties', () => {
      const { CognitoDriver } = proxyquire('../../../src/libs/aws/cognito/driver', {
        'aws-sdk': { SNS: MockSNS },
      })

      const a = CognitoDriver.instance
      const b = CognitoDriver.instance

      assert.strictEqual(i, 1)
      assert.instanceOf(a, CognitoDriver)
      assert.instanceOf(b, CognitoDriver)
      assert.deepEqual(a, b)
    })
  })

  describe('instance', () => {
    const { CognitoDriver } = require('../../../src/libs/aws/cognito/driver')

    describe('signup', () => {
      it('should work', async () => {
        const output = await CognitoDriver.instance.signUp({
          username: 'fanneiOZ01',
          email: 'test@abc.com',
          fullName: 'John Doe',
          password: 'password'
        })

        console.log(output)
      }).timeout(5000)
    })

    describe('confirm', () => {
      it('should work', async () => {
        const output = await CognitoDriver.instance.confirmEmail({
          username: 'fanneiOZ',
          verificationCode: '756096',
        })

        console.log(output)
      }).timeout(5000)
    })
  })
})
