export interface INotification {
    message:string;
    type: NotificationType,
    duration?: number,
}

export enum NotificationType {
    SUCCESS = 0,
    WARNING = 1,
    ERROR = 2,
}
