class DDBItemParser {
  static methods = new Map([
    [ 'S', DDBItemParser.string ],
    [ 'N', DDBItemParser.number ],
    [ 'M', DDBItemParser.map ],
    [ 'BOOL', DDBItemParser.boolean ],
    [ 'L', DDBItemParser.list ],
  ])

  static string(value) {
    return value
  }

  static number(value) {
    return parseFloat(value && value.trim() !== '' ? value : '0')
  }

  static boolean(value) {
    return value.constructor.name === 'Boolean' ? value : JSON.parse(value.toLowerCase())
  }

  static map(value) {
    return DDBItemParser.parse(value)
  }

  static list(values) {
    return values.map(valueObj => resolveParserByType(valueObj)(Object.values(valueObj)[0]))
  }

  static parse(data) {
    const result = {}
    for (const [key, valueObj] of Object.entries(data)) {
      const parser = resolveParserByType(valueObj)
      const values = Object.values(valueObj)
      if (parser) {
        result[key] = parser(values[0])
      } else if (values.length) {
        result[key] = DDBItemParser.parse(values[0])
      } else {
        result[key] = {}
      }
    }

    return result
  }
}

function resolveParserByType(data) {
  for (const key of Object.keys(data)) {
    if (DDBItemParser.methods.has(key)) {
      return DDBItemParser.methods.get(key)
    }
  }

  return undefined
}

module.exports = { DDBItemParser }
