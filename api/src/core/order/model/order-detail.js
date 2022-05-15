const { Money } = require('../../product/model/money')

class OrderDetail {
  constructor({ id, quantity, basePrice, updatedAt }) {
    this.componentId = id
    this.quantity = quantity
    this.basePrice = Money.createFromJson(basePrice)
    this.updatedAt = new Date(updatedAt)
  }

  get JSON() {
    return {
      id: this.componentId,
      quantity: this.quantity,
      basePrice: this.basePrice.JSON,
      updatedAt: this.updatedAt.getTime(),
    }
  }
}

module.exports = { OrderDetail }
