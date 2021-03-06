const { OrderRepo } = require('./repo/order.repo')
const { Order } = require('./model/order')
const { OrderStatus } = require('./model/order-status')
const { OrderDetail } = require('./model/order-detail')

/**
 * Get order by ID
 *
 * @param {string} customerId
 * @param {string} orderId
 * @return {Promise<Object>}
 */
exports.getOrderById = async (customerId, orderId) => {
  const order = await OrderRepo.instance.get(customerId, orderId)
  verifyExisting(orderId, order)

  return order.JSON
}

/**
 * Get by CustomerId
 *
 * @param {string} customerId
 * @return {Promise<Object[]>}
 */
exports.getOrdersByCustomerId = async (customerId) => {
  const orders = await OrderRepo.instance.getByCustomerId(customerId)

  return orders.map(order => order.JSON)
}

/**
 * Checkout
 *
 * @param {string} customerId
 * @param {Object[]} cart
 * @return {Promise<Object>}
 */
exports.checkOut = async (customerId, cart) => {
  const order = new Order({
    status: OrderStatus.CHECKED_OUT,
    customerId
  })
  order.append(...cart.map(item => new OrderDetail(item)))

  await OrderRepo.instance.save(order)

  return order.JSON
}

/**
 * Make the payment
 *
 * @param {string} customerId
 * @param {string} orderId
 * @return {Promise<Object>}
 */
exports.pay = async (customerId, orderId) => {
  const order = await OrderRepo.instance.get(customerId, orderId)
  verifyExisting(orderId, order)
  order.pay()
  await OrderRepo.instance.save(order)

  return order.JSON
}


/**
 * Cancel the order
 *
 * @param {string} customerId
 * @param {string} orderId
 * @return {Promise<Object>}
 */
exports.cancel = async (customerId, orderId) => {
  const order = await OrderRepo.instance.get(customerId, orderId)
  verifyExisting(orderId, order)
  order.cancel()
  await OrderRepo.instance.save(order)

  return order.JSON
}


/**
 * Confirm and complete the order
 *
 * @param {string} customerId
 * @param {string} orderId
 * @return {Promise<Object>}
 */
exports.confirm = async (customerId, orderId) => {
  const order = await OrderRepo.instance.get(customerId, orderId)
  verifyExisting(orderId, order)
  order.cancel()
  await OrderRepo.instance.save(order)

  return order.JSON
}

function verifyExisting(orderId, order) {
  if (!order) {
    throw new Error(`Order id ${orderId} does not exist`)
  }
}
