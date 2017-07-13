import {Invocable, MetaMember, Mutability, ProxyType, Requirement} from './MetaMember';

export abstract class BaseMetaMember implements MetaMember {

  constructor(private _name: string,
              private _isProxy: ProxyType = ProxyType.NOT_PROXY,
              private _canInvoke: Invocable = Invocable.CANNOT_INVOKE,
              private _isRequired: Requirement = Requirement.NOT_REQUIRED,
              private _isMutable: Mutability = Mutability.MUTABLE) {
  }

  get name() {
    return this._name;
  }

  get isRequired() {
    return this._isRequired == Requirement.REQUIRED;
  }

  get isMutable() {
    return this._isMutable == Mutability.MUTABLE;
  }

  get canInvoke() {
    return this._canInvoke == Invocable.CAN_INVOKE;
  }

  get isProxy() {
    return this._isProxy != ProxyType.NOT_PROXY;
  }
}
