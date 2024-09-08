import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { ApiService } from '../_services/api.service';
import { DataModel, DataState } from '../_models/data.model';
import { selectFilteredData, selectLoading } from '../_store/selectors';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { loadDataSuccess, setFilter } from '../_store/actions';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatLabel, MatFormField, MatInputModule, MatIconModule],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {
  cdref: ChangeDetectorRef = inject(ChangeDetectorRef);
  router: Router = inject(Router);
  apiService: ApiService = inject(ApiService);
  store: Store<{ data: DataState }> = inject(Store);
  tableContents$: Observable<DataModel[]> | undefined;
  displayedColumns: string[] = ['sectiontitle', 'title', 'sectionsnippet', 'snippet'];
  filter$ = new BehaviorSubject<string>('');

  ngOnInit(): void {
    this.apiService.getData().subscribe(data => {
      this.store.dispatch(loadDataSuccess({ data: data.query.search }));
    });

    this.tableContents$ = this.store.pipe(select(selectFilteredData));

    this.store.pipe(select(selectLoading)).subscribe(loading => {
      console.log('Loading state:', loading);
    });
  }
  
  applyFilter(filterValue: string): void {
    this.store.dispatch(setFilter({ filter: filterValue }));
  }
}