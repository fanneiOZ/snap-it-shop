const { DDBDriver } = require('../../../libs/aws/dynamodb/driver')
const { Order } = require('../model/order')

class OrderRepo {
  /**
   * @type {OrderRepo}
   */
  static #instance = undefined

  static get instance() {
    if (!(this.#instance && this.#instance instanceof OrderRepo)) {
      this.#instance = new OrderRepo()
    }

    return this.#instance
  }

  static entityFactory(dbState) {
    return new Order({
      customerId: dbState.hk,
      id: dbState.rk,
      status: dbState['status'],
      details: dbState['details'],
      totalAmount: dbState['total_amount'],
      createdAt: dbState['created_at'],
      updatedAt: dbState['updated_at']
    })
  }

  /**
   * @param {Order} order
   */
  static dbStateFactory(order) {
    const obj = order.JSON

    return {
      hk: obj.customerId,
      rk: obj.id,
      status: obj.status,
      details: obj.details,
      total_amount: obj.totalAmount,
      created_at: obj.createdAt,
      updated_at: obj.updatedAt
    }
  }

  constructor() {
    this.tableName = 'orders'
  }

  async get(customerId, orderId) {
    const item = await DDBDriver.instance.get(this.tableName, customerId, orderId)

    return OrderRepo.entityFactory(item)
  }

  async save(order) {
    await DDBDriver.instance.save(this.tableName, OrderRepo.dbStateFactory(order))
  }
}

module.exports = { OrderRepo }
