const proxyquire = require('proxyquire')
const sinon = require('sinon')
const { assert } = require('chai')

describe('SNSDriver', () => {
  describe('Static factory', () => {
    let i = 0

    class MockSNS {
      constructor() {
        this.i = ++i
      }
    }

    it('should main singleton properties', () => {
      const { SNSDriver } = proxyquire('../../../src/libs/aws/sns/driver', {
        'aws-sdk': { SNS: MockSNS },
      })

      const a = SNSDriver.instance
      const b = SNSDriver.instance

      assert.strictEqual(i, 1)
      assert.instanceOf(a, SNSDriver)
      assert.instanceOf(b, SNSDriver)
      assert.deepEqual(a, b)
    })
  })

  describe('instance', () => {
    const { SNSDriver } = require('../../../src/libs/aws/sns/driver')

    describe('checkTopic', () => {
      it('should work', async () => {
        const output = await SNSDriver.instance.checkTopic()

        console.log(output)
      })
    })

    describe('publish', () => {
      it('should work', async () => {
        const output = await SNSDriver.instance.publish('test message')

        console.log(output)
      })
    })

    describe('registerDeviceToken', () => {
      it('register', async () => {
        const output = await SNSDriver.instance.registerDeviceToken(
          'e4DhcIpCRAqpkQXnwSR3TT:APA91bH3Q6tYrttp6_CykAcuVj8v-FoEmPlNsX6d9X2hMC2KMtA-n2R36l4fJQV1Kja6ajbiY_3Fzq1YMyPx-hX2PXqvIyiDF915l7MRENeOscMTaiimQ6eAB5ruDPGRdYH2Z7JagWvB',
          {device: 'test-sertis-realme'}
        )

        console.log(output)
      })
    })
  })
})
