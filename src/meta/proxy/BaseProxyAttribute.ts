import {BaseMetaMember} from '../BaseMetaMember';
import {Invocable, Mutability, ProxyType, Requirement} from '../MetaMember';

export abstract class BaseProxyAttribute extends BaseMetaMember {
  constructor(_name: string,
              _proxyType: ProxyType,
              _isRequired?: Requirement,
              _isMutable?: Mutability) {
    super(_name, _proxyType, Invocable.CANNOT_INVOKE, _isRequired, _isMutable);
  }
}
