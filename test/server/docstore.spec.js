'use strict';

let expect = require('chai').expect,
    ds =  require('../../src/server/docstore.js'),
    options = ds.options;

describe('docstore module', () => {
  it('deserializing non json should throw an error', () => {
   expect(() =>  { options.format.deserialize('I AM NOT JSON!'); }).to.throw();
  });

  it('deserializing valid json should work as expected', () => {
   expect(options.format.deserialize('{ "test": "asdf"}').test).to.equal('asdf');
  });

  it('serializing a valid js object should work as expected', () => {
   expect(options.format.serialize({ test: 'asdf' })).to.equal('{\n\t"test": "asdf"\n}');
  });

  it('opening a document should work as expected', () => {
   ds.open('.candy', (store) => {
    expect(store.get).to.not.be(undefined);
   });
  });
});
