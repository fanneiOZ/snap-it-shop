const { Money } = require('../../product/model/money')

class ComponentType {
  static get PRODUCT() {
    return 'product'
  }

  static get ADDON() {
    return 'addon'
  }
}

class OrderDetail {
  constructor({ id, quantity, basePrice, updatedAt, componentType }) {
    this.componentId = id
    this.componentType = componentType
    this.quantity = quantity
    this.basePrice = Money.createFromJson(basePrice)
    this.updatedAt = updatedAt ? new Date(updatedAt) : new Date()
  }

  get JSON() {
    return {
      id: this.componentId,
      quantity: this.quantity,
      componentType: this.componentType,
      basePrice: this.basePrice.JSON,
      updatedAt: this.updatedAt.getTime(),
    }
  }

  get subtotal() {
    return this.basePrice.multiply(this.quantity)
  }
}

module.exports = { OrderDetail, ComponentType }
