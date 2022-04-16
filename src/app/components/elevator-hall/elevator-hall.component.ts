import { Component, OnInit } from '@angular/core';
import { ElevatorService } from 'src/app/services/elevator.service';
import { FloorConfig } from 'src/app/types/floor-config.type';


type ElevatorContainerStyle = {
  height: string,
  'margin-top': string
}

type FloorStyle = {
  height: string
}

type Styles = {
  elevatorContainer: ElevatorContainerStyle[],
  floor: FloorStyle[]
}

@Component({
  selector: 'app-elevator-hall',
  templateUrl: './elevator-hall.component.html'
})
export class ElevatorHallComponent implements OnInit {
  private readonly floorMap = new Map<number, FloorConfig>();
  public readonly styles: Styles = {
    elevatorContainer: [],
    floor: []
  }

  constructor(public elevatorService: ElevatorService) {}

  ngOnInit(): void {
    this.updateFloorMap();
    this.updateElevatorContainerStyles();
    this.updateFloorStyles();
  }

  private updateFloorMap() {
    for (let floor of this.elevatorService.floors) this.floorMap.set(floor.number, floor);
  }

  private updateElevatorContainerStyles() {
    for (const elevator of this.elevatorService.elevators) {
      let height = 0;
      for (let i = elevator.minAvailableFloor; i <= elevator.maxAvailableFloor; i++) {
        height += this.floorMap.get(i)?.height || 0;
      }

      let marginTop = 0;
      for (let i = elevator.maxAvailableFloor + 1; i <= this.elevatorService.floors[this.elevatorService.floors.length - 1].number; i++) {
        marginTop += this.floorMap.get(i)?.height || 0;
      }

      this.styles.elevatorContainer.push({
        height: `${height}em`,
        'margin-top': `${marginTop}em`
      });
    }
  }

  private updateFloorStyles() {
    for (const floor of this.elevatorService.floors.reverse()) {
      this.styles.floor.push({
        height: `${floor.height}em`
      })
    }
  }
}
