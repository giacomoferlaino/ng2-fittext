import { ElementRef } from '@angular/core';

export enum ClientProperties {
  height = 'clientHeight',
  width = 'clientWidth',
}

export class HtmlElementUtils {
  public static elementHasOverflow(
    parent: HTMLElement,
    children: HTMLElement
  ): boolean {
    return (
      HtmlElementUtils.hasXAxisOverflow(parent, children) ||
      HtmlElementUtils.hasYAxisOverflow(parent, children)
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

  public static getInitialFontSizeFromProperty(
    container: HTMLElement,
    el: ElementRef<HTMLElement>,
    clientPropery: ClientProperties
  ): number {
    return container
      ? container[clientPropery]
      : el.nativeElement.parentElement[clientPropery];
  }

  public static isVisible(
    container: HTMLElement,
    el: ElementRef<HTMLElement>,
    clientPropery: ClientProperties = ClientProperties.height
  ): boolean {
    return (
      HtmlElementUtils.getInitialFontSizeFromProperty(
        container,
        el,
        ClientProperties.height
      ) > 0
    );
  }
}
