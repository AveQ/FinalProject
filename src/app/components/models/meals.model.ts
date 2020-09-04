import {Food} from './food.model';

export class Meals {
  public id: number;
  public name: string;
  public fullKcal: number;
  public fullCarb: number;
  public fullFats: number;
  public fullProteins: number;
  public isIngedientsOpen: boolean;
  public ingredients: Food[];
  public delete: boolean;
}
