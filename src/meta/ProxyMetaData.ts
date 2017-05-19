import {MetaMember} from './MetaMember';
import {NameCachingStrategy} from '../cache/NameCachingStrategy';
import {AbstractMethod} from './AbstractMethod';
import {Primitive} from './fields/Primitive';

const cacheByName = new NameCachingStrategy();

class Cache {
  nameMap: Map<string, MetaMember> = new Map<string, MetaMember>();
}

export class ProxyMetaData {

  private nameMap: Map<string, MetaMember>;

  constructor(meta: MetaMember[]) {
    const reducer = (acc: Cache, member: MetaMember): Cache => {
      cacheByName.put(acc.nameMap, member);
      return acc;
    };

    const cache = meta.reduce(reducer, new Cache());
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
