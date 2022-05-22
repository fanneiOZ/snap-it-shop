const orderControllers = require('./app/controller/order.controller')
const { LambdaProxy } = require('./libs/aws/lambda/proxy')
const { setupAws } = require('./libs/aws/config')

setupAws()

exports.getOrderByOrderId = LambdaProxy(orderControllers.getOrderByOrderId)
exports.getOrdersByCustomerId = LambdaProxy(orderControllers.getOrdersByCustomerId)
