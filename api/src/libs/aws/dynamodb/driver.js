const AWS = require('aws-sdk')
AWS.config.update({ region: 'local', dynamodb: { endpoint: 'http://localhost:18000' } })
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
    this.#ddb = new DynamoDB({ apiVersion: '2012-08-10' })
  }

  async get(tableName, hashKey, rangeKey = undefined) {
    const attributeValues = { 'hk': { S: hashKey } }
    let conditionExpr = 'hk = :hk'
    if (rangeKey) {
      attributeValues[':rk'] = { S: rangeKey }
      conditionExpr = `${conditionExpr} and rk = :rk`
    }
    const result = await new Promise((resolve, reject) => {
      this.#ddb.getItem(
        { TableName: tableName, Key: attributeValues },
        (err, data) => {
          if (err) {
            reject(err)
          } else {
            resolve(data)
          }
        })
    })

    return DDBItemParser.parse(result.Item)
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
