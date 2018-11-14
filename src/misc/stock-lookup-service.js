let symbolLookup = _symbol => { throw new Error('not yet implemented') }
const symbolLookupStub = stub => symbolLookup = stub

module.exports = {
  symbolLookup,
  symbolLookupStub
}
