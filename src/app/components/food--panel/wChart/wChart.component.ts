import {AfterViewInit, Component, DoCheck, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {Label, MultiDataSet} from 'ng2-charts';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FoodService} from '../../../services/food.service';

class Day {
  name: string;
  date: string;
  time: number;
}

enum Days {
  'Niedziela' = 0,
  'Poniedziałek' = 1,
  'Wtorek' = 2,
  'Środa' = 3,
  'Czwartek' = 4,
  'Piątek' = 5,
  'Sobota' = 6
}

@Component({
  selector: 'app-w-chart',
  templateUrl: './wChart.component.html',
  styleUrls: ['./wChart.component.scss']
})
export class WChartComponent implements OnInit, DoCheck {
  public statusWater = 250;
  public recom = 2500;
  @Input() waterData = null;
  @Input() historyId = null;
  @Input() summ;
// Doughnut
  public doughnutChartOptions = {
    responsive: false,
  };
  public doughnutChartLabels: Label[] = ['Nawodnienie', 'Brakuje'];
  public doughnutChartData: MultiDataSet = [
    [this.waterData, this.recom]
  ];
  public doughnutColorsColors = [
    {
      borderColor: 'transparent',
      pointBackgroundColor: 'rgb(26,132,177)',
      backgroundColor: ['rgb(44, 169, 255)', 'rgb(211,219,255)'],
      hoverBackgroundColor: 'rgb(221, 1, 1)',
    },
  ];
  public doughnutChartType: ChartType = 'doughnut';


  openSm(content) {
    this.modalService.open(content, {size: 'sm'});
    this.statusWater = 250;
  }

  newWaterStatus(status) {
    if (status) {
      this.statusWater += 50;
    } else {
      this.statusWater -= 50;
    }
  }

  sendNewValue(value) {
    if (!value) {
      this.statusWater *= -1;
    }
    if (this.waterData + this.statusWater >= 0 && this.waterData + this.statusWater <= 2500) {
      this.recom += this.statusWater * -1;
      this.waterData += this.statusWater;
    } else if (this.waterData + this.statusWater < 0) {
      this.waterData = 0;
      this.recom = 2500;
    } else if (this.waterData + this.statusWater > 2500) {
      this.waterData = 2500;
      this.recom = 0;
    }
    this.doughnutChartData = [this.waterData, this.recom];
    this.modalService.dismissAll();
    this.foodService.patchWaterData(this.historyId, 'water', this.waterData).subscribe(
      data => {
      },
      error => {
      },
      () => {
      }
    );
  }

  constructor(private modalService: NgbModal,
              private foodService: FoodService) {
  }

  changeInputValue(val) {
    this.statusWater = val.target.value;
  }

  ngOnInit(): void {

  }

  // TODO:
  // ZMIENIC KONIECZNIE BO CALY CZAS SIE WYSWIETLA!!
  // reagowanie na input i zmienianie dynamicznie danych na wykresie
  ngDoCheck(): void {
    this.recom = 2500 - this.waterData;
    this.doughnutChartData = [
      [this.waterData, this.recom]
    ];
  }
}
