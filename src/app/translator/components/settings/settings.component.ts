import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Locale } from 'src/app/core/model/locale';
import { Project } from 'src/app/core/model/project';
import { DialogAddCultureComponent } from '../dialog-add-culture/dialog-add-culture.component';
import { MatTableDataSource } from '@angular/material/table';
import { DialogConfirmRemoveComponent } from 'src/app/shared/components/dialog-confirm-remove/dialog-confirm-remove.component';
import { ProjectService } from '@core/service/translator/project.service';
import { NotificationService } from '@shared/service/notification.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  form!: FormGroup;
  project!: Project;
  displayedColumns: string[] = ['id', 'name', 'actions'];
  dataSource: MatTableDataSource<Locale> = new MatTableDataSource<Locale>();
  constructor(private formBuider: FormBuilder,
    private dialog: MatDialog,
    private projectService: ProjectService,
    private notification: NotificationService) { }

  ngOnInit(): void {

    this.loadData();

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
    this.projectService.updateProject(this.project);
  }

  onRemoveLocale(locale: Locale) {

    if (this.project.baseLocale == locale.id) {
      this.notification.warning('No puede eliminar la cultura base');
      return;
    }

    this.openModalWindow(DialogConfirmRemoveComponent,
      { title: 'Cultura', message: `Se borrarán todas las traducciones para la cultura ${locale.id} y no se podrán recuperar ¿Esta seguro que desea proceder?` })
      .afterClosed()
      .subscribe(result => {
        console.log(this.dataSource);
        if (result) {
          this.projectService.removeLocaleFromAllResources(locale);
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
    this.project = this.projectService.getProject();
    this.dataSource.data = this.project.locales;
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
