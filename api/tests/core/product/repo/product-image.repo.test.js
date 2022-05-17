const { ProductImageRepo } = require('../../../../src/core/product/repo/product-image.repo')

describe('Product Image Repo', () => {
  it('should infer image', async () => {
    const result = await ProductImageRepo.instance.inferProductLabel('uploads/fe1a0a7f-39ac-4955-8db3-84be334f6c8a')

    console.log(result)
  }).timeout(5000)
})
