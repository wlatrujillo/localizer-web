import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { INotification, NotificationType } from '@shared/model/notification';
import { NotificationService } from '@shared/service/notification.service';
import { takeWhile } from 'rxjs';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {

  @ViewChild('notificationContainer') container!: ElementRef<HTMLDivElement>;

  private _subscribed: boolean = true;
  private classMap!: Map<NotificationType, string>;

  constructor(
    private service: NotificationService,
    private renderer: Renderer2) {

  }

  ngOnInit(): void {
    this.classMap = new Map<NotificationType, string>();
    this.classMap.set(NotificationType.SUCCESS, 'success');
    this.classMap.set(NotificationType.WARNING, 'warning');
    this.classMap.set(NotificationType.ERROR, 'error');

    this.service.notification
      .pipe(takeWhile(() => this._subscribed))
      .subscribe(notification => {
        if (notification) this.render(notification);
      });
  }

  ngOnDestroy() {
    this._subscribed = false;
  }


  private render(notification: INotification) {
    let notificationBox = this.renderer.createElement('div');
    let header = this.renderer.createElement('b');
    let content = this.renderer.createElement('div');
    const boxColorClass = this.classMap.get(notification.type);
    let classesToAdd = ['message-box', boxColorClass];
    classesToAdd.forEach((x) => this.renderer.addClass(notificationBox, x || ''));
    this.renderer.setStyle(notificationBox, 'transition', `opacity ${notification.duration}ms`);
    this.renderer.setStyle(notificationBox, 'opacity', '0.90');

    const headerText = this.renderer.createText(this.getText(notification.type));
    this.renderer.appendChild(header, headerText);
    const text = this.renderer.createText(notification.message);
    this.renderer.appendChild(content, text);
    this.renderer.appendChild(this.container.nativeElement, notificationBox);
    this.renderer.appendChild(notificationBox, header);
    this.renderer.appendChild(notificationBox, content);
    setTimeout(() => {
      this.renderer.setStyle(notificationBox, 'opacity', '0');
      setTimeout(() => {
        this.renderer.removeChild(this.container.nativeElement, notificationBox);
      }, notification.duration);
    }, notification.duration);
  }

  private getText(type: NotificationType): string {
    switch (type) {
      case NotificationType.SUCCESS:
        return 'Exito';
      case NotificationType.WARNING:
        return 'Alerta';
      case NotificationType.ERROR:
        return 'Error';
      default:
        return '';
    }
  }

}
