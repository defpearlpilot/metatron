import {Named} from '../cache/CachingStrategy';

export enum Required {
  REQUIRED,
  NOT_REQUIRED
}

export enum Mutable {
  IMMUTABLE,
  MUTABLE
}

export enum Invocable {
  CAN_INVOKE,
  CANNOT_INVOKE
}

export enum ProxyType {
  NOT_PROXY,
  PROXY,
  PROXY_LIST
}


export interface MetaBuilder {
  required: () => MetaBuilder;
  notRequired: () => MetaBuilder;

  invokable: () => MetaBuilder;
  notInvokable: () => MetaBuilder;

  immutable: () => MetaBuilder;
  mutable: () => MetaBuilder;
}

class AbstractMetaBuilder implements MetaBuilder {
  private _required: Required;
  private _invocable: Invocable;
  private _immutable: Mutable;

  constructor(private _name: string) {
  }

  required() {
    this._required = Required.REQUIRED;
    return this;
  };

  notRequired() {
    this._required = Required.NOT_REQUIRED;
    return this;
  }

  invokable() {
    this._invocable = Invocable.CAN_INVOKE;
    return this;
  };

  notInvokable() {
    this._invocable = Invocable.CANNOT_INVOKE;
    return this;
  }

  immutable() {
    this._immutable = Mutable.IMMUTABLE;
    return this;
  };

  mutable() {
    this._immutable = Mutable.MUTABLE;
    return this;
  };

}


class PrimitiveBuilder extends AbstractMetaBuilder {
  constructor(_name: string) {
    super(_name);
  }
}

class ProxyBuilder extends AbstractMetaBuilder {
  constructor(_name: string) {
    super(_name);
  }
}

class MethodBuilder extends AbstractMetaBuilder {
  constructor(_name: string) {
    super(_name);
  }
}

export class MetaBuilderFactory {
  primitive(name: string): MetaBuilder {
    return new PrimitiveBuilder(name);
  }

  proxy(name: string): MetaBuilder {
    return new ProxyBuilder(name);
  }

  method(name: string): MetaBuilder {
    return new MethodBuilder(name);
  }

}
