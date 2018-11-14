const { defaultSymbolLookup } = require('./stock-lookup-service')

module.exports = function(symbolLookup = defaultSymbolLookup) {
  const obj = {
    createPortfolio: function() {
      return { holdings: {} }
    },

    empty: function(portfolio) {
      return this.size(portfolio) === 0
    },

    size: function(portfolio) {
      return Object.keys(portfolio.holdings).length
    },

    value: function(portfolio) {
      return this.empty(portfolio) ? 0 :
        Object.keys(portfolio.holdings).reduce(
          (totalValue, symbol) => totalValue + symbolLookup(symbol) * this.sharesOf(portfolio, symbol),
          0)
    },

    sharesOf: function(portfolio, symbol) {
      return !portfolio.holdings[symbol] ? 0 : portfolio.holdings[symbol]
    },

    purchase: function(portfolio, symbol, shares) {
      const newPortfolio = Object.assign({}, portfolio)
      const newHoldings = Object.assign({}, portfolio.holdings)
      newHoldings[symbol] = this.sharesOf(portfolio, symbol) + shares
      newPortfolio.holdings = newHoldings
      return newPortfolio
    }
  }
  return obj
}
