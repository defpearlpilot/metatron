import {Named} from '../cache/CachingStrategy';

export enum Requirement {
  REQUIRED,
  NOT_REQUIRED
}

export enum Mutability {
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


export interface MetaMember extends Named {
  isRequired: boolean;
  isMutable: boolean;
  isProxy: boolean;
  canInvoke: boolean;
}
