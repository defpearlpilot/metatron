import {Mutability, ProxyType, Requirement} from '../MetaMember';
import {BaseProxyAttribute} from "./BaseProxyAttribute";
import {ProxyListAttribute} from "./ProxyListAttribute";
import {ProxyMetaData} from "../ProxyMetaData";

export class ProxyAttribute extends BaseProxyAttribute {
  constructor(_name: string,
              _meta: ProxyMetaData,
              _isRequired?: Requirement,
              _isMutable?: Mutability) {
    super(_name, _meta, ProxyType.PROXY, _isRequired, _isMutable);
  }

  withName(name: string) {
    return new ProxyAttribute(name, this._meta, this._isRequired, this._isMutable)
  }

  asListProxy(): BaseProxyAttribute {
    return new ProxyListAttribute(this._name, this._meta, this._isRequired, this._isMutable);
  }

  asProxy(): BaseProxyAttribute {
    return this;
  }

}
