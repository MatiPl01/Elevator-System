import { DoorState } from "../enums/door-state.enum";


export class ElevatorDoor {
  private _state: DoorState = DoorState.OPEN;

  get state(): DoorState {
    return this._state
  }

  open(): boolean {
    const areOpen = this._state === DoorState.OPEN;
    this._state = DoorState.OPEN;
    // Return false if door are already open or true if they aren't
    return !areOpen;
  }

  close(): boolean {
    const areClosed = this._state === DoorState.CLOSED;
    this._state = DoorState.OPEN;
    // Return false if door are already closed or true if they aren't
    return !areClosed;
  }
}
