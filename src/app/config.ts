export const sampleRoutes = [
  {
    from: 3,
    to: 17,
    noPassengers: 12
  },
  {
    from: 9,
    to: 7,
    noPassengers: 12
  },
  {
    from: 15,
    to: 5,
    noPassengers: 5
  },
  {
    from: 18,
    to: 15,
    noPassengers: 9
  },
  {
    from: 16,
    to: 3,
    noPassengers: 6
  },
  {
    from: -1,
    to: 18,
    noPassengers: 8
  },
  {
    from: 8,
    to: 14,
    noPassengers: 2
  },
  {
    from: 17,
    to: 14,
    noPassengers: 5
  },
  {
    from: 2,
    to: 14,
    noPassengers: 9
  },
  {
    from: 6,
    to: 16,
    noPassengers: 15
  },
  {
    from: 6,
    to: 18,
    noPassengers: 8
  },
  {
    from: 8,
    to: 17,
    noPassengers: 12
  },
  {
    from: 15,
    to: -1,
    noPassengers: 2
  },
  {
    from: 12,
    to: 6,
    noPassengers: 6
  },
  {
    from: 6,
    to: 16,
    noPassengers: 10
  },
  {
    from: 13,
    to: 4,
    noPassengers: 6
  },
  {
    from: 7,
    to: 0,
    noPassengers: 4
  },
  {
    from: 1,
    to: 8,
    noPassengers: 6
  },
  {
    from: 4,
    to: 13,
    noPassengers: 11
  },
  {
    from: 0,
    to: 6,
    noPassengers: 4
  },
  {
    from: 10,
    to: 20,
    noPassengers: 9
  },
  {
    from: 18,
    to: 11,
    noPassengers: 12
  },
  {
    from: 12,
    to: 14,
    noPassengers: 15
  },
  {
    from: 14,
    to: 20,
    noPassengers: 15
  },
  {
    from: 7,
    to: 15,
    noPassengers: 11
  }
];

export const defaultsConfig = {
  maxPossibleLoad: 8,
  minPossibleSpeed: .25,
  maxPossibleSpeed: 5,
  minPossibleStopDuration: 2,
  maxPossibleStopDuration: 20,
  minPossibleDoorToggleDuration: 1,
  maxPossibleDoorToggleDuration: 5,
  minPossibleFloorHeight: 2.5,
  maxPossibleFloorHeight: 10,
  minPossibleFloorNum: -10,
  maxPossibleFloorNum: 1000,
};

export const floorsConfig = {
  minFloor: -1,
  maxFloor: 20,
  heights: [
    3.2,
    5.0,
    4.75,
    3.7,
    2.75,
    4.45,
    3.8,
    4.25,
    2.5,
    4.9,
    4.1,
    3.6,
    4.95,
    3.5,
    2.8,
    4.1,
    4.35,
    4.45,
    3.35,
    4.75,
    2.6,
    4.25
  ]
}

export const defaultElevatorConfig = {
  minFloorNum: floorsConfig.minFloor,
  maxFloorNum: floorsConfig.maxFloor,
  idleFloorNum: floorsConfig.maxFloor,
  maxLoad: 6,
  speed: 2,
  stopDuration: 5,
  toggleDoorDuration: 2
}

export const elevatorsConfig = [
  {
    minFloorNum: 0,
    maxFloorNum: 10,
    maxLoad: 4,
    speed: 2,
    idleFloorNum: 0,
    stopDuration: 5,
    toggleDoorDuration: 2
  },
  {
    minFloorNum: 10,
    maxFloorNum: 20,
    maxLoad: 8,
    speed: 1.5,
    idleFloorNum: 10,
    stopDuration: 6,
    toggleDoorDuration: 1.5
  },
  {
    minFloorNum: -1,
    maxFloorNum: 18,
    maxLoad: 6,
    speed: 1.5,
    idleFloorNum: 0,
    stopDuration: 6,
    toggleDoorDuration: 1.5
  }
];
