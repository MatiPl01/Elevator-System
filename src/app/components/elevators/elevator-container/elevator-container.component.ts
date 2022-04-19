import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ElevatorService } from 'src/app/services/elevator.service';
import { ElevatorConfig } from 'src/app/types/elevator-config.type';
import { FloorConfig } from 'src/app/types/floor-config.type';


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
  @Input('elevatorConfig') config!: ElevatorConfig;
  public containerStyle!: ElevatorContainerStyle;
  private subscription: Subscription;
  private floors!: FloorConfig[];

  constructor(private elevatorService: ElevatorService) {
    this.floors = this.elevatorService.floors;

    this.subscription = this.elevatorService.floorsChange.subscribe((floors: FloorConfig[]) => {
      this.floors = floors;
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
    console.log(this.floors)

    let i = 0;
    for (; this.floors[i].number < this.config.minFloorNum; i++) {
      marginBottom += this.floors[i].height;
    }

    for (; this.floors[i] && this.floors[i].number <= this.config.maxFloorNum; i++) {
      height += this.floors[i].height;
    }

    for (; i < this.floors.length; i++) {
      marginTop += this.floors[i].height;
    }

    this.containerStyle = {
      height: `${height}em`,
      'margin-top': `${marginTop}em`,
      'margin-bottom': `${marginBottom}em`
    };
  }
}
