const { RekognitionDriver } = require('../../../libs/aws/rekognition/driver')

class ProductImageRepo {
  /**
   * @type {this}
   */
  static #instance

  /**
   * @return {ProductImageRepo}
   */
  static get instance() {
    if (!(this.#instance && this.#instance instanceof ProductImageRepo)) {
      this.#instance = new ProductImageRepo()
    }

    return this.#instance
  }

  #THRESHOLD_CONFIDENCE = 70

  async inferProductLabel(s3ObjectKey) {
    const inferred = await RekognitionDriver.instance.detectCustomLabel(s3ObjectKey)

    return inferred.filter(item => item.Confidence >= this.#THRESHOLD_CONFIDENCE).map(item => item.Name)
  }
}

module.exports = { ProductImageRepo }
