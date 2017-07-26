import {AbstractMethod} from '../AbstractMethod';
import {Invocable} from '../MetaMember';


export class AttributeMethod extends AbstractMethod {

  constructor(_name: string,
              private parameters: string[],
              private calc: (parameters: Map<string, any>) => any) {
    super(_name, Invocable.CAN_INVOKE);
  }

  parameterNames(): string[] {
    return this.parameters;
  }

  invoke(parameters: Map<string, any>) {
    return this.calc(parameters);
  }
}
