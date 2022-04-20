import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ElevatorService } from 'src/app/services/elevator.service';


type ElevatorContainerStyle = {
  height: string,
  'margin-top': string,
  'margin-bottom': string
}

@Component({
  selector: 'app-elevator-container',
  templateUrl: './elevator-container.component.html'
})
export class ElevatorContainerComponent implements OnInit, OnDestroy {
  @Input() idx!: number;
  public containerStyle!: ElevatorContainerStyle;
  private subscriptions: Subscription[] = [];

  constructor(private elevatorService: ElevatorService) {
    this.subscriptions.push(
      this.elevatorService.elevatorFloorsChange.subscribe((idx: number) => {
        if (idx === this.idx) this.updateContainerStyle();
      })
    )
  }

  ngOnInit() {
    this.updateContainerStyle();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private updateContainerStyle() {
    let marginBottom = 0, marginTop = 0, height = 0;

    const elevatorConfig = this.elevatorService.elevators[this.idx].config;
    const floors = this.elevatorService.floors;

    for (let i = 0; i < elevatorConfig.minFloorNum - floors.minFloor; i++) {
      marginBottom += floors.heights[i].height;
    }

    for (let i = elevatorConfig.minFloorNum - floors.minFloor; 
             i <= elevatorConfig.maxFloorNum - floors.minFloor; i++) {
      height += floors.heights[i].height;
    }
    
    for (let i = elevatorConfig.maxFloorNum - floors.minFloor + 1; 
             i < this.elevatorService.noFloors; i++) {
      marginTop += floors.heights[i].height;
    }

    this.containerStyle = {
      height: `${height}em`,
      'margin-top': `${marginTop}em`,
      'margin-bottom': `${marginBottom}em`
    };
  }
}
