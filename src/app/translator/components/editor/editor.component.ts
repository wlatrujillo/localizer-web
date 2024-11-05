import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, fromEvent, tap } from 'rxjs';
import { Locale } from 'src/app/core/model/locale';
import { Resource } from 'src/app/core/model/resource';
import { Translation } from 'src/app/core/model/translation';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogAddResourceComponent } from '../dialog-add-resource/dialog-add-resource.component';
import { DialogConfirmRemoveComponent } from 'src/app/shared/components/dialog-confirm-remove/dialog-confirm-remove.component';
import { ResourceService } from '@core/service/translator/resource.service';
import { ProjectService } from '@core/service/translator/project.service';
import { Project } from '@core/model/project';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, AfterViewInit {

  @ViewChild('searchInput') matInput!: ElementRef;

  //from service
  locales: Locale[] = [];
  baseLocale: Locale | undefined;

  //template variables
  selectedLocales: FormControl = new FormControl([]);
  selectedTranslation: Translation | null = null;
  project!: Project | undefined;
  resources: Resource[] = [];


  constructor(private dialog: MatDialog,
    private resourceService: ResourceService,
    private projectService: ProjectService) { }

  ngAfterViewInit(): void {
    fromEvent(this.matInput.nativeElement, 'keyup')
      .pipe(
        filter(Boolean),
        debounceTime(150),
        distinctUntilChanged(),
        tap((text) => {
          console.log(this.matInput.nativeElement.value)
        })
      )
      .subscribe(() => {
        this.resources =
          this.resourceService.getResourcesFilterByText(this.matInput.nativeElement.value);
      });
  }

  ngOnInit(): void {


    this.project = this.projectService.getProject();
    this.locales = this.project?.locales;
    this.baseLocale = this.project?.locales?.find((locale: Locale) => locale.id == this.project?.baseLocale);
    this.resources = this.resourceService.getResources();
    this.selectedLocales.setValue([this.baseLocale]);

  }

  isLocaleSelected(localeId: string): boolean {
    if (!Array.isArray(this.selectedLocales.value)) {
      return this.selectedLocales.value.id == localeId;
    }
    return this.selectedLocales.value
      .some((locale: Locale) => locale.id == localeId);
  }

  openEditor(translation: Translation): void {
    console.log(translation);
  }

  clearSearch(): void {
    this.matInput.nativeElement.value = '';
    this.resources = this.resourceService.getResources();
  }



  openDialogAddResource(): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { locales: this.locales, baseLocale: this.baseLocale }

    const dialogRef = this.dialog
      .open(DialogAddResourceComponent, dialogConfig);

    dialogRef.afterClosed()
      .subscribe(result => {
        console.log(result)
        if (result.success) {
         // this.resources.push(result.resource);
        }
      });
  }

  onDeleteResource(resource: Resource): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: "Recurso",
      message: `¿Está seguro que desea eliminar 
      el recurso ${resource.id} con todas sus traducciones?`
    };

    const dialogRef = this.dialog
      .open(DialogConfirmRemoveComponent, dialogConfig);

    dialogRef
      .afterClosed()
      .subscribe(acceptedDelete => {
        if (acceptedDelete) {
          console.log("Borrando recurso...");
          this.resourceService.deleteResource(resource.id);
        }
      });

  }

  onSubmitTranslation(
    resource: Resource,
    translation: Translation,
    inputValue: string): void {
    translation.value = inputValue;
    this.resourceService.updateTranslation(resource.id, translation);
    this.selectedTranslation = null;
  }

  compareCulture(locale1: Locale, locale2: Locale): boolean {
    return locale1 && locale2 ?
      locale1.id === locale2.id : locale1 === locale2;
  }


}
