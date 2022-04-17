import { Injectable } from "@angular/core";
import { ElevatorComponent, RouteData } from "../components/elevator/elevator.component";


@Injectable({
  providedIn: 'root'
})
export class ElevatorService {
  private static readonly IDs = 'ABCDEFGHIJKLMNOP'; // Max 16 elevators

  public readonly elevatorsConfig = [
    {
      minAvailableFloor: 0,
      maxAvailableFloor: 10,
      maxLoad: 4,
      speed: 2,
      idleFloorNum: 0,
      stopDuration: 5,
      toggleDoorDuration: 2
    },
    {
      minAvailableFloor: 10,
      maxAvailableFloor: 20,
      maxLoad: 3,
      speed: 1.5,
      idleFloorNum: 10,
      stopDuration: 6,
      toggleDoorDuration: 1.5
    },
    {
      minAvailableFloor: -1,
      maxAvailableFloor: 18,
      maxLoad: 3,
      speed: 1.5,
      idleFloorNum: 0,
      stopDuration: 6,
      toggleDoorDuration: 1.5
    }
  ];

  public readonly floorsConfig = [
    {
      number: -1,
      height: 2.5
    },
    {
      number: 0,
      height: 2.5
    },
    {
      number: 1,
      height: 2.75
    },
    {
      number: 2,
      height: 3
    },
    {
      number: 3,
      height: 2.5
    },
    {
      number: 4,
      height: 3.5
    },
    {
      number: 5,
      height: 2.5
    },
    {
      number: 6,
      height: 2.75
    },
    {
      number: 7,
      height: 3
    },
    {
      number: 8,
      height: 2.5
    },
    {
      number: 9,
      height: 3.5
    },
    {
      number: 10,
      height: 2.5
    },
    {
      number: 11,
      height: 2.75
    },
    {
      number: 12,
      height: 3
    },
    {
      number: 13,
      height: 2.5
    },
    {
      number: 14,
      height: 3.5
    },
    {
      number: 15,
      height: 2.5
    },
    {
      number: 16,
      height: 2.75
    },
    {
      number: 17,
      height: 3
    },
    {
      number: 18,
      height: 2.5
    },
    {
      number: 19,
      height: 3.5
    },
    {
      number: 20,
      height: 2.5
    },
    // {
    //   number: 21,
    //   height: 2.75
    // },
    // {
    //   number: 22,
    //   height: 3
    // },
    // {
    //   number: 23,
    //   height: 2.5
    // },
    // {
    //   number: 24,
    //   height: 3.5
    // },
    // {
    //   number: 25,
    //   height: 2.5
    // },
    // {
    //   number: 26,
    //   height: 2.75
    // },
    // {
    //   number: 27,
    //   height: 3
    // },
    // {
    //   number: 28,
    //   height: 2.5
    // },
    // {
    //   number: 29,
    //   height: 3.5
    // },
    // {
    //   number: 30,
    //   height: 2.5
    // },
    // {
    //   number: 31,
    //   height: 2.75
    // },
    // {
    //   number: 32,
    //   height: 3
    // },
    // {
    //   number: 33,
    //   height: 2.5
    // },
    // {
    //   number: 34,
    //   height: 3.5
    // },
    // {
    //   number: 35,
    //   height: 2.5
    // },
    // {
    //   number: 36,
    //   height: 2.75
    // },
    // {
    //   number: 37,
    //   height: 3
    // },
    // {
    //   number: 38,
    //   height: 2.5
    // },
    // {
    //   number: 39,
    //   height: 3.5
    // },
    // {
    //   number: 40,
    //   height: 2.5
    // },
    // {
    //   number: 41,
    //   height: 2.75
    // },
    // {
    //   number: 42,
    //   height: 3
    // },
    // {
    //   number: 43,
    //   height: 2.5
    // },
    // {
    //   number: 44,
    //   height: 3.5
    // },
    // {
    //   number: 45,
    //   height: 2.5
    // },
    // {
    //   number: 46,
    //   height: 2.75
    // },
    // {
    //   number: 47,
    //   height: 3
    // },
    // {
    //   number: 48,
    //   height: 2.5
    // },
    // {
    //   number: 49,
    //   height: 3.5
    // },
    // {
    //   number: 50,
    //   height: 2.5
    // },
    // {
    //   number: 51,
    //   height: 2.75
    // },
    // {
    //   number: 52,
    //   height: 3
    // },
    // {
    //   number: 53,
    //   height: 2.5
    // },
    // {
    //   number: 54,
    //   height: 3.5
    // },
    // {
    //   number: 55,
    //   height: 2.5
    // },
    // {
    //   number: 56,
    //   height: 2.75
    // },
    // {
    //   number: 57,
    //   height: 3
    // },
    // {
    //   number: 58,
    //   height: 2.5
    // },
    // {
    //   number: 59,
    //   height: 3.5
    // },
    // {
    //   number: 60,
    //   height: 2.5
    // }
  ];

