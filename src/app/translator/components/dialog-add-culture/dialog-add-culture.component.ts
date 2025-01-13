import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjectService } from '@core/service/project.service';
import { Locale } from '@core/model/locale';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, FormControl, FormBuilder, FormGroup,ReactiveFormsModule, Validators } from '@angular/forms';



@Component({
  selector: 'app-dialog-add-culture',
  standalone: true,
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, MatIconModule, MatSelectModule, MatButtonModule, MatDialogModule, MatCardModule ],
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

    this.projectService.getAllLocales("_id").subscribe(response => {
      this.availableLocales =
       this.getAvailableLocales(response, selectedLocales);
    });
  }

  onSubmit(locale: Locale) {
    if (!locale) return;
    this.projectService.addLocaleToAllResources("_id", locale);
    this.dialogRef.close(true);
  }

  getAvailableLocales(allLocales: Locale[], selectedLocales: Locale[]): Locale[] {
    return allLocales
      .filter((locale: Locale) => {
        return !selectedLocales.some((l: Locale) => l.code == locale.code);
      });
  }


}
