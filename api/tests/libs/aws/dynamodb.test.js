const proxyquire = require('proxyquire')
const sinon = require('sinon')
const { assert } = require('chai')

const { DDBItemParser } = require('../../../src/libs/aws/dynamodb/item-parser')
const { DDBDriver } = require('../../../src/libs/aws/dynamodb/driver')
const { setupAws } = require('../../../src/libs/aws/config')

describe('DDB', () => {
  describe('instance', () => {
    const spy = sinon.spy()
    let i = 0

    class SpyDDB {
      constructor() {
        spy()
        this.i = ++i
      }
    }

    it('should maintain singleton properties', () => {
      const { DDBDriver } = proxyquire(
        '../../../src/libs/aws/dynamodb/driver', {
          'aws-sdk': { DynamoDB: SpyDDB },
        },
      )

      const a = DDBDriver.instance
      const b = DDBDriver.instance
      const c = DDBDriver.instance

      assert.deepEqual(a, b)
      assert.strictEqual(i, 1)
      sinon.assert.calledOnce(spy)
    })
  })
  describe('get', () => {
    const { DDBDriver } = require('../../../src/libs/aws/dynamodb/driver')

    beforeEach(() => {
      setupAws()
    })

    it('should fetch with only hk', async () => {
      const expectedResult = {
        a: { a: [ 1, "2", false ], k: "v" },
        hk: "test2",
        test: true,
        v: 1234,
      }
      const result = await DDBDriver.instance.get('test_table', 'test2')

      assert.deepEqual(result, expectedResult)
    })

    it('should return undefined when fetch non-existing data', async () => {
      const result = await DDBDriver.instance.get('test_table', 'non-existing')

      assert.isUndefined(result)
    })

    it('should fetch with hk and rk', async () => {
      const expectedResult = {
        "name": "CeraVe SA Smoothing Cleanser",
        "rk": "3-337875-684118",
        "hk": "store",
        "barcode": "3-337875-684118",
        "price": {
          "amount": "47500",
          "currency": "THB"
        }
      }

      const result = await DDBDriver.instance.get('products', 'store', '3-337875-684118')

      assert.deepEqual(result, expectedResult)
    })
  })

  describe('getByHashKey', () => {
    const { DDBDriver } = require('../../../src/libs/aws/dynamodb/driver')

    it('should fetch', async () => {
      setupAws()
      const result = await DDBDriver.instance.getByPartitionKey('orders', 'customer-id')

      console.log(result)
    })
  })
})

describe('DDBItemParser', () => {
  it('should parse string', () => {
    const input = { test: { S: 'test' } }

    const output = DDBItemParser.parse(input)

    assert.deepEqual(output, { test: 'test' })
  })

  it('should parse number', () => {
    const input = { test: { N: '' } }

    const output = DDBItemParser.parse(input)

    assert.deepEqual(output, { test: 0 })
  })

  it('should parse float', () => {
    const input = { test: { N: '999.99999' } }

    const output = DDBItemParser.parse(input)

    assert.deepEqual(output, { test: 999.99999 })
  })

  it('should parse bool', () => {
    const input = { test: { BOOL: 'True' } }

    const output = DDBItemParser.parse(input)

    assert.deepEqual(output, { test: true })
  })

  it('should parse map', () => {
    const input = { test: { M: { k: { S: 'v' }, k2: { N: '0' } } } }

    const output = DDBItemParser.parse(input)

    assert.deepEqual(output, { test: { k: 'v', k2: 0 } })
  })

  it('should parse list', () => {
    const input = { test: { L: [ { N: "1" }, { S: "2" }, { BOOL: false } ] } }
    const output = DDBItemParser.parse(input)

    assert.deepEqual(output, { test: [ 1, '2', false ] })
  })

  it('should parser compound data', () => {
    const input = {
      "a": {
        "M": {
          "a": { "L": [ { "N": "1" }, { "S": "2" }, { "BOOL": false } ] },
          "k": { "S": "v" },
        },
      },
      "hk": { "S": "test2" },
      "test": { "BOOL": true },
      "v": { "N": "1234" },
    }
    const expectedOutput = {
      "a": { "a": [ 1, "2", false ], "k": "v" },
      "hk": "test2",
      "test": true,
      "v": 1234,
    }

    const output = DDBItemParser.parse(input)

    assert.deepEqual(output, expectedOutput)
  })

  it('should ignore parsing empty object', () => {
    const input = {}

    const output = DDBItemParser.parse(input)

    assert.deepEqual(output, {})
  })
})
