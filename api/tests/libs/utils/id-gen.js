const { nanoid } = require('nanoid')

class IdGen {
  static generate(prefix = undefined) {
    return `${prefix ? prefix + '-' : ''}${nanoid()}`
  }
}

module.exports = { IdGen }
