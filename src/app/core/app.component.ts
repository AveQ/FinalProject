import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'NFL Center';
  modalStatus = null;

  constructor(private authService: AuthService,
              private translate: TranslateService) {
    translate.setDefaultLang('pl');
  }

  ngOnInit(): void {
    // sprawdzaj przypisany język i podczas zmiany zmien na inny
    this.authService.user.subscribe(
      data => {
        // gdy uzytkownik zalogowany czytaj wartosc przypisana do bazy danych
        if (data) {
          this.translate.use(data.user.language.toLowerCase());
        } else {
          // gdy wylogowany czytaj z localstorage
          const language = JSON.parse(localStorage.getItem('language'));
          if (language) {
            this.translate.use(language.toLowerCase());
          }
        }
      }
    );
    // automatyczne wylogowaniue po godzinie
    this.authService.autoLogin();
    // modale informujace o akcji - zalogowania/wylogowania/zarejestrowania
    this.authService.modalMessage.subscribe(
      data => {
        this.modalStatus = data;
      }
    );
  }
}
