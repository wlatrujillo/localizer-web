import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Locale } from '@core/model/locale';
import { RowFileModel } from '@core/model/row-file-model';
import { UploaderService } from '@core/service/translator/uploader.service';
import { DialogProcessFileComponent } from '../dialog-process-file/dialog-process-file.component';
import { ProjectService } from '@core/service/translator/project.service';
import { NotificationService } from '@shared/service/notification.service';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent implements OnInit {

  locales: Locale[] = [];
  isProcessFileAvailable: boolean = false;
  file!: File;
  selectedLocale!: Locale;
  rowFileModel!: RowFileModel;

  constructor(
    private uploader: UploaderService,
    private dialog: MatDialog,
    private projectService: ProjectService,
    private notification: NotificationService) { }

  ngOnInit(): void {
    this.locales = this.projectService.getProject()?.locales || [];
  }

  onFileSelected(event: any) {
    let reader = new FileReader();

    reader.onload = (e) => {
      const content = reader.result as string;
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.direction = 'ltr';
      dialogConfig.position = { top: '10%' };
      dialogConfig.data = { row: content.split('\n')[0], locales: this.locales }


      const dialogRef = this.dialog.open(DialogProcessFileComponent, dialogConfig);

      dialogRef.afterClosed()
        .subscribe(result => {

          if (!result) {
            event.target.value = null;
            this.isProcessFileAvailable = false;
            return;
          }

          this.selectedLocale = result.locale;
          this.rowFileModel = result.rowFileModel;
          this.file = event.target.files[0];
          this.isProcessFileAvailable = true;


        });
    };
    reader.readAsText(event.target.files[0]);

  }



  onProcessFile() {
    this.uploader.onFileSelected(
      this.file,
      this.rowFileModel,
      this.selectedLocale);
    this.notification.success("Archivo procesado correctamente");
    this.isProcessFileAvailable = false;
    this.file = null as any;
  }


}
