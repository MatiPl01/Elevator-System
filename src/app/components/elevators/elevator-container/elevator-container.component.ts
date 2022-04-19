import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ElevatorService } from 'src/app/services/elevator.service';
import { FloorsConfig } from 'src/app/types/floors-config.type';


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
  private subscription: Subscription;
  private floors!: FloorsConfig;

  constructor(private elevatorService: ElevatorService) {
    this.floors = this.elevatorService.floors;
    this.subscription = this.elevatorService.floorsChange.subscribe((floors: FloorsConfig) => {
      this.updateContainerStyle();
    })
  }

  ngOnInit() {
    this.updateContainerStyle();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private updateContainerStyle() {
    let marginBottom = 0, marginTop = 0, height = 0;

    const elevatorConfig = this.elevatorService.elevators[this.idx].config;

    for (let i = 0; i < this.floors.minFloor - elevatorConfig.minFloorNum; i++) {
      marginBottom += this.floors.heights[i];
    }

    for (let i = this.floors.minFloor - elevatorConfig.minFloorNum; 
             i < this.floors.maxFloor - elevatorConfig.minFloorNum; i++) {
      height += this.floors.heights[i];
    }

    for (let i = this.floors.maxFloor - elevatorConfig.minFloorNum + 1; 
             i < elevatorConfig.maxFloorNum - elevatorConfig.minFloorNum; i++) {
      marginTop += this.floors.heights[i];
    }

    
    this.containerStyle = {
      height: `${height}em`,
      'margin-top': `${marginTop}em`,
      'margin-bottom': `${marginBottom}em`
    };
    console.log('>>>', this.containerStyle)
  }
}
