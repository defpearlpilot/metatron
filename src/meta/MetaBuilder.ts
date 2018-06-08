import {Invocable, MetaMember, Mutability, ProxyType, Requirement} from './MetaMember';
import {Primitive} from './fields/Primitive';
import {ProxyAttribute} from './proxy/ProxyAttribute';
import {ProxyListAttribute} from './proxy/ProxyListAttribute';
import {AttributeMethod} from './methods/AttributeMethod';
import {ProxyMetaData} from "./ProxyMetaData";



export interface MetaBuilder {
  required: () => MetaBuilder;
  notRequired: () => MetaBuilder;

  invokable: () => MetaBuilder;
  notInvokable: () => MetaBuilder;

  immutable: () => MetaBuilder;
  mutable: () => MetaBuilder;

  build: () => MetaMember;
}


export abstract class AbstractMetaBuilder implements MetaBuilder {
  protected _required: Requirement = Requirement.NOT_REQUIRED;
  protected _canInvoke: Invocable = Invocable.CANNOT_INVOKE;
  protected _immutable: Mutability = Mutability.IMMUTABLE;

  protected constructor(protected _name: string) {
  }

  required() {
    this._required = Requirement.REQUIRED;
    return this;
  };

  notRequired() {
    this._required = Requirement.NOT_REQUIRED;
    return this;
  }

  invokable() {
    this._canInvoke = Invocable.CAN_INVOKE;
    return this;
  };

  notInvokable() {
    this._canInvoke = Invocable.CANNOT_INVOKE;
    return this;
  }

  immutable() {
    this._immutable = Mutability.IMMUTABLE;
    return this;
  };

  mutable() {
    this._immutable = Mutability.MUTABLE;
    return this;
  };

  abstract build(): MetaMember;
}


export class PrimitiveBuilder extends AbstractMetaBuilder {
  constructor(_name: string) {
    super(_name);
  }

  build(): MetaMember {
    return new Primitive(this._name, this._required, this._immutable);
  }
}


export class ProxyBuilder extends AbstractMetaBuilder {
  private _proxyType: ProxyType;
  private _meta: ProxyMetaData;

  constructor(_name: string, _meta: ProxyMetaData) {
    super(_name);
    this._meta = _meta;
  }

  scalar(): ProxyBuilder {
    this._proxyType = ProxyType.PROXY;
    return this;
  }

  list(): ProxyBuilder {
    this._proxyType = ProxyType.PROXY_LIST;
    return this;
  }

  build(): MetaMember {
    switch (this._proxyType) {
      case ProxyType.NOT_PROXY: {
        throw new Error('Framework error: should not be constructing a proxy that is not a proxy')
      }
      case ProxyType.PROXY: {
        return new ProxyAttribute(this._name, this._meta, this._required, this._immutable)
      }
      case ProxyType.PROXY_LIST: {
        return new ProxyListAttribute(this._name, this._meta, this._required, this._immutable)
      }
    }
  }
}


export type ParameterApplication = (p: Map<string, any>) => any;


export class MethodBuilder extends AbstractMetaBuilder {
  private _parameters: Set<string>;
  private _calc: ParameterApplication;

  constructor(_name: string) {
    super(_name);
    this._parameters = new Set<string>();
  }

  parameter(_name: string) {
    this._parameters.add(_name);
    return this;
  }

  parameters(_names: string[]) {
    _names.forEach(this._parameters.add);
    return this;
  }

  calculation(_calc: ParameterApplication) {
    this._calc = _calc;
    return this;
  }

  build(): MetaMember {
    return new AttributeMethod(this._name, Array.from(this._parameters), this._calc);
  }
}


export class MetaBuilderFactory {
  static primitive(name: string): PrimitiveBuilder {
    return new PrimitiveBuilder(name);
  }

  static proxy(name: string, meta: ProxyMetaData): ProxyBuilder {
    return new ProxyBuilder(name, meta);
  }

  static method(name: string): MetaBuilder {
    return new MethodBuilder(name);
  }

}
