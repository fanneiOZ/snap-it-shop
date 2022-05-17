const orderUseCases = require('../../core/order/order.usecases')

/**
 * GET /orders
 *
 * @param params
 * @return {Promise<{response: {orders: Object[]}, status: number}>}
 */
exports.getOrdersByCustomerId = async ({ params }) => {
  const orders = await orderUseCases.getOrdersByCustomerId('customer-id')

  return { status: 200, response: { orders } }
}

/**
 * GET /orders/{id}
 *
 * @param params
 * @return {Promise<{response: {order: Object}, status: number}>}
 */
exports.getOrderByOrderId = async ({ params }) => {
  const { id } = params
  const order = await orderUseCases.getOrderById('customer-id', id)

  return { status: 200, response: { order } }
}

/**
 * POST /orders/{id}/confirm
 *
 * @param params
 * @return {Promise<{response: {order: Object}, status: number}>}
 */
exports.confirmOrder = async ({ params }) => {
  const { id } = params
  const order = await orderUseCases.confirm('customer-id', id)

  return { status: 200, response: { order } }
}

/**
 * POST /orders/{id}/cancel
 *
 * @param params
 * @return {Promise<{response: {order: Object}, status: number}>}
 */
exports.cancelOrder = async ({ params }) => {
  const { id: orderId } = params
  const order = await orderUseCases.cancel('customer-id', orderId)

  return { status: 200, response: { order } }
}

/**
 * POST /orders/checkout
 *
 * @param body
 * @return {Promise<{response: {order: Object} | Object, status: number}>}
 */
exports.checkOutOrder = async ({ body }) => {
  const { cart } = body
  if (!cart) {
    return { status: 400, response: {} }
  }

  const order = await orderUseCases.checkOut('customer-id', cart)

  return { status: 200, response: { order } }
}

/**
 * POST /orders/{id}/pay
 *
 * @param params
 * @param body
 * @return {Promise<{response: {order: Object}, status: number}>}
 */
exports.payOrder = async ({ params, body }) => {
  const { id: orderId } = params
  const order = await orderUseCases.pay('customer-id', orderId)

  return { status: 200, response: { order } }
}
