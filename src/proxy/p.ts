function add(n: number) {
  let sum = n;
  const proxy: any = new Proxy(function a() {}, {
    get (obj, key) {
      console.log('get', key, sum);
      return () => sum;
    },
    apply (receiver, ...args: any[]) {
      console.log('apply', args);
      sum += args[1][0];
      return proxy;
    },
  });
  return proxy
}

let val = Number(add(5)(8)(127));
let plusOne = val + 1;


console.log(val, plusOne);
console.log(add(5)(4)(3));
