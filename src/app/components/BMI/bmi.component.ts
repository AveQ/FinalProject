import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationService} from '../../services/navigation.service';
import {FormControl, FormGroup} from '@angular/forms';



@Component({
  selector: 'app-bmi',
  templateUrl: './bmi.component.html',
  styleUrls: ['./bmi.component.scss']
})
export class BMIComponent implements OnInit, OnDestroy {
  bmiForm: FormGroup;
  constructor(private navigateService: NavigationService) {
  }
  ngOnInit(): void {
    this.navigateService.changeNavSubject(4);
    this.bmiForm = new FormGroup({
      weight: new FormControl(),
      height: new FormControl(),
      man: new FormControl(),
      woman: new FormControl(),
    });
  }
  onSubmit() {
    console.log(this.bmiForm.value);
  }
  ngOnDestroy(): void {
  }

}
