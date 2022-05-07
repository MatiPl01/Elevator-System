import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ElevatorService } from 'src/app/services/elevator.service';
import { defaultsConfig } from 'src/app/config';


@Component({
  selector: 'app-floor-details',
  templateUrl: './floor-details.component.html'
})
export class FloorDetailsComponent implements OnInit {
  @ViewChild('input') inputRef!: ElementRef<HTMLElement>;
  @Input() idx!: number;
  @Input() heightObj!: { height: number };

  public floorNum!: number;
  public defaultsConfig = defaultsConfig;

  constructor(private elevatorService: ElevatorService) {}

  ngOnInit() {
    this.floorNum = this.elevatorService.floors.minFloor + this.idx;
  }

  updateHeight() {
    const { minPossibleFloorHeight: minHeight, maxPossibleFloorHeight: maxHeight } = defaultsConfig;
    const { height } = this.heightObj;
    const [ intPart, decPart ] = String(Math.min(Math.max(minHeight, height), maxHeight)).split(/[.,]/);
    this.heightObj.height = +`${intPart}.${decPart?.slice(0, 2) || 0}`;
    this.elevatorService.notifyFloorChange();

  }

  correctInputValue() {
    (this.inputRef.nativeElement as HTMLInputElement).value = String(this.heightObj.height)
  }
}
