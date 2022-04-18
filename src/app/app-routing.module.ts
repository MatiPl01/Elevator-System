import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ButtonPanelComponent } from './components/button-panel/button-panel.component';
import { ElevatorsViewComponent } from './views/elevators/elevators-view.component';

const routes: Routes = [
  { path: '', component: ElevatorsViewComponent, children: [
    { path: 'panel/:floorNum', component: ButtonPanelComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
