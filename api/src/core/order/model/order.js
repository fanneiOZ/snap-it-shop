const { OrderStatus } = require('./order-status')
const { OrderDetail } = require('./order-detail')
const { Money } = require('../../product/model/money')
const { IdGen } = require('../../../../tests/libs/utils/id-gen')

class Order {
  constructor({ id, status, details, createdAt, updatedAt, totalAmount, customerId }) {
    if (!(customerId && status)) {
      throw new Error('Missing required fields: customerId and status')
    }

    this.customerId = customerId
    this.status = new OrderStatus(status)
    this.id = id ?? IdGen.generate('O', 6)
    this.details = details ? details.map(detail => new OrderDetail(detail)) : []
    this.createdAt = createdAt ? new Date(createdAt) : new Date()
    this.updatedAt = updatedAt ? new Date(updatedAt) : new Date()
    this.totalAmount = totalAmount ? Money.createFromJson(totalAmount) : new Money('THB', '00')
  }

  get JSON() {
    return {
      id: this.id,
      status: this.status.JSON,
      details: this.details.map(detail => detail.JSON),
      createdAt: this.createdAt.getTime(),
      updatedAt: this.updatedAt.getTime(),
      totalAmount: this.totalAmount.JSON,
      customerId: this.customerId,
    }
  }

  append(...details) {
    this.details = this.details.concat(details)

    return this
  }

  removeDetailAt(i) {
    if (i + 1 > this.details.length) {
      throw new Error(`No detail at index ${i}`)
    }
    this.details = [ ...this.details.slice(0, i), ...this.details.slice(i + 1)]

    return this
  }

  calculateTotal() {
    this.totalAmount = Money.sum(...this.details.map(detail => detail.basePrice.multiply(detail.quantity)))

    return this
  }

  cancel() {
    if (this.status.is(OrderStatus.CHECKED_OUT)) {
      this.status = OrderStatus.CANCELLED
      this.updatedAt = new Date()

      return this
    }

    throw new Error('Unable to cancel order')
  }

  confirm() {
    if (this.status.is(OrderStatus.DELIVERED)) {
      this.status = OrderStatus.COMPLETED
      this.updatedAt = new Date()

      return this
    }

    throw new Error('Unable to confirm order')
  }

  pay() {
    if (this.status.is(OrderStatus.CHECKED_OUT)) {
      this.status = OrderStatus.PLACED
      this.updatedAt = new Date()

      return this
    }

    throw new Error('Unable to place order')
  }
}

module.exports = { Order }
