export class ExercisesProperty {
  idExercise: string;
  time: number;
  kcal: number;
}

export class ExerciseHistoryModel {
  _id: string;
  idUser: string;
  date: number;
  kcal: number;
  time: number;
  exercises: [ExercisesProperty];
}
