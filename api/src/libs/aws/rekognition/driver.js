const { Rekognition } = require('aws-sdk')

class RekognitionDriver {
  /**
   * @type {RekognitionDriver}
   */
  static #instance = undefined

  static get instance() {
    if (!(this.#instance && this.#instance instanceof RekognitionDriver)) {
      this.#instance = new RekognitionDriver()
    }

    return this.#instance
  }

  /**
   * @type {Rekognition}
   */
  #rekognition = undefined
  #imageBucketName = '2110524-snap-it-shop-images'
  #projectVersionArn = 'arn:aws:rekognition:us-west-2:839956791745:project/snap-it-shop/version/snap-it-shop.2022-04-24T22.48.33/1650815313343'

  constructor() {
    this.#rekognition = new Rekognition({ apiVersion: '2016-06-27', region: 'us-west-2' })
  }

  async detectCustomLabel(imageKey) {
    const promise = await this.#rekognition.detectCustomLabels({
        Image: { S3Object: { Bucket: this.#imageBucketName, Name: imageKey } },
        ProjectVersionArn: this.#projectVersionArn
      })
      .promise()

    return promise.CustomLabels
  }
}

module.exports = { RekognitionDriver }

