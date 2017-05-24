import * as Rx from 'rxjs';

import {Notification} from '../events/Notification';

export interface Proxied {
  commit(): boolean;

  rollback(): boolean;

  destroy(): boolean;

  subscribe(onNext: (update: Notification) => void,
            onError: (error: any) => void,
            onComplete: () => void): Rx.Subscription;
}
