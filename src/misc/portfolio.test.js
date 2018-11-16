var chai = require('chai')
var expect = chai.expect

var Portfolio = require('./portfolio')
var empty = Portfolio.empty
var createPortfolio = Portfolio.createPortfolio
var purchase = Portfolio.purchase
var size = Portfolio.size
var sharesOf = Portfolio.sharesOf
var value = Portfolio.value

var Bayer = 'BAYN'
var BayerPrice = 42
var IBM = 'IBM'
var IBMPrice = 110

describe('a portfolio', function() {
  var portfolio

  beforeEach(function() {
    portfolio = createPortfolio()
  })

  it('is empty when created', function() {
    expect(empty(portfolio)).to.be.true
  })

  it('is not empty after purchase', function() {
    portfolio = purchase(portfolio, Bayer, 10)

    expect(empty(portfolio)).to.be.false
  })

  it('has size 0 when created', function() {
    expect(size(portfolio)).to.equal(0)
  })

  it('increases size after purchase', function() {
    portfolio = purchase(portfolio, Bayer, 10)

    expect(size(portfolio)).to.equal(1)
  })

  it('increments size with new symbol purchase', function() {
    portfolio = purchase(portfolio, Bayer, 1)
    portfolio = purchase(portfolio, 'IBM', 2)

    expect(size(portfolio)).to.equal(2)
  })

  it('does not increment the size with duplicate symbol purchase', function() {
    portfolio = purchase(portfolio, Bayer, 1)
    portfolio = purchase(portfolio, Bayer, 1)

    expect(size(portfolio)).to.equal(1)
  })

  it('answers 0 sharesOf for symbol not purchased', function() {
    expect(sharesOf(portfolio, Bayer)).to.equal(0)
  })

  it('answers the number of sharesOf for a purchase', function() {
    portfolio = purchase(portfolio, Bayer, 42)

    expect(sharesOf(portfolio, Bayer)).to.equal(42)
  })

  it('does not alter passed state on purchase', function() {
    purchase(portfolio, Bayer, 23)

    expect(sharesOf(portfolio, Bayer)).to.equal(0)
  })

  it('accumulates shares for multiple purchases', function() {
    portfolio = purchase(portfolio, Bayer, 23)
    portfolio = purchase(portfolio, Bayer, 19)

    expect(sharesOf(portfolio, Bayer)).to.equal(42)
  })

  describe('portfolio value', function() {
    it('is symbol price for single-share purchase', function() {
      var portfolio = createPortfolio()

      portfolio = purchase(portfolio, 'IBM', 1)

      expect(value(portfolio)).to.equal(IBMPrice)
    })
  })

  xdescribe('value of portfolio', function() {
    it('is 0 when created', function() {
      expect(value(portfolio)).to.equal(0)
    })

    it('is symbol price for single-share purchase', function() {
      portfolio = purchase(portfolio, IBM, 1)

      expect(value(portfolio)).to.equal(IBMPrice)
    })

    it('multiplies share price by number of shares', function() {
      portfolio = purchase(portfolio, IBM, 20)

      expect(value(portfolio)).to.equal(20 * IBMPrice)
    })

    it('sums values for all symbols', function() {
      portfolio = purchase(portfolio, IBM, 20)
      portfolio = purchase(portfolio, Bayer, 10)

      expect(value(portfolio)).to.equal(20 * IBMPrice + 10 * BayerPrice)
    })
  })
})