import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

import { Locale } from '@core/model/locale';
import { Constants } from '@core/service/electron/constants';

@Injectable({
  providedIn: 'root'
})
export class GeneratorJsSrv {
  ipcRenderer!: typeof ipcRenderer;
  webFrame!: typeof webFrame;
  childProcess!: typeof childProcess;
  fs!: typeof fs;
  path!: typeof path;

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



  exportToJson(locales: Locale[]): void {

    const resources = JSON.parse(this.fs.readFileSync(this.resourcesPath, 'utf8'));

    for (let locale of locales) {
      let json: any = {};
      for (let resource of resources) {
        json[resource.id] = resource.translations.find((translation: any) => translation.locale === locale.id)?.value;
      }
      if (this.isElectron) {
        this.createBuildFolder();
        const pathToResult = `${this.appBuildPath}\\${locale.id}.json`;
        this.fs.appendFileSync(pathToResult, JSON.stringify(json, null, 4));
      }
    }


  }


  exportToMenuJS(locales: Locale[]): void {

    const resources = JSON.parse(this.fs.readFileSync(this.resourcesPath, 'utf8'));

    for (let locale of locales) {
      let menu: any = {
        "COMMONS": {
          "MENU": {}
        }
      };
      for (let resource of resources) {
        menu.COMMONS.MENU[resource.id] = resource.translations.find((translation: any) => translation.locale === locale.id)?.value;
      }
      if (this.isElectron) {
        this.createBuildFolder();
        const pathToResult = this.path.join(this.appBuildPath, `menu-${locale.id}.js`);
        this.fs.appendFileSync(pathToResult, JSON.stringify(menu, null, 4));
      }
    }

  }
  get resourcesPath(): string {
    return this.path.join(this.appDataPath, Constants.RESOURCES_FILE_NAME);
  }


  get appBuildPath(): string {
    let basePath = localStorage.getItem('path') as string;
    return this.path.join(basePath, 'build');
  }

  get appDataPath(): string {
    let basePath = localStorage.getItem('path') as string;
    return this.path.join(basePath, 'AppData');
  }

  private createBuildFolder(): void {
    const path = this.appBuildPath;
    if (!this.fs.existsSync(path)) {
      this.fs.mkdirSync(path);
    }
  }


  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }


}
