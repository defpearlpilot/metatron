import * as Rx from 'rxjs';
import {isNil} from 'lodash';

import {ProxyMetaData} from '../meta/ProxyMetaData';
import {AbstractMethod} from '../meta/AbstractMethod';
import {Proxied} from './Proxied';

import {Notification, RevertedNotification, UpdatedNotification} from '../events/Notification';
import {BuiltInMethod} from '../meta/methods/BuiltInMethod';


export class Handler<T extends Proxied> implements ProxyHandler<T> {

  private _original: Map<string, any> = new Map<string, any>();
  private _changes: Map<string, any> = new Map<string, any>();
  private _subject: Rx.Subject<Notification>;
  private _subscription: Rx.Subscription;


  constructor(private _meta: ProxyMetaData) {
    this._subject = new Rx.Subject<Notification>();

  }

  // construct(target: T, argArray: any, newTarget?: any): object {
  //   TODO: implement this, maybe
  //   return {};
  // }

  subscribe(onNext: (update: Notification) => void,
            onError: (error: any) => void,
            onComplete: () => void) : Rx.Subscription {
    return this._subject.subscribe(onNext, onError, onComplete);
  }


  /**
   * trap for attribute accesses
   *
   * @param target
   * @param property
   * @param receiver
   * @returns {any}
   */
  get(target: T, property: PropertyKey, receiver: any) {
    this.checkProperty(property as string);
    return this.validateRequired(property as string, () => this.provideValue(target, property as string));
  }


  /**
   * trap for attribute mutations
   *
   * @param target
   * @param property
   * @param value
   * @param receiver
   * @returns {boolean}
   */
  set(target: T, property: PropertyKey, value: any, receiver: any): boolean {
    this.checkProperty(property as string);
    this.validateMutable(property as string);
    this.validateRequired(property as string, () => value);

    this.setValue(target, property, value);

    return true;
  }


  private checkProperty(property: string): void {
    if (!this._meta.containsProperty(property as string)) {
      throw new Error(`Proxy does not expect property: ${property}`);
    }
  }


  private provideValue(target: T, property: string) {
    const _invoke = () => {
      const methodDescriptor = this._meta.getMethod(property);
      if (methodDescriptor instanceof BuiltInMethod) {
        return Reflect.get(this, methodDescriptor.name).bind(this);
      }

      const invocation = methodDescriptor as AbstractMethod;
      const parameterMap = this.gatherParameters(target, methodDescriptor);
      return invocation.invoke(parameterMap);
    };

    const _getValue = () => {
      // check for property existence because we can unset key values
      if (this._changes.has(property)) {
        return this._changes.get(property);
      }

      return Reflect.get(target, property);
    };

    return this._meta.canInvoke(property) ? _invoke() : _getValue();
  }


  private setValue(target: T, property: PropertyKey, value: any) {
    const _setValue = (provideCurrent: () => any,
                       provideOriginal: () => any,
                       setOriginal: (original: any) => void,
                       publishRevert: (last: any) => void,
                       publishUpdate: (current: any) => void) => {

      const current = provideCurrent();
      if (this.areEqual(current, value)) {
        return;
      }

      const original = provideOriginal();
      if (this.areEqual(original, value)) {
        return publishRevert(current);
      }

      setOriginal(current);
      this._changes.set(propName, value);
      publishUpdate(current);
    };


    const propName = property as string;

    if (!this._changes.has(propName)) {
      /*
      if this is the first time setting the value, the original will be fetched from the target
      we will need to tuck away that value in '_original' and publish that this item has been updated
      if it's changed
       */
      return _setValue(() => Reflect.get(target, propName),
                       () => undefined,
                       (original) => this._original.set(propName, original),
                       () => { /* shouldn't need to revert since we haven't seen it */},
                       (updated) => this.publishUpdate(propName, value, updated));
    } else {
      /*
      If we've seen this before then check against changes. If this is an update then check against
      the original to see if we should publish a revert message.
       */
      return _setValue(() => this._changes.get(propName),
                       () => this._original.get(propName),
                       () => { /* original value should have been set already */},
                       (last) => this.publishReversion(propName, value, last),
                       (updated) => this.publishUpdate(propName, value, updated));
    }
  }


  private validateRequired(property: string, valueProvider: () => any) {
    const value = valueProvider();

    if (this._meta.isRequiredProperty(property) && isNil(value)) {
      throw new Error(`Proxy encountered a nil property: ${property}`);
    }

    return value;
  }


  private validateMutable(property: string) {
    if (this._meta.isMutable(property)) {
      return;
    }

    throw new Error(`Proxy attempted to set an immutable property ${property}`);
  }


  private gatherParameters(target: T, methodDescriptor: AbstractMethod) {
    return methodDescriptor.parameterNames().reduce((acc, property) => {
      const value = this.validateRequired(property, () => this.provideValue(target, property));
      acc.set(property as string, value);

      return acc;
    }, new Map<string, any>())
  }


  /*
  To be replaced with something more robust
   */
  private areEqual(some?: any, other?: any) {
    return some === other;
  }


  private publishUpdate(property: string, value: any, last?: any) {
    const updated = new UpdatedNotification(property, value, last);
    this._subject.next(updated);
  }


  private publishReversion(property: string, value: any, last?: any) {
    const reverted = new RevertedNotification(property, value, last);
    this._subject.next(reverted);
  }

}
