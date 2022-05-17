const { ProductImageRepo } = require('./repo/product-image.repo')
const { ProductRepo } = require('./repo/product.repo')

exports.scanProduct = async (customerId, imageKey) => {
  const labelList = await ProductImageRepo.instance.inferProductLabel(imageKey)
  const fetchProductPromises = labelList.map(ProductRepo.instance.get)

  return (await Promise.all(fetchProductPromises)).map(product => product.JSON)
}

exports.listProducts = async () => {
  const products = await ProductRepo.instance.getAll()

  return products.map(product => product.JSON)
}

exports.getById = async (productId) => {
  const product = await ProductRepo.instance.get(productId)

  return product.JSON
}
