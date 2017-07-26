import {BaseMetaMember} from '../BaseMetaMember';
import {Invocable, Mutability, ProxyType, Requirement} from '../MetaMember';

export class ProxyAttribute extends BaseMetaMember {
  constructor(_name: string,
              _isRequired?: Requirement,
              _isMutable?: Mutability) {
    super(_name, ProxyType.PROXY, Invocable.CANNOT_INVOKE, _isRequired, _isMutable);
  }
}
