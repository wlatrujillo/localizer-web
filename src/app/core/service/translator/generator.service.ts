import { Injectable } from '@angular/core';
import { GeneratorSqlSrv } from '../electron/generator.sql.srv';
import { GeneratorJsSrv } from '../electron/generator.js.srv';
import { Locale } from '@core/model/locale';

@Injectable({
  providedIn: 'root'
})
export class GeneratorService {

  constructor(
    private generatorSql: GeneratorSqlSrv,
    private generatorJs: GeneratorJsSrv) { }

  public toErrorsMySql(locales: Locale[], baseLocale: Locale): void {
    this.generatorSql.exportToErrorsMySql(locales, baseLocale);
  }

  public toCatalogMySql(locales: Locale[], baseLocale: Locale): void {
    this.generatorSql.exportToCatalogMySql(locales, baseLocale);
  }

  public toTransactionMySql(locales: Locale[], baseLocale: Locale): void {
    this.generatorSql.exportToTransactionMySql(locales, baseLocale);
  }

  public toMenuJS(locales: Locale[]): void {
    this.generatorJs.exportToMenuJS(locales);
  }

  public toJson(locales: Locale[]): void {
    this.generatorJs.exportToJson(locales);
  }

}
