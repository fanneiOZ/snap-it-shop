const {assert} = require('chai')

const { OrderRepo } = require('../../../../src/core/order/repo/order.repo')
const { Order } = require('../../../../src/core/order/model/order')
const { OrderStatus } = require('../../../../src/core/order/model/order-status')

describe('Order Repo', () => {
  describe('save and get', () => {
    it('should work', async () => {
      const order = new Order({
        id: 'order-id',
        status: OrderStatus.CANCELLED.JSON,
        details: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        totalAmount: { amount: '00', currency: 'THB' },
        customerId: 'customer-id',
      })

      await OrderRepo.instance.save(order)
      const result = await OrderRepo.instance.get('customer-id', 'order-id')

      assert.deepEqual(result, order)
    })
  })
})
