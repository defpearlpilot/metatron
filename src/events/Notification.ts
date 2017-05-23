export enum NotificationType {
  CREATED,
  UPDATED,
  REVERTED,
  COMMITTED,
  DELETED
}

export interface Notification {
  type: NotificationType;
  property: string;
  value: any;
  last?: any;
}


export class AbstractNotification implements Notification {
  constructor(private _type: NotificationType,
              private _property: string,
              private _value: any,
              private _last?: any) {
  }

  get type(): NotificationType {
    return this._type;
  }

  get property(): string {
    return this._property;
  }

  get value(): string {
    return this._value;
  }

  get last(): string {
    return this._last;
  }
}


export class CreatedNotification extends AbstractNotification {
  constructor(value: any) {
    super(NotificationType.CREATED, "__item__", value);
  }
}


export class UpdatedNotification extends AbstractNotification {
  constructor(property: string, value: any, last?: any) {
    super(NotificationType.UPDATED, property, value, last);
  }
}


export class RevertedNotification extends AbstractNotification {
  constructor(property: string, value: any, last?: any) {
    super(NotificationType.REVERTED, property, value, last);
  }
}


export class CommittedNofiication extends AbstractNotification {
  constructor(value: any) {
    super(NotificationType.COMMITTED, "__item__", value);
  }
}


export class DeletedNotification extends AbstractNotification {
  constructor(value: any) {
    super(NotificationType.DELETED, "__item__", value);
  }
}
