import {Named} from '../cache/CachingStrategy';

export enum Requirement {
  NOT_REQUIRED,
  REQUIRED
}

export enum Mutability {
  IMMUTABLE,
  MUTABLE
}

export enum Invocable {
  CANNOT_INVOKE,
  CAN_INVOKE
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

  withName: (name: string) => MetaMember;
}
