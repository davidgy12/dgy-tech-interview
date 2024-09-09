import { ChangeDetectorRef, Component, inject, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../_services/api.service';
import { DataModel, DataState } from '../_models/data.model';
import { selectFilteredData, selectLoading } from '../_store/selectors';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { loadDataSuccess, setFilter } from '../_store/actions';
import { TruncateMultiLineDirective } from '../_directives/truncate.directive';
import { PopupComponent } from '../popup/popup.component';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatLabel, MatFormField, MatInputModule, MatIconModule, TruncateMultiLineDirective, MatTooltipModule],
  providers: [DatePipe],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, AfterViewInit {
  cdref: ChangeDetectorRef = inject(ChangeDetectorRef);
  apiService: ApiService = inject(ApiService);
  store: Store<{ data: DataState }> = inject(Store);
  dialog: MatDialog = inject(MatDialog);
  datePipe: DatePipe = inject(DatePipe);
  tableContents$: Observable<DataModel[]> | undefined;
  displayedColumns: string[] = ['sectiontitle', 'title', 'sectionsnippet', 'snippet', 'timestamp'];
  filter$ = new BehaviorSubject<string>('');
  tooltipMessage: string = 'Click here to view full text';

  @ViewChild('truncateContent', { static: false }) truncateContent: ElementRef | undefined;
  @ViewChild('tooltip') tooltip: MatTooltip | undefined;

  ngOnInit(): void {
    // Fetch data from API and dispatch success action to store
    this.apiService.getData().subscribe(data => {
      this.store.dispatch(loadDataSuccess({ data: data.query.search }));
      this.cdref.detectChanges(); // Ensure change detection after dispatch
    });

    // Subscribe to filtered data observable from store
    this.tableContents$ = this.store.pipe(select(selectFilteredData));

    // Subscribe to loading state
    this.store.pipe(select(selectLoading)).subscribe(loading => {
      console.log('Loading state:', loading);
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.cdref.detectChanges(); // Ensure changes are detected
      this.checkTruncationStatus();
    }, 0);
  }
  
  applyFilter(filterValue: string): void {
    // Dispatch filter action to store
    this.store.dispatch(setFilter({ filter: filterValue }));
    this.cdref.detectChanges(); // Ensure changes are detected
  }


  openPopup(text: string): void {
    this.dialog.open(PopupComponent, {
      data: { text }
    });    
  }

  onMouseEnter() {
    if (this.truncateContent && this.truncateContent.nativeElement) {
      const isTruncated = this.truncateContent.nativeElement.getAttribute('data-is-truncated');
      console.log('Truncation Status:', isTruncated);
  
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

  private checkTruncationStatus() {
    if (this.truncateContent) {
      const element = this.truncateContent.nativeElement; // Access element via directive
      if (element) {
        const isTruncated = element.getAttribute('data-is-truncated');
        console.log('Truncation Status:', isTruncated);
      } else {
        console.warn('Native element is not defined.');
      }
    } else {
      
    }
  }

  formatDate(timestamp: Date): string {
    return this.datePipe.transform(timestamp, 'MMM dd, yyyy') || '';
  }


}