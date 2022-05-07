import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonPanelComponent } from './components/button-panel/button-panel.component';
import { ElevatorsComponent } from './components/elevators/elevators.component';
import { ElevatorComponent } from './components/elevators/elevator/elevator.component';
import { ElevatorsViewComponent } from './views/elevators/elevators-view.component';
import { SettingsBoxComponent } from './components/settings/options/options.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { RangeSliderComponent } from './components/settings/range-slider/range-slider.component';
import { DetailsPanelComponent } from './components/settings/details-panel/details-panel.component';
import { ElevatorDetailsComponent } from './components/settings/details-panel/elevators-tab/elevator-details/elevator-details.component';
import { FloorDetailsComponent } from './components/settings/details-panel/floors-tab/floor-details/floor-details.component';
import { ElevatorsTabComponent } from './components/settings/details-panel/elevators-tab/elevators-tab.component';
import { FloorsTabComponent } from './components/settings/details-panel/floors-tab/floors-tab.component';
import { ElevatorContainerComponent } from './components/elevators/elevator-container/elevator-container.component';


@NgModule({
  declarations: [
    AppComponent,
    ButtonPanelComponent,
    ElevatorComponent,
    ElevatorsComponent,
    ElevatorsViewComponent,
    SettingsBoxComponent,
    RangeSliderComponent,
    DetailsPanelComponent,
    ElevatorDetailsComponent,
    FloorDetailsComponent,
    ElevatorsTabComponent,
    FloorsTabComponent,
    ElevatorContainerComponent
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
