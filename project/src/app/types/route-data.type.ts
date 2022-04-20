export type RouteData = {
  // The total time increase of each elevator passenger caused by the
  // addition of the new passenger's route
  totalTime: number,
  // Index where the fromFloorNumber will be inserted (if there is not
  // that floor yet)
  enterIdx: number,
  // Index where the toFloorNum will be inserted (if there is not
  // that floor yet)
  leaveIdx: number,
  // Number of the floor where the new passenger will enter the elevator
  fromFloorNum: number,
  // Number of the floor where the new passenger will leave the elevator
  toFloorNum: number
}
