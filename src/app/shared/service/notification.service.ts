import { Injectable } from '@angular/core';
import { NotificationType, INotification } from '@shared/model/notification';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  private notification$: Subject<INotification> = new Subject<INotification>();

  success(message: string, duration?: number) {
    this.notify(
      message,
      NotificationType.SUCCESS,
      duration);
  }
  warning(message: string, duration?: number) {
    this.notify(
      message,
      NotificationType.WARNING,
      duration);
  }
  error(message: string, duration?: number) {
    this.notify(
      message,
      NotificationType.ERROR,
      duration);
  }
  private notify(message: string, type: NotificationType, duration?: number) {
    duration = duration || 3000;
    this.notification$.next(
      {
        message,
        type,
        duration
      } as INotification);
  }

  get notification() {
    return this.notification$.asObservable();
  }
}
