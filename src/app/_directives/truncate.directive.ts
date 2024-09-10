import { Directive, ElementRef, Input, AfterViewInit, Renderer2, ChangeDetectorRef, inject } from '@angular/core';

/**
 * Directive to handle multi-line text truncation.
 * Truncates text content after a specified number of lines and adds ellipsis.
 */
@Directive({
  selector: '[truncate]', 
  standalone: true, 
  exportAs: 'truncate' 
})
export class TruncateDirective implements AfterViewInit {
  @Input() maxLines: number = 2; // Maximum number of lines to display before truncation

  // Inject Angular services
  el: ElementRef = inject(ElementRef); 
  renderer: Renderer2 = inject(Renderer2); 
  cdref: ChangeDetectorRef = inject(ChangeDetectorRef); 

  ngAfterViewInit() {
    // Apply truncation styles initially
    this.applyTruncate();
  
    // MutationObserver to watch for changes in the element's child nodes
    const observer = new MutationObserver(() => {
      // Apply truncation when content changes
      this.applyTruncate();
      this.cdref.detectChanges();
    });
    observer.observe(this.el.nativeElement, { childList: true, subtree: true });
  
    // Use requestAnimationFrame to ensure the truncation styles are applied after render
    requestAnimationFrame(() => {
      this.applyTruncate();
      this.cdref.detectChanges(); 
    });
  
    // Listen for window resize events to reapply truncation
    window.addEventListener('resize', () => {
      this.applyTruncate();
      this.cdref.detectChanges(); 
    });
  }

  /**
   * Applies truncation styles to the host element.
   */
  private applyTruncate() {
    const element = this.el.nativeElement; 
    const lineHeight = parseInt(window.getComputedStyle(element).lineHeight, 10); // Get line height
    const maxHeight = this.maxLines * lineHeight; // Calculate maximum height based on line height and maxLines

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

    // Set a custom attribute to indicate truncation status as using isTruncated property caused mismatch
    this.renderer.setAttribute(element, 'data-truncated', isTruncated.toString());
  }

  getTruncationStatus(): boolean {
    return this.el.nativeElement.getAttribute('data-truncated') === 'true';
  }
}