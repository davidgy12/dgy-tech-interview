import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ApiService } from '../_services/api.service';
import { loadData, loadDataSuccess, loadDataFailure } from './actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class DataEffects {
  actions$ = inject(Actions);
  apiService = inject(ApiService);
  loadData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadData),
      switchMap(() =>
        this.apiService.getData().pipe(
          map(data => loadDataSuccess({ data: data.query.search })),
          catchError(error => {
            console.error('Data fetching failed', error);
            return of(loadDataFailure({ error }));
          })
        )
      )
    )
  );

}