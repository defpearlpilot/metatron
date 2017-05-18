import {CachingStrategy, Named} from './CachingStrategy';


export class NameCachingStrategy<T extends Named> implements CachingStrategy<T> {
  put(cache: Map<string, T>, item: T) {
    const name = item.name;
    cache.set(name, item);
  }

  get(cache: Map<string, T>, key: string) {
    return cache.get(key);
  }
}
