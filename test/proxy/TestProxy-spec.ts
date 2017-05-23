import {expect} from 'chai';

import {createProxy, Test} from '../../src/proxy/TestProxy';
import {Notification, RevertedNotification, UpdatedNotification} from '../../src/events/Notification';

function createValidProxy(): Test {
  const sourceItem: Test = {
    required: 'value',
    not_writable: 'can\'t change me',
    writable: 'writable',
    writable_required: 'required',
    commit: () => true,
    destroy: () => true,
    subscribe: (onNext,
                onError: (error: any) => void,
                onComplete: () => void) => {
      throw new Error('should not get here');
    },
  };

  return createProxy(sourceItem);
}

describe('proxy meta data test suite', function () {

  it('tests proxy read', function testProxyRead() {
    const validProxy = createValidProxy();
    const invalidProxy = createProxy({} as Test);

    // test reading
    expect(validProxy.required).to.be.equal('value');
    expect(() => invalidProxy.required).to.throw('Proxy encountered a nil property: required');

    expect(() => Reflect.get(validProxy, 'missing')).to.throw('Proxy does not expect property: missing');
  });


  it('tests proxy write', function testProxyWrite() {
    const validProxy = createValidProxy();

    expect(() => { validProxy.not_writable = 'i defy your innate self' }).to.throw('Proxy attempted to set an immutable property not_writable');

    validProxy.writable = 'value';
    expect(validProxy.writable).to.be.equal('value');

    validProxy.writable = undefined;
    expect(validProxy.writable).to.be.undefined;

    expect(() => { validProxy.writable_required = undefined }).to.throw('Proxy encountered a nil property: writable_required');
  });


  it('tests proxy invocation', function testProxyInvocation() {
    const validProxy = createValidProxy();
    expect(validProxy.attribute).to.be.equal('valuewritable');
  });

});

describe('notification suite', function testNotifications() {

  it('tests an update notification', function testUpdateNotification(done) {
    const validProxy = createValidProxy();
    validProxy.subscribe((notification: Notification) => {
                           expect(notification instanceof UpdatedNotification).to.be.true;

                           const update = notification as UpdatedNotification;
                           expect(update.value).to.be.equal('update');
                           done();
                         },
                         (error: any) => {
                         },
                         () => {
                         });

    validProxy.writable = 'update';
  });

  it('tests a revert notification', function testUpdateNotification(done) {
    const validProxy = createValidProxy();

    validProxy.required = 'update';

    validProxy.subscribe((notification: Notification) => {
                           expect(notification instanceof RevertedNotification).to.be.true;

                           const revert = notification as RevertedNotification;
                           expect(revert.value).to.be.equal('value');
                           expect(revert.last).to.be.equal('update');
                           done();
                         },
                         (error: any) => {
                         },
                         () => {
                         });

    validProxy.required = 'value';
  });

});
