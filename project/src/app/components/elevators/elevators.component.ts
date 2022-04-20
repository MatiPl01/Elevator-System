import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ElevatorService } from 'src/app/services/elevator.service';


@Component({
  selector: 'app-elevators',
  templateUrl: './elevators.component.html'
})
export class ElevatorsComponent implements OnDestroy {
  public heights: { height: number }[] = [];
  private subscription: Subscription;

  constructor(public elevatorService: ElevatorService) {
    this.heights = this.elevatorService.floors.heights.slice(0, elevatorService.noFloors);
    this.subscription = this.elevatorService.floorsChange.subscribe(() => {
      this.heights = this.elevatorService.floors.heights.slice(0, elevatorService.noFloors);
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
