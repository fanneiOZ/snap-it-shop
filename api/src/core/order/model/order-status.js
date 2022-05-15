class OrderStatus {
  static get CHECKED_OUT() {
    return new OrderStatus('checked-out')
  }

  static get PLACED() {
    return new OrderStatus('placed')
  }

  static get DELIVERED() {
    return new OrderStatus('delivered')
  }

  static get COMPLETED() {
    return new OrderStatus('completed')
  }

  static get CANCELLED() {
    return new OrderStatus('cancelled')
  }

  static get REFUNDED() {
    return new OrderStatus('refunded')
  }

  constructor(status) {
    this.status = status
  }

  get JSON() {
    return this.status
  }

  /**
   * @param {OrderStatus} status
   * @return {boolean}
   */
  is(...status) {
    return status.some(value => value.status.JSON === this.status.JSON)
  }
}

module.exports = { OrderStatus }
