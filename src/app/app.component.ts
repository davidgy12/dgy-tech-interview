import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { RouterOutlet, RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'dgy-klm-tech-interview';

cdref: ChangeDetectorRef = inject(ChangeDetectorRef);
router: Router = inject(Router);

ngOnInit(): void {
    this.cdref.detectChanges();
    this.cdref.markForCheck();
}
}