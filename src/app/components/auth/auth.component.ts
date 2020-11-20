import {Component, ElementRef, HostListener, OnInit, Renderer2} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthResponseData, AuthService} from '../../services/auth.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  // Observable dotyczący logowania i rejestracji
  authObs: Observable<AuthResponseData>;
  signinForm: FormGroup;
  focusonEmail: boolean = false;
  focusonPassword: boolean = false;
  focusWeight: boolean = false;
  dataInvalid: boolean = false;
  signup: boolean = false;
  authFailed = false;
  rememberMe = false;

  // Czas oczewkiwania na połaczenie zastąpiona animacja

  constructor(
    private ele: ElementRef,
    private ren: Renderer2,
    private router: Router,
    private authService: AuthService) {
  }

  ngOnInit(): void {
    this.signinForm = new FormGroup(
      {
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, Validators.required)
      }
    );
  }

  onSubmit() {
    // ustaw animacje
    this.authFailed = false;
    // przypisz odpowiedni observable
    this.authObs =
      this.signup ? this.authService.signup(this.signinForm.value) :
        this.authService.login(this.signinForm.value);
    // subscribe
    this.authObs.subscribe(
      resData => {
        console.log(resData);
        this.router.navigate(['/']);
      },
      error => {
        if (error.error.message === 'Auth failed') {
          this.authFailed = true;
        }
      },
      () => {
      }
    );


    console.log(this.signinForm.value);
  }

  onFocus(name: string) {
    if ((name === 'password' && this.focusonPassword === true) ||
      (name === 'password' && this.focusonPassword === false &&
        this.signinForm.get('password').value !== null && this.signinForm.get('password').value !== '')
    ) {
      return 'form__label--inputfocus'; // return class with animation for label in form
    } else if ((name === 'email' && this.focusonEmail === true) ||
      (name === 'email' && this.focusonEmail === false &&
        this.signinForm.get('email').value !== null && this.signinForm.get('email').value !== '')
    ) {
      return 'form__label--inputfocus'; // return class with animation for label in form
    } else {
      return 'form__label';
    }
  }

  closeComponent() {

  }
}
