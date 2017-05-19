import {Handler} from './Handler';
import {Primitive} from '../meta/fields/Primitive';
import {ProxyMetaData} from '../meta/ProxyMetaData';
import {Mutability, Requirement} from '../meta/MetaMember';
import {AttributeMethod} from '../meta/methods/AttributeMethod';


export interface Test {
  required: string;
  not_writable: string;
  writable?: string;
  writable_required: string;
  attribute?: string;
}

class Attribute extends AttributeMethod {

  constructor() {
    super('attribute');
  }

  parameterNames(): string[] {
    return ['required', 'writable'];
  }

  invoke(parameters: Map<string, any>) {
    const requireVal = parameters.get('required');
    const writableVal = parameters.get('writable');

    return requireVal + writableVal;
  }

}

const proxyFields = [
  new Primitive('required', Requirement.REQUIRED),
  new Primitive('not_required'),
  new Primitive('not_writable', Requirement.REQUIRED, Mutability.IMMUTABLE),
  new Primitive('writable', Requirement.NOT_REQUIRED, Mutability.MUTABLE),
  new Primitive('writable_required', Requirement.REQUIRED, Mutability.MUTABLE),
  new Attribute()
];

const testMetaData = new ProxyMetaData(proxyFields);


export function createProxy(item: Test) {
  return new Proxy<Test>(item, new Handler(testMetaData));
}
