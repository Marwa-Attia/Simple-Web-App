import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }   from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule }   from '@angular/forms';
import { DeactiveLoanHoganService } from './component/deactiveLoanHogan/deactive-loan-hogan.service';
import { DeactiveLoanHoganComponent} from './component/deactiveLoanHogan/deactive-loan-hogan.component';
import { OrderFloodService } from './component/orderFloodCertificate/order-flood.service';
import { OrderFloodComponent } from './component/orderFloodCertificate/order-flood.component';
import { EAppService } from './component/eApp/eApp.service';
import { RemoveActiveEAppFormMilestoneComponent } from './component/eApp/remove-active-eAppForm-milestone.component';
import { ResubmiteAppDataComponent } from './component/eApp/resubmit-eAppForm.component';
import { ReruneAppFormComponent } from './component/eApp/rerun-eAppForm.component';
import { CoreHttpService } from './component/lib/core-http.service';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { AppMockData }   from './app-mock-data';
import { WFFilterDirective } from './component/lib/wfFilter.directive';
import { WFTabSet } from './component/lib/wfTabSet.directive';
import { WFTab } from './component/lib/wfTab.directive';
import {ColumnComponent} from './component/lib/column.component';
import{CellComponent} from './component/lib/cell.component';
import {WFGrid} from './component/lib/wfGrid.directive';
import {WFGridPager} from './component/lib/wfGridPager.directive';
import { WFGridDemoComponent} from './component/demos/wfGrid.demo.component';
import { VendorSimulationService } from './component/vendorSimulation/vendor-simulation.service';
import { VendorSimulation } from './component/vendorSimulation/vendor-simulation.component';
import{OrderBy} from './component/lib/orderBy.pipe';
import{WFCell} from './component/lib/wfCell.directive';
import{WFRow} from './component/lib/wfRow.component';
import{GroupBy} from './component/lib/groupBy.pipe';
import{WFDataCell} from './component/lib/wfCell.component';
import{ComponentOutlet} from './component/lib/component-outlet';
import {provideComponentOutletModule} from './component/lib/provider';

import { CoreModule }   from './component/core.module';
//
import {HttpModule} from '@angular/http';
@NgModule({
    imports: [HttpModule, BrowserModule, AppRoutingModule, FormsModule, InMemoryWebApiModule.forRoot(AppMockData),CoreModule],
    declarations: [AppComponent, DeactiveLoanHoganComponent, OrderFloodComponent, RemoveActiveEAppFormMilestoneComponent, ResubmiteAppDataComponent, WFFilterDirective,ReruneAppFormComponent,WFTabSet,WFTab,VendorSimulation,ColumnComponent,WFGrid,WFGridPager,WFGridDemoComponent,OrderBy,CellComponent,WFCell,GroupBy,ComponentOutlet,WFRow,WFDataCell],
    providers: [DeactiveLoanHoganService, OrderFloodService, EAppService,VendorSimulationService,provideComponentOutletModule({})],
    bootstrap: [AppComponent]
})
export class AppModule { }
