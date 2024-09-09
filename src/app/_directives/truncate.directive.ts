import { Directive, ElementRef, Input, AfterViewInit, Renderer2, ChangeDetectorRef, NgZone, inject } from '@angular/core';

/**
 * Directive to handle multi-line text truncation.
 * Truncates text content after a specified number of lines and adds ellipsis.
 */
@Directive({
  selector: '[truncateMultiLine]', // Selector to apply the directive
  standalone: true, // Indicates this directive is a standalone component
  exportAs: 'truncateMultiLine' // Allows the directive to be referenced in templates
})
export class TruncateMultiLineDirective implements AfterViewInit {
  @Input() maxLines: number = 2; // Maximum number of lines to display before truncation

  // Inject Angular services
  el: ElementRef = inject(ElementRef); // Element reference to the host element
  renderer: Renderer2 = inject(Renderer2); // Renderer for manipulating DOM
  cdref: ChangeDetectorRef = inject(ChangeDetectorRef); // Change detector for managing change detection
  ngZone: NgZone = inject(NgZone); // NgZone for running outside Angular's change detection

  /**
   * Lifecycle hook that is called after the view has been initialized.
   * It sets up truncation and observation for changes in the content.
   */
  ngAfterViewInit() {
    // Run outside Angular's change detection to avoid unnecessary checks
    this.ngZone.runOutsideAngular(() => {
      this.applyTruncate(); // Apply truncation styles

      // MutationObserver to watch for changes in the element's child nodes
      const observer = new MutationObserver(() => {
        this.ngZone.run(() => { // Re-enter Angular's zone to update truncation
          this.applyTruncate();
        });
      });
      observer.observe(this.el.nativeElement, { childList: true, subtree: true });

      // Request animation frame to ensure styles are applied correctly
      requestAnimationFrame(() => {
        this.ngZone.run(() => { // Re-enter Angular's zone for change detection
          this.applyTruncate();
          this.cdref.detectChanges(); // Trigger change detection
        });
      });

      // Listen for window resize events to reapply truncation
      window.addEventListener('resize', () => this.applyTruncate());
    });
  }

  /**
   * Applies truncation styles to the host element.
   * Sets overflow, display, line-clamp, and other styles to truncate text.
   */
  private applyTruncate() {
    const element = this.el.nativeElement; // Get the host element
    const lineHeight = parseInt(window.getComputedStyle(element).lineHeight, 10); // Get line height
    const maxHeight = this.maxLines * lineHeight; // Calculate maximum height based on line height and maxLines

    // Apply styles for truncation
    this.renderer.setStyle(element, 'overflow', 'hidden');
    this.renderer.setStyle(element, 'display', '-webkit-box');
    this.renderer.setStyle(element, '-webkit-line-clamp', `${this.maxLines}`);
    this.renderer.setStyle(element, '-webkit-box-orient', 'vertical');
    this.renderer.setStyle(element, 'max-height', `${maxHeight}px`);
    this.renderer.setStyle(element, 'text-overflow', 'ellipsis');
    this.renderer.setStyle(element, 'white-space', 'normal');

    // Force a reflow to update scrollHeight and clientHeight
    element.offsetHeight;

    // Determine if the content is truncated
    const isTruncated = element.scrollHeight > element.clientHeight;

    // Set a custom attribute to indicate truncation status
    this.renderer.setAttribute(element, 'data-truncated', isTruncated.toString());
  }

  /**
   * Gets the truncation status of the host element.
   * @returns {boolean} True if the content is truncated, false otherwise.
   */
  getTruncationStatus(): boolean {
    // Check the custom attribute for truncation status
    return this.el.nativeElement.getAttribute('data-truncated') === 'true';
  }
}