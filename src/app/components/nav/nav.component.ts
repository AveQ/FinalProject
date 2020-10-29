import {Component, OnInit} from '@angular/core';
import {NavigationService} from '../../services/navigation.service';

@Component({
  selector: 'app-navb',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  rotateImage = false;
  name = 'Gosia';
  sidebarLock = true;
  account: string = 'Account';
  selectRoute: number = 0;
  focusonEmail: boolean = false;
  focusonPassword: boolean = false;
  dataInvalid: boolean = false;
  signup: boolean = false;
  authFailed = false;
  menuOpen = 0;

  constructor(private navigateService: NavigationService) {
  }

  ngOnInit(): void {
    this.name === 'Sign up' ? this.account = 'Sign up' : this.account = 'Account';
    this.navigateService.returnNavSubject().subscribe(
      value => {
        this.selectRoute = value;
      }
    );
  }

  changeSidebar() {
    this.sidebarLock = !this.sidebarLock;
  }

}
