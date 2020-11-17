import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationService} from '../../services/navigation.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-bmi',
  templateUrl: './bmi.component.html',
  styleUrls: ['./bmi.component.scss']
})
export class BMIComponent implements OnInit, OnDestroy {
  bmiForm: FormGroup;
  bmi = null;
  constructor(private navigateService: NavigationService, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.navigateService.changeNavSubject(4);
    this.buildForm();
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
