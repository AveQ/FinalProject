export class AllExerciseModel {
  count: number;
  exercises: {
    id: string;
    name: string;
    type: string;
    description: string;
    rate: number;
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
  id: string;
  name: string;
  type: string;
  description: string;
  rate: number;
  popular: number;
  musclePart: string;
  image: string;
  video: string;
  difficult: number;
  kcalRatio: number;
}
