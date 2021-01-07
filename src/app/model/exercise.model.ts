export class AllExerciseModel {
  count: number;
  exercises: {
    id: string;
    name: string;
    namePL: string;
    type: string;
    description: string;
    descriptionPL: string;
    rate: {
      counter: number,
      sum: number,
      rate: number
    };
    popular: number;
    musclePart: string;
    image: string;
    video: string;
    difficult: number;
    kcalRatio: number;
    request: {
      type: string;
      url: string;
    };
  };
}

export class ExerciseModel {
  _id: string;
  name: string;
  namePL: string;
  type: string;
  description: string;
  descriptionPL: string;
  rate: {
    counter: number,
    sum: number,
    rate: number
  };
  popular: number;
  musclePart: string;
  image: string;
  video: string;
  difficult: number;
  kcalRatio: number;
}
