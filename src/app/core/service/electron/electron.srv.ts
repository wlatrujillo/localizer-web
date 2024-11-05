import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

import { Resource } from '../../model/resource';
import { Project } from '../../model/project';
import { Observable, Subject, of } from 'rxjs';
import { Constants } from '@core/service/electron/constants';
import { Locale } from '@core/model/locale';
import { Translation } from '@core/model/translation';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {

  project: Project = {} as Project;

  resources: Resource[] = [];

  ipcRenderer!: typeof ipcRenderer;
  webFrame!: typeof webFrame;
  childProcess!: typeof childProcess;
  fs!: typeof fs;
  path !: typeof path;

  subject = new Subject<string>();

  constructor() {


    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = (window as any).require('electron').ipcRenderer;
      this.webFrame = (window as any).require('electron').webFrame;
      this.fs = (window as any).require('fs');
      this.path = (window as any).require('path');

      this.childProcess = (window as any).require('child_process');
      this.childProcess.exec('node -v', (error, stdout, stderr) => {
        if (error) {
          console.error(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout:\n${stdout}`);
      });

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

  /*saveResourceToDisk = (url: string, filePath: string) => {
    return new Promise((resolve, reject) => {
      this.ipcRenderer.invoke('saveResourceToDisk', url, filePath).then((result: any) => {
        resolve(result);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }*/





  // Project services

  saveProjectToDisk = (data: Project) => {
    if (!this.basePath) return;
    this.project = data;
    if (this.isElectron) {
      this.fs.writeFileSync(this.path.join(this.basePath, Constants.PROJECT_FILE_NAME),
        JSON.stringify(data, null, 4),
        {
          encoding: "utf8",
          flag: "w",
          mode: 0o666
        });
    }
  }

  createFolder = (path: string) => {

    if (this.isElectron) {
      if (this.fs.existsSync(path)) {
        return;
      }
      this.fs.mkdirSync(path, { recursive: true });
    }

  }

  removeLocaleFromAllResources(locale: Locale): void {
    if (locale.id == this.project.baseLocale) {
      throw new Error('No puede eliminar la cultura base');
    }
    let index = this.project.locales.findIndex((l: Locale) => l.id == locale.id);
    this.project.locales.splice(index, 1);
    let resources = this.getResourcesFromDisk();
    this.saveProjectToDisk(this.project);
    resources.forEach((resource: Resource) => {
      let index = resource.translations.findIndex((t: Translation) => t.locale == locale.id);
      resource.translations.splice(index, 1);
    });

    this.saveResourcesToDisk(resources);
  }

  addLocaleToAllResources(locale: Locale): void {

    let resources = this.getResourcesFromDisk();

    resources.forEach((resource: Resource) => {
      let baseTranslation = resource.translations
        .find((t: Translation) =>
          t.locale == this.project.baseLocale);
      resource.translations.push({
        locale: locale.id,
        value: baseTranslation?.value || ''
      });
    });
    this.project.locales.push(locale);
    this.saveResourcesToDisk(resources);
    this.saveProjectToDisk(this.project);
  }

  createProject(path: string, project: Project, resources: Resource[]): void {
    this.saveProjectToDisk(project);
    //create folder AppData
    this.createFolder(this.path.join(path, 'AppData'));
    this.saveResourcesToDisk(resources);
  }

  getProjectFromDisk = (): Project => {
    if (!this.basePath) return {} as Project;
    if (this.isElectron) {
      let data = this.fs.readFileSync(this.path.join(this.basePath, Constants.PROJECT_FILE_NAME), 'utf8');
      this.project = JSON.parse(data);
      return this.project;
    }
    return {} as Project;
  }


  // Dialog services

  showOpenDialog = (): Observable<string> => {
    if (this.isElectron) {
      this.ipcRenderer.invoke('showOpenDialog', {
        title: 'Select a file',
        buttonLabel: 'Abrir',
        filters: [
          { name: 'Archivos', extensions: ['json'] },
        ],
        properties: ['openFile']
      })
        .then((result: any) => {
          console.log(result);
          if (result.canceled) {
            localStorage.removeItem('path');
          } else {
            //TO-DO: Validar que sea un archivo json and that contains the correct structure
            const path = this.path.dirname(result.filePaths[0]);
            localStorage.setItem('path', path);
            this.subject.next(result.filePaths[0]);
          }
        })
        .catch((error: any) => {
          console.error(error);
          this.subject.error(error);
        });
    }
    return this.subject;
  }

  showOpenDialogDirectory = (): Observable<string> => {
    if (this.isElectron) {
      this.ipcRenderer.invoke('showOpenDialog', {
        title: 'Selccione una carpeta',
        buttonLabel: 'Seleccionar carpeta',
        properties: ['openDirectory']
      })
        .then((result: any) => {
          console.log(result);
          if (result.canceled) {
            localStorage.removeItem('path');
          } else {
            this.subject.next(result.filePaths[0]);
            localStorage.setItem('path', result.filePaths[0]);
          }
        })
        .catch((error: any) => {
          console.error(error);
          this.subject.error(error);
        });
    }
    return this.subject;
  }


  // Resources
  saveResourcesToDisk = (data: Resource[]) => {
    if (this.isElectron) {
      this.fs.writeFileSync(this.path.join(this.appDataPath, Constants.RESOURCES_FILE_NAME),
        JSON.stringify(data, null, 4),
        {
          encoding: "utf8",
          flag: "w",
          mode: 0o666
        });
    }
  }

  getResourcesFromDisk = () => {

    this.resources = [];

    if (!this.basePath) return this.resources;

    if (this.isElectron) {
      let data = this.fs.readFileSync(this.path.join(this.appDataPath, Constants.RESOURCES_FILE_NAME), 'utf8');
      this.resources = JSON.parse(data);
      return this.resources;
    }
    return this.resources;
  }
  addResource(resource: Resource): void {
    let found = this.resources.some((r: Resource) => r.id == resource.id);
    if (found) {
      throw new Error(`El recurso con identificador ${resource.id} ya existe`);
    }

    this.resources.push(resource); // add resource to the end of the array
    this.saveResourcesToDisk(this.resources);
  }

  getResourcesFilterByText(text: string): Resource[] {
    if (!text) {
      return this.resources;
    }
    return this.resources
      .filter((resource) => {
        return resource.id?.includes(text) ||
          resource.translations?.some((translation) => {
            return translation.value?.includes(text);
          });
      });
  }


  updateResource(resource: Resource): void {
    let index = this.resources.findIndex((r: Resource) => r.id == resource.id);
    if (index < 0) return;
    this.resources[index] = resource; // replace resource at index
    this.saveResourcesToDisk(this.resources);
  }

  deleteResource(resourceId: string): void {
    let index = this.resources.findIndex((r: Resource) => r.id == resourceId);
    if (index < 0) return;
    this.resources.splice(index, 1); // remove 1 element from index
    this.saveResourcesToDisk(this.resources);
  }

  updateTranslation(
    resourceId: string,
    translation: Translation): void {
    let resource = this.resources.find((r: Resource) => r.id == resourceId);
    if (!resource) return;
    let index = resource.translations.findIndex((t: any) => t.locale == translation.locale);
    if (index < 0) return;
    resource.translations[index] = translation;
    this.saveResourcesToDisk(this.resources);
  }



  get appDataPath(): string {
    return this.path.join(this.basePath, 'AppData');
  }

  get basePath(): string {
    return localStorage.getItem('path') || '';
  }

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }



}
