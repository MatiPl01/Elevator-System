import { Component } from '@angular/core';
import { DetailsTab } from 'src/app/enums/details-tab.enum';

@Component({
  selector: 'app-details-box',
  templateUrl: './details-box.component.html'
})
export class DetailsBoxComponent {
  public DetailsTab = DetailsTab;
  public activeTab: DetailsTab = DetailsTab.FLOORS;

  constructor() {}
}
