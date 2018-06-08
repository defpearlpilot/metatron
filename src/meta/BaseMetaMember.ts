import {Invocable, MetaMember, Mutability, ProxyType, Requirement} from './MetaMember';

export abstract class BaseMetaMember implements MetaMember {

  protected constructor(protected _name: string,
                        protected _isProxy: ProxyType = ProxyType.NOT_PROXY,
                        protected _canInvoke: Invocable = Invocable.CANNOT_INVOKE,
                        protected _isRequired: Requirement = Requirement.NOT_REQUIRED,
                        protected _isMutable: Mutability = Mutability.MUTABLE) {
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

  withName(name: string): MetaMember {
    throw 'Must implement';
  };
}
