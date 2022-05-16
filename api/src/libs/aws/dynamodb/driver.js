const { DynamoDB } = require('aws-sdk')
const { DDBItemSerializer } = require('./item-serlializer')
const { DDBItemParser } = require('./item-parser')

class DDBDriver {
  /**
   * @type {DynamoDB}
   */
  #ddb = undefined

  static #instance

  /**
   * @return {DDBDriver}
   */
  static get instance() {
    if (!(this.#instance && this.#instance instanceof DDBDriver)) {
      this.#instance = new DDBDriver()
    }

    return this.#instance
  }

  constructor() {
    this.#ddb = new DynamoDB({ apiVersion: '2012-08-10', region: 'local', endpoint: 'http://localhost:18000' })
  }

  async get(tableName, hashKey, rangeKey = undefined) {
    const keyValues = Object.assign({ hk: { S: hashKey } }, rangeKey ? { rk: { S: rangeKey } } : {})
    const result = await new Promise((resolve, reject) => {
      this.#ddb.getItem(
        { TableName: tableName, Key: keyValues },
        (err, data) => {
          if (err) {
            reject(err)
          } else {
            resolve(data)
          }
        })
    })

    return result.Item ? DDBItemParser.parse(result.Item) : undefined
  }

  async getByPartitionKey(tableName, partitionKey) {
    const params = {
      TableName: tableName,
      ExpressionAttributeValues: { ':hk': { S: partitionKey } },
      KeyConditionExpression: 'hk = :hk',
    }
    const result = await this.#ddb.query(params).promise()

    return result.Items.map(DDBItemParser.parse)
  }


  /**
   *
   * @param {string} tableName
   * @param {Object} data
   * @return {Promise<void>}
   */
  async save(tableName, data) {
    return await new Promise((resolve, reject) => {
      this.#ddb.putItem(
        { TableName: tableName, Item: DDBItemSerializer.serialize(data) },
        (err, data) => {
          if (err) {
            reject(err)
          } else {
            resolve(data)
          }
        },
      )
    })
  }

  async listTables() {
    return await this.#ddb.listTables()
  }
}

module.exports = { DDBDriver }
