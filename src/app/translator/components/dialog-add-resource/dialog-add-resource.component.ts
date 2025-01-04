import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Locale } from '@core/model/locale';
import { Resource } from '@core/model/resource';
import { ResourceService } from '@core/service/resource.service';
import { NotificationService } from '@shared/service/notification.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dialog-add-resource',
  standalone: true,
  imports: [ MatDialogModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule ],
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
      resource.code = this.form.value.id;
      resource.value = this.form.value.value;

      this.resourceService.create(this.data.projectId, resource).subscribe( response => {
        console.log(response);
        this.dialogRef.close({ success: true, resource: response });
      });
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
