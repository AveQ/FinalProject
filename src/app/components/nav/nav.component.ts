import {Component, OnInit} from '@angular/core';

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

  constructor() {
  }

  ngOnInit(): void {
    this.name === 'Sign up' ? this.account = 'Sign up' : this.account = 'Account';
  }

  changeSidebar() {
    this.sidebarLock = !this.sidebarLock;
  }

}
