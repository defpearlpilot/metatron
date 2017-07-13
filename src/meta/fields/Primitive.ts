import {BaseMetaMember} from '../BaseMetaMember';
import {Invocable, Mutability, ProxyType, Requirement} from '../MetaMember';

export class Primitive extends BaseMetaMember {

  constructor(_name: string,
              _isRequired?: Requirement,
              _isMutable?: Mutability) {
    super(_name, ProxyType.NOT_PROXY, Invocable.CANNOT_INVOKE, _isRequired, _isMutable);
  }
}
