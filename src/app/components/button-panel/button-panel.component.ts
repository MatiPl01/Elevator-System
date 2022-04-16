import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button-panel[minAvailableFloor][maxAvailableFloor]', // Make attributes required
  templateUrl: './button-panel.component.html'
})
export class ButtonPanelComponent implements OnInit {
  private static readonly MAX_BUTTONS_PER_SCREEN = 16;
  
  @Input() minAvailableFloor!: number;
  @Input() maxAvailableFloor!: number;
  @Output() floorChoiceEvent = new EventEmitter<number>();

  public floorGroups: number[][] = [];
  public currentTabIdx: number = 0;
  public underlinedTabIdx = this.currentTabIdx;
  public floorChoice!: number;

  ngOnInit() {
    this.groupFloors();
  }

  private groupFloors() {
    let group: number[] = [];
    
    for (let i = this.minAvailableFloor; i <= this.maxAvailableFloor; i++) {
      group.push(i);
      if (group.length === ButtonPanelComponent.MAX_BUTTONS_PER_SCREEN) {
        this.floorGroups.push(group);
        group = [];
      }
    }

    if (group.length) this.floorGroups.push(group);
  }

  setUnderlinedTab(idx: number) {
    this.underlinedTabIdx = idx;
  }

  setButtonTab(idx: number) {
    this.currentTabIdx = idx;
  }

  changeButtonTab(offset: number) {
    this.currentTabIdx += offset;
    this.setUnderlinedTab(this.currentTabIdx);
  }

  chooseFloor(event: Event) {
    this.floorChoice = +(event.target as HTMLInputElement).value;
  }

  submitChoice() {
    this.floorChoiceEvent.emit(this.floorChoice);
  }
}
