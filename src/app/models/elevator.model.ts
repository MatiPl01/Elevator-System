import { EventEmitter } from "@angular/core";
import { DoorState } from "../enums/door-state.enum";
import { ElevatorState } from "../enums/elevator-state.enum";
import { ElevatorDoor } from "./elevator-door.model";
import { Queue } from "../data-structures/queue.data-structure";


export class Elevator {
  private readonly door: ElevatorDoor = new ElevatorDoor();
  
  // public doorStateEvent = new EventEmitter<DoorState>();

  private state = ElevatorState.IDLE;
  private readonly maxLoad: number;
  private readonly maxSpeed: number;
  private readonly leavingCountsMap = new Map<number, number>();
  private noPassengers = 0;
  private totalCost = 0;
  private currentFloor = 0;
  private nextFloors = new Queue();

  constructor(maxLoad: number, maxSpeed: number) {
    this.maxLoad = maxLoad;
    this.maxSpeed = maxSpeed;
  }

  // openDoor(): boolean {
  //   const areOpen = this.door.open();
  //   this.doorStateEvent.emit(this.door.state);
  //   return areOpen;
  // }

  // closeDoor(): boolean {
  //   const areClosed = this.door.close();
  //   this.doorStateEvent.emit(this.door.state);
  //   return areClosed;
  // }

  addPerson(floorNum: number) {
    const noLeaving = this.leavingCountsMap.get(floorNum) || 0;
    // If there was nobody leaving at the specified floor,
    // add the number of a floor to the nextFloors queue
    if (!noLeaving) this.nextFloors.enqueue(floorNum);
    this.leavingCountsMap.set(floorNum, noLeaving + 1);
  }
}
