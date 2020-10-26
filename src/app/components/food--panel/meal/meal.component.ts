import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

interface Meal {
  id: number;
  howMany: string;
  name: string;
  properties: number[];
}

interface MealDB {
  id: number;
  name: string;
  properties: number[];
}

const Meal: Meal[] = [
  {
    id: 1,
    howMany: '100g',
    name: 'Masło',
    properties: [1200, 400, 500, 300],
  },
  {
    id: 2,
    howMany: '200g',
    name: 'Ogórek',
    properties: [20, 2, 3, 15],
  },
];
const MealDB: MealDB[] = [
  {
    id: 1,
    name: 'Masełko',
    properties: [
      1000, 234, 1234, 231
    ]
  },
  {
    id: 2,
    name: 'Rosołek',
    properties: [
      1000, 234, 1234, 231
    ]
  },
  {
    id: 1,
    name: 'Udeczko',
    properties: [
      1000, 234, 1234, 231
    ]
  },
  {
    id: 1,
    name: 'Udeczko',
    properties: [
      1000, 234, 1234, 231
    ]
  },
  {
    id: 1,
    name: 'Spaghetti',
    properties: [
      1000, 234, 1234, 231
    ]
  }
];

@Component({
  selector: 'app-meal',
  templateUrl: './meal.component.html',
  styleUrls: ['./meal.component.scss']
})
export class MealComponent implements OnInit {
  nameOfMeal = 'śniadnie';
  nameOfProduct = 'Niewybrano';
  meal = Meal;
  mealDB = MealDB;
  page = 1;
  showMoreInfo(data) {
    console.log(data);
  }

  constructor(private modalService: NgbModal) {
  }

  ngOnInit(): void {
  }

  openSm(content, value) {
    this.modalService.open(content, {size: 'sm'});
    this.nameOfProduct = value;
  }
}
