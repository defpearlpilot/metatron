import {Handler} from './Handler';
import {Primitive} from '../meta/Primitive';
import {ProxyMetaData} from '../meta/ProxyMetaData';
import {Mutability, Requirement} from '../meta/MetaMember';


export interface Test {
  required: string;
  writable: string;
  writable_required: string;
}

const proxyFields = [
  new Primitive('required', Requirement.REQUIRED),
  new Primitive('not_required'),
  new Primitive('writable', Requirement.NOT_REQUIRED, Mutability.MUTABLE),
  new Primitive('writable_required', Requirement.REQUIRED, Mutability.MUTABLE),
];

const testMetaData = new ProxyMetaData(proxyFields);


export function createProxy(item: Test) {
  return new Proxy<Test>(item, new Handler(testMetaData));
}
