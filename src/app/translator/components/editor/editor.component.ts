import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, fromEvent, tap } from 'rxjs';
import { Locale } from '@core/model/locale';
import { Resource } from '@core/model/resource';
import { Translation } from '@core/model/translation';
import { Project } from '@core/model/project';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogAddResourceComponent } from '../dialog-add-resource/dialog-add-resource.component';
import { DialogConfirmRemoveComponent } from '@shared/components/dialog-confirm-remove/dialog-confirm-remove.component';
import { ResourceService } from '@core/service/resource.service';
import { TranslationService } from '@core/service/translation.service';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { FormsModule, FormBuilder, FormGroup,ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatIconModule, MatButtonModule],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, AfterViewInit {

  @Input({ required: true }) project!: Project;
  @ViewChild('searchInput') matInput!: ElementRef;

  //from service
  locales: Locale[] = [];
  baseLocale: Locale | undefined;

  //template variables
  selectedLocales: FormControl = new FormControl([]);
  selectedTranslation: Translation | null = null;
  resources: Resource[] = [];


  constructor(private dialog: MatDialog,
    private resourceService: ResourceService,
    private translationService: TranslationService
  ) { }

  ngOnInit(): void {

    console.log("Init editor component with project:", this.project);

    this.locales = this.project?.locales;
    this.baseLocale = this.project?.locales?.find((locale: Locale) => locale.code== this.project?.baseLocale);
    console.log("Get Resources with projectId:", this.project['_id']);
    this.resourceService.getAll(this.project['_id']).subscribe((resources: Resource[]) => {
      this.resources = resources;
    });
    this.selectedLocales.setValue([this.baseLocale]);

  }

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
          this.resourceService.getFilterByText(this.project['_id'], this.matInput.nativeElement.value).subscribe((resources: Resource[]) => {
            this.resources = resources;
          });
      });
  }



  isLocaleSelected(localeId: string): boolean {
    if (!Array.isArray(this.selectedLocales.value)) {
      return this.selectedLocales.value.id == localeId;
    }
    return this.selectedLocales.value
      .some((locale: Locale) => locale.code == localeId);
  }

  openEditor(translation: Translation): void {
    console.log(translation);
  }

  clearSearch(): void {
    this.matInput.nativeElement.value = '';
    this.resourceService.getAll(this.project['_id']).subscribe((resources: Resource[]) => {
      this.resources = resources;
    });
  }



  openDialogAddResource(): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { locales: this.locales,
                          baseLocale: this.baseLocale,
                          projectId: this.project._id
                        }

    const dialogRef = this.dialog
      .open(DialogAddResourceComponent, dialogConfig);

    dialogRef.afterClosed()
      .subscribe(result => {
        console.log(result)
        if (result.success) {
         this.resources.push(result.resource);
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
      el recurso ${resource.code} con todas sus traducciones?`
    };

    const dialogRef = this.dialog
      .open(DialogConfirmRemoveComponent, dialogConfig);

    dialogRef
      .afterClosed()
      .subscribe(acceptedDelete => {
        if (acceptedDelete) {
          console.log("Borrando recurso...");
          const index = this.resources.findIndex(e=>e.code==resource.code);
          this.resourceService
              .deleteById(this.project['_id'], resource.code)
              .subscribe( response => {this.resources.splice(index,1)}, error => {console.error(error)});
        }
      });

  }

  onSubmitTranslation(
    resource: Resource,
    translation: Translation,
    inputValue: string): void {
    translation.value = inputValue;
    this.translationService.update(this.project['_id'], resource.code, translation).subscribe();
    this.selectedTranslation = null;
  }

  compareCulture(locale1: Locale, locale2: Locale): boolean {
    return locale1 && locale2 ?
      locale1.code === locale2.code : locale1 === locale2;
  }


}
