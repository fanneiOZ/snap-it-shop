const { assert } = require('chai')
const sinon = require('sinon')

const { LambdaProxy } = require('../../../src/libs/aws/lambda/proxy')

describe('LambdaProxy', () => {
  let event = undefined
  const sampleRESTAPIGatewayEvent = {
    "resource": "/orders/{id}",
    "path": "/orders/hello-test",
    "httpMethod": "GET",
    "headers": {
      "Accept": "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      "Cache-Control": "no-cache",
      "Content-Type": "application/json",
      "Host": "aut8wy8yjc.execute-api.us-west-2.amazonaws.com",
      "Postman-Token": "63bc13d6-2949-4ff5-80d4-68d20933437d",
      "User-Agent": "PostmanRuntime/7.29.0",
      "X-Amzn-Trace-Id": "Root=1-62834817-410bfcfd6ff808003aab3014",
      "X-Forwarded-For": "183.88.228.222",
      "X-Forwarded-Port": "443",
      "X-Forwarded-Proto": "https",
    },
    "multiValueHeaders": {
      "Accept": [ "*/*" ],
      "Accept-Encoding": [ "gzip, deflate, br" ],
      "Cache-Control": [ "no-cache" ],
      "Content-Type": [ "application/json" ],
      "Host": [ "aut8wy8yjc.execute-api.us-west-2.amazonaws.com" ],
      "Postman-Token": [ "63bc13d6-2949-4ff5-80d4-68d20933437d" ],
      "User-Agent": [ "PostmanRuntime/7.29.0" ],
      "X-Amzn-Trace-Id": [ "Root=1-62834817-410bfcfd6ff808003aab3014" ],
      "X-Forwarded-For": [ "183.88.228.222" ],
      "X-Forwarded-Port": [ "443" ],
      "X-Forwarded-Proto": [ "https" ],
    },
    "queryStringParameters": {
      "a": "b",
      "c": "value",
      "d": "2",
      "e": "",
      "k": "true",
    },
    "multiValueQueryStringParameters": {
      "a": [ "b" ],
      "c": [ "value" ],
      "d": [ "1", "2" ],
      "e": [ "" ],
      "k": [ "true" ],
    },
    "pathParameters": { "id": "hello-test" },
    "stageVariables": null,
    "requestContext": {
      "resourceId": "55y8k1",
      "resourcePath": "/orders/{id}",
      "httpMethod": "GET",
      "extendedRequestId": "SQgzqH5lPHcF9TA=",
      "requestTime": "17/May/2022:07:00:39 +0000",
      "path": "/dev/orders/hello-test",
      "accountId": "839956791745",
      "protocol": "HTTP/1.1",
      "stage": "dev",
      "domainPrefix": "aut8wy8yjc",
      "requestTimeEpoch": 1652770839298,
      "requestId": "177172be-9f4b-4c8a-bf09-3876392e3152",
      "identity": {
        "cognitoIdentityPoolId": null,
        "accountId": null,
        "cognitoIdentityId": null,
        "caller": null,
        "sourceIp": "183.88.228.222",
        "principalOrgId": null,
        "accessKey": null,
        "cognitoAuthenticationType": null,
        "cognitoAuthenticationProvider": null,
        "userArn": null,
        "userAgent": "PostmanRuntime/7.29.0",
        "user": null,
      },
      "domainName": "aut8wy8yjc.execute-api.us-west-2.amazonaws.com",
      "apiId": "aut8wy8yjc",
    },
    "body": "{\"req\": true}",
    "isBase64Encoded": false,
    "rid": "iQUMyvbHILRkX3Ufe6v_8",
  }

  beforeEach(() => {
    event = JSON.parse(JSON.stringify(sampleRESTAPIGatewayEvent))
  })

  afterEach(() => {
    sinon.reset()
  })

  it('should proxy the controller', async () => {
    const stubController = sinon.stub().resolves({ response: { k: 'v' }, status: 300 })
    const expectedRequest = {
      query: { a: 'b', c: 'value', d: [ '1', '2' ], e: '', k: 'true' },
      params: { id: 'hello-test' },
      body: { req: true },
    }
    const expectedResponse = { statusCode: 300, body: '{"k":"v"}' }

    const response = await LambdaProxy(stubController)(event)

    assert.deepEqual(response, expectedResponse)
    sinon.assert.calledOnceWithExactly(stubController, expectedRequest)
  })

  it('should proxy the exception', async () => {
    const stubController = sinon.stub().rejects(new Error('test'))
    const expectedRequest = {
      query: { a: 'b', c: 'value', d: [ '1', '2' ], e: '', k: 'true' },
      params: { id: 'hello-test' },
      body: { req: true },
    }
    const expectedResponse = { statusCode: 500, body: '{"error_message":"test"}' }

    const response = await LambdaProxy(stubController)(event)

    assert.deepEqual(response, expectedResponse)
    sinon.assert.calledOnceWithExactly(stubController, expectedRequest)
  })
})
