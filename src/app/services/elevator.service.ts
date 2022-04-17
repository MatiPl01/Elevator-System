import { Injectable } from "@angular/core";
import { ElevatorComponent } from "../components/elevator/elevator.component";
import { Queue } from "../utils/data-structures/queue.data-structure";


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
      initialFloorNum: 0,
      toggleDoorDuration: 2,
      waitForPeopleDuration: 5
    },
    {
      minAvailableFloor: 10,
      maxAvailableFloor: 20,
      maxLoad: 3,
      speed: 1.5,
      initialFloorNum: 10,
      toggleDoorDuration: 1.5,
      waitForPeopleDuration: 6
    },
    {
      minAvailableFloor: -1,
      maxAvailableFloor: 18,
      maxLoad: 3,
      speed: 1.75,
      stopDuration: 10,
      initialFloorNum: 0,
      toggleDoorDuration: 2.5,
      waitForPeopleDuration: 8
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

    const q = new Queue();
    q.enqueue(1);
    q.enqueue(2);
    q.enqueue(3);

    console.log(...q);
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
    
    // Find an elevator for which the increase of the total time to
    // destination of all passengers will be the lowest
    let minTimeIncrease = Infinity;
    let bestElevator = null;
    for (const elevator of availableElevators) {
      const currentTimeIncrease = elevator.calcTotalCost(fromFloorNum, toFloorNum);
      if (currentTimeIncrease < minTimeIncrease) {
        minTimeIncrease = currentTimeIncrease;
        bestElevator = elevator;
      }
    }
    
    // Add a route to the elevator
    if (bestElevator) bestElevator.addRoute(fromFloorNum, toFloorNum);
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
