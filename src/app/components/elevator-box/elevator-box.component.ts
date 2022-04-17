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
  selector: 'app-elevator-box',
  templateUrl: './elevator-box.component.html'
})
export class ElevatorBoxComponent implements OnInit {
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
    for (let floor of this.elevatorService.floorsConfig) this.floorMap.set(floor.number, floor);
  }

  private updateElevatorContainerStyles() {
    for (const elevator of this.elevatorService.elevatorsConfig) {
      let height = 0;
      for (let i = elevator.minAvailableFloor; i <= elevator.maxAvailableFloor; i++) {
        height += this.floorMap.get(i)?.height || 0;
      }

      let marginTop = 0;
      for (let i = elevator.maxAvailableFloor + 1; i <= this.elevatorService.floorsConfig[this.elevatorService.floorsConfig.length - 1].number; i++) {
        marginTop += this.floorMap.get(i)?.height || 0;
      }

      this.styles.elevatorContainer.push({
        height: `${height}em`,
        'margin-top': `${marginTop}em`
      });
    }
  }

  private updateFloorStyles() {
    for (const floor of this.elevatorService.floorsConfig.reverse()) {
      this.styles.floor.push({
        height: `${floor.height}em`
      })
    }
  }
}
