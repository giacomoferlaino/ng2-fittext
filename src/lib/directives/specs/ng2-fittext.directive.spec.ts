import { Ng2FittextDirective } from '../ng2-fittext.directive';
import { Renderer2, ElementRef, EventEmitter } from '@angular/core';
import { HtmlElementUtils } from '../html-element-utils';

describe('Class: Ng2FittextDirective', () => {
  let ng2FittextDirective: Ng2FittextDirective;
  let elMock: ElementRef;
  let rendererMock: Renderer2;
  const defaultProperties: any = {
    fittext: undefined,
    activateOnResize: false,
    container: undefined,
    activateOnInputEvents: false,
    useMaxFontSize: true,
    modelToWatch: undefined,
    fontSizeChanged: new EventEmitter(),
    done: false,
  };

  beforeEach(() => {
    elMock = {} as ElementRef;
    rendererMock = ({
      setStyle: () => {},
    } as unknown) as Renderer2;
    ng2FittextDirective = new Ng2FittextDirective(elMock, rendererMock);
  });

  describe('Method: constructor', () => {
    it('Should initialize the object properties to their default values', () => {
      expect(ng2FittextDirective.fittext).toEqual(defaultProperties.fittext);
      expect(ng2FittextDirective.activateOnResize).toEqual(
        defaultProperties.activateOnResize
      );
      expect(ng2FittextDirective.container).toEqual(
        defaultProperties.container
      );
      expect(ng2FittextDirective.activateOnInputEvents).toEqual(
        defaultProperties.activateOnInputEvents
      );
      expect(ng2FittextDirective.minFontSize).toEqual(
        defaultProperties.minFontSize
      );
      expect(ng2FittextDirective.maxFontSize).toEqual(
        defaultProperties.maxFontSize
      );
      expect(ng2FittextDirective.useMaxFontSize).toEqual(
        defaultProperties.useMaxFontSize
      );
      expect(ng2FittextDirective.modelToWatch).toEqual(
        defaultProperties.modelToWatch
      );
      expect(ng2FittextDirective.fontSizeChanged).toEqual(
        defaultProperties.fontSizeChanged
      );
      expect(ng2FittextDirective.done).toEqual(defaultProperties.done);
    });
  });

  describe('Method: setElementFontSize', () => {
    let newFontSize: number;
    let isVisibleSpy: jasmine.Spy;

    beforeEach(() => {
      newFontSize = 100;
      isVisibleSpy = spyOn(HtmlElementUtils, 'isVisible').and.returnValue(true);
      elMock.nativeElement = {
        style: {},
      };
      ng2FittextDirective.done = false;
    });

    it('Should not change the font size if the element is not visible', () => {
      isVisibleSpy.and.returnValue(false);
      const previousFontSize: number = ng2FittextDirective.fontSize;
      ng2FittextDirective.setElementFontSize(newFontSize);
      expect(ng2FittextDirective.fontSize).toEqual(previousFontSize);
    });

    it('Should not change the font size if the fitting operation is done', () => {
      ng2FittextDirective.done = true;
      const previousFontSize: number = ng2FittextDirective.fontSize;
      ng2FittextDirective.setElementFontSize(newFontSize);
      expect(ng2FittextDirective.fontSize).toEqual(previousFontSize);
    });

    it('Should set a new fontSize value', () => {
      newFontSize = 500;
      ng2FittextDirective.setElementFontSize(newFontSize);
      const currentFontSize: number = ng2FittextDirective.fontSize;
      expect(currentFontSize).toEqual(newFontSize);
    });

    it('Should emit the font size change', () => {
      newFontSize = 500;
      spyOn(ng2FittextDirective.fontSizeChanged, 'emit');
      ng2FittextDirective.setElementFontSize(newFontSize);
      expect(ng2FittextDirective.fontSizeChanged.emit).toHaveBeenCalledWith(
        newFontSize
      );
    });

    it('Should update the nativeElement with the new font size', () => {
      newFontSize = 500;
      spyOn(ng2FittextDirective.renderer, 'setStyle');
      ng2FittextDirective.setElementFontSize(newFontSize);
      expect(ng2FittextDirective.renderer.setStyle).toHaveBeenCalledWith(
        elMock.nativeElement,
        'font-size',
        `${newFontSize}px`
      );
    });
  });

  describe('Getter: fontSize', () => {
    it('Should return FontManager fontSize property value', () => {
      expect(ng2FittextDirective.fontSize).toBe(
        (ng2FittextDirective as any)._fontManager.fontSize
      );
    });
  });

  describe('Method: hasOverflow', () => {
    let containerMock: any;
    let parentElementMock: any;

    beforeEach(() => {
      containerMock = {
        isContainer: true,
      };
      parentElementMock = {
        isParentElement: true,
      };
      ng2FittextDirective.container = { ...containerMock };
      ng2FittextDirective.el.nativeElement = {
        parentElement: { ...parentElementMock },
      } as HTMLElement;
    });

    it('Should calculate the overflow using the container if is present', () => {
      spyOn(HtmlElementUtils, 'elementHasOverflow').and.callFake(
        (parentElement: any, childrenElement: any) => {
          expect(parentElement).toEqual(containerMock);
          return true;
        }
      );
      expect(ng2FittextDirective.hasOverflow()).toBe(true);
    });

    it('Should calculate the overflow using the parent element if the container is not present', () => {
      delete ng2FittextDirective.container;
      spyOn(HtmlElementUtils, 'elementHasOverflow').and.callFake(
        (parentElement: any, childrenElement: any) => {
          expect(parentElement).toEqual(parentElementMock);
          return true;
        }
      );
      expect(ng2FittextDirective.hasOverflow()).toBe(true);
    });
  });
});
