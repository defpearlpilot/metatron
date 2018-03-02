const original = {
  field1: 'Field 1',
  _underpants: 'Calvin Klien'
};

const handler = {
  get: function(target, field, receiver) {
    if (field[0] === "_") {
      return "You don't have access"
    }
    return Reflect.get(target, field, receiver)
  }
};

const revocable = Proxy.revocable(original, handler);

const revocableProxy = revocable.proxy;

console.log('I am getting field field1', revocableProxy.field1);
console.log('I am getting field _underpants', revocableProxy._underpants);

revocable.revoke();

console.log('I am getting field field1 after revoking', revocableProxy.field1);


