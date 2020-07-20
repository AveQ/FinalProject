import {Component, OnInit} from '@angular/core';
import {NavigationService} from '../services/navigation.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isOpenSidebar = true;

  constructor(private navigationService: NavigationService) {
  }

  ngOnInit(): void {
    this.navigationService.isOpenSidebar.subscribe(
      value => {
        this.isOpenSidebar = value;
      }
    );
  }

}
