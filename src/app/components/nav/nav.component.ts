import {Component, OnInit} from '@angular/core';
import {NavigationService} from '../../services/navigation.service';
import {AuthService} from '../../services/auth.service';
import {BehaviorSubject, Subscription} from 'rxjs';
import {User} from '../../model/user.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navb',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  // sprawdź czy użytkownik jest zalogowany
  userSub: Subscription;
  isAuthenticated = false;
  // inne - stylowanie
  rotateImage = false;
  name = 'User';
  account: string = 'Account';
  selectRoute: number = 0;
  menuOpen = 0;
  otherMenu = false;

  constructor(
    private navigateService: NavigationService,
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(
      user => {
        this.isAuthenticated = !!user;
      }
    );
    this.name === 'Sign up' ? this.account = 'Sign up' : this.account = 'Account';
    this.navigateService.returnNavSubject().subscribe(
      value => {
        this.selectRoute = value;
      }
    );
  }

  openOtherMenu() {
    this.otherMenu = !this.otherMenu;
  }

  menuExit() {
    this.menuOpen = 2;
    this.otherMenu = false;
  }

  logout() {
    this.authService.logout();
  }
}
