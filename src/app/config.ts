export const sampleRoutes = [
  {
    from: 3,
    to: 17,
    noPeople: 12
  },
  {
    from: 9,
    to: 7,
    noPeople: 12
  },
  {
    from: 15,
    to: 5,
    noPeople: 5
  },
  {
    from: 18,
    to: 15,
    noPeople: 9
  },
  {
    from: 16,
    to: 3,
    noPeople: 6
  },
  {
    from: -1,
    to: 18,
    noPeople: 8
  },
  {
    from: 8,
    to: 14,
    noPeople: 2
  },
  {
    from: 17,
    to: 14,
    noPeople: 5
  },
  {
    from: 2,
    to: 14,
    noPeople: 9
  },
  {
    from: 6,
    to: 16,
    noPeople: 15
  },
  {
    from: 6,
    to: 20,
    noPeople: 8
  },
  {
    from: 8,
    to: 20,
    noPeople: 12
  },
  {
    from: 19,
    to: -1,
    noPeople: 2
  },
  {
    from: 12,
    to: 6,
    noPeople: 6
  },
  {
    from: 6,
    to: 16,
    noPeople: 10
  },
  {
    from: 13,
    to: 4,
    noPeople: 6
  },
  {
    from: 14,
    to: 14,
    noPeople: 4
  },
  {
    from: 1,
    to: 14,
    noPeople: 6
  },
  {
    from: 4,
    to: 13,
    noPeople: 11
  },
  {
    from: -1,
    to: 17,
    noPeople: 4
  },
  {
    from: 4,
    to: 20,
    noPeople: 9
  },
  {
    from: 4,
    to: 2,
    noPeople: 12
  },
  {
    from: -1,
    to: 17,
    noPeople: 15
  },
  {
    from: 14,
    to: 20,
    noPeople: 15
  },
  {
    from: 7,
    to: 15,
    noPeople: 11
  }
]

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
    2.75,
    3.3,
    3.1,
    4.6,
    3.3,
    2.4,
    4.45,
    4.5,
    2.95,
    4.55,
    3.1,
    2.55,
    2.5,
    3.5,
    2.75,
    4.0,
    2.15,
    4.35,
    2.05,
    4.3,
    4.25
  ]
}

export const defaultElevatorConfig = {
  minFloorNum: floorsConfig.minFloor,
  maxFloorNum: floorsConfig.minFloor,
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
    maxLoad: 3,
    speed: 1.5,
    idleFloorNum: 10,
    stopDuration: 6,
    toggleDoorDuration: 1.5
  },
  {
    minFloorNum: -1,
    maxFloorNum: 18,
    maxLoad: 3,
    speed: 1.5,
    idleFloorNum: 0,
    stopDuration: 6,
    toggleDoorDuration: 1.5
  }
];
