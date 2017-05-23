import {AbstractMethod} from '../AbstractMethod';
import {Invocable} from '../MetaMember';


export class BuiltInMethod extends AbstractMethod {

  constructor(_name: string) {
    super(_name, Invocable.CAN_INVOKE);
  }

  parameterNames(): string[] {
    return [];
  }

  invoke(parameters: Map<string, any>) {
    throw new Error('This method should not be called');
  }

}
