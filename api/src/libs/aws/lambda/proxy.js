const { HttpException } = require('../../http.exception')

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
        body: JSON.stringify(response),
      }
    } catch (e) {
      const exception = !(e instanceof HttpException)
        ? new HttpException(500, 'INTERNAL_ERROR', e.message)
        : e

      return {
        statusCode: exception.statusCode,
        body: JSON.stringify(exception.errorResponseBody),
      }
    }
  }
}

function extractRequestFromLambdaEvent(event) {
  const query = {}
  if (event.hasOwnProperty('multiValueQueryStringParameters') && event['multiValueQueryStringParameters']) {
    const baseObj = event['multiValueQueryStringParameters']
    for (const key of Object.keys(baseObj)) {
      query[key] = baseObj[key].length === 1 ? baseObj[key][0] : baseObj[key]
    }
  }
  const identity = event.hasOwnProperty('requestContext') && event['requestContext'].hasOwnProperty('authorizer')
    ? event['requestContext']['authorizer']['claims']
    : {}

  return {
    query,
    identity,
    params: event.hasOwnProperty('pathParameters') ? event['pathParameters'] : {},
    body: event['body'] ? JSON.parse(event['body']) : {},
  }
}
