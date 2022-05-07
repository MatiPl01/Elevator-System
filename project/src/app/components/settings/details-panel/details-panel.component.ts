import { Component } from '@angular/core';
import { DetailsTab } from 'src/app/enums/details-tab.enum';

@Component({
  selector: 'app-details-panel',
  templateUrl: './details-panel.component.html'
})
export class DetailsPanelComponent {
  public DetailsTab = DetailsTab;
  public activeTab: DetailsTab = DetailsTab.ELEVATORS;

  switchTab(tab: DetailsTab) {
    this.activeTab = tab;
  }
}
