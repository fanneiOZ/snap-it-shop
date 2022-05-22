const { loadEnvConfig, mapEnvConfig } = require('./env')

class ConfigProvider {
  /**
   * @type {ConfigProvider}
   */
  static #instance

  static get instance() {
    if (!this.#instance) {
      this.#instance = new ConfigProvider()
    }

    return this.#instance
  }

  #configValues = {}

  constructor() {
    loadEnvConfig()
    this.#configValues = mapEnvConfig()
  }

  get values() {
    return this.#configValues
  }
}

module.exports = { ConfigProvider }
