import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { LabelType, Options } from '@angular-slider/ngx-slider'

@Component({
  selector: 'app-range-slider',
  styleUrls: ['./range-slider.component.scss'],
  templateUrl: './range-slider.component.html'
})
export class RangeSliderComponent implements OnInit {
  @Output() valueChange = new EventEmitter<number>()
  @Input() min!: number;
  @Input() max!: number;
  @Input() step: number = .1;
  @Input() default!: number;
  public options!: Options;
  public value!: number;
  private decimalDigitsCount: number = 0;

  ngOnInit() {
    this.decimalDigitsCount = String(this.step).split('.')[1].length;
    this.value = Math.round(this.default / this.step);
    this.options = {
      floor: Math.floor(this.min / this.step),
      ceil: Math.ceil(this.max / this.step),
      translate: (value: number, label: LabelType): string => {
        return `${(value * this.step).toFixed(this.decimalDigitsCount)}x`
      }
    };
  }

  onChange() {
    this.valueChange.emit(+(this.value * this.step).toFixed(this.decimalDigitsCount));
  }
}
