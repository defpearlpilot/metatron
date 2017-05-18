import {expect} from 'chai';
import {createProxy, Test} from '../../src/proxy/TestProxy';

describe('proxy meta data test suite', function () {
  it('tests proxy accessor', function testProxy() {

    const validProxy = createProxy({required: 'value', writable: 'writable', writable_required: 'required'});

    const invalidProxy = createProxy({} as Test);

    // test reading
    expect(validProxy.required).to.be.equal('value');
    expect(() => invalidProxy.required).to.throw;

    // test writing
    validProxy.writable = 'value';
    expect(validProxy.writable).to.be.equal('value');

    validProxy.writable = undefined;
    expect(validProxy.writable).to.be.undefined;
  });
});
