import { Utils } from '../utils';

describe('Utilities functions', () => {
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
        Utils.hasXAxisOverflow(parentElementMock, childrenElementMock)
      ).toBe(false);
    });

    it('Should return true if overflow is present on the x axis', () => {
      childrenElementMock = {
        scrollWidth: 2,
      } as HTMLElement;
      expect(
        Utils.hasXAxisOverflow(parentElementMock, childrenElementMock)
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
        Utils.hasYAxisOverflow(parentElementMock, childrenElementMock)
      ).toBe(false);
    });

    it('Should return true if overflow is present on the x axis', () => {
      childrenElementMock = {
        clientHeight: 2,
      } as HTMLElement;
      expect(
        Utils.hasYAxisOverflow(parentElementMock, childrenElementMock)
      ).toBe(true);
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
      hasXAxisOverflowSpy = spyOn(Utils, 'hasXAxisOverflow').and.returnValue(
        false
      );
      hasYAxisOverflowSpy = spyOn(Utils, 'hasYAxisOverflow').and.returnValue(
        false
      );
    });

    it('Should return false if no overflow is present', () => {
      expect(Utils.checkOverflow(parentElementMock, childrenElementMock)).toBe(
        false
      );
    });

    it('Should return true if x axis has overflow', () => {
      hasXAxisOverflowSpy.and.returnValue(true);
      expect(Utils.checkOverflow(parentElementMock, childrenElementMock)).toBe(
        true
      );
    });

    it('Should return true if y axis has overflow', () => {
      hasYAxisOverflowSpy.and.returnValue(true);
      expect(Utils.checkOverflow(parentElementMock, childrenElementMock)).toBe(
        true
      );
    });
  });
});
