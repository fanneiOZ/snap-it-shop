const { Money } = require('./money')

class Product {
  constructor({ id, name, price, barcode }) {
    this.id = id
    this.name = name
    this.barcode = barcode
    this.price = Money.createFromJson(price)
  }

  get JSON() {
    return {
      id: this.id,
      name: this.name,
      barcode: this.barcode,
      price: this.price.JSON,
    }
  }
}

module.exports = { Product }
