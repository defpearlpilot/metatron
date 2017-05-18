import {Named} from '../cache/CachingStrategy';

export enum Requirement {
  REQUIRED,
  NOT_REQUIRED
}

export enum Mutability {
  IMMUTABLE,
  MUTABLE
}

export interface MetaMember extends Named {
  isRequired: boolean;
  isMutable: boolean;
}
