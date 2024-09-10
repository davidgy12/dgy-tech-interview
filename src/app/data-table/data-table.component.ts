import { ChangeDetectorRef, Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../_services/api.service';
import { DataModel, DataState } from '../_models/data.model';
import { selectFilteredData } from '../_store/selectors';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { loadData, loadDataSuccess, setFilter } from '../_store/actions';
import { TruncateDirective } from '../_directives/truncate.directive';
import { PopupComponent } from '../popup/popup.component';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatLabel, MatFormField, MatInputModule, MatIconModule, TruncateDirective, MatTooltipModule],
  providers: [DatePipe],
  templateUrl: './data-table.component.html'
})
export class DataTableComponent implements OnInit {
  cdref: ChangeDetectorRef = inject(ChangeDetectorRef);
  apiService: ApiService = inject(ApiService);
  store: Store<{ data: DataState }> = inject(Store);
  dialog: MatDialog = inject(MatDialog);
  datePipe: DatePipe = inject(DatePipe);
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  tableContents$: Observable<DataModel[]> | undefined;
  displayedColumns: string[] = ['sectiontitle', 'title', 'sectionsnippet', 'snippet', 'timestamp'];
  filter$ = new BehaviorSubject<string>('');
  tooltipMessage: string = 'Click here to view full text';

  @ViewChild('truncateContent', { static: false }) truncateContent: ElementRef | undefined;
  @ViewChild('tooltip') tooltip: MatTooltip | undefined;

  ngOnInit(): void {
    this.loading$.next(true);
    this.store.dispatch(loadData());

    this.apiService.getData().subscribe(data => {
      this.store.dispatch(loadDataSuccess({ data: data.query.search }));
      this.loading$.next(false);
      this.cdref.detectChanges()
    });

    this.tableContents$ = this.store.pipe(select(selectFilteredData));
  }
  
  applyFilter(filterValue: string): void {
    this.store.dispatch(setFilter({ filter: filterValue }));
    this.cdref.detectChanges(); 
  }


  openPopup(text: string): void {
    this.dialog.open(PopupComponent, {
      data: { text }
    });    
  }

  onMouseEnter() {
    if (this.truncateContent && this.truncateContent.nativeElement) {
      const isTruncated = this.truncateContent.nativeElement.getAttribute('data-is-truncated');
      if (isTruncated === 'true') {
        this.tooltipMessage = 'Click here to view full text';
        this.tooltip?.show();
      }
    } else {
    }
  }

  onMouseLeave() {
    this.tooltip?.hide();
  }

  formatDate(timestamp: Date): string {
    return this.datePipe.transform(timestamp, 'MMM dd, yyyy') || '';
  }

}