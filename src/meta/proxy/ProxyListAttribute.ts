import {BaseMetaMember} from '../BaseMetaMember';
import {Invocable, Mutability, ProxyType, Requirement} from '../MetaMember';

export class ProxyListAttribute extends BaseMetaMember {
  constructor(_name: string,
              _isRequired?: Requirement,
              _isMutable?: Mutability) {
    super(_name, ProxyType.PROXY_LIST, Invocable.CANNOT_INVOKE, _isRequired, _isMutable);
  }
}
