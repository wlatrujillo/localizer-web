import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Project } from '@core/model/project';
import { GeneratorService } from '@core/service/translator/generator.service';
import { ProjectService } from '@core/service/translator/project.service';
import { NotificationService } from '@shared/service/notification.service';
import { Locale } from 'src/app/core/model/locale';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss']
})
export class GeneratorComponent implements OnInit {

  panelOpenState = false;
  fileFormat: FormControl = new FormControl('');
  selectedLocales: FormControl = new FormControl([]);

  locales: Locale[] = [];

  project!: Project;

  formats: { value: string, description: string }[] = [];

  constructor(
    private projectService: ProjectService,
    private generator: GeneratorService,
    private notification: NotificationService) { }

  ngOnInit(): void {
    this.project = this.projectService.getProject();
    this.locales = this.project.locales;
    this.formats = [
      { value: 'mysql-errors', description: 'MySQL (.sql) errores' },
      { value: 'mysql-catalogs', description: 'MySQL (.sql) catalogos' },
      { value: 'mysql-trn', description: 'MySQL (.sql) transacciones' },
      { value: 'menu', description: 'Menu (.js)' },
    ]
  }

  generate() {

    let locales: Locale[] = this.selectedLocales.value;
    if (locales.length == 0) {
      this.notification.warning('Debe seleccionar al menos una cultura');
      return;
    }

    let fileFormat: string = this.fileFormat.value;

    switch (fileFormat) {
      case 'mysql-errors':
        this.generator.toErrorsMySql(locales, { id: this.project?.baseLocale || '', name: '' });
        this.notification.success('Se ha generado los scripts SQL');
        break;
      case 'mysql-catalogs':
        this.generator.toCatalogMySql(locales, { id: this.project?.baseLocale || '', name: '' });
        this.notification.success('Se ha generado los scripts SQL');
        break;
      case 'mysql-trn':
        this.generator.toTransactionMySql(locales, { id: this.project?.baseLocale || '', name: '' });
        this.notification.success('Se ha generado los scripts SQL');
        break;
      case 'menu':
        this.generator.toMenuJS(locales);
        this.notification.success('Se ha generado los archivos de Menu JS');
        break;
      case 'json':
        this.generator.toJson(locales);
        this.notification.success('Se ha generado los archivos JSON');
        break;
      default:
    }

  }

  compareLocales(locale1: Locale, locale2: Locale): boolean {
    return locale1 && locale2 ?
      locale1.id === locale2.id : locale1 === locale2;
  }

  isAllLocalesChecked(): boolean {
    return this.selectedLocales.value?.length === this.locales.length;
  }

  isAllLocalesIndeterminate(): boolean {
    return this.selectedLocales.value?.length > 0 && this.selectedLocales.value?.length < this.locales.length;
  }

  allLocalesSelection(change: MatCheckboxChange): void {
    if (change.checked) {
      this.selectedLocales.setValue(this.locales);
    } else {
      this.selectedLocales.setValue([]);
    }
  }
}
