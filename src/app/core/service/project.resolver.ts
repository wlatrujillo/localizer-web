import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { Project } from '../model/project';
import { AdminService } from '../service/admin.service';

export const ProjectResolver: ResolveFn<Project> = (route, state) => {
  return inject(AdminService).getProjectById(route.params['_projectId']);
};
