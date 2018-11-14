import { symbolLookup } from './stock-lookup-service'

exports.createPortfolio = () => ({ holdings: {} })

exports.empty = portfolio => size(portfolio) === 0

exports.size = portfolio => Object.keys(portfolio.holdings).length

exports.value = portfolio => empty(portfolio) ? 0 :
  Object.keys(portfolio.holdings).reduce(
    (totalValue, symbol) => totalValue + symbolLookup(symbol) * sharesOf(portfolio, symbol),
    0)

exports.sharesOf = (portfolio, symbol) =>
  !portfolio.holdings[symbol] ? 0 : portfolio.holdings[symbol]

exports.purchase = (portfolio, symbol, shares) =>
  ({ ...portfolio,
    holdings: {
      ...portfolio.holdings,
      [symbol]: sharesOf(portfolio, symbol) + shares
    }
  })
