import { Ng2FittextDirective } from '../ng2-fittext.directive';
import { Renderer2, ElementRef, EventEmitter } from '@angular/core';

describe('Class: Ng2FittextDirective', () => {
  let ng2FittextDirective: Ng2FittextDirective;
  let elMock: ElementRef;
  let rendererMock: Renderer2;
  const defaultProperties: any = {
    fittext: undefined,
    activateOnResize: false,
    container: undefined,
    activateOnInputEvents: false,
    minFontSize: 7,
    maxFontSize: 1000,
    useMaxFontSize: true,
    modelToWatch: undefined,
    fontSizeChanged: new EventEmitter(),
    fontSize: 1000,
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
      expect(ng2FittextDirective.fontSize).toEqual(defaultProperties.fontSize);
      expect(ng2FittextDirective.done).toEqual(defaultProperties.done);
    });
  });

  describe('Setter: fontSize', () => {
    let newFontSize: number;

    it('Should use the minFontSize property value if the specified font size is smaller', () => {
      newFontSize = defaultProperties.minFontSize - 1;
      ng2FittextDirective.fontSize = newFontSize;
      expect(ng2FittextDirective.fontSize).toEqual(
        defaultProperties.minFontSize
      );
    });
    it('Should use the maxFontSize property value if the specified font size is bigger', () => {
      newFontSize = defaultProperties.maxFontSize + 1;
      ng2FittextDirective.fontSize = newFontSize;
      expect(ng2FittextDirective.fontSize).toEqual(
        defaultProperties.maxFontSize
      );
    });
  });

  describe('Method: setElementFontSize', () => {
    let newFontSize: number;
    let isVisibleSpy: jasmine.Spy;

    beforeEach(() => {
      newFontSize = 100;
      isVisibleSpy = spyOn(ng2FittextDirective, 'isVisible').and.returnValue(
        true
      );
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
    it('Should return the current font size', () => {
      expect(ng2FittextDirective.fontSize).toEqual(defaultProperties.fontSize);
    });
  });

  describe('Method: calculateFontSize', () => {
    it('Should return the font size rounded down', () => {
      expect(ng2FittextDirective.calculateFontSize(10, 3)).toEqual(3);
      expect(ng2FittextDirective.calculateFontSize(9, 3)).toEqual(3);
      expect(ng2FittextDirective.calculateFontSize(8, 3)).toEqual(2);
    });
  });

  describe('Method: checkOverflow', () => {
    let parentElementMock: HTMLElement;
    let childrenElementMock: HTMLElement;
    let hasXAxisOverflowSpy: jasmine.Spy;
    let hasYAxisOverflowSpy: jasmine.Spy;

    beforeEach(() => {
      parentElementMock = {} as HTMLElement;
      childrenElementMock = {} as HTMLElement;
      hasXAxisOverflowSpy = spyOn(
        ng2FittextDirective,
        'hasXAxisOverflow'
      ).and.returnValue(false);
      hasYAxisOverflowSpy = spyOn(
        ng2FittextDirective,
        'hasYAxisOverflow'
      ).and.returnValue(false);
    });

    it('Should return false if no overflow is present', () => {
      expect(
        ng2FittextDirective.checkOverflow(
          parentElementMock,
          childrenElementMock
        )
      ).toBe(false);
    });

    it('Should return true if x axis has overflow', () => {
      hasXAxisOverflowSpy.and.returnValue(true);
      expect(
        ng2FittextDirective.checkOverflow(
          parentElementMock,
          childrenElementMock
        )
      ).toBe(true);
    });

    it('Should return true if y axis has overflow', () => {
      hasYAxisOverflowSpy.and.returnValue(true);
      expect(
        ng2FittextDirective.checkOverflow(
          parentElementMock,
          childrenElementMock
        )
      ).toBe(true);
    });
  });

  describe('Method: getStartFontSizeFromHeight', () => {
    it('Should return the container clientHeight value if the container is present', () => {
      const containerClientHeight = 10;
      ng2FittextDirective.container = {
        clientHeight: containerClientHeight,
      } as HTMLElement;
      expect(ng2FittextDirective.getStartFontSizeFromHeight()).toEqual(
        containerClientHeight
      );
    });

    it('Should return the parentElement clientHeight value if no container is present', () => {
      const parentlientHeight = 11;
      elMock.nativeElement = {
        parentElement: {
          clientHeight: parentlientHeight,
        },
      } as HTMLElement;
      expect(ng2FittextDirective.getStartFontSizeFromHeight()).toEqual(
        parentlientHeight
      );
    });
  });

  describe('Method: isVisible', () => {
    it('Should return the true if getStartFontSizeFromHeight() is greater than zero', () => {
      spyOn(ng2FittextDirective, 'getStartFontSizeFromHeight').and.returnValue(
        1
      );
      expect(ng2FittextDirective.isVisible()).toBe(true);
    });

    it('Should return the false if getStartFontSizeFromHeight() is smaller or equal to zero', () => {
      const spy = spyOn(
        ng2FittextDirective,
        'getStartFontSizeFromHeight'
      ).and.returnValue(0);
      expect(ng2FittextDirective.isVisible()).toBe(false);
      spy.and.returnValue(-1);
      expect(ng2FittextDirective.isVisible()).toBe(false);
    });
  });

  describe('Method: hasXAxisOverflow', () => {
    let parentElementMock: HTMLElement;
    let childrenElementMock: HTMLElement;

    beforeEach(() => {
      parentElementMock = {
        clientWidth: 0,
      } as HTMLElement;
      childrenElementMock = {
        scrollWidth: 0,
      } as HTMLElement;
    });

    it('Should return false if no overflow is present on the x axis', () => {
      expect(
        ng2FittextDirective.hasXAxisOverflow(
          parentElementMock,
          childrenElementMock
        )
      ).toBe(false);
    });

    it('Should return true if overflow is present on the x axis', () => {
      childrenElementMock = {
        scrollWidth: 2,
      } as HTMLElement;
      expect(
        ng2FittextDirective.hasXAxisOverflow(
          parentElementMock,
          childrenElementMock
        )
      ).toBe(true);
    });
  });

  describe('Method: hasYAxisOverflow', () => {
    let parentElementMock: HTMLElement;
    let childrenElementMock: HTMLElement;

    beforeEach(() => {
      parentElementMock = {
        clientHeight: 0,
      } as HTMLElement;
      childrenElementMock = {
        clientHeight: 0,
      } as HTMLElement;
    });

    it('Should return false if no overflow is present on the x axis', () => {
      expect(
        ng2FittextDirective.hasYAxisOverflow(
          parentElementMock,
          childrenElementMock
        )
      ).toBe(false);
    });

    it('Should return true if overflow is present on the x axis', () => {
      childrenElementMock = {
        clientHeight: 2,
      } as HTMLElement;
      expect(
        ng2FittextDirective.hasYAxisOverflow(
          parentElementMock,
          childrenElementMock
        )
      ).toBe(true);
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
      spyOn(ng2FittextDirective, 'checkOverflow').and.callFake(
        (parentElement: any, childrenElement: any) => {
          expect(parentElement).toEqual(containerMock);
          return true;
        }
      );
      expect(ng2FittextDirective.hasOverflow()).toBe(true);
    });

    it('Should calculate the overflow using the parent element if the container is not present', () => {
      delete ng2FittextDirective.container;
      spyOn(ng2FittextDirective, 'checkOverflow').and.callFake(
        (parentElement: any, childrenElement: any) => {
          expect(parentElement).toEqual(parentElementMock);
          return true;
        }
      );
      expect(ng2FittextDirective.hasOverflow()).toBe(true);
    });
  });
});
