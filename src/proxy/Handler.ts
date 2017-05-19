import {isNil} from 'lodash';
import {ProxyMetaData} from '../meta/ProxyMetaData';
import {AbstractMethod} from '../meta/AbstractMethod';


export class Handler<T extends object> implements ProxyHandler<T> {

  private _changes: Map<string, any> = new Map<string, any>();

  constructor(private meta: ProxyMetaData) {

  }

  // construct(target: T, argArray: any, newTarget?: any): object {
  //   TODO: implement this, maybe
  //   return {};
  // }


  get(target: T, property: PropertyKey, receiver: any) {
    this.checkProperty(property as string);
    return this.validateRequired(property as string, () => this.provideValue(target, property as string));
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


  private provideValue(target: T, property: string) {
    if (!this.meta.canInvoke(property)) {
      return Reflect.get(target, property);
    }

    const methodDescriptor = this.meta.getMethod(property);
    const parameterMap = this.gatherParameters(target, methodDescriptor);

    return methodDescriptor.invoke(parameterMap);
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


  private gatherParameters(target: T, methodDescriptor: AbstractMethod) {
    return methodDescriptor.parameterNames().reduce((acc, property) => {
      const value = this.validateRequired(property, () => Reflect.get(target, property));
      acc.set(property as string, value);

      return acc;
    }, new Map<string, any>())
  }


}
