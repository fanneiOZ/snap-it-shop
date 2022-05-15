const { assert } = require('chai')
const { Money } = require('../../../../src/core/product/model/money')

describe('Money', () => {
  describe('clone', () => {
    it('should clone into new instance of money', () => {
      const x = new Money('THB', '987654321')

      assert.deepEqual(Money.clone(x), new Money('THB', '987654321'))
    })
  })

  it('should define attributes properly', () => {
    const x = new Money('THB', '987654321')

    assert.strictEqual(x.parsedAmount, 9876543.21)
    assert.strictEqual(x.rawAmount, 987654321)
    assert.strictEqual(x.amount, '987654321')
    assert.strictEqual(x.currencyCode, 'THB')
    assert.deepEqual(x.value, {currency: 'THB', amount: '987654321'})
  })

  describe('sum', () => {
    it('should sum all money', () => {
      const x = new Money('THB', '10000')
      const y = new Money('THB', '20000')
      const z = new Money('THB', '30000')

      assert.deepEqual(Money.sum(x, y, z), new Money('THB', '60000'))
    })

    it('should sum and support chain operation', () => {
      const x = new Money('THB', '10000')
      const y = new Money('THB', '20000')
      const z = new Money('THB', '30000')
      const m = new Money('THB', '40000')

      assert.deepEqual(
        Money.sum(x, y, z).add(m).multiply(1.07).add(y).multiply(0.7),
        new Money('THB', '88900')
      )
    })
  })

  describe('add', () => {
    it('should add properly', () => {
      const x = new Money('THB', '100000')
      const y = new Money('THB', '99')

      assert.deepEqual(x.add(y), new Money('THB', '100099'))
    })
  })

  describe('multiply', () => {
    it('should multiply when input is whole number', () => {
      const x = new Money('THB', '100000')

      assert.deepEqual(x.multiply(9), new Money('THB', '900000'))
    })

    it('should multiply when input is less than 1', () => {
      const x = new Money('THB', '100000')

      assert.deepEqual(x.multiply(0.07), new Money('THB', '7000'))
    })

    it('should multiply when input is fractional more than 1', () => {
      const x = new Money('THB', '100000')

      assert.deepEqual(x.multiply(1.07), new Money('THB', '107000'))
    })
  })
})
