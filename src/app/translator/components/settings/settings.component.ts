import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Locale } from '@core/model/locale';
import { Project } from '@core/model/project';
import { DialogAddCultureComponent } from '../dialog-add-culture/dialog-add-culture.component';
import { MatTableDataSource } from '@angular/material/table';
import { DialogConfirmRemoveComponent } from '@shared/components/dialog-confirm-remove/dialog-confirm-remove.component';
import { ProjectService } from '@core/service/project.service';
import { NotificationService } from '@shared/service/notification.service';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, FormBuilder, FormGroup,ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ CommonModule, RouterModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatTableModule, MatIconModule, MatSelectModule, MatButtonModule, MatDialogModule, MatCardModule ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  form!: FormGroup;
  project: Project = {} as Project;
  displayedColumns: string[] = ['code', 'name', 'actions'];
  dataSource: MatTableDataSource<Locale> = new MatTableDataSource<Locale>();

  constructor(private formBuider: FormBuilder,
    private dialog: MatDialog,
    private projectService: ProjectService,
    private notification: NotificationService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.project = this.route.snapshot.data['project'] as Project
    this.dataSource.data = this.project.locales;

    this.form = this.formBuider.group({
      name: [this.project?.name, [Validators.required]],
      description: [this.project?.description, []],
      baseLocale: [this.project?.baseLocale, []],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.project.name = this.form.value.name;
    this.project.description = this.form.value.description;
    this.project.baseLocale = this.form.value.baseLocale;
    this.projectService.updateById(this.project._id, this.project);
  }

  onRemoveLocale(locale: Locale) {

    if (this.project.baseLocale == locale.code) {
      this.notification.warning('No puede eliminar la cultura base');
      return;
    }

    this.openModalWindow(DialogConfirmRemoveComponent,
      { title: 'Cultura', message: `Se borrarán todas las traducciones para la cultura ${locale.code} y no se podrán recuperar ¿Esta seguro que desea proceder?` })
      .afterClosed()
      .subscribe(result => {
        console.log(this.dataSource);
        if (result) {
          this.projectService.removeLocaleFromAllResources(this.project._id, locale);
          this.loadData();
        }
      });
  }

  openDialogAddCulture(): void {

    this.openModalWindow(DialogAddCultureComponent, { locales: this.project.locales })
      .afterClosed()
      .subscribe(result => {
        console.log(this.dataSource);
        if (result) {
          this.loadData();
        }
      });

  }

  loadData() {
    this.projectService.getById(this.project._id).subscribe( result => {
      this.project = result;
      this.dataSource.data = this.project.locales;
    });
  }

  openModalWindow(componet: any, data: any): MatDialogRef<any, any> {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    dialogConfig.width = '50%';
    return this.dialog.open(componet, dialogConfig);

  }
}
