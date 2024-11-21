import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjectService } from '@core/service/translator/project.service';
import { Locale } from 'src/app/core/model/locale';

@Component({
  selector: 'app-dialog-add-culture',
  standalone: true,
  imports: [],
  templateUrl: './dialog-add-culture.component.html',
  styleUrls: ['./dialog-add-culture.component.scss']
})
export class DialogAddCultureComponent implements OnInit {

  availableLocales: Locale[] = [];

  selectedLocale: FormControl = new FormControl();

  constructor(
    private dialogRef: MatDialogRef<DialogAddCultureComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private projectService: ProjectService) { }

  ngOnInit(): void {
    let selectedLocales = this.data.locales;
    let allLocales = this.getAllLocales();
    this.availableLocales =
      this.getAvailableLocales(allLocales, selectedLocales);
  }

  onSubmit(locale: Locale) {
    if (!locale) return;
    this.projectService.addLocaleToAllResources(locale);
    this.dialogRef.close(true);
  }

  getAllLocales(): Locale[] {
    return this.projectService.getAllLocales();
  }

  getAvailableLocales(allLocales: Locale[], selectedLocales: Locale[]): Locale[] {
    return allLocales
      .filter((locale: Locale) => {
        return !selectedLocales.some((l: Locale) => l.id == locale.id);
      });
  }


}
