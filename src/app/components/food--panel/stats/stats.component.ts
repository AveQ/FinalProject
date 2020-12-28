import {Component, DoCheck, Input, OnInit} from '@angular/core';
import {UserService} from '../../../services/user.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit, DoCheck {
  @Input() currentDay;
  summ;
  wrongData = false;
  bars = [
    {
      value: 30,
      max: 100,
      name: 'Kalorie',
      type: 'success'
    },
    {
      value: 50,
      max: 100,
      name: 'Proteiny',
      type: 'success'
    },
    {
      value: 40,
      max: 100,
      name: 'Tłuszcze',
      type: 'success'
    },
    {
      value: 10,
      max: 100,
      name: 'Węglowodany',
      type: 'success'
    }
  ];

  ngOnInit(): void {
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

  }

  constructor(private userService: UserService) {

  }

  generatePDF() {

    const arrayTitles = ['Kalorie', 'Bialko', 'Tluszcze', 'Weglowodany'];

    const date = new Date(this.currentDay.time);
    const pdf = new jsPDF();

    pdf.setFont(' font-family: \'Roboto Condensed\', sans-serif;', 'font-weight: bold;');
    pdf.setFontSize(24);
    let textWidth = pdf.getStringUnitWidth('PODSUMOWANIE - ' + date.getDate() +
      '.' + (date.getMonth() + 1) + '.' + date.getFullYear()) * pdf.getFontSize() / pdf.internal.scaleFactor;
    let textOffset = (pdf.internal.pageSize.width - textWidth) / 2;
    pdf.text('PODSUMOWANIE - ' + date.getDate() +
      '.' + (date.getMonth() + 1) + '.' + date.getFullYear(), textOffset, 10);
    pdf.setFontSize(18);
    for (let i = 0; i < 4; i++) {
      textWidth = pdf.getStringUnitWidth(arrayTitles[i]) * pdf.getFontSize() / pdf.internal.scaleFactor;
      textOffset = (pdf.internal.pageSize.width - textWidth) / 2;
      pdf.text(arrayTitles[i], textOffset, 25 * (i + 1));
      textWidth = pdf.getStringUnitWidth(this.bars[i].value.toPrecision(4) +
        'kcal / ' + this.bars[i].max.toPrecision(4) + 'kcal') * pdf.getFontSize() / pdf.internal.scaleFactor;
      textOffset = (pdf.internal.pageSize.width - textWidth) / 2;
      pdf.text(this.bars[i].value.toPrecision(4) + 'kcal / ' + this.bars[i].max.toPrecision(4) + 'kcal', textOffset, (25 * (i + 1)) + 10);
    }

    textWidth = pdf.getStringUnitWidth('NFL - Center 2020') * pdf.getFontSize() / pdf.internal.scaleFactor;
    textOffset = (pdf.internal.pageSize.width - textWidth) / 2;
    pdf.text('NFL - Center 2020', textOffset, 280);

    pdf.save('File.pdf');
  }

  ngDoCheck(): void {

  }


}
