import {expect} from 'chai';
import {createProxy, Test} from '../../src/proxy/TestProxy';

describe('proxy meta data test suite', function () {
  it('tests proxy read', function testProxyRead() {

    const validProxy = createProxy({required: 'value', not_writable: 'can\'t change me', writable: 'writable', writable_required: 'required'});


    const invalidProxy = createProxy({} as Test);

    // test reading
    expect(validProxy.required).to.be.equal('value');
    expect(() => invalidProxy.required).to.throw('Proxy encountered a nil property: required');

    expect(() => Reflect.get(validProxy, 'missing')).to.throw('Proxy does not expect property: missing');
  });

  it('tests proxy write', function testProxyWrite() {

    const validProxy = createProxy({required: 'value', not_writable: 'can\'t change me', writable: 'writable', writable_required: 'required'});

    expect(() => { validProxy.not_writable = 'i defy your innate self' }).to.throw('Proxy attempted to set an immutable property not_writable');

    validProxy.writable = 'value';
    expect(validProxy.writable).to.be.equal('value');

    validProxy.writable = undefined;
    expect(validProxy.writable).to.be.undefined;

    expect(() => { validProxy.writable_required = undefined }).to.throw('Proxy encountered a nil property: writable_required');
  });

  it('tests proxy invocation', function testProxyInvocation() {

    const validProxy = createProxy({required: 'required', not_writable: 'can\'t change me', writable: 'writable', writable_required: 'required'});

    expect(validProxy.attribute).to.be.equal('requiredwritable');
  });

});
