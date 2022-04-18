import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonPanelComponent } from './components/button-panel/button-panel.component';
import { ElevatorsComponent } from './components/elevators/elevators.component';
import { ElevatorComponent } from './components/elevator/elevator.component';
import { ElevatorsViewComponent } from './views/elevators/elevators-view.component';
import { SettingsBoxComponent } from './components/settings-box/settings-box.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { RangeSliderComponent } from './components/range-slider/range-slider.component';
import { DetailsBoxComponent } from './components/details-box/details-box.component';
import { ElevatorDetailsComponent } from './components/elevator-details/elevator-details.component';


@NgModule({
  declarations: [
    AppComponent,
    ButtonPanelComponent,
    ElevatorComponent,
    ElevatorsComponent,
    ElevatorsViewComponent,
    SettingsBoxComponent,
    RangeSliderComponent,
    DetailsBoxComponent,
    ElevatorDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxSliderModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
