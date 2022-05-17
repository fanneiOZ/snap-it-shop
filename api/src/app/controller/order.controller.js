const orderUseCases = require('../../core/order/order.usecases')

/**
 * GET /orders
 *
 * @param identity
 * @return {Promise<{response: {orders: Object[]}, status: number}>}
 */
exports.getOrdersByCustomerId = async ({ identity }) => {
  const { 'cognito:username': customerId } = identity
  const orders = await orderUseCases.getOrdersByCustomerId(customerId)

  return { status: 200, response: { orders } }
}

/**
 * GET /orders/{id}
 *
 * @param params
 * @param identity
 * @return {Promise<{response: {order: Object}, status: number}>}
 */
exports.getOrderByOrderId = async ({ params, identity }) => {
  const { id } = params
  const { 'cognito:username': customerId } = identity
  const order = await orderUseCases.getOrderById('customer-id', id)

  return { status: 200, response: { order } }
}

/**
 * POST /orders/{id}/confirm
 *
 * @param params
 * @param identity
 * @return {Promise<{response: {order: Object}, status: number}>}
 */
exports.confirmOrder = async ({ params, identity }) => {
  const { id } = params
  const { 'cognito:username': customerId } = identity
  const order = await orderUseCases.confirm('customer-id', id)

  return { status: 200, response: { order } }
}

/**
 * POST /orders/{id}/cancel
 *
 * @param params
 * @param identity
 * @return {Promise<{response: {order: Object}, status: number}>}
 */
exports.cancelOrder = async ({ params, identity }) => {
  const { id: orderId } = params
  const { 'cognito:username': customerId } = identity
  const order = await orderUseCases.cancel(customerId, orderId)

  return { status: 200, response: { order } }
}

/**
 * POST /orders/checkout
 *
 * @param body
 * @param identity
 * @return {Promise<{response: {order: Object} | Object, status: number}>}
 */
exports.checkOutOrder = async ({ body, identity }) => {
  const { 'cognito:username': customerId } = identity
  const { cart } = body
  if (!cart) {
    return { status: 400, response: {} }
  }

  const order = await orderUseCases.checkOut(customerId, cart)

  return { status: 200, response: { order } }
}

/**
 * POST /orders/{id}/pay
 *
 * @param params
 * @param body
 * @return {Promise<{response: {order: Object}, status: number}>}
 */
exports.payOrder = async ({ params, identity }) => {
  const { id: orderId } = params
  const { 'cognito:username': customerId } = identity
  const order = await orderUseCases.pay(customerId, orderId)

  return { status: 200, response: { order } }
}
