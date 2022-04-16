import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ElevatorService {
  public readonly elevators = [
    {
      minAvailableFloor: -1,
      maxAvailableFloor: 60,
      maxLoad: 4,
      maxSpeed: 10,
      currentFloor: 0
    },
    {
      minAvailableFloor: -1,
      maxAvailableFloor: 30,
      maxLoad: 3,
      maxSpeed: 10,
      currentFloor: 30
    },
    {
      minAvailableFloor: 30,
      maxAvailableFloor: 60,
      maxLoad: 3,
      maxSpeed: 6,
      currentFloor: 30
    }
  ];

  public readonly floors = [
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
    {
      number: 21,
      height: 2.75
    },
    {
      number: 22,
      height: 3
    },
    {
      number: 23,
      height: 2.5
    },
    {
      number: 24,
      height: 3.5
    },
    {
      number: 25,
      height: 2.5
    },
    {
      number: 26,
      height: 2.75
    },
    {
      number: 27,
      height: 3
    },
    {
      number: 28,
      height: 2.5
    },
    {
      number: 29,
      height: 3.5
    },
    {
      number: 30,
      height: 2.5
    },
    {
      number: 31,
      height: 2.75
    },
    {
      number: 32,
      height: 3
    },
    {
      number: 33,
      height: 2.5
    },
    {
      number: 34,
      height: 3.5
    },
    {
      number: 35,
      height: 2.5
    },
    {
      number: 36,
      height: 2.75
    },
    {
      number: 37,
      height: 3
    },
    {
      number: 38,
      height: 2.5
    },
    {
      number: 39,
      height: 3.5
    },
    {
      number: 40,
      height: 2.5
    },
    {
      number: 41,
      height: 2.75
    },
    {
      number: 42,
      height: 3
    },
    {
      number: 43,
      height: 2.5
    },
    {
      number: 44,
      height: 3.5
    },
    {
      number: 45,
      height: 2.5
    },
    {
      number: 46,
      height: 2.75
    },
    {
      number: 47,
      height: 3
    },
    {
      number: 48,
      height: 2.5
    },
    {
      number: 49,
      height: 3.5
    },
    {
      number: 50,
      height: 2.5
    },
    {
      number: 51,
      height: 2.75
    },
    {
      number: 52,
      height: 3
    },
    {
      number: 53,
      height: 2.5
    },
    {
      number: 54,
      height: 3.5
    },
    {
      number: 55,
      height: 2.5
    },
    {
      number: 56,
      height: 2.75
    },
    {
      number: 57,
      height: 3
    },
    {
      number: 58,
      height: 2.5
    },
    {
      number: 59,
      height: 3.5
    },
    {
      number: 60,
      height: 2.5
    }
  ];

  public readonly heightSums = new Map<number, number>();

  constructor() {
    this.calcFloorHeightSums();
  }

  private calcFloorHeightSums() {
    this.heightSums.set(this.floors[0].number, 0);

    for (let i = 1; i < this.floors.length; i++) {
      const currentNum = this.floors[i].number;
      const { number: prevNum, height: prevHeight } = this.floors[i - 1];
      const prevSum = this.heightSums.get(prevNum);
      this.heightSums.set(currentNum, prevHeight + (prevSum || 0));

      console.log(currentNum, this.heightSums.get(currentNum))
    }
  }
}
