import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ElevatorService } from 'src/app/services/elevator.service';
import { defaultsConfig, defaultElevatorConfig } from 'src/app/config';
import { ElevatorData } from 'src/app/services/elevator.service';
import { Subscription } from 'rxjs';
import { ElevatorConfig } from "../../../../../types/elevator-config.type";

@Component({
  selector: 'app-elevator-details',
  templateUrl: './elevator-details.component.html'
})
export class ElevatorDetailsComponent implements OnInit, OnDestroy {
  @Input() idx!: number;
  Math = Math;

  public id!: string;
  public elevator!: ElevatorData;
  public config!: ElevatorConfig;
  public defaultsConfig = defaultsConfig;
  public defaultElevatorConfig = defaultElevatorConfig;

  private subscription: Subscription;
  private prevInputLength: Map<string, number> = new Map();

  constructor(public elevatorService: ElevatorService) {
    this.subscription = this.elevatorService.elevatorRemoved.subscribe((idx: number) => {
      if (this.idx > idx) {
        this.idx--;
        this.id = this.elevatorService.getElevatorId(this.idx);
      }
    })
  }

  ngOnInit() {
    this.elevator = this.elevatorService.elevators[this.idx];
    this.config = { ...this.elevator.config };
    this.id = this.elevatorService.getElevatorId(this.idx);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  removeElevator() {
    this.elevatorService.removeElevator(this.idx);
  }

  validateInput(event: Event, isInt = false): boolean {
    const inputEl = event.target as HTMLInputElement;
    if (inputEl.value === '') return false;
    if (inputEl.value.length < (this.prevInputLength.get(inputEl.name) || 0)) {
      this.prevInputLength.set(inputEl.name, inputEl.value.length);
    }
    this.updateValue(inputEl, isInt);
    return true;
  }

  validateOnChange(event: Event, isInt = false) {
    this.updateValue(event.target as HTMLInputElement, isInt, true);
  }

  validateFloorInput(event: Event) {
    const inputEl = event.target as HTMLInputElement;
    const wasUpdated = this.validateInput(event, true);
    if (wasUpdated) this.updateElevatorFloors(inputEl.name);
  }

  updateElevatorFloors(updatedProperty: string) {
    if (updatedProperty === 'minFloorNum') {
      this.updateMaxFloor();
      this.updateMinFloor();
    } else {
      this.updateMinFloor();
      this.updateMaxFloor();
    }
    this.updateIdleFloor();
    Object.assign(this.elevator.config, this.config);

    this.elevator?.component?.reset();
    this.elevatorService.notifyElevatorFloorsChange(this.idx);
  }

  private updateValue(inputEl: HTMLInputElement, isInt = false, replaceFloatWithCorrect = false) {
    let value = Math.min(Math.max(+inputEl.min, +inputEl.value), +inputEl.max);
    if (isInt) {
      value = Math.trunc(value);
      this.setNewValue(inputEl, value);
    } else {
      value = ElevatorDetailsComponent.parseFloatValue(value);
      const inputVal = +inputEl.value;

      if (inputEl.value.length >= Math.max(inputEl.max.length, inputEl.min.length)
          || Math.floor(inputVal) > inputEl.max.length
          || replaceFloatWithCorrect) {
        this.setNewValue(inputEl, value);
      }
    }
  }

  private static parseFloatValue(value: number) {
    const [intPart, decPart] = String(value).split(/[.,]/);
    return +`${intPart}.${decPart?.slice(0, 2) || 0}`;
  }

  private setNewValue(inputEl: HTMLInputElement, value: number) {
    this.config[inputEl.name as keyof ElevatorConfig] = value;
    inputEl.value = String(value);
    Object.assign(this.elevator.config, this.config);
  }

  private updateMinFloor() {
    this.config.minFloorNum = Math.max(
      Math.min(this.config.minFloorNum, this.config.maxFloorNum),
      this.elevatorService.floors.minFloor
    );
  }

  private updateMaxFloor() {
    this.config.maxFloorNum = Math.min(
      Math.max(this.config.minFloorNum, this.config.maxFloorNum),
      this.elevatorService.floors.maxFloor
    );
  }

  private updateIdleFloor() {
    this.config.idleFloorNum = Math.min(
      Math.max(this.config.minFloorNum, this.config.idleFloorNum),
      this.config.maxFloorNum
    );
  }
}
