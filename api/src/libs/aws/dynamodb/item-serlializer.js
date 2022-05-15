class DDBItemSerializer {
  static methods = new Map([
    [ 'String', DDBItemSerializer.str ],
    [ 'Number', DDBItemSerializer.int ],
    [ 'Object', DDBItemSerializer.map ],
    [ 'Boolean', DDBItemSerializer.boolean ],
    [ 'Array', DDBItemSerializer.list ],
  ])

  static str(value) {
    return { S: value }
  }

  static int(value) {
    return { N: value.toString() }
  }

  static boolean(value) {
    return { BOOL: value }
  }

  static map(value) {
    return { M: DDBItemSerializer.serialize(value) }
  }

  static list(value) {
    const result = []
    for (const item of value) {
      const valueType = item.constructor.name
      if (DDBItemSerializer.methods.has(valueType)) {
        result.push(DDBItemSerializer.methods.get(valueType)(item))
      }
    }

    return { L: result }
  }

  static serialize(data) {
    return Object.entries(data).reduce(
      (result, [ key, value ]) => {
        const serializer = resolveSerializerByValue(value)

        return Object.assign(result, serializer ? { [key]: serializer(value) } : {})
      },
      {},
    )
  }
}

function resolveSerializerByValue(value) {
  return DDBItemSerializer.methods.get(value.constructor.name)
}

module.exports = { DDBItemSerializer }
