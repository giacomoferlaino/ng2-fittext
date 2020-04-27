import { HtmlElementUtils, ClientProperties } from '../html-element-utils';
import { ElementRef } from '@angular/core';

describe('HtmlElementUtils class', () => {
  let parentElementMock: HTMLElement;
  let childrenElementMock: HTMLElement;
  let containerMock: HTMLElement;
  let elementRefMock: ElementRef<HTMLElement>;

  beforeEach(() => {
    parentElementMock = {
      clientWidth: 0,
    } as HTMLElement;
    childrenElementMock = {
      scrollWidth: 0,
    } as HTMLElement;
    containerMock = {} as HTMLElement;
    elementRefMock = {} as ElementRef<HTMLElement>;
  });

  describe('Static Method: hasXAxisOverflow', () => {
    it('Should return false if no overflow is present on the x axis', () => {
      expect(
        HtmlElementUtils.hasXAxisOverflow(
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
        HtmlElementUtils.hasXAxisOverflow(
          parentElementMock,
          childrenElementMock
        )
      ).toBe(true);
    });
  });

  describe('Static Method: hasYAxisOverflow', () => {
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
        HtmlElementUtils.hasYAxisOverflow(
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
        HtmlElementUtils.hasYAxisOverflow(
          parentElementMock,
          childrenElementMock
        )
      ).toBe(true);
    });
  });

  describe('Static Method: elementHasOverflow', () => {
    let hasXAxisOverflowSpy: jasmine.Spy;
    let hasYAxisOverflowSpy: jasmine.Spy;

    beforeEach(() => {
      parentElementMock = {} as HTMLElement;
      childrenElementMock = {} as HTMLElement;
      hasXAxisOverflowSpy = spyOn(
        HtmlElementUtils,
        'hasXAxisOverflow'
      ).and.returnValue(false);
      hasYAxisOverflowSpy = spyOn(
        HtmlElementUtils,
        'hasYAxisOverflow'
      ).and.returnValue(false);
    });

    it('Should return false if no overflow is present', () => {
      expect(
        HtmlElementUtils.elementHasOverflow(
          parentElementMock,
          childrenElementMock
        )
      ).toBe(false);
    });

    it('Should return true if x axis has overflow', () => {
      hasXAxisOverflowSpy.and.returnValue(true);
      expect(
        HtmlElementUtils.elementHasOverflow(
          parentElementMock,
          childrenElementMock
        )
      ).toBe(true);
    });

    it('Should return true if y axis has overflow', () => {
      hasYAxisOverflowSpy.and.returnValue(true);
      expect(
        HtmlElementUtils.elementHasOverflow(
          parentElementMock,
          childrenElementMock
        )
      ).toBe(true);
    });
  });

  describe('Method: getInitialFontSizeFromProperty', () => {
    it('Should return the container <clientProperty> value if the container is present', () => {
      const containerClientHeight = 10;
      containerMock = {
        clientHeight: containerClientHeight,
      } as HTMLElement;
      expect(
        HtmlElementUtils.getInitialFontSizeFromProperty(
          containerMock,
          elementRefMock,
          ClientProperties.height
        )
      ).toEqual(containerClientHeight);
    });

    it('Should return the parentElement <clientProperty> value if no container is present', () => {
      const parentlientHeight = 11;
      elementRefMock.nativeElement = {
        parentElement: {
          clientHeight: parentlientHeight,
        },
      } as HTMLElement;
      expect(
        HtmlElementUtils.getInitialFontSizeFromProperty(
          undefined,
          elementRefMock,
          ClientProperties.height
        )
      ).toEqual(parentlientHeight);
    });
  });

  describe('Static Method: isVisible', () => {
    it('Should return the true if the initial font is greater than zero', () => {
      spyOn(HtmlElementUtils, 'getInitialFontSizeFromProperty').and.returnValue(
        1
      );
      expect(HtmlElementUtils.isVisible(containerMock, elementRefMock)).toBe(
        true
      );
    });

    it('Should return the false if the initial font is not greater than zero', () => {
      spyOn(HtmlElementUtils, 'getInitialFontSizeFromProperty').and.returnValue(
        0
      );
      expect(HtmlElementUtils.isVisible(containerMock, elementRefMock)).toBe(
        false
      );
    });
  });
});
