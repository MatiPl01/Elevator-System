import { EventEmitter, Injectable } from "@angular/core";
import { ElevatorComponent } from "../components/elevators/elevator/elevator.component";
import { defaultsConfig } from "../config";
import { ElevatorConfig } from "../types/elevator-config.type";
import { FloorsConfig } from "../types/floors-config.type";
import { RouteData } from "../types/route-data.type";
import * as config from "../config";


export type ElevatorData = {
  config: ElevatorConfig,
  component: ElevatorComponent | null
}

@Injectable({
  providedIn: 'root'
})
export class ElevatorService {
  private static readonly IDs = 'ABCDEFGHIJKLMNOP'; // Max 16 elevators
  public floorsChange = new EventEmitter<FloorsConfig>();
  public elevatorFloorsChange = new EventEmitter<number>();
  public elevatorRegistered = new EventEmitter<{ idx: number, data: ElevatorData }>();
  public elevatorRemoved = new EventEmitter<number>();

  private _floors: FloorsConfig = config.floorsConfig;
  private _elevators: ElevatorData[] = [];

  public readonly floorHeights: Map<number, number> = new Map();
  private readonly availableFloors: Map<number, { min: number, max: number }> = new Map();

  constructor() {
    this.calcFloorHeightSums();
    this.loadElevatorsConfig();
    this.updateAvailableFloors();

    // Load the routes asynchronously (to ensure that elevator components were created)
    setTimeout(this.loadSampleRoutes.bind(this), 0);
  }

  get floors(): FloorsConfig {
    return this._floors;
  }

  get elevators(): { config: ElevatorConfig, component: ElevatorComponent | null }[] {
    return this._elevators;
  }

  get noFloors(): number {
    return this.floors.maxFloor - this.floors.minFloor + 1;
  }

  registerElevatorComponent(idx: number, component: ElevatorComponent) {
    if (idx < this._elevators.length) {
      this._elevators[idx].component = component;
    } else {
      this._elevators.push({
        config: {
          ...config.defaultElevatorConfig,
          minFloorNum: this.floors.minFloor,
          maxFloorNum: this.floors.maxFloor
        },
        component: component
      });
    }

    this.elevatorRegistered.emit({
      idx,
      data: this._elevators[idx]
    })
  }

  getElevatorId(idx: number): string {
    if (idx >= ElevatorService.IDs.length) {
      throw new Error("Wrong elevator index. Index too large.");
    }
    return ElevatorService.IDs[idx];
  }

  canCreateElevator() {
    return this._elevators.length < ElevatorService.IDs.length;
  }

  createElevator() {
    if (this.canCreateElevator()) {
      this._elevators.push({
        config: {
          ...config.defaultElevatorConfig,
          minFloorNum: this.floors.minFloor,
          maxFloorNum: this.floors.maxFloor
        },
        component: null
      });
    }
  }

  removeElevator(idx: number) {
    this._elevators.splice(idx, 1);
    this.elevatorRemoved.emit(idx);
  }

  updateFloors(minFloorNum: number, maxFloorNum: number) {
    const newFloors: FloorsConfig = {
      minFloor: minFloorNum,
      maxFloor: maxFloorNum,
      heights: []
    };

    // Add floors that are lower than the current minimum floor number
    for (let floorNum = minFloorNum; floorNum < Math.min(this._floors.minFloor, maxFloorNum + 1); floorNum++) {
      newFloors.heights.push({ height: config.defaultsConfig.minPossibleFloorHeight });
    }

    // Add the current floors that are between the new minFloorNum and
    // the new maxFloorNum
    const startIdx = Math.max(minFloorNum - this._floors.minFloor, 0);
    const endIdx = maxFloorNum - this._floors.minFloor + 1;
    newFloors.heights.push(...this._floors.heights.slice(startIdx, endIdx));

    // Add floors that are higher than the floor of the current maxFloorNum
    for (let floorNum = Math.max(this._floors.maxFloor + 1, minFloorNum); floorNum < maxFloorNum + 1; floorNum++) {
      newFloors.heights.push({ height: config.defaultsConfig.minPossibleFloorHeight });
    }

    this._floors = newFloors;
    this.notifyFloorChange();
  }

  notifyFloorChange() {
    this.floorHeights.clear();
    this.calcFloorHeightSums();
    this.floorsChange.emit(this._floors);
  }

  notifyElevatorFloorsChange(idx: number) {
    this.updateAvailableFloors();
    this.elevatorFloorsChange.emit(idx);
  }

