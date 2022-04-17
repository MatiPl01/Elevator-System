export type ElevatorConfig = {
  minAvailableFloor: number,
  maxAvailableFloor: number,
  maxLoad: number,
  speed: number, // seconds
  initialFloorNum: number,
  toggleDoorDuration: number,
  waitForPeopleDuration: number
}
