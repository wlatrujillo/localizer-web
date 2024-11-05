import { Injectable } from '@angular/core';
import { Resource } from '@core/model/resource';
import { ElectronService } from '../electron/electron.srv';
import { Translation } from '@core/model/translation';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {


  constructor(private electronService: ElectronService) {
  }


  addResource(resource: Resource): void {
    this.electronService.addResource(resource);
  }

  getResources(): Resource[] {
    return this.electronService.getResourcesFromDisk();
  }

  getResourcesFilterByText(text: string): Resource[] {
    return this.electronService.getResourcesFilterByText(text);
  }


  updateResource(resource: Resource): void {
    this.electronService.updateResource(resource);
  }

  deleteResource(resourceId: string): void {
    this.electronService.deleteResource(resourceId);
  }

  updateTranslation(
    resourceId: string,
    translation: Translation): void {
    this.electronService.updateTranslation(resourceId, translation);
  }

}
