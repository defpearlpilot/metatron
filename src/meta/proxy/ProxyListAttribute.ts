import {Mutability, ProxyType, Requirement} from '../MetaMember';
import {BaseProxyAttribute} from "./BaseProxyAttribute";
import {ProxyAttribute} from "./ProxyAttribute";
import {ProxyMetaData} from "../ProxyMetaData";

export class ProxyListAttribute extends BaseProxyAttribute {
  constructor(_name: string,
              _meta: ProxyMetaData,
              _isRequired?: Requirement,
              _isMutable?: Mutability) {
    super(_name, _meta, ProxyType.PROXY_LIST, _isRequired, _isMutable);
  }

  withName(name: string) {
    return new ProxyListAttribute(name, this._meta, this._isRequired, this._isMutable)
  }

  asListProxy(): BaseProxyAttribute {
    return this;
  }

  asProxy(): BaseProxyAttribute {
    return new ProxyAttribute(this._name, this._meta, this._isRequired, this._isMutable) ;
  }
}
