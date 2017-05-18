import {expect} from 'chai';
import {createProxy, Test} from '../../src/proxy/TestProxy';

describe('proxy meta data test suite', function () {
  it('tests proxy accessor', function testProxy() {

    const validProxy = createProxy({required: 'value', not_writable: 'can\'t change me', writable: 'writable', writable_required: 'required'});

    const invalidProxy = createProxy({} as Test);

    // test reading
    expect(validProxy.required).to.be.equal('value');
    expect(() => invalidProxy.required).to.throw('Proxy encountered a nil property: required');

    // test writing
    expect(() => { validProxy.not_writable = 'i defy your innate self' }).to.throw('Proxy attempted to set an immutable property not_writable');

    validProxy.writable = 'value';
    expect(validProxy.writable).to.be.equal('value');

    validProxy.writable = undefined;
    expect(validProxy.writable).to.be.undefined;

    expect(() => { validProxy.writable_required = undefined }).to.throw('Proxy encountered a nil property: writable_required');
  });
});
