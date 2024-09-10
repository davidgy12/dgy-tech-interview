import { createSelector } from '@ngrx/store';
import { DataState, DataModel } from '../_models/data.model';
import { DatePipe } from '@angular/common';

export const selectDataState = (state: { data: DataState }) => state.data;

export const selectFilteredData = createSelector(
  selectDataState,
  (state: DataState): DataModel[] => {
    const filterText = state.filter.toLowerCase();
    const datePipe = new DatePipe('en-US');
    return state.data.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(filterText);
      const sectionTitleMatch = item.sectiontitle.toLowerCase().includes(filterText);
      const snippetMatch = item.snippet.toLowerCase().includes(filterText);
      const sectionSnippetMatch = item.sectionsnippet.toLowerCase().includes(filterText);
      const formattedDate = item.timestamp ? datePipe.transform(item.timestamp, 'MMM dd, yyyy')?.toLowerCase() || '' : '';
      const dateMatch = formattedDate.includes(filterText);

      return titleMatch || sectionTitleMatch || snippetMatch || sectionSnippetMatch || dateMatch;
    });
  }
);
