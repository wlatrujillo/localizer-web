import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { AdminService } from '../../core/service/admin.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.adminService.getAllProjects().subscribe(
      (data) => {
        console.log(data);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
