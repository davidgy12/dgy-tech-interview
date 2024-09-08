import { Action, createReducer, on } from '@ngrx/store';
import { loadDataSuccess, loadDataFailure, setFilter, loadData } from './actions';
import { DataState } from '../_models/data.model';

export const initialState: DataState = {
  data: [],
  filter: '',
  loading: false
};

export const dataReducer = createReducer(
    initialState,
    on(loadDataSuccess, (state, { data }) => ({
      ...state,
      data: data.map(item => ({
        sectiontitle: item.sectiontitle ? item.sectiontitle : item.title,
        title: item.title,
        sectionsnippet: item.sectionsnippet ? item.sectionsnippet : item.snippet,
        snippet: item.snippet,
        timestamp: item.timestamp
      })),
      loading: false
    })),
  on(loadDataFailure, state => ({
    ...state,
    loading: false
  })),
  on(setFilter, (state, { filter }) => ({ ...state, filter }))
);

export function reducer(state: DataState | undefined, action: Action) {
  return dataReducer(state, action);
}