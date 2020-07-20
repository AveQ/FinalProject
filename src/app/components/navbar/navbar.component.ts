import {Component} from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  rotateImage = false;
  name = 'asdddddddddddddddddddddddddddddddddddddddddddd';
  sidebarLock = true;

  focusonEmail: boolean = false;
  focusonPassword: boolean = false;
  dataInvalid: boolean = false;
  signup: boolean = false;
  authFailed = false;

}
