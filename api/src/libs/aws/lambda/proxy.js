/**
 * @param {Function} controller
 */
exports.LambdaProxy = (controller) => {
  return async (event) => {
    const request = extractRequestFromLambdaEvent(event)
    try {
      const { response, status } = await controller(request)

      return {
        statusCode: status ?? 200,
        body: JSON.stringify(response)
      }
    } catch (e) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error_message: e.message })
      }
    }
  }
}

function extractRequestFromLambdaEvent(event) {
  const query = {}
  if (event.hasOwnProperty('multiValueQueryStringParameters')) {
    const baseObj = event['multiValueQueryStringParameters']
    for (const key of Object.keys(baseObj)) {
      query[key] = baseObj[key].length === 1 ? baseObj[key][0] : baseObj[key]
    }
  }

  return {
    query,
    params: event.hasOwnProperty('pathParameters') ? event['pathParameters'] : {},
    body: event['body'] ? JSON.parse(event['body']) : {},
  }
}
