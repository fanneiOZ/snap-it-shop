const { assert } = require('chai')
const path = require('path')
const fs = require('fs')

describe('dotEnv', () => {

  it('should load env from .env', () => {
    const { loadEnvConfig } = require('../../src/libs/config/env')

    loadEnvConfig()

    assert.strictEqual(process.env['COGNITO_CLIENT_ID'], 'client-id')
  })
})
