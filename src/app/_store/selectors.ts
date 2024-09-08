import { createSelector } from '@ngrx/store';
import { DataState, DataModel } from '../_models/data.model';

export const selectDataState = (state: { data: DataState }) => state.data;

export const selectFilteredData = createSelector(
  selectDataState,
  (state: DataState): DataModel[] => {
    const filterText = state.filter.toLowerCase();
    return state.data.filter(item =>
      item.title.toLowerCase().includes(filterText) ||
      item.sectiontitle.toLowerCase().includes(filterText) ||
      item.snippet.toLowerCase().includes(filterText) ||
      item.sectionsnippet.toLowerCase().includes(filterText) 
    );
  }
);

export const selectLoading = createSelector(
  selectDataState,
  (state: DataState) => state.loading
);