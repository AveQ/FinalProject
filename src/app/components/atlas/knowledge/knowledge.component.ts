import {Component, OnDestroy, OnInit} from '@angular/core';
import * as _ from 'lodash';
import {MuscleResponseData, MusclesService} from '../../../services/muscles.service';
import {TranslateService} from '@ngx-translate/core';
import {Title} from '@angular/platform-browser';

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
  language = 'pl';

  constructor(private musclesServices: MusclesService,
              private translate: TranslateService,
              private titleService: Title) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Muscles | NFL-Center');
    this.language = this.translate.currentLang;
    this.language === 'pl' ? this.partOfBody = 'Wybierz partię' : this.partOfBody = 'Select muscle';
    this.musclesServices.getMuscles().subscribe(
      data => {
        this.muscles = data.muscles;
      }
    );
  }

  openMuscle(value, valueEN) {
    this.language === 'pl' ? this.partOfBody = valueEN.toUpperCase() : this.partOfBody = valueEN.toUpperCase();
    const index = _.findIndex(this.muscles, data => {
      return data.dbName === valueEN;
    });
    console.log(this.muscles[index]);
    this.titleMuscle = this.muscles[index].name;
    this.descriptionMuscle = this.muscles[index].description;
  }

  ngOnDestroy(): void {
  }
}
