import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'NFL Center';
  modalStatus = null;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.autoLogin();
    this.authService.modalMessage.subscribe(
      data => {
        this.modalStatus = data;
      }
    );
  }
}
