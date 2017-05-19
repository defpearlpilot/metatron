import {BaseMetaMember} from '../BaseMetaMember';
import {Invocable, Mutability, Requirement} from '../MetaMember';

export class Primitive extends BaseMetaMember {

  constructor(_name: string,
              _isRequired?: Requirement,
              _isMutable?: Mutability) {
    super(_name, Invocable.CANNOT_INVOKE, _isRequired, _isMutable);
  }
}