  private readonly elevators: ElevatorComponent[] = [];
  public readonly floorHeights: number[] = [0];
  private readonly minFloorNum = this.floorsConfig[0].number;
  private readonly availableFloors: { min: number, max: number }[] = [];

  constructor() {
    this.calcFloorHeightSums();
    this.updateAvailableFloors();
  }

  registerElevator(elevator: ElevatorComponent): string {
    this.elevators.push(elevator);
    return ElevatorService.IDs[this.elevators.length - 1];
  }

  getFloorHeight(floorNum: number): number {
    return this.floorHeights[floorNum - this.minFloorNum];
  }

  getAvailableFloorsFrom(fromFloorNum: number): { min: number, max: number } {
    const idx = fromFloorNum - this.minFloorNum;
    return {
      min: this.availableFloors[idx]?.min || Infinity,
      max: this.availableFloors[idx]?.max || -Infinity
    }
  }

  addRoute(fromFloorNum: number, toFloorNum: number) {
    // Find elevators that are available between specified floors
    const availableElevators = this.elevators.filter((elevator: ElevatorComponent) => {
      return elevator.minAvailableFloor <= fromFloorNum 
          && fromFloorNum <= elevator.maxAvailableFloor
          && elevator.minAvailableFloor <= toFloorNum
          && toFloorNum <= elevator.maxAvailableFloor;
    })

    // Find the lowest total time route
    let bestTime = Infinity;
    let bestRoute!: RouteData;
    let bestElevator!: ElevatorComponent;

    for (const elevator of availableElevators) {
      const elevatorBestRoute = elevator.findBestRoute(fromFloorNum, toFloorNum);
      console.log(elevator.id, elevatorBestRoute)

      if (elevatorBestRoute.totalTime < bestTime) {
        bestTime = elevatorBestRoute.totalTime;
        bestRoute = elevatorBestRoute;
        bestElevator = elevator;
      }
    }
    
    // Add a route to the elevator
    if (bestElevator) bestElevator.addRoute(bestRoute);
    else console.error("Could not find the best elevator");
  }

  private calcFloorHeightSums() {
    for (let i = 1; i < this.floorsConfig.length; i++) {
      const { height: prevHeight } = this.floorsConfig[i - 1];
      const prevSum = this.floorHeights[i - 1];
      this.floorHeights.push(prevSum + prevHeight);
    }
  }

  private updateAvailableFloors() {
    for (let i = this.minFloorNum; i < this.floorsConfig.length; i++) {
      this.availableFloors.push({ min: Infinity, max: -Infinity });
    }
    
    for (const elevator of this.elevatorsConfig) {
      const minIdx = elevator.minAvailableFloor - this.minFloorNum;
      const maxIdx = elevator.maxAvailableFloor - this.minFloorNum;
      for (let i = minIdx; i <= maxIdx; i++) {
        this.availableFloors[i].min = Math.min(this.availableFloors[i].min, elevator.minAvailableFloor);
        this.availableFloors[i].max = Math.max(this.availableFloors[i].max, elevator.maxAvailableFloor);
      }
    }
  }
}
