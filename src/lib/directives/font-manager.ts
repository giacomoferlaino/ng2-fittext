export class FontManager {
  private _fontSize: number;

  public minFontSize: number;
  public maxFontSize: number;

  constructor(minFontSize: number = 7, maxFontSize: number = 1000) {
    this.minFontSize = minFontSize;
    this.maxFontSize = maxFontSize;
    this._fontSize = maxFontSize;
  }

  public set fontSize(fontSize: number) {
    if (fontSize < this.minFontSize) this._fontSize = this.minFontSize;
    else if (fontSize > this.maxFontSize) this._fontSize = this.maxFontSize;
    else this._fontSize = fontSize;
  }

  public get fontSize(): number {
    return this._fontSize;
  }

  public static calculateFontSize(fontSize: number, speed: number): number {
    return Math.floor(fontSize / speed);
  }
}
