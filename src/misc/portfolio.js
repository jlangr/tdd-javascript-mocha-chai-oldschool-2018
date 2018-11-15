//var defaultSymbolLookup = require('./stock-lookup-service') // in ES2015 you can use default args

module.exports = function(symbolLookup) {
  return {
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
      var sumValues = function(totalValue, symbol) {
        return totalValue + symbolLookup(symbol) * this.sharesOf(portfolio, symbol)
      }.bind(this)
      return this.empty(portfolio) ? 0 : Object.keys(portfolio.holdings).reduce(sumValues, 0)
    },

    sharesOf: function(portfolio, symbol) {
      return !portfolio.holdings[symbol] ? 0 : portfolio.holdings[symbol]
    },

    purchase: function(portfolio, symbol, shares) {
      var newPortfolio = Object.assign({}, portfolio)
      var newHoldings = Object.assign({}, portfolio.holdings)
      newHoldings[symbol] = this.sharesOf(portfolio, symbol) + shares
      newPortfolio.holdings = newHoldings
      return newPortfolio
    }
  }
}
