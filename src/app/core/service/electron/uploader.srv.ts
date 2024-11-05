import { Injectable } from '@angular/core';
// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { Locale } from '@core/model/locale';
import { Resource } from '@core/model/resource';
import { RowFileModel } from '@core/model/row-file-model';
import { ElectronService } from './electron.srv';
import { Project } from '@core/model/project';

@Injectable({
  providedIn: 'root'
})
export class UploaderSrv {
  ipcRenderer!: typeof ipcRenderer;
  webFrame!: typeof webFrame;
  childProcess!: typeof childProcess;
  fs!: typeof fs;
  path!: typeof path;
  constructor(private electronService: ElectronService) {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = (window as any).require('electron').ipcRenderer;
      this.webFrame = (window as any).require('electron').webFrame;
      this.fs = (window as any).require('fs');
      this.path = (window as any).require('path');
      this.childProcess = (window as any).require('child_process');

      // Notes :
      // * A NodeJS's dependency imported with 'window.require' MUST BE present in `dependencies` of both `app/package.json`
      // and `package.json (root folder)` in order to make it work here in Electron's Renderer process (src folder)
      // because it will loaded at runtime by Electron.
      // * A NodeJS's dependency imported with TS module import (ex: import { Dropbox } from 'dropbox') CAN only be present
      // in `dependencies` of `package.json (root folder)` because it is loaded during build phase and does not need to be
      // in the final bundle. Reminder : only if not used in Electron's Main process (app folder)

      // If you want to use a NodeJS 3rd party deps in Renderer process,
      // ipcRenderer.invoke can serve many common use cases.
      // https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendererinvokechannel-args
    }
  }

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }


  onFileSelected(file: File, rowFileModel: RowFileModel, locale: Locale) {
    let reader = new FileReader();
    reader.onload = (e) => {
      console.log(reader.result);
      this.processCsv(reader.result as string, rowFileModel, locale);
    };
    reader.readAsText(file);
  }

  processCsv(content: string, rowFileModel: RowFileModel, locale: Locale): void {

    let csvRowToResource = (csvRow: string, rowFileModel: RowFileModel, locale: Locale) => {

      let row = csvRow.split(',');
      let resource = {} as Resource;
      resource.translations = [];

      resource.id = row[rowFileModel.key];
      resource.translations.push({ locale: locale.id, value: row[rowFileModel.translation]?.trim() });

      return resource;
    }

    let rows = content.split('\n');

    let resources: Resource[] = this.electronService.getResourcesFromDisk();

    let project: Project = this.electronService.getProjectFromDisk();

    for (let row of rows) {

      let resource = csvRowToResource(row, rowFileModel, locale);

      if (!resource.id) continue;

      let resourceIndex = resources.findIndex(r => r.id == resource.id);

      if (resourceIndex == -1) {
        this.newResource(resources, resource, project);
      } else {
        this.updateResource(resources, resource, resourceIndex, locale);
      }


    }

    this.electronService.saveResourcesToDisk(resources);

  }

  private newResource(resources: Resource[], resource: Resource, project: Project) {
    let isBaseLocale: boolean = resource.translations[0].locale == project.baseLocale;
    let newResource = {} as Resource;
    newResource.id = resource.id;
    newResource.translations = [];
    for (let locale of project.locales) {
      if (locale.id == resource.translations[0].locale) {
        newResource.translations.push(resource.translations[0]);
      } else {
        newResource.translations.push({ locale: locale.id, value: isBaseLocale ? resource.translations[0].value : '' });
      }
    }
    resources.push(newResource);
  }

  private updateResource(resources: Resource[], resource: Resource, resourceIndex: number, locale: Locale) {
    let translationsIndex = resources[resourceIndex].translations.findIndex(t => t.locale == locale.id);
    resources[resourceIndex].translations[translationsIndex] = resource.translations[0];
  }

  get appDataPath(): string {
    return this.path.join(this.basePath, 'AppData');
  }

  get basePath(): string {
    return localStorage.getItem('path') as string;
  }

}
