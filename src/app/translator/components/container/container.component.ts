import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import {MatTabsModule} from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { EditorComponent } from '../editor/editor.component';
import { Project } from '@core/model/project';

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [ RouterModule, MatTabsModule, MatIconModule, EditorComponent],
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }
  project: Project = {} as Project;

  ngOnInit(): void {
    console.log('ContainerComponent initialized.', this.route.snapshot.data);
    this.project = this.route.snapshot.data['project'] as Project
  }



}
