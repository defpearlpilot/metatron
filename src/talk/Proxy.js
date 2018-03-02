const original = {field1: 'Field 1'};

const handler = {
  get: function(target, field, receiver) {
    console.log("I am intercepting a 'get' on field: ", field);
    return field
  }
};

const proxy = new Proxy(original, handler);

console.log('I am getting original field field1', original.field1);
console.log('I am getting proxy field field1', proxy.field1);
console.log('I am getting proxy field field2', proxy.field2);

