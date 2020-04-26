import { FontManager } from '../font-manager';

describe('Class: FontManager', () => {
  const defaultProperties: any = {
    minFontSize: 7,
    maxFontSize: 1000,
    fontSize: 50,
  };
  let fontManager: FontManager;

  beforeEach(() => {
    fontManager = new FontManager();
    fontManager.minFontSize = defaultProperties.minFontSize;
    fontManager.maxFontSize = defaultProperties.maxFontSize;
  });

  describe('Method: constructor', () => {
    it('Should return an instance with default propertiy values', () => {
      expect(fontManager.minFontSize).toBe(defaultProperties.minFontSize);
      expect(fontManager.maxFontSize).toBe(defaultProperties.maxFontSize);
      expect(fontManager.fontSize).toBe(defaultProperties.maxFontSize);
    });
  });

  describe('Setter: fontSize', () => {
    let newFontSize: number;

    it('Should use the minFontSize property value if the specified font size is smaller', () => {
      newFontSize = defaultProperties.minFontSize - 1;
      fontManager.fontSize = newFontSize;
      expect(fontManager.fontSize).toEqual(defaultProperties.minFontSize);
    });
    it('Should use the maxFontSize property value if the specified font size is bigger', () => {
      newFontSize = defaultProperties.maxFontSize + 1;
      fontManager.fontSize = newFontSize;
      expect(fontManager.fontSize).toEqual(defaultProperties.maxFontSize);
    });
  });

  describe('Getter: fontSize', () => {
    beforeEach(() => {
      fontManager.fontSize = defaultProperties.fontSize;
    });

    it('Should get the _fontSize property', () => {
      expect(fontManager.fontSize).toEqual(defaultProperties.fontSize);
    });
  });

  describe('Static Method: calculateFontSize', () => {
    it('Should return the font size rounded down', () => {
      expect(FontManager.calculateFontSize(10, 3)).toEqual(3);
      expect(FontManager.calculateFontSize(9, 3)).toEqual(3);
      expect(FontManager.calculateFontSize(8, 3)).toEqual(2);
    });
  });
});
