const { nanoid } = require('nanoid')

class IdGen {
  static generate(prefix = undefined, size =undefined) {
    return `${prefix ? prefix + '-' : ''}${nanoid(size)}`
  }
}

module.exports = { IdGen }
