export class Utils {
  public static checkOverflow(
    parent: HTMLElement,
    children: HTMLElement
  ): boolean {
    return (
      Utils.hasXAxisOverflow(parent, children) ||
      Utils.hasYAxisOverflow(parent, children)
    );
  }

  public static hasXAxisOverflow(
    parent: HTMLElement,
    children: HTMLElement
  ): boolean {
    return children.scrollWidth - parent.clientWidth > 0;
  }

  public static hasYAxisOverflow(
    parent: HTMLElement,
    children: HTMLElement
  ): boolean {
    return children.clientHeight - parent.clientHeight > 0;
  }
}
