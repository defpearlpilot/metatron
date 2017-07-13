import {BaseMetaMember} from './BaseMetaMember';
import {Invocable, Mutability, ProxyType, Requirement} from './MetaMember';


export abstract class AbstractMethod extends BaseMetaMember {

  constructor(_name: string, _canInvoke: Invocable) {
    super(_name, ProxyType.NOT_PROXY, _canInvoke, Requirement.REQUIRED, Mutability.IMMUTABLE);
  }

  abstract parameterNames(): string[];

  abstract invoke(parameters: Map<string, any>): any;
}
