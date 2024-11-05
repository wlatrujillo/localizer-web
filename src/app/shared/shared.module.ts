import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { DialogConfirmRemoveComponent } from './components/dialog-confirm-remove/dialog-confirm-remove.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationComponent } from './components/notification/notification.component';



@NgModule({
  declarations: [
    PageNotFoundComponent,
    DialogConfirmRemoveComponent,
    NotificationComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    PageNotFoundComponent,
    DialogConfirmRemoveComponent,
    NotificationComponent
  ]
})
export class SharedModule { }
