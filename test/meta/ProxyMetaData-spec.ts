import {expect} from 'chai';
import {Primitive} from '../../src/meta/Primitive';
import {ProxyMetaData} from '../../src/meta/ProxyMetaData';

describe('proxy meta data test suite', function () {
  it('tests field membership', function testFieldMembership() {
    const proxyFields = [
      new Primitive('field')
    ];

    const proxyMeta = new ProxyMetaData(proxyFields);
    expect(proxyMeta.containsProperty('field')).to.be.true;
    expect(proxyMeta.containsProperty('missing')).to.throw;
  });
});
