import { Component, ElementRef, ViewChildren, QueryList } from '@angular/core';

@Component({
  selector: 'app-elevators-view',
  templateUrl: './elevators-view.component.html'
})
export class ElevatorsViewComponent {
  @ViewChildren("checkbox") checkboxes!: QueryList<ElementRef>;

  uncheckOtherCheckboxes(event: Event) {
    const currCheckboxEl = event.target as HTMLInputElement;
    this.checkboxes.forEach((checkboxRef: ElementRef) => {
      const checkboxEl = checkboxRef.nativeElement;
      if (checkboxEl !== currCheckboxEl) checkboxEl.checked = false;
    })
  }
}
