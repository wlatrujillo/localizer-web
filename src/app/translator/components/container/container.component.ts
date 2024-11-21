import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, NavigationEnd, NavigationStart } from '@angular/router';
import {MatTabsModule} from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [ RouterModule, MatTabsModule, MatIconModule ],
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }



}
