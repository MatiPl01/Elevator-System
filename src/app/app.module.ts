import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonPanelComponent } from './components/button-panel/button-panel.component';
import { ElevatorBoxComponent } from './components/elevator-box/elevator-box.component';
import { ElevatorComponent } from './components/elevator/elevator.component';
ElevatorBoxComponent
import { ElevatorsViewComponent } from './views/elevators/elevators-view.component';
import { SettingsBoxComponent } from './components/settings-box/settings-box.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { RangeSliderComponent } from './components/range-slider/range-slider.component';


@NgModule({
  declarations: [
    AppComponent,
    ButtonPanelComponent,
    ElevatorComponent,
    ElevatorBoxComponent,
    ElevatorsViewComponent,
    SettingsBoxComponent,
    RangeSliderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxSliderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
