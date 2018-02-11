import * as swagger from 'swagger-parser'
import {PrimitiveBuilder} from "../meta/MetaBuilder";
import {ProxyMetaData} from "../meta/ProxyMetaData";
import {Handler} from "../proxy/Handler";
import {Proxied} from '../proxy/Proxied';

import {Test} from "../proxy/TestProxy";

function processResponses(swagger: any) {
  console.log(swagger['responses'])
}

function processGET(swagger: any) {
  const get = swagger['get'];
  processResponses(get);
}

function processMethods(path: String, swagger: any) {
  processGET(swagger)
}

function processPaths(swaggerO: any) {
  Object.keys(swaggerO.paths).map(path => {
    processMethods(path, swaggerO.paths[path])
  })
}

function processDefinitions(swagger: any) {
  const definitions = swagger['definitions'];

  return Object.keys(definitions)
    .map(modelName => definitions[modelName])
    .filter(model => model['properties'] !== undefined)
    .map(model => {
      const properties = model['properties'];
      const fields = Object.keys(properties).map(prop => {
        return new PrimitiveBuilder(prop).required().build();
      });

      return new ProxyMetaData(fields);
    });
}


interface Fail extends Proxied {
  name: string,
  unexpected: string,
}


interface Success extends Proxied {
  name: string,
  tag: string,
}

// const handler = {
//   construct (target: any, args: any) {
//     console.log('constructing ', target);
//     return new target(...args)
//   }
// };
//
// function target (a: any, b: any, c: any) {
//   this.a = a;
//   this.b = b;
//   this.c = c;
// }

// const proxy = new Proxy(target, handler);
// const val = new proxy(1,2,3);
// console.log(val);
// console.log(proxy);

class MaybeService {
  getSuccessItem(): Success {
    return {
      name: "Hello",
      tag: 'Good',
      commit: () => true,
      rollback: () => true,
      destroy: () => true,
      validate: () => false,
      subscribe: (onNext: any,
                  onError: (error: any) => void,
                  onComplete: () => void) => {
        throw new Error('should not get here');
      }
    };
  }

  getFailureItem(): Fail {
    return {
      name: "Fail",
      unexpected: 'Not supposed to be here',
      commit: () => true,
      rollback: () => true,
      destroy: () => true,
      validate: () => false,
      subscribe: (onNext: any,
                  onError: (error: any) => void,
                  onComplete: () => void) => {
        throw new Error('should not get here');
      }
    };

  }
}

const Service = new MaybeService();

swagger.parse('src/resources/swagger.json')
  .then(res => {
    const proxyMeta = processDefinitions(res);
    console.log(proxyMeta);
    return proxyMeta;
  })
  .then(proxyMeta => {
    const itemWillSucceed = Service.getSuccessItem();
    console.log(itemWillSucceed);
    const successProxy = new Proxy<Success>(itemWillSucceed, new Handler(proxyMeta[0]));
    successProxy.validate();
    console.log('Validated success proxy as expected!');
    return proxyMeta;
  })
  .then(proxyMeta => {
    const itemWillFail = Service.getFailureItem();
    console.log(itemWillFail);
    const failProxy = new Proxy<Fail>(itemWillFail, new Handler(proxyMeta[0]));
    failProxy.validate();
  })
  .catch(proxy => {
    console.log('Here in the catch handler because proxy failed to validate!')
  });
