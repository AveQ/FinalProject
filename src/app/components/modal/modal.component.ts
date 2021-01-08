import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  messageSuccessLogin = {
    pl: 'Zalogowano!',
    en: 'Logged in!'
  };
  messageSuccessLoginSec = {
    pl: 'Witaj w NFL Center -',
    en: 'Welcome to NFL Center - '
  };
  messageSuccessSignSec = {
    pl: 'Zarejestrowano!',
    en: 'Registered!'
  };
  messageSuccessSign = {
    pl: 'Możesz się teraz zalogować',
    en: 'You can sign in now'
  };
  messageSuccessLogout = {
    pl: 'Wylogowano!',
    en: 'Logged out!'
  };
  messageSuccessLogoutSec = {
    pl: 'Do zobaczenia!',
    en: 'See you soon!'
  };
  user;
  userName = 'User';
  activeStatus = '';
  activeMessage = '';
  activeMessageSec = '';
  language = 'pl';

  constructor(private authService: AuthService,
              private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.language = this.translate.currentLang.toLowerCase();
    this.authService.user.subscribe(
      data => {
        if (data) {
          this.user = data;
          data.user.nick !== '' ? this.userName = data.user.nick : this.userName = 'User';
        }
      }
    );
    this.authService.modalMessage.subscribe(
      data => {
        if (data === 'signup') {
          this.activeMessage = this.messageSuccessSign[this.language];
          this.activeMessageSec = this.messageSuccessSignSec[this.language];
          this.activeStatus = 'signup';
        } else if (data === 'login') {
          this.activeMessage = this.messageSuccessLogin[this.language];
          this.activeMessageSec = this.messageSuccessLoginSec[this.language];
          this.activeStatus = 'login';
        } else if (data === 'logout') {
          this.activeMessage = this.messageSuccessLogout[this.language];
          this.activeMessageSec = this.messageSuccessLogoutSec[this.language];
          this.activeStatus = 'logout';
        }
      }
    );
  }

  closeModal() {
    this.authService.closeModal();
  }
}
