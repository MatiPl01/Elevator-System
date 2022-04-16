export type ElevatorConfig = {
  minAvailableFloor: number,
  maxAvailableFloor: number,
  maxLoad: number,
  speed: number, // seconds
  stopDuration: number,
  initialFloor: number
}
