const decimalPoints = new Map([
  [ 'THB', 2 ],
])

class Money {
  /**
   * @param {{currency: string, amount: string}}
   * @return {Money}
   */
  static createFromJson({ currency, amount }) {
    return new Money(currency, amount)
  }

  /**
   * @param {Money} money
   * @return {Money}
   */
  static clone(money) {
    return Money.createFromJson(money.value)
  }

  /**
   * @param {Money} moneyList
   * @return {Money}
   */
  static sum(...moneyList) {
    const start = moneyList[0]
    if (!(start instanceof Money)) {
      throw new Error('Operand is not instance of Money')
    }

    return moneyList.slice(1).reduce((result, money) => result.add(money), start)
  }

  currencyCode = 'THB'
  amount = '00'
  #decimalPlace = 2

  constructor(currencyCode, amount) {
    this.#decimalPlace = decimalPoints.get(currencyCode)
    if (!this.#decimalPlace) {
      throw new Error('Invalid currency code')
    }
    this.currencyCode = currencyCode
    this.amount = amount
  }

  /**
   * @return {{amount: string, currency: string}}
   */
  get value() {
    return {
      amount: this.amount,
      currency: this.currencyCode,
    }
  }

  /**
   * @return {number}
   */
  get parsedAmount() {
    return parseFloat(this.amount.slice(0, -this.#decimalPlace))
      + parseFloat(this.amount.slice(-this.#decimalPlace)) / Math.pow(10, this.#decimalPlace)
  }

  /**
   * @return {number}
   */
  get rawAmount() {
    return parseInt(this.amount, 10)
  }

  /**
   * @param {Money} money
   * @return {Money}
   */
  add(money) {
    this.#validateInputMoney(money)

    return new Money(this.currencyCode, (this.rawAmount + money.rawAmount).toString(10))
  }

  /**
   * @param {number} multiplier
   * @return {Money}
   */
  multiply(multiplier) {
    return new Money(this.currencyCode, Math.floor(this.rawAmount * multiplier).toString(10))
  }

  #validateInputMoney(money) {
    if (this.currencyCode !== money.currencyCode) {
      return new Error(
        `Adding money currency unmatched. (Expected: ${this.currencyCode}, Received: ${money.currencyCode})`
      )
    }
  }
}

module.exports = { Money }
