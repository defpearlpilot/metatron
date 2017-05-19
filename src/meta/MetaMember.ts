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


export interface MetaMember extends Named {
  isRequired: boolean;
  isMutable: boolean;
  canInvoke: boolean;
}
