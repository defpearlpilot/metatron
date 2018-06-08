import {BaseMetaMember} from '../BaseMetaMember';
import {Invocable, Mutability, ProxyType, Requirement} from '../MetaMember';
import {ProxyListAttribute} from "./ProxyListAttribute";
import {ProxyAttribute} from "./ProxyAttribute";
import {ProxyMetaData} from "../ProxyMetaData";

export abstract class BaseProxyAttribute extends BaseMetaMember {
  protected _meta: ProxyMetaData;

  constructor(_name: string,
              _meta: ProxyMetaData,
              _proxyType: ProxyType,
              _isRequired?: Requirement,
              _isMutable?: Mutability) {
    super(_name, _proxyType, Invocable.CANNOT_INVOKE, _isRequired, _isMutable);
    this._meta = _meta;
  }

  get metaData() {
    return this._meta
  }

  abstract asListProxy(): BaseProxyAttribute;

  abstract asProxy(): BaseProxyAttribute;
}
