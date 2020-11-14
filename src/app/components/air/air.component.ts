import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationService} from '../../services/navigation.service';
import {FormControl, FormGroup} from '@angular/forms';



@Component({
  selector: 'app-bmi',
  templateUrl: './air.component.html',
  styleUrls: ['./air.component.scss']
})
export class AirComponent implements OnInit, OnDestroy {
  airForm: FormGroup;
  entries = [
    {
      city: 'Zawiercie',

    }
  ];
  constructor(private navigateService: NavigationService) {
  }
  ngOnInit(): void {
    this.navigateService.changeNavSubject(4);
    this.airForm = new FormGroup({
      city: new FormControl(),
    });
  }
  onSubmit() {
    console.log(this.airForm.value);
  }
  ngOnDestroy(): void {
  }

}
