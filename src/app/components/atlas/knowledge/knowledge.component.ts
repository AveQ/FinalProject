import {Component, OnDestroy, OnInit} from '@angular/core';
import * as _ from 'lodash';
import {MuscleResponseData, MusclesService} from '../../../services/muscles.service';
import {TranslateService} from '@ngx-translate/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-knowledge',
  templateUrl: './knowledge.component.html',
  styleUrls: ['./knowledge.component.scss', '../../BMI/bmi.component.scss']
})
export class KnowledgeComponent implements OnInit, OnDestroy {
  isFront = true;
  titleMuscle = 'None';
  descriptionMuscle = '';
  partOfBody = 'Wybierz partię';
  muscles: [{
    _id: string,
    name: string,
    namePL: string,
    dbName: string,
    description: string,
    descriptionPL: string
  }];
  language = 'pl';
  paramsSubscription: Subscription;

  constructor(private musclesServices: MusclesService,
              private translate: TranslateService,
              private route: ActivatedRoute,
              private router: Router,
              private titleService: Title) {
  }

  ngOnInit(): void {
    this.language = this.translate.currentLang;
    this.language.toLowerCase() === 'pl' ? this.partOfBody = 'Wybierz partię' : this.partOfBody = 'Select a muscle';

    this.titleService.setTitle('Muscles | NFL-Center');
    this.musclesServices.getMuscles().subscribe(
      data => {
        this.muscles = data.muscles;
      }, error => {
      },
      () => {
        this.setRoute();
      }
    );
  }

  // sprawdz params i ustaw podstronke. jezeli inna od dozwolonych przekieruj na glowna
  setRoute() {
    this.paramsSubscription = this.route.queryParams.subscribe(
      (params: Params) => {
        if (params) {
          this.openMuscle(params.muscle);
        }
      }
    );
  }

  openMuscle(value) {
    if (value) {
      this.router.navigate(['/atlas/knowledge'], {queryParams: {muscle: value}});
      const index = _.findIndex(this.muscles, data => {
        return data.dbName === value;
      });

      let desc;
      let name;
      if (this.language.toLowerCase() === 'pl') {
        desc = 'descriptionPL';
        name = 'namePL';
      } else {
        desc = 'description';
        name = 'name';
      }
      this.partOfBody = this.muscles[index][name].toUpperCase();
      this.titleMuscle = this.muscles[index][name].toUpperCase();
      this.descriptionMuscle = this.muscles[index][desc];
    }
  }

  ngOnDestroy(): void {
  }
}
