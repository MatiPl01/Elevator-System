import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ElevatorService } from 'src/app/services/elevator.service';

@Component({
  selector: 'app-button-panel[minAvailableFloor][maxAvailableFloor]', // Make attributes required
  templateUrl: './button-panel.component.html'
})
export class ButtonPanelComponent implements OnInit {
  private static readonly MAX_BUTTONS_PER_SCREEN = 16;

  private readonly minAvailableFloor: number;
  private readonly maxAvailableFloor: number;
  private readonly startFloorNum: number;
  public floorGroups: number[][] = [];
  public currentTabIdx: number = 0;
  public underlinedTabIdx = this.currentTabIdx;
  public floorChoice!: number;

  constructor(private elevatorService: ElevatorService,
              private route: ActivatedRoute) {
    this.startFloorNum = +this.route.snapshot.params['floorNum'];
    const { min, max } = this.elevatorService.getAvailableFloorsFrom(this.startFloorNum);
    this.minAvailableFloor = min;
    this.maxAvailableFloor = max;
  }

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
    console.log('choice', this.floorChoice)
  }
}
