import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { AdminService } from '../../core/service/admin.service';
import { Project } from '../../core/model/project';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [ MatCardModule, MatButtonModule, MatGridListModule ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {

  constructor(private adminService: AdminService) { }

  projects: Project[] = [];

  ngOnInit() {
    this.adminService.getAllProjects().subscribe(
      (data) => {
        console.log(data);
        this.projects = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
