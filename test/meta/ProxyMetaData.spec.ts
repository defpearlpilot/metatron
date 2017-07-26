import {expect} from 'chai';
import {Primitive} from '../../src/meta/fields/Primitive';
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
