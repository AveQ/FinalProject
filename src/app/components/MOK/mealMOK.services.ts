import {Injectable} from '@angular/core';
import {Meals} from '../models/meals.model';

@Injectable({
    providedIn: 'root'
  }
)
export class MealMOK {
  meals: Meals[] = [
    {
      id: 1,
      name: 'Śniadanie',
      fullKcal: 133,
      fullCarb: 123,
      fullFats: 432,
      fullProteins: 32,
      delete: false,
      isIngedientsOpen: false,
      ingredients: [
        {
          name: 'Jajecznica',
          portion: 'pieces', // grams, pieces, glasses,
          howMany: 2,
          proteins: 345,
          fats: 322,
          carb: 111
        },
        {
          name: 'Jajecznica',
          portion: 'grams', // grams, pieces, glasses,
          howMany: 2,
          proteins: 345,
          fats: 322,
          carb: 111
        }
      ]
    },
    {
      id: 1,
      name: 'Obiad',
      fullKcal: 133,
      fullCarb: 123,
      fullFats: 432,
      fullProteins: 32,
      delete: false,
      isIngedientsOpen: false,
      ingredients: [
        {
          name: 'Jajecznica',
          portion: 'pieces', // grams, pieces, glasses,
          howMany: 2,
          proteins: 345,
          fats: 322,
          carb: 111
        }
      ]
    },
    {
      id: 1,
      name: 'Kolacja',
      fullKcal: 133,
      fullCarb: 123,
      fullFats: 432,
      fullProteins: 32,
      delete: false,
      isIngedientsOpen: false,
      ingredients: [
        {
          name: 'Jajecznica',
          portion: 'pieces', // grams, pieces, glasses,
          howMany: 2,
          proteins: 345,
          fats: 322,
          carb: 111
        },
        {
          name: 'Jajecznica',
          portion: 'pieces', // grams, pieces, glasses,
          howMany: 2,
          proteins: 345,
          fats: 322,
          carb: 111
        }
      ]
    },
    {
      id: 1,
      name: 'II Śniadanie',
      fullKcal: 133,
      fullCarb: 123,
      fullFats: 432,
      fullProteins: 32,
      delete: false,
      isIngedientsOpen: false,
      ingredients: [
        {
          name: 'Jajecznica',
          portion: 'pieces', // grams, pieces, glasses,
          howMany: 2,
          proteins: 345,
          fats: 322,
          carb: 111
        }
      ]
    },
    {
      id: 1,
      name: 'Podwieczorek',
      fullKcal: 133,
      fullCarb: 123,
      fullFats: 432,
      fullProteins: 32,
      delete: false,
      isIngedientsOpen: false,
      ingredients: [
        {
          name: 'Jajecznica',
          portion: 'pieces', // grams, pieces, glasses,
          howMany: 2,
          proteins: 345,
          fats: 322,
          carb: 111
        },
        {
          name: 'Jajecznica',
          portion: 'pieces', // grams, pieces, glasses,
          howMany: 2,
          proteins: 345,
          fats: 322,
          carb: 111
        }
      ]
    },
    {
      id: 1,
      name: 'Dodatkowy posiłek',
      fullKcal: 133,
      fullCarb: 123,
      fullFats: 432,
      fullProteins: 32,
      delete: false,
      isIngedientsOpen: false,
      ingredients: [
        {
          name: 'Jajecznica',
          portion: 'pieces', // grams, pieces, glasses,
          howMany: 2,
          proteins: 345,
          fats: 322,
          carb: 111
        }
      ]
    }
  ];

  addNewMeal() {
    this.meals.push({
      id: 1,
      name: 'Dodatkowy posiłek',
      fullKcal: 133,
      fullCarb: 123,
      fullFats: 432,
      fullProteins: 32,
      delete: true,
      isIngedientsOpen: false,
      ingredients: [
        {
          name: 'Jajecznica',
          portion: 'pieces', // grams, pieces, glasses,
          howMany: 2,
          proteins: 345,
          fats: 322,
          carb: 111
        }
      ]
    });
  }
}
