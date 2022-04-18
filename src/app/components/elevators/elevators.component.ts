import { Component } from '@angular/core';
import { ElevatorService } from 'src/app/services/elevator.service';
import { FloorConfig } from 'src/app/types/floor-config.type';


type ElevatorContainerStyle = {
  height: string,
  'margin-top': string,
  'margin-bottom': string
}

type FloorStyle = {
  height: string
}

@Component({
  selector: 'app-elevators',
  templateUrl: './elevators.component.html'
})
export class ElevatorsComponent {
  private readonly floorMap = new Map<number, FloorConfig>();
  public readonly floorStyles: FloorStyle[] = [];
  public maxFloorNum: number = -Infinity;

  constructor(public elevatorService: ElevatorService) {
    this.updateFloors();
    this.updateFloorStyles();
  }

  getElevatorContainerStyle(minFloorNum: number, maxFloorNum: number): ElevatorContainerStyle {
    let marginBottom = 0;
    for (let i = this.elevatorService.floorsConfig[0].number; i < minFloorNum; i++) {
      marginBottom += this.floorMap.get(i)?.height || 0;
    }

    let height = 0;
    for (let i = minFloorNum; i <= maxFloorNum; i++) {
      height += this.floorMap.get(i)?.height || 0;
    }

    let marginTop = 0;
    for (let i = maxFloorNum + 1; i <= this.elevatorService.floorsConfig[this.elevatorService.floorsConfig.length - 1].number; i++) {
      marginTop += this.floorMap.get(i)?.height || 0;
    }

    return {
      height: `${height}em`,
      'margin-top': `${marginTop}em`,
      'margin-bottom': `${marginBottom}em`
    };
  }

  private updateFloors() {
    for (let floor of this.elevatorService.floorsConfig) {
      if (floor.number > this.maxFloorNum) this.maxFloorNum = floor.number;
      this.floorMap.set(floor.number, floor);
    }
  }

  private updateFloorStyles() {
    for (const floor of this.elevatorService.floorsConfig.slice().reverse()) {
      this.floorStyles.push({
        height: `${floor.height}em`
      })
    }
  }
}
