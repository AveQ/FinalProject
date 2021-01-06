import {Component, OnDestroy, OnInit} from '@angular/core';
import * as _ from 'lodash';
import {MuscleResponseData, MusclesService} from '../../../services/muscles.service';

@Component({
  selector: 'app-knowledge',
  templateUrl: './knowledge.component.html',
  styleUrls: ['./knowledge.component.scss', '../../BMI/bmi.component.scss']
})
export class KnowledgeComponent implements OnInit, OnDestroy {
  isFront = true;
  titleMuscle = 'brak';
  descriptionMuscle = 'brak';
  partOfBody = 'Wybierz partię';
  muscles: [{
    _id: string,
    name: string,
    dbName: string,
    description: string
  }];
  constructor(private musclesServices: MusclesService) {
  }

  ngOnInit(): void {
    this.musclesServices.getMuscles().subscribe(
      data => {
        this.muscles = data.muscles;
      }
    );
  }
  openMuscle(value) {
    const index = _.findIndex(this.muscles, data => {
      return data.dbName === value;
    });
    console.log(this.muscles[index]);
    this.titleMuscle = this.muscles[index].name;
    this.descriptionMuscle = this.muscles[index].description;
  }
  ngOnDestroy(): void {
  }
}
