var symbolLookup = require('./stock-lookup-service').symbolLookup

var  createPortfolio = function() {
  return { holdings: {} }
}

var empty = function(portfolio) {
  return size(portfolio) === 0
}

var size = function(portfolio) {
  return Object.keys(portfolio.holdings).length
}

var value = function(portfolio) {
  var sumValues = function(totalValue, symbol) {
    return totalValue + symbolLookup(symbol) * sharesOf(portfolio, symbol)
  }
  return empty(portfolio) ? 0 : Object.keys(portfolio.holdings).reduce(sumValues, 0)
}

var sharesOf = function(portfolio, symbol) {
  return !portfolio.holdings[symbol] ? 0 : portfolio.holdings[symbol]
}

var purchase = function(portfolio, symbol, shares) {
  var newPortfolio = Object.assign({}, portfolio)
  var newHoldings = Object.assign({}, portfolio.holdings)
  newHoldings[symbol] = sharesOf(portfolio, symbol) + shares
  newPortfolio.holdings = newHoldings
  return newPortfolio
}

module.exports = {
  createPortfolio: createPortfolio,
  empty: empty,
  size: size,
  value: value,
  sharesOf: sharesOf,
  purchase: purchase
}