const {assert} = require('chai')

describe('RekognitionDriver', () => {
  describe('driver', () => {
    const { RekognitionDriver } = require('../../../src/libs/aws/rekognition/driver')
    describe('detectCustomLabel', () => {
      it('should detect nothing when image does not contain feature', async () => {
        const result = await RekognitionDriver.instance.detectCustomLabel('uploads/IMG_9705.jpg')

        assert.isEmpty(result)
      }).timeout(5000)
    })
  })
})
