var chai = require('chai')
var expect = chai.expect
var sinon = require('sinon')

var stubSymbolLookup = sinon.stub()
var Portfolio = require('./portfolio')(stubSymbolLookup)

var Bayer = 'BAYN'
var BayerPrice = 42
var IBM = 'IBM'
var IBMPrice = 110

describe('a portfolio', function() {
  var portfolio

  beforeEach(function() {
    portfolio = Portfolio.createPortfolio()
  })

  it('is empty when created', function() {
    expect(Portfolio.empty(portfolio)).to.be.true
  })

  it('is not empty after purchase', function() {
    portfolio = Portfolio.purchase(portfolio, Bayer, 10)

    expect(Portfolio.empty(portfolio)).to.be.false
  })

  it('has size 0 when created', function() {
    expect(Portfolio.size(portfolio)).to.equal(0)
  })

  it('increases size after purchase', function() {
    portfolio = Portfolio.purchase(portfolio, Bayer, 10)

    expect(Portfolio.size(portfolio)).to.equal(1)
  })

  it('increments size with new symbol purchase', function() {
    portfolio = Portfolio.purchase(portfolio, Bayer, 1)
    portfolio = Portfolio.purchase(portfolio, 'IBM', 2)

    expect(Portfolio.size(portfolio)).to.equal(2)
  })

  it('does not increment the size with duplicate symbol purchase', function() {
    portfolio = Portfolio.purchase(portfolio, Bayer, 1)
    portfolio = Portfolio.purchase(portfolio, Bayer, 1)

    expect(Portfolio.size(portfolio)).to.equal(1)
  })

  it('answers 0 sharesOf for symbol not purchased', function() {
    expect(Portfolio.sharesOf(portfolio, Bayer)).to.equal(0)
  })

  it('answers the number of sharesOf for a purchase', function() {
    portfolio = Portfolio.purchase(portfolio, Bayer, 42)

    expect(Portfolio.sharesOf(portfolio, Bayer)).to.equal(42)
  })

  it('does not alter passed state on purchase', function() {
    Portfolio.purchase(portfolio, Bayer, 23)

    expect(Portfolio.sharesOf(portfolio, Bayer)).to.equal(0)
  })

  it('accumulates shares for multiple purchases', function() {
    portfolio = Portfolio.purchase(portfolio, Bayer, 23)
    portfolio = Portfolio.purchase(portfolio, Bayer, 19)

    expect(Portfolio.sharesOf(portfolio, Bayer)).to.equal(42)
  })

  describe('portfolio value', function() {
    it('is symbol price for single-share purchase', function() {
      var portfolio = Portfolio.createPortfolio()
      stubSymbolLookup.withArgs(IBM).returns(IBMPrice)

      portfolio = Portfolio.purchase(portfolio, 'IBM', 1)

      expect(Portfolio.value(portfolio)).to.equal(IBMPrice)
    })
  })

  describe('value of portfolio', function() {
    beforeEach(function() {
      stubSymbolLookup.withArgs(IBM).returns(IBMPrice)
      stubSymbolLookup.withArgs(Bayer).returns(BayerPrice)
    })

    afterEach(function() {
      stubSymbolLookup.resetBehavior()
    })

    it('is 0 when created', function() {
      expect(Portfolio.value(portfolio)).to.equal(0)
    })

    it('is symbol price for single-share purchase', function() {
      portfolio = Portfolio.purchase(portfolio, IBM, 1)

      expect(Portfolio.value(portfolio)).to.equal(IBMPrice)
    })

    it('multiplies share price by number of shares', function() {
      portfolio = Portfolio.purchase(portfolio, IBM, 20)

      expect(Portfolio.value(portfolio)).to.equal(20 * IBMPrice)
    })

    it('sums values for all symbols', function() {
      portfolio = Portfolio.purchase(portfolio, IBM, 20)
      portfolio = Portfolio.purchase(portfolio, Bayer, 10)

      expect(Portfolio.value(portfolio)).to.equal(20 * IBMPrice + 10 * BayerPrice)
    })
  })
})