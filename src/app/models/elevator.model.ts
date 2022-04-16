import { EventEmitter } from "@angular/core";
import { DoorState } from "../enums/door-state.enum";
import { ElevatorState } from "../enums/elevator-state.enum";
import { ElevatorDoor } from "./elevator-door.model";


export class Elevator {
  private readonly door: ElevatorDoor = new ElevatorDoor();
  
  public doorStateEvent = new EventEmitter<DoorState>();

  private state: ElevatorState = ElevatorState.IDLE;
  private readonly maxLoad: number;
  private readonly maxSpeed: number;
  private noPassengers: number = 0;

  constructor(maxLoad: number, maxSpeed: number) {
    this.maxLoad = maxLoad;
    this.maxSpeed = maxSpeed;
  }

  openDoor(): boolean {
    const areOpen = this.door.open();
    this.doorStateEvent.emit(this.door.state);
    return areOpen;
  }

  closeDoor(): boolean {
    const areClosed = this.door.close();
    this.doorStateEvent.emit(this.door.state);
    return areClosed;
  }
}
