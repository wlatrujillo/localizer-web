import { Injectable } from '@angular/core';
import { UploaderSrv } from '../electron/uploader.srv';
import { Locale } from '@core/model/locale';
import { RowFileModel } from '@core/model/row-file-model';

@Injectable({
  providedIn: 'root'
})
export class UploaderService {

  constructor(private uploaderSrv: UploaderSrv) { }

  onFileSelected(file: File, rowFileModel: RowFileModel, locale: Locale) {
    this.uploaderSrv.onFileSelected(file, rowFileModel, locale);
  }

  processCsv(content: string, rowFileModel: RowFileModel, locale: Locale): void {

    this.uploaderSrv.processCsv(content, rowFileModel, locale);

  }
}
