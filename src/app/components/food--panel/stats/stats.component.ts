import {Component, DoCheck, Input, OnInit} from '@angular/core';
import {UserService} from '../../../services/user.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {ExerciseService} from '../../../services/exercise.service';
import {AuthService} from '../../../services/auth.service';
import {FoodService} from '../../../services/food.service';
import * as _ from 'lodash';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  @Input() currentDay;
  @Input() waterData;
  @Input() meals;
  summ;
  wrongData = false;
  bars = [
    {
      value: 30,
      max: 100,
      name: 'Kalorie',
      nameEn: 'Calories',
      type: 'success'
    },
    {
      value: 50,
      max: 100,
      name: 'Białka',
      nameEn: 'Proteins',
      type: 'success'
    },
    {
      value: 40,
      max: 100,
      name: 'Tłuszcze',
      nameEn: 'Fats',
      type: 'success'
    },
    {
      value: 10,
      max: 100,
      name: 'Węglowodany',
      nameEn: 'Carbohydrates',
      type: 'success'
    }
  ];
  private user;
  private userId;
  exercisesTime = 0;
  exercisesKcal = 0;
  exercisesCounter = 0;
  todayExercises = [];
  meal = [];
  language = 'PL';
  @Input() mealPDF;

  ngOnInit(): void {
    this.language = this.translate.currentLang;
    this.authService.user.subscribe(
      data => {
        if (data) {
          this.user = data;
          this.userId = this.user.user.id;
        }
      }
    );
    this.userService.summ.subscribe(data => {
      if (data) {
        this.summ = data;
        for (let i = 0; i < 4; i++) {
          this.bars[i].max = this.summ[i].max;
          this.bars[i].value = this.summ[i].today;
          if (this.bars[i].max < this.bars[i].value) {
            this.bars[i].type = 'danger';
          } else {
            this.bars[i].type = 'success';
          }
          if (this.bars[i].max === 0) {
            this.wrongData = true;
          }
        }
      }
    });
    this.getUserHistoryExercises();

  }

  constructor(private userService: UserService,
              private exerciseService: ExerciseService,
              private authService: AuthService,
              private foodService: FoodService,
              private translate: TranslateService) {

  }

  getUserHistoryExercises() {
    if (this.userId) {
      this.exerciseService.loadUserAllHistory(this.userId).subscribe(
        data => {
          for (const element in data) {
            // sprawdz czy data sie zgadza i czy istnieje
            if (data.hasOwnProperty(element) &&
              new Date(this.currentDay.time).getDate() === new Date(data[element].date).getDate() &&
              new Date(this.currentDay.time).getMonth() === new Date(data[element].date).getMonth()) {
              console.log(new Date(data[element].date).getMonth())
              this.sumKcalAndTime(data[element].exercises);
            }
          }
        }, error => {
        },
        () => {

        }
      );
    }
  }

  sumKcalAndTime(exercises) {
    let kcal = 0;
    let time = 0;
    let counter = 0;
    for (const point in exercises) {
      if (exercises.hasOwnProperty(point)) {
        kcal += exercises[point].kcal;
        time += exercises[point].time;
        counter++;
        // przygotowania do PDF
        this.exerciseService.getExercise(exercises[point].idExercise).subscribe(
          data => {
            this.todayExercises.push({
              kcal: exercises[point].kcal,
              time: exercises[point].time,
              name: data.name
            });
          }, error => {
          },
          () => {

          }
        );
      }
    }
    this.exercisesTime = time;
    this.exercisesKcal = kcal;
    this.exercisesCounter = counter;
    console.log(this.exercisesCounter)
  }

  async generatePDF() {
    // fix bug UTF8
    this.meals[0].name = 'Sniadanie';
    this.meals[1].name = 'II Sniadanie';

    let spaceY = 10;
    const arrayTitles = ['Kalorie', 'Bialko', 'Tluszcze', 'Weglowodany'];

    const date = new Date(this.currentDay.time);
    const pdf = new jsPDF();

    pdf.setFont(' font-family: \'Roboto Condensed\', sans-serif;', 'font-weight: bold;');
    pdf.setFontSize(24);
    // TYTUL
    let textWidth = pdf.getStringUnitWidth('PODSUMOWANIE - ' + date.getDate() +
      '.' + (date.getMonth() + 1) + '.' + date.getFullYear()) * pdf.getFontSize() / pdf.internal.scaleFactor;
    let textOffset = (pdf.internal.pageSize.width - textWidth) / 2;
    pdf.text('PODSUMOWANIE - ' + date.getDate() +
      '.' + (date.getMonth() + 1) + '.' + date.getFullYear(), textOffset, spaceY);
    pdf.setFontSize(18);
    spaceY = spaceY + 20;
    // KCAL I MACRO
    for (let i = 0; i < 4; i++) {
      textWidth = pdf.getStringUnitWidth(arrayTitles[i]) * pdf.getFontSize() / pdf.internal.scaleFactor;
      textOffset = (pdf.internal.pageSize.width - textWidth) / 2;
      pdf.text(arrayTitles[i], textOffset, spaceY);
      spaceY = spaceY + 8;
      textWidth = pdf.getStringUnitWidth(this.bars[i].value.toPrecision(4) +
        ' kcal / ' + this.bars[i].max.toPrecision(4) + ' kcal') * pdf.getFontSize() / pdf.internal.scaleFactor;
      textOffset = (pdf.internal.pageSize.width - textWidth) / 2;
      pdf.text(this.bars[i].value.toPrecision(4) + ' kcal / ' + this.bars[i].max.toPrecision(4) + ' kcal', textOffset, spaceY);
      spaceY = spaceY + 10;
    }
    spaceY = spaceY + 10;
    // CWICZENIA
    textWidth = pdf.getStringUnitWidth('Cwiczenia:') * pdf.getFontSize() / pdf.internal.scaleFactor;
    textOffset = (pdf.internal.pageSize.width - textWidth) / 2;
    pdf.text('Cwiczenia:', textOffset, spaceY);
    spaceY = spaceY + 10;

    let counter = 0;
    for (const exer in this.todayExercises) {
      if (this.todayExercises.hasOwnProperty(exer)) {
        counter++;
        textWidth = pdf.getStringUnitWidth(counter + '. ' + this.todayExercises[exer].name)
          * pdf.getFontSize() / pdf.internal.scaleFactor;
        textOffset = (pdf.internal.pageSize.width - textWidth) / 2;

        pdf.text(counter + '. ' + this.todayExercises[exer].name, textOffset, spaceY);
        spaceY = spaceY + 10;

        textWidth = pdf.getStringUnitWidth('Czas: '
          + this.todayExercises[exer].time + ' min, spalone kcal: '
          + this.todayExercises[exer].kcal + ' kcal')
          * pdf.getFontSize() / pdf.internal.scaleFactor;

        textOffset = (pdf.internal.pageSize.width - textWidth) / 2;

        pdf.text('Czas: '
          + this.todayExercises[exer].time + ' min, spalone kcal: '
          + this.todayExercises[exer].kcal + ' kcal', textOffset, spaceY);
        spaceY = spaceY + 10;
      }
    }
    if (counter === 0) {
      counter++;
      textWidth = pdf.getStringUnitWidth('Brak cwiczen') * pdf.getFontSize() / pdf.internal.scaleFactor;
      textOffset = (pdf.internal.pageSize.width - textWidth) / 2;
      pdf.text('Brak cwiczen', textOffset, spaceY);
    }
    spaceY = spaceY + 10;
    // POSILKI
    textWidth = pdf.getStringUnitWidth('Posilki:') * pdf.getFontSize() / pdf.internal.scaleFactor;
    textOffset = (pdf.internal.pageSize.width - textWidth) / 2;
    pdf.text('Posilki:', textOffset, spaceY);
    spaceY = spaceY + 10;
    for (const text of this.mealPDF) {
      textWidth = pdf.getStringUnitWidth(unescape(encodeURIComponent(text))) * pdf.getFontSize() / pdf.internal.scaleFactor;
      textOffset = (pdf.internal.pageSize.width - textWidth) / 2;
      pdf.text(unescape(encodeURIComponent(text)), textOffset, spaceY);
      spaceY = spaceY + 10;
    }
    if (_.isEmpty(this.mealPDF)) {
      textWidth = pdf.getStringUnitWidth('Brak Posilków') * pdf.getFontSize() / pdf.internal.scaleFactor;
      textOffset = (pdf.internal.pageSize.width - textWidth) / 2;
      pdf.text('Brak Posilków', textOffset, spaceY);
      spaceY = spaceY + 10;
    }
    spaceY = spaceY + 50;

    pdf.text('Admin NFL Center', 10, spaceY);

    pdf.save('Bilans.pdf');
  }




}
