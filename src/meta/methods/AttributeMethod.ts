import {AbstractMethod} from '../AbstractMethod';
import {Invocable} from '../MetaMember';


export abstract class AttributeMethod extends AbstractMethod {

  constructor(_name: string) {
    super(_name, Invocable.CAN_INVOKE);
  }

}
