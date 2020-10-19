import {Component, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {NavigationService} from '../services/navigation.service';

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

  constructor(private userService: UserService,
              private navigationService: NavigationService) {
  }

  ngOnInit(): void {
    this.name = this.userService.getUserName();
    this.name === 'Sign up' ? this.account = 'Sign up' : this.account = 'Account';
  }

  changeSidebar() {
    this.sidebarLock = !this.sidebarLock;
    this.navigationService.changeSidebar(this.sidebarLock);
  }

}
