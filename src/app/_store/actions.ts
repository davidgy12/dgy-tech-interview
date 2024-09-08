import { createAction, props } from '@ngrx/store';
import { DataModel } from '../_models/data.model';

export const loadData = createAction('[Data] Load Data');
export const loadDataSuccess = createAction(
  '[Data] Load Data Success',
  props<{ data: DataModel[] }>()
);
export const loadDataFailure = createAction(
  '[Data] Load Data Failure',
  props<{ error: any }>()
);
export const setFilter = createAction(
  '[Data] Set Filter',
  props<{ filter: string }>()
);