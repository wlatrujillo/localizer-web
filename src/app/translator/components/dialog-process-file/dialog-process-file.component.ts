import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Locale } from '@core/model/locale';
import { NotificationService } from '@shared/service/notification.service';

@Component({
  selector: 'app-dialog-process-file',
  templateUrl: './dialog-process-file.component.html',
  styleUrls: ['./dialog-process-file.component.scss']
})
export class DialogProcessFileComponent implements OnInit {

  locales: Locale[] = [];
  columns: string[] = [];
  rowKeys: any = { 0: 'key', 1: 'translation' };

  rowOptions: any[] = [
    { code: 'key', description: "Clave Principal" },
    { code: 'translation', description: "Traducción" },
  ];

  selectedLocale: FormControl = new FormControl({}, [Validators.required]);

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private notification: NotificationService,
    private dialogRef: MatDialogRef<DialogProcessFileComponent>
  ) { }

  ngOnInit(): void {
    this.locales = this.data.locales;
    this.columns = this.data.row.split(',');
    this.selectedLocale.setValue(this.locales[0]);
  }

  compareLocales(locale1: Locale, locale2: Locale): boolean {
    return locale1 && locale2 ?
      locale1.id === locale2.id : locale1 === locale2;
  }

  onSubmitProcessFile(): void {

    if (this.selectedLocale.invalid) {
      return;
    }

    let countKey = 0;
    let countValue = 0;

    for (const key in this.rowKeys) {

      if (this.rowKeys[key] == 'key') {
        countKey++;
      }
      if (this.rowKeys[key] == 'translation') {
        countValue++;
      }
    }

    if (countKey == 0) {
      this.notification.error("Debe seleccionar una clave principal");
      return;
    }

    if (countValue == 0) {
      this.notification.error("Debe seleccionar una traducción");
      return;
    }

    if (countKey > 1) {
      this.notification.error("Solo puede seleccionar una clave principal");
      return;
    }

    if (countValue > 1) {
      this.notification.error("Solo puede seleccionar una traducción");
      return;
    }

    this.dialogRef.close({
      locale: this.selectedLocale.value,
      rowFileModel: {
        key: Object.keys(this.rowKeys).find(key => this.rowKeys[key] == 'key'),
        translation: Object.keys(this.rowKeys).find(key => this.rowKeys[key] == 'translation'),
      }
    });

  }


}
