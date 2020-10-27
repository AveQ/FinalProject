import {Component, ElementRef, HostListener, OnInit, Renderer2} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit{
  signinForm: FormGroup;
  focusonEmail: boolean = false;
  focusonPassword: boolean = false;
  focusWeight: boolean = false;
  dataInvalid: boolean = false;
  signup: boolean = false;
  authFailed = false;
  rememberMe = false;

  constructor(
    private ele: ElementRef,
    private ren: Renderer2,
    private router: Router) {
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
  }
  onFocus(name: string) {
    if ((name === 'password' && this.focusonPassword === true ) ||
      (name === 'password' && this.focusonPassword === false &&
        this.signinForm.get('password').value !== null && this.signinForm.get('password').value !== '')
    ) {
      return 'form__label--inputfocus'; // return class with animation for label in form
    } else if ((name === 'email' && this.focusonEmail === true ) ||
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
