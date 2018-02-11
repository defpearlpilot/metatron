import {Handler} from './Handler';
import {ProxyMetaData} from '../meta/ProxyMetaData';
import {MetaMember} from '../meta/MetaMember';
import {Proxied} from './Proxied';
import {MethodBuilder, PrimitiveBuilder} from '../meta/MetaBuilder';


export interface Test extends Proxied {
  required: string;
  not_writable: string;
  writable?: string;
  writable_required: string;
  attribute?: string;
}

const proxyFields: MetaMember[] = [
  new PrimitiveBuilder('required').required().build(),
  new PrimitiveBuilder('not_required').build(),
  new PrimitiveBuilder('not_writable').required().immutable().build(),
  new PrimitiveBuilder('writable').notRequired().mutable().build(),
  new PrimitiveBuilder('writable_required').required().mutable().build(),
  new MethodBuilder('attribute').parameter('required')
                                .parameter('writable')
                                .calculation(parameters => {
                                  const requireVal = parameters.get('required');
                                  const writableVal = parameters.get('writable');

                                  return requireVal + writableVal;
                                }).build()
];

const testMetaData = new ProxyMetaData(proxyFields);


export function createProxy(item: Test) {
  return new Proxy<Test>(item, new Handler(testMetaData));
}
