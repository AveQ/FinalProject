import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  messageSuccessLogin = 'Zalogowano!';
  messageSuccessLoginSec = 'Witaj w NFL Center - ';
  messageSuccessSign = 'Zarejestrowano!';
  messageSuccessSignSec = 'Możesz się teraz zalogować';
  messageSuccessLogout = 'Wylogowano!';
  messageSuccessLogoutSec = 'Do zobaczenia!';
  user;
  userName = 'User';
  activeStatus = '';
  activeMessage = '';
  activeMessageSec = '';

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
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
          this.activeMessage = this.messageSuccessSign;
          this.activeMessageSec = this.messageSuccessSignSec;
          this.activeStatus = 'signup';
        } else if (data === 'login') {
          this.activeMessage = this.messageSuccessLogin;
          this.activeMessageSec = this.messageSuccessLoginSec;
          this.activeStatus = 'login';
        } else if (data === 'logout') {
          this.activeMessage = this.messageSuccessLogout;
          this.activeMessageSec = this.messageSuccessLogoutSec;
          this.activeStatus = 'logout';
        }
      }
    );
  }

  closeModal() {
    this.authService.closeModal();
  }
}