  getFloorHeight(floorNum: number): number {
    const height = this.floorHeights.get(floorNum);
    if (height === undefined) throw new Error(`Wrong floor number ${floorNum}`);
    return height;
  }

  getAvailableFloorsFrom(fromFloorNum: number): { min: number, max: number } {
    const availableFloors = this.availableFloors.get(fromFloorNum);

    if (!availableFloors) {
      throw new Error(`Floor ${fromFloorNum} doesn't exist`);
    }

    return {
      min: availableFloors.min,
      max: availableFloors.max
    };
  }

  addRoute(fromFloorNum: number, toFloorNum: number) {
    // Find elevators that are available between specified floors
    const availableElevators = this.elevators.filter((elevator: ElevatorData) => {
      return elevator.config.minFloorNum <= fromFloorNum
        && fromFloorNum <= elevator.config.maxFloorNum
        && elevator.config.minFloorNum <= toFloorNum
        && toFloorNum <= elevator.config.maxFloorNum;
    })

    // Find the lowest total time route
    let bestTime = Infinity;
    let bestRoute!: RouteData;
    let bestElevator!: ElevatorComponent|null;

    for (const { component: elevatorComponent } of availableElevators) {
      if (!elevatorComponent) continue;
      const elevatorBestRoute = elevatorComponent.findBestRoute(fromFloorNum, toFloorNum);

      if (!bestRoute || elevatorBestRoute.totalTime < bestTime) {
        bestTime = elevatorBestRoute.totalTime;
        bestRoute = elevatorBestRoute;
        bestElevator = elevatorComponent;
      }
    }

    // Add a route to the elevator
    if (bestElevator) bestElevator.addRoute(bestRoute);
    else alert("Could not find the best elevator. Check if your config is correct");
  }

  private calcFloorHeightSums() {
    this.floorHeights.set(this.floors.minFloor, 0);
    for (let i = 1; i < this.floors.heights.length; i++) {
      const prevHeight = this.floorHeights.get(this.floors.minFloor + i - 1) || 0;
      const currHeight = this.floors.heights[i - 1].height;
      this.floorHeights.set(this.floors.minFloor + i, prevHeight + currHeight);
    }
  }

  private updateAvailableFloors() {
    for (let i = this.floors.minFloor; i <= this.floors.maxFloor; i++) {
      this.availableFloors.set(i, { min: Infinity, max: -Infinity });
    }

    for (const { config: elevatorConfig } of this.elevators) {
      for (let i = elevatorConfig.minFloorNum; i <= elevatorConfig.maxFloorNum; i++) {
        // Update the minimum and maximum floor reachable from the ith floor
        const availableFloor = this.availableFloors.get(i);

        if (!availableFloor) {
          throw new Error(`There is no floor with number ${i} but this floor number is stored in the elevatorConfig`);
        }

        availableFloor.min = Math.min(availableFloor.min, elevatorConfig.minFloorNum);
        availableFloor.max = Math.max(availableFloor.max, elevatorConfig.maxFloorNum);
      }
    }
  }

  private loadElevatorsConfig() {
    this._elevators = config.elevatorsConfig.map((elevatorConfig: ElevatorConfig, idx: number) => {
      if (!ElevatorService.validateElevatorConfig(elevatorConfig)) {
        throw new Error(`${idx} elevator config is not valid. Check the defaults config to see max/min possible values.`);
      }
      return { config: elevatorConfig, component: null };
    });
  }

  private static validateElevatorConfig(elevatorConfig: ElevatorConfig): boolean {
    return !(elevatorConfig.maxLoad > defaultsConfig.maxPossibleLoad
          || elevatorConfig.speed < defaultsConfig.minPossibleSpeed
          || elevatorConfig.speed > defaultsConfig.maxPossibleSpeed
          || elevatorConfig.stopDuration < defaultsConfig.minPossibleStopDuration
          || elevatorConfig.stopDuration > defaultsConfig.maxPossibleStopDuration
          || elevatorConfig.toggleDoorDuration < defaultsConfig.minPossibleDoorToggleDuration
          || elevatorConfig.toggleDoorDuration > defaultsConfig.maxPossibleDoorToggleDuration);
  }

  private loadSampleRoutes() {
    for (const route of config.sampleRoutes) {
      for (let i = 0; i < route.noPassengers; i++) {
        this.addRoute(route.from, route.to);
      }
    }
  }
}
