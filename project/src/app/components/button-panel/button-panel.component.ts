import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ElevatorService } from 'src/app/services/elevator.service';

@Component({
  selector: 'app-button-panel',
  templateUrl: './button-panel.component.html'
})
export class ButtonPanelComponent implements OnInit {
  private static readonly MAX_BUTTONS_PER_SCREEN = 16;

  private readonly minFloorNum: number;
  private readonly maxFloorNum: number;
  public readonly startFloorNum: number;
  public floorGroups: number[][] = [];
  public currentTabIdx: number = 0;
  public underlinedTabIdx = this.currentTabIdx;
  public floorChoice: number|null = null;

  constructor(private elevatorService: ElevatorService,
              private route: ActivatedRoute,
              private router: Router) {
    this.startFloorNum = +this.route.snapshot.params['floorNum'];
    const { min, max } = this.elevatorService.getAvailableFloorsFrom(this.startFloorNum);
    this.minFloorNum = min;
    this.maxFloorNum = max;
  }

  ngOnInit() {
    this.groupFloors();
  }

  private groupFloors() {
    let group: number[] = [];
    
    for (let i = this.minFloorNum; i <= this.maxFloorNum; i++) {
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
    if (this.floorChoice !== null) this.elevatorService.addRoute(this.startFloorNum, this.floorChoice);
  }

  closePanel() {
    this.router.navigate(['/']);
  }
}
