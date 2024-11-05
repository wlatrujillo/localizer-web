import { Injectable } from '@angular/core';
import { Project } from '@core/model/project';
import { ElectronService } from '../electron/electron.srv';
import { Resource } from '@core/model/resource';
import { Locale } from '@core/model/locale';

let allLocales = [
  { id: 'ES', name: 'Español' },
  { id: 'ES-EC', name: 'Español Ecuador' },
  { id: 'ES-PA', name: 'Español Panamá' },
  { id: 'ES-CO', name: 'Español Colombia' },
  { id: 'ES-MX', name: 'Español México' },
  { id: 'ES-ES', name: 'Español España' },
  { id: 'ES-BO', name: 'Español Bolivia' },
  { id: 'ES-AR', name: 'Español Argentina' },
  { id: 'EN', name: 'Inglés' },
  { id: 'EN-US', name: 'Inglés US' },
  { id: 'EN-GB', name: 'Inglés UK' },
  { id: 'FR-FR', name: 'Frances France' },
  { id: 'FR-CA', name: 'Frances Canada' },
]


@Injectable({
  providedIn: 'root'
})
export class ProjectService {


  constructor(private electronService: ElectronService) {
  }

  addLocaleToAllResources(locale: Locale): void {
    this.electronService.addLocaleToAllResources(locale);
  }

  removeLocaleFromAllResources(locale: Locale): void {
    this.electronService.removeLocaleFromAllResources(locale);
  }

  createProject(path: string, project: Project, resources: Resource[]): void {
    this.electronService.createProject(path, project, resources);
  }

  getProject(): Project {
    return this.electronService.getProjectFromDisk();
  }

  updateProject(project: Project): void {
    this.electronService.saveProjectToDisk(project);
  }

  getAllLocales(): Locale[] {
    return allLocales;
  }

}
