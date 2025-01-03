import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { Project } from '@core/model/project';
import { ProjectService } from '@core/service/project.service';

export const ProjectResolver: ResolveFn<Project> = (route, state) => {
  return inject(ProjectService).getById(route.params['_projectId']);
};
