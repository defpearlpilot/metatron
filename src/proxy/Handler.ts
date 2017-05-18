import {isNil} from 'lodash';
import {ProxyMetaData} from '../meta/ProxyMetaData';


export class Handler<T extends object> implements ProxyHandler<T> {
  constructor(private meta: ProxyMetaData) {

  }

  // construct(target: T, argArray: any, newTarget?: any): object {
  //   TODO: implement this, maybe
  //   return {};
  // }


  get(target: T, property: PropertyKey, receiver: any) {
    this.checkProperty(property as string);
    return this.validateRequired(property as string, () => Reflect.get(target, property));
  }


  set(target: T, property: PropertyKey, value: any, receiver: any): boolean {
    this.checkProperty(property as string);
    this.validateMutable(property as string);
    this.validateRequired(property as string, () => value);

    Reflect.set(target, property, value);

    return true;
  }


  private checkProperty(property: string): void {
    if (!this.meta.containsProperty(property as string)) {
      throw new Error(`Proxy does not expect property: ${property}`);
    }
  }


  private validateRequired(property: string, valueProvider:() => any) {
    const value = valueProvider();

    if (this.meta.isRequiredProperty(property) && isNil(value)) {
      throw new Error(`Proxy encountered a nil property: ${property}`);
    }

    return value;
  }


  private validateMutable(property: string) {
    if (this.meta.isMutable(property)) {
      return;
    }

    throw new Error(`Proxy attempted to set an immutable property ${property}`);
  }

}
