import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { format } from 'sql-formatter';

import { Locale } from '@core/model/locale';
import { Constants } from '@core/service/electron/constants';

@Injectable({
  providedIn: 'root'
})
export class GeneratorSqlSrv {
  ipcRenderer!: typeof ipcRenderer;
  webFrame!: typeof webFrame;
  childProcess!: typeof childProcess;
  fs!: typeof fs;
  path!: typeof path;
  format!: typeof format;

  constructor() {

    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = (window as any).require('electron').ipcRenderer;
      this.webFrame = (window as any).require('electron').webFrame;
      this.fs = (window as any).require('fs');
      this.path = (window as any).require('path');
      this.format = (window as any).require('sql-formatter');
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

  private toErrorMySql(resource: any, locale: string, baseLocale: string): string {

    let baseTranslation = resource
      .translations
      .find((translation: any) => translation.locale == baseLocale);

    let translation = resource
      .translations
      .find((translation: any) => translation.locale == locale);


    if (!translation || !baseTranslation) {
      return '';
    }

    let result = '';

    if (baseTranslation.locale == translation.locale || baseTranslation.value != translation.value) {
      result =
        `select @pc_id := pc_id 
    from cobis.ad_pseudo_catalogo
    where pc_tipo = 'E' 
    and pc_identificador = 'c-cobis-cl-errores'
    and pc_codigo_int = ${resource.id};`;

      result +=
        `if exists (select 1 from cobis.ad_recurso 
        where re_pc_id = @pc_id and re_cultura = '${translation.locale}') 
        then
          update cobis.ad_recurso set re_valor = '${translation.value}'
          where re_pc_id = @pc_id
          and re_cultura = '${translation.locale}';
        else
          insert into cobis.ad_recurso (re_pc_id, re_cultura, re_valor)
          values (@pc_id, '${translation.locale}', '${translation.value}');
        end if;`;
    }

    return result;
  }

  private toCatalogMySql(resource: any, locale: string, baseLocale: string): string {

    let baseTranslation = resource
      .translations
      .find((translation: any) => translation.locale == baseLocale);

    let translation = resource
      .translations
      .find((translation: any) => translation.locale == locale);


    if (!translation || !baseTranslation) {
      return '';
    }

    let result = '';

    if (baseTranslation.locale == translation.locale || baseTranslation.value != translation.value) {
      result =
        `select @pc_id := pc_id 
    from cobis.ad_pseudo_catalogo
    where pc_tipo = 'C'
    and pc_identificador = '${resource.id.split('@')[0]}' 
    and pc_codigo = ${resource.id.split('@')[1]};`;

      result +=
        `if exists (select 1 from cobis.ad_recurso 
        where re_pc_id = @pc_id and re_cultura = '${translation.locale}') 
        then
          update cobis.ad_recurso set re_valor = '${translation.value}'
          where re_pc_id = @pc_id
          and re_cultura = '${translation.locale}';
        else
          insert into cobis.ad_recurso (re_pc_id, re_cultura, re_valor)
          values (@pc_id, '${translation.locale}', '${translation.value}');
        end if;`;
    }

    return result;
  }

  private toTransactionMySql(resource: any, locale: string, baseLocale: string): string {

    let baseTranslation = resource
      .translations
      .find((translation: any) => translation.locale == baseLocale);

    let translation = resource
      .translations
      .find((translation: any) => translation.locale == locale);


    if (!translation || !baseTranslation) {
      return '';
    }

    let result = '';

    if (baseTranslation.locale == translation.locale || baseTranslation.value != translation.value) {
      result =
        `select @pc_id := pc_id 
    from cobis.ad_pseudo_catalogo
    where pc_tipo = 'T' 
    and pc_identificador = 'c-cobis-cl-ttransaccion'
    and pc_codigo_int = ${resource.id};`;

      result +=
        `if exists (select 1 from cobis.ad_recurso 
        where re_pc_id = @pc_id and re_cultura = '${translation.locale}') 
        then
          update cobis.ad_recurso set re_valor = '${translation.value}'
          where re_pc_id = @pc_id
          and re_cultura = '${translation.locale}';
        else
          insert into cobis.ad_recurso (re_pc_id, re_cultura, re_valor)
          values (@pc_id, '${translation.locale}', '${translation.value}');
        end if;`;
    }

    return result;
  }

  private getSpHeader(procedureName: string): string {
    let header = 'use cobis;\n';
    let cleanProcedureName = procedureName.replace(/-/g, '_');
    header += `DROP PROCEDURE IF EXISTS ${cleanProcedureName};\n`;
    header += 'DELIMITER //\n';
    header += `CREATE PROCEDURE ${cleanProcedureName}()\n`;
    header += 'BEGIN\n';
    return header;
  }

  private getSpFooter(procedureName: string): string {
    let cleanProcedureName = procedureName.replace(/-/g, '_');
    let footer = `\nEND//\n`;
    footer += `DELIMITER ;\n`;
    footer += `CALL ${cleanProcedureName}();\n`;
    footer += `DROP PROCEDURE IF EXISTS ${cleanProcedureName};\n`;
    return footer;
  }


  private getScriptMySqlForLocales(
    procedureName: string,
    locale: string,
    baseLocale: string,
    generateBody: (r: any, l: any, b: any) => string): string {

    let header = this.getSpHeader(procedureName);
    let footer = this.getSpFooter(procedureName);

    const resources = JSON.parse(this.fs.readFileSync(this.resourcesPath, 'utf8'));
    let body = '';
    resources.forEach((resource: any) => {
      body += generateBody(resource, locale, baseLocale);
    });

    body = format(body,
      {
        language: 'mysql',
        tabWidth: 2,
        keywordCase: 'upper',
        linesBetweenQueries: 1,
      });



    return header + body + footer;
  }

  exportToErrorsMySql(locales: Locale[], baseLocale: Locale): void {

    for (let locale of locales) {

      if (this.isElectron) {
        this.createBuildFolder();
        let sql = this.getScriptMySqlForLocales(`COBIS_errors_mysql_${locale.id}`,
          locale.id, baseLocale.id, this.toErrorMySql);
        const filePath = this.path.join(this.appBuildPath, `COBIS_errors_mysql_${locale.id}.sql`);
        if (this.fs.existsSync(filePath)) {
          this.fs.unlinkSync(filePath);
        }
        this.fs.appendFileSync(filePath, sql);
      }

    }


  };

  exportToCatalogMySql(locales: Locale[], baseLocale: Locale): void {
    for (let locale of locales) {
      if (this.isElectron) {
        let sql = this.getScriptMySqlForLocales(`COBIS_catalog_mysql_${locale.id}`,
          locale.id, baseLocale.id, this.toCatalogMySql);
        this.createBuildFolder();
        const pathToResult = this.path.join(this.appBuildPath, `COBIS_catalog_mysql_${locale.id}.sql`);
        if (this.fs.existsSync(pathToResult)) {
          this.fs.unlinkSync(pathToResult);
        }
        this.fs.appendFileSync(pathToResult, sql);
      }
    }
  };

  exportToTransactionMySql(locales: Locale[], baseLocale: Locale): void {
    for (let locale of locales) {

      if (this.isElectron) {
        let sql = this.getScriptMySqlForLocales(`COBIS_trn_mysql_${locale.id}`,
          locale.id, baseLocale.id, this.toTransactionMySql);
        this.createBuildFolder();
        const pathToResult = this.path.join(this.appBuildPath, `COBIS_trn_mysql_${locale.id}.sql`);
        if (this.fs.existsSync(pathToResult)) {
          this.fs.unlinkSync(pathToResult);
        }
        this.fs.appendFileSync(pathToResult, sql);
      }
    }
  };

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
