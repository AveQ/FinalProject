import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationService} from '../../services/navigation.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Title} from '@angular/platform-browser';


@Component({
  selector: 'app-bmi',
  templateUrl: './bmi.component.html',
  styleUrls: ['./bmi.component.scss']
})
export class BMIComponent implements OnInit, OnDestroy {
  bmiForm: FormGroup;
  bmi = null;
  user;
  heightUser;
  weightUser;

  constructor(private authService: AuthService,
              private navigateService: NavigationService,
              private fb: FormBuilder,
              private titleService: Title) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('BMI | NFL-Center');
    this.authService.user.subscribe(
      data => {
        if (data) {
          this.user = data;
          this.heightUser = data.user.height;
          this.weightUser = data.user.weight;
        }
      }
    );
    this.navigateService.changeNavSubject(4);
    this.buildForm();
  }

  loadUserValue() {
    this.bmi = +this.calcBMI(this.heightUser, this.weightUser);
  }

  // budownaie formularza startowego - pobieranie danych do bmi
  buildForm() {
    this.bmiForm = new FormGroup({
      weight: new FormControl(null, Validators.required),
      height: new FormControl(null, Validators.required),
      man: new FormControl(false),
      woman: new FormControl(false),
    });
  }

  // odznacz inne checkboxy przy zaznaczeniu jednego
  changeOtherCheckbox(value) {
    if (value === 'man') {
      this.bmiForm.get('woman').setValue(false);
    } else {
      this.bmiForm.get('man').setValue(false);
    }
  }

  // oblicz BMI
  calcBMI(height, weight) {
    return (weight / (height / 100 * height / 100)).toPrecision(4);
  }

  onSubmit() {
    this.bmi = +this.calcBMI(this.bmiForm.get('height').value, this.bmiForm.get('weight').value);
  }

  ngOnDestroy(): void {
  }

}
