import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[Accordion]'
})
export class AccordionDirective implements OnInit {
  private accordionItems: HTMLElement[] = [];
  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    const accordionElements = this.elementRef.nativeElement.children;

    for (let i = 0; i < accordionElements.length; i++) {
      this.accordionItems.push(accordionElements[i]);
      accordionElements[i]
        .querySelector(".fa-chevron-up")
        .addEventListener("click", () => {
          this.toggleAccordion(i);
        });
    }
  }

  toggleAccordion(index: number) {
    this.accordionItems.forEach((item: HTMLElement, i: number) => {
      const listMethod = index == i ? "toggle" : "add";
      item.classList[listMethod]("collapsed");
    });
  }
}
