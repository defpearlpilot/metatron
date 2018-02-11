import {MetaMember} from './MetaMember';
import {NameCachingStrategy} from '../cache/NameCachingStrategy';
import {AbstractMethod} from './AbstractMethod';
import {Primitive} from './fields/Primitive';
import {BuiltInMethod} from './methods/BuiltInMethod';

const cacheByName = new NameCachingStrategy();

class Cache {
  nameMap: Map<string, MetaMember> = new Map<string, MetaMember>();
}

const BUILT_INS = [
  new BuiltInMethod("isProxy"),
  new BuiltInMethod("validate"),
  new BuiltInMethod("commit"),
  new BuiltInMethod("rollback"),
  new BuiltInMethod("update"),
  new BuiltInMethod("destroy"),
  new BuiltInMethod("subscribe")
];


export class ProxyMetaData {

  private nameMap: Map<string, MetaMember>;

  constructor(meta: MetaMember[]) {
    const cacheMetaMembers = (acc: Cache, member: MetaMember): Cache => {
      cacheByName.put(acc.nameMap, member);
      return acc;
    };

    const initial = meta.reduce(cacheMetaMembers, new Cache());
    const cache = BUILT_INS.reduce(cacheMetaMembers, initial);
    this.nameMap = cache.nameMap;
  }


  containsProperty(name: string) {
    return this.nameMap.has(name);
  }


  isRequiredProperty(name: string) {
    return this.nameMap.get(name).isRequired;
  }


  isMutable(name: string) {
    return this.nameMap.get(name).isMutable;
  }


  isProxy(name: string) {
    return this.nameMap.get(name)
  }


  canInvoke(name: string) {
    return this.nameMap.get(name).canInvoke;
  }


  getPrimitive(name: string): Primitive {
    return this.nameMap.get(name) as Primitive;
  }


  getMethod(name: string): AbstractMethod {
    return this.nameMap.get(name) as AbstractMethod;
  }
}
