const {assert} = require('chai')

describe('RekognitionDriver', () => {
  describe('driver', () => {
    const { RekognitionDriver } = require('../../../src/libs/aws/rekognition/driver')

    describe('detectCustomLabel', () => {
      it('should detect nothing when image does not contain feature', async () => {
        const result = await RekognitionDriver.instance.detectCustomLabel('uploads/fe1a0a7f-39ac-4955-8db3-84be334f6c8a')
        console.log(result)

        assert.isNotEmpty(result)
      }).timeout(5000)
    })
  })
})
