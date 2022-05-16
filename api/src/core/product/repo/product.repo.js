const { DDBDriver } = require('../../../libs/aws/dynamodb/driver')
const { Product } = require('../model/product')

class ProductRepo {
  /**
   * @type {ProductRepo}
   */
  static #instance = undefined

  static get instance() {
    if (!(this.#instance && this.#instance instanceof ProductRepo)) {
      this.#instance = new ProductRepo()
    }

    return this.#instance
  }

  static entityFactory(dbState) {
    if (!dbState) return undefined

    return new Product({
      customerId: dbState.hk,
      id: dbState.rk,
      name: dbState['name'],
      barcode: dbState['barcode'],
      price: dbState['price'],
    })
  }

  /**
   *
   * @param {Product} product
   */
  static dbStateFactory(product) {
    const obj = product.JSON

    return {
      hk: ProductRepo.partitionKey,
      rk: obj.id,
      name: obj.name,
      barcode: obj.barcode,
      price: obj.price,
    }
  }

  static partitionKey = 'store'

  constructor() {
    this.tableName = 'products'
  }

  async get(productId) {
    const item = await DDBDriver.instance.get(this.tableName, ProductRepo.partitionKey, productId)

    return ProductRepo.entityFactory(item)
  }

  async getAll() {
    const items = await DDBDriver.instance.getByPartitionKey(this.tableName, ProductRepo.partitionKey)

    return items.map(ProductRepo.entityFactory)
  }

  async save(product) {
    await DDBDriver.instance.save(this.tableName, ProductRepo.dbStateFactory(product))
  }
}
