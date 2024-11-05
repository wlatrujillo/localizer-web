import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Locale } from '@core/model/locale';
import { Resource } from '@core/model/resource';
import { ResourceService } from '@core/service/translator/resource.service';
import { NotificationService } from '@shared/service/notification.service';

@Component({
  selector: 'app-dialog-add-resource',
  templateUrl: './dialog-add-resource.component.html',
  styleUrls: ['./dialog-add-resource.component.scss']
})
export class DialogAddResourceComponent implements OnInit {

  form!: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<DialogAddResourceComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder,
    private resourceService: ResourceService,
    private notification: NotificationService) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [this.data?.id, [Validators.required]],
      value: [this.data?.value]
    });
  }

  onSubmitAddResource() {
    if (this.form.invalid) return;
    try {
      let resource: Resource = {} as Resource;
      resource.id = this.form.value.id;
      resource.translations = [];
      this.data.locales.forEach((locale: Locale) => {
        resource.translations.push({
          locale: locale.id,
          value: this.form.value.value
        });
      });
      this.resourceService.addResource(resource);
      this.dialogRef.close({ success: true, resource });
    } catch (e) {
      console.error(e);
      this.notification.error(e as string);
    }
  }

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.form.controls[controlName].hasError(errorName);
  }


}
