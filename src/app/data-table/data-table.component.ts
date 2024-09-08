import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Data, NavigationEnd, Router } from '@angular/router';
import { filter, map, Observable } from 'rxjs';
import { ApiService } from '../_services/api.service';
import { ApiResponse, DataModel } from '../_models/data.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})

export class DataTableComponent implements OnInit {
  cdref: ChangeDetectorRef = inject(ChangeDetectorRef);
  router: Router = inject(Router);
  apiService: ApiService = inject(ApiService);
  tableContents$: Observable<DataModel[]> | undefined;

  ngOnInit(): void {
    this.tableContents$ = this.apiService.getData().pipe(
      map((data: ApiResponse) => {
        if (data && data.query && Array.isArray(data.query.search)) {
          return data.query.search.map((item: DataModel) => ({
            title: item.title,
            snippet: item.snippet,
            timestamp: item.timestamp,
          }));
        }
        return [];
      })
    );
    console.log(this.tableContents$)
      

  }

}
