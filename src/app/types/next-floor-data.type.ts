export type NextFloorData = {
  // Floor number
  floorNum: number,

  details?: {
    // Number of people leaving the elevator on the floorNum floor
    noLeaving: number,
    // Number of people entering the elevator on the floorNum floor
    noEntering: number,
    // Number of people waiting inside the elevator on the floorNum floor
    noInside: number
  }
}
