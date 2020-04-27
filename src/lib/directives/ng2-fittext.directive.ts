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
import { FontManager } from './font-manager';
import { HtmlElementUtils, ClientProperties } from './html-element-utils';

@Directive({
  selector: '[fittext]',
})
export class Ng2FittextDirective
  implements AfterViewInit, OnInit, OnChanges, AfterViewChecked {
  private _speed: number = 1.05;
  private _fontManager: FontManager;

  @Input('fittext') fittext: any;
  @Input('activateOnResize') activateOnResize: boolean = false;
  @Input('container') container: HTMLElement;
  @Input('activateOnInputEvents') activateOnInputEvents: boolean = false;
  @Input('useMaxFontSize') useMaxFontSize = true; /* Deprecated */
  @Input('modelToWatch') modelToWatch: any;
  @Input('minFontSize') set minFontSize(fontSize: number) {
    this._fontManager.minFontSize = fontSize;
  }
  @Input('maxFontSize') set maxFontSize(fontSize: number) {
    this._fontManager.maxFontSize = fontSize;
  }
  @Output() fontSizeChanged: EventEmitter<number> = new EventEmitter();
  done: boolean = false;

  get fontSize(): number {
    return this._fontManager.fontSize;
  }

  constructor(public el: ElementRef<HTMLElement>, public renderer: Renderer2) {
    this._fontManager = new FontManager();
  }

  setElementFontSize(fontSize: number): void {
    if (this.isVisible() && !this.done) {
      this._fontManager.fontSize = fontSize;
      this.fontSizeChanged.emit(this._fontManager.fontSize);
      this.renderer.setStyle(
        this.el.nativeElement,
        'font-size',
        this._fontManager.fontSize + 'px'
      );
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.done = false;
    if (this.activateOnResize && this.fittext) {
      if (this.activateOnInputEvents && this.fittext) {
        this.setElementFontSize(
          HtmlElementUtils.getInitialFontSizeFromProperty(
            this.container,
            this.el,
            ClientProperties.height
          )
        );
      } else {
        this.setElementFontSize(
          HtmlElementUtils.getInitialFontSizeFromProperty(
            this.container,
            this.el,
            ClientProperties.width
          )
        );
      }

      this.ngAfterViewInit();
    }
  }

  @HostListener('input', ['$event'])
  onInputEvents(event: Event) {
    this.done = false;
    if (this.activateOnInputEvents && this.fittext) {
      this.setElementFontSize(
        HtmlElementUtils.getInitialFontSizeFromProperty(
          this.container,
          this.el,
          ClientProperties.height
        )
      );
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
          if (this._fontManager.fontSize > this._fontManager.minFontSize) {
            // iterate only until font size is bigger than minimal value
            this.setElementFontSize(
              this._fontManager.calculateNextFontSize(this._speed)
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
        this.setElementFontSize(this._fontManager.maxFontSize);
        this.ngAfterViewInit();
      });
    }
  }

  ngAfterViewChecked() {
    if (this._fontManager.fontSize > this._fontManager.minFontSize) {
      this.setElementFontSize(
        HtmlElementUtils.getInitialFontSizeFromProperty(
          this.container,
          this.el,
          ClientProperties.height
        )
      );
      this.ngAfterViewInit();
    }
  }

  hasOverflow(): boolean {
    return this.container
      ? HtmlElementUtils.elementHasOverflow(
          this.container,
          this.el.nativeElement
        )
      : HtmlElementUtils.elementHasOverflow(
          this.el.nativeElement.parentElement,
          this.el.nativeElement
        );
  }

  private isVisible(): boolean {
    return HtmlElementUtils.isVisible(this.container, this.el);
  }
}
