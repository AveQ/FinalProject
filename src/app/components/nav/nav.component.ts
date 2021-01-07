import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NavigationService} from '../../services/navigation.service';
import {AuthService} from '../../services/auth.service';
import {BehaviorSubject, Subscription} from 'rxjs';
import {User} from '../../model/user.model';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-navb',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  @Input() navImage = '';
  @Input() category = '';
  // sprawdź czy użytkownik jest zalogowany
  userSub: Subscription;
  isAuthenticated = false;
  isAuthenticatedAdmin = false;
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
    private router: Router,

  ) {

  }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(
      user => {
        if (user) {
          this.isAuthenticated = !!user;
          this.isAuthenticatedAdmin = user.user.isAdmin;
        }
      }
    );
    this.name === 'Sign up' ? this.account = 'Sign up' : this.account = 'Account';
    this.navigateService.returnNavSubject().subscribe(
      value => {
        this.selectRoute = value;
      }
    );
  }

  getClassImg() {
    return {
      height: '255px',
      fontFamily: '\'Roboto Condensed\', sans-serif;',
      background: 'linear-gradient(\n' +
        '      rgba(0, 0, 0, 0.5),\n' +
        '      rgba(0, 0, 0, 0.5)\n' +
        '  ), url(' + this.navImage + ') no-repeat top center fixed\n',
      backgroundSize: 'cover'
    };
  }

  openOtherMenu() {
    this.otherMenu = !this.otherMenu;
  }

  menuExit() {
    this.menuOpen = 2;
    this.otherMenu = false;
  }

  logout() {
    this.router.navigate(['./']);
    this.authService.logout();
    if (this.selectRoute === 0) {
      window.location.reload();
    }
  }
}
