import {
  AfterViewChecked,
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  OnInit,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[fittext]',
})
export class Ng2FittextDirective
  implements AfterViewInit, OnInit, OnChanges, AfterViewChecked {
  @Input('fittext') fittext: any;
  @Input('activateOnResize') activateOnResize: boolean = false;
  @Input('container') container: HTMLElement;
  @Input('activateOnInputEvents') activateOnInputEvents: boolean = false;
  @Input('minFontSize') minFontSize = 7;
  @Input('maxFontSize') maxFontSize = 1000;
  @Input('useMaxFontSize') useMaxFontSize = true; /* Deprecated */
  @Input('modelToWatch') modelToWatch: any;
  @Output() fontSizeChanged: EventEmitter<number> = new EventEmitter();
  done: boolean = false;

  private _fontSize = 1000;
  private _speed = 1.05;

  set fontSize(fontSize: number) {
    if (fontSize < this.minFontSize) this._fontSize = this.minFontSize;
    else if (fontSize > this.maxFontSize) this._fontSize = this.maxFontSize;
    else this._fontSize = fontSize;
  }

  get fontSize(): number {
    return this._fontSize;
  }

  constructor(public el: ElementRef<HTMLElement>, public renderer: Renderer2) {}

  setElementFontSize(fontSize: number): void {
    if (this.isVisible() && !this.done) {
      this.fontSize = fontSize;
      this.fontSizeChanged.emit(fontSize);
      this.renderer.setStyle(
        this.el.nativeElement,
        'font-size',
        fontSize.toString() + 'px'
      );
    }
  }

  calculateFontSize(fontSize: number, speed: number): number {
    return Math.floor(fontSize / speed);
  }

  checkOverflow(parent: HTMLElement, children: HTMLElement): boolean {
    return (
      this.hasXAxisOverflow(parent, children) ||
      this.hasYAxisOverflow(parent, children)
    );
  }

  hasXAxisOverflow(parent: HTMLElement, children: HTMLElement): boolean {
    return children.scrollWidth - parent.clientWidth > 0;
  }

  hasYAxisOverflow(parent: HTMLElement, children: HTMLElement): boolean {
    return children.clientHeight - parent.clientHeight > 0;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.done = false;
    if (this.activateOnResize && this.fittext) {
      if (this.activateOnInputEvents && this.fittext) {
        this.setElementFontSize(this.getStartFontSizeFromHeight());
      } else {
        this.setElementFontSize(this.getStartFontSizeFromWeight());
      }

      this.ngAfterViewInit();
    }
  }

  @HostListener('input', ['$event'])
  onInputEvents(event: Event) {
    this.done = false;
    if (this.activateOnInputEvents && this.fittext) {
      this.setElementFontSize(this.getStartFontSizeFromHeight());
      this.ngAfterViewInit();
    }
  }

  ngOnInit() {
    this.done = false;
    this.renderer.setStyle(this.el.nativeElement, 'will-change', 'content');
    this.ngAfterViewInit();
  }

  ngAfterViewInit() {
    if (this.isVisible() && !this.done) {
      if (this.fittext) {
        if (this.hasOverflow()) {
          if (this._fontSize > this.minFontSize) {
            // iterate only until font size is bigger than minimal value
            this.setElementFontSize(
              this.calculateFontSize(this._fontSize, this._speed)
            );
            this.ngAfterViewInit();
          }
        } else {
          this.done = true;
        }
      }
    }
  }

  ngOnChanges(changes: any): void {
    if (changes.modelToWatch) {
      // change of model to watch - call ngAfterViewInit where is implemented logic to change size
      setTimeout(() => {
        this.done = false;
        this.setElementFontSize(this.maxFontSize);
        this.ngAfterViewInit();
      });
    }
  }

  ngAfterViewChecked() {
    if (this._fontSize > this.minFontSize) {
      this.setElementFontSize(this.getStartFontSizeFromHeight());
      this.ngAfterViewInit();
    }
  }

  getStartFontSizeFromHeight(): number {
    return this.container
      ? this.container.clientHeight
      : this.el.nativeElement.parentElement.clientHeight;
  }

  private getStartFontSizeFromWeight(): number {
    return this.container
      ? this.container.clientWidth
      : this.el.nativeElement.parentElement.clientWidth;
  }

  isVisible(): boolean {
    return this.getStartFontSizeFromHeight() > 0;
  }

  hasOverflow(): boolean {
    return this.container
      ? this.checkOverflow(this.container, this.el.nativeElement)
      : this.checkOverflow(
          this.el.nativeElement.parentElement,
          this.el.nativeElement
        );
  }
}
