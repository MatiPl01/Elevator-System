import { Component, Input, OnInit } from '@angular/core';
import { ElevatorService } from 'src/app/services/elevator.service';
import { ElevatorConfig } from 'src/app/types/elevator-config.type';

@Component({
  selector: 'app-elevator',
  templateUrl: './elevator.component.html'
})
export class ElevatorComponent implements OnInit {
  @Input() config!: ElevatorConfig;
  public currentFloor!: number;
  public bottom: number = 0;

  constructor(public elevatorService: ElevatorService) {}

  ngOnInit(): void {
    this.currentFloor = this.config.currentFloor;

    this.bottom = this.elevatorService.heightSums.get(this.currentFloor)!;
    console.log(this.currentFloor, this.bottom);

    // setInterval((() => {
    //   this.bottom += .01;
    //   console.log(this.bottom)
    // }).bind(this), 10)
  }
}
