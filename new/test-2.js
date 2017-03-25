import { UpgradeAdapter } from '@angular/upgrade';
import {HttpModule} from '@angular/http';
import { AppMockData }   from '../app-mock-data';
import { FormsModule }   from '@angular/forms';
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Location,LocationStrategy } from '@angular/common';
import { Http, Request, RequestOptionsArgs, Response, XHRBackend, RequestOptions, ConnectionBackend, Headers} from '@angular/http';
import { Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';


// UIs
import { DeactiveLoanHoganComponent} from '../views/partial/deactiveLoanHogan/deactive-loan-hogan.component';
import { DeactiveLoanHoganService } from '../views/partial/deactiveLoanHogan/deactive-loan-hogan.service';
import { OrderFloodService } from '../views/partial/orderFloodCertificate/order-flood.service';
import { OrderFloodComponent } from '../views/partial/orderFloodCertificate/order-flood.component';
import { VendorSimulationService } from '../views/partial/vendorSimulation/vendor-simulation.service';
import { VendorSimulation } from '../views/partial/vendorSimulation/vendor-simulation.component';
import { EAppService } from '../views/partial/eApp/eApp.service';
import { RemoveActiveEAppFormMilestoneComponent } from '../views/partial/eApp/remove-active-eAppForm-milestone.component';
import { ResubmiteAppDataComponent } from '../views/partial/eApp/resubmit-eAppForm.component';
import { ReruneAppFormComponent } from '../views/partial/eApp/rerun-eAppForm.component';
import {editEmailComponent} from '../views/partial/editEmailTemplate/editEmailTemplate.component';
import {satisfyStipsComponent} from '../views/partial/satisfyAllStips/satisfyAllStips.component';
import {updateAUOriginatorComponent} from '../views/partial/updateAUOriginatorOfLoan/updateAUOriginator.component';
import {DataVisibilityComponent} from '../views/partial/dataVisibilityConfiguration/dataVisibilityConfiguration.component';


//Demos
import { WFGridDemoComponent} from '../demos/wfGrid.demo.component';



//HTTP Service
import { CoreHttpService } from '../directives/core-http.service';
import {WFFrameworkModule} from '../framework/wfFramework.module';

@NgModule({
  imports: [
       BrowserModule, FormsModule,HttpModule,WFFrameworkModule
  ],
  declarations: [
  
    WFGridDemoComponent, 
    DeactiveLoanHoganComponent, 
    OrderFloodComponent, 
    VendorSimulation, 
    RemoveActiveEAppFormMilestoneComponent ,
    ResubmiteAppDataComponent ,
    ReruneAppFormComponent , 
    editEmailComponent, 
    updateAUOriginatorComponent, 
    DataVisibilityComponent, 
    satisfyStipsComponent
      ],
 
  providers: [
    DeactiveLoanHoganService,
    OrderFloodService,
    VendorSimulationService,
    EAppService,
   {
      provide: CoreHttpService,
      useFactory: (backend: XHRBackend, options: RequestOptions,router: Router) => {
        return new CoreHttpService(backend, options,router);
      },
      deps: [XHRBackend, RequestOptions]
    }]
})
export class AdminModule { 

}

const upgradeAdapter  = new UpgradeAdapter(AdminModule);

export default upgradeAdapter;
-----------------------------------------------------------------------------------------------------------------------------------------
import { Component } from '@angular/core';

@Component({
    selector: 'wf-grid-demo',
    templateUrl: 'angular_io/app/demos/wfGrid.demo.html'
})

export class WFGridDemoComponent {
    wfCol: any = { header: "hello", value: "hi" };
    testRec: number;
    records: any[] = [
        { id: "A", city: "Cairo3", country: "Morocco" },
        { id: "B", city: "Cairoe", country: "Egypt" },
        { id: "C", city: "Caiewro", country: "France" },
        { id: "D", city: "Caiewro", country: "USA" },
        { id: "E", city: "Ca4iro", country: "Germany" },
        { id: "F", city: "Caigro", country: "Iceland" },
        { id: "G", city: "Caiewro", country: "Ireland" },
        { id: "H", city: "Caiefro", country: "Spain" },
        { id: "I", city: "Cairo", country: "Egypt" },
        { id: "J", city: "Caifzxro", country: "Germany" },
        { id: "K", city: "Casadiro", country: "Egypt" },
        { id: "L", city: "Caixczzro", country: "Egypt" },
        { id: "M", city: "Caixro", country: "Iceland" },
        { id: "N", city: "Cariro", country: "Egypt" },
        { id: "O", city: "Careiro", country: "Egypt" },
        { id: "P", city: "Caeriro", country: "Egypt" },
        { id: "Q", city: "Cadsiro", country: "France" },
        { id: "R", city: "Caidsadsaro", country: "Morocco" },
        { id: "S", city: "Cadiro", country: "USA" },
        { id: "T", city: "Cairo", country: "USA" },
        { id: "U", city: "Caddiro", country: "Spain" },
        { id: "V", city: "Cadsairo", country: "Spain" },
        { id: "W", city: "Cddiro", country: "Egypt" }
    ];
    dataset: any = {
        title: 'Cities',
        //enablePaging: true,
        paging: {
            startIndex: 1,
            currentPage: 1,
            totalPages: 5,
            totalRecords: 23,
            rowsPerPage: 5,
            endIndex: 5,
            oldPage: 0,
            selectedPageSize: 5
        },
        enableEdit:true,
       //deprecated colDef: [{ header: "",  value: "selected", cellTemplate:'<wf-checklist id ="my" [rowObj]="row" [hidden]="false" [disable]="false"  (clickHandler)="self.handlerFire($event)" [checked]="row.selected" [list]="myList"></wf-checklist>',showCheckbox:true},{ header: "ID", value: "id", cellTemplate: '<a (click)="self.handlerFire($event)"> {{value}} </a>', sortable: true , colHandler: this.select}, { header: "City", value: "city", cellTemplate: '<p *ngFor="let i of [1,2,3]"> {{value}} </p>', sortable: true }],
       enableGrouping: true,
        //deprecated groupInfo : {displayName : 'Country', field:'country', cellTemplate: "<a onClick=\"alert('Hi')\"> {{value}} </a>"},
        enableTableExpandCollapse: true,
        enablePaging: true,
        //useExternalPaging: false,
        enableSorting: true,
        //useExternalSorting: false,
        //enablePagingBottom: true,
        data: [
            {selected :true, id: "A", city: "Cairo3", country: "Morocco" ,currentlyEditing:false},
            { selected:false,id: "B", city: "Cairoe", country: "Egypt",currentlyEditing:false },
            {selected:false, id: "C", city: "Caiewro", country: "France",currentlyEditing:false },
            { selected:false,id: "D", city: "Caiewro", country: "USA",currentlyEditing:false },
            { selected:false,id: "E", city: "Ca4iro", country: "Germany",currentlyEditing:false },
            { selected:false, id: "F", city: "Caigro", country: "Iceland",currentlyEditing:false },
            { selected:false,id: "G", city: "Caiewro", country: "Ireland",currentlyEditing:false },
            {selected:false, id: "H", city: "Caiefro", country: "Spain" ,currentlyEditing:false},
            { selected:false,id: "I", city: "Cairo", country: "Egypt" ,currentlyEditing:false},
            { selected:false,id: "J", city: "Caifzxro", country: "Germany" ,currentlyEditing:false},
            { selected:false,id: "K", city: "Casadiro", country: "Egypt" ,currentlyEditing:false},
            { selected:false,id: "L", city: "Caixczzro", country: "Egypt",currentlyEditing:false },
            { selected:false,id: "M", city: "Caixro", country: "Iceland" ,currentlyEditing:false},
            { selected:false,id: "N", city: "Cariro", country: "Egypt" ,currentlyEditing:false},
            {selected:false, id: "O", city: "Careiro", country: "Egypt" ,currentlyEditing:false},
            { selected:false,id: "P", city: "Caeriro", country: "Egypt" ,currentlyEditing:false},
            { selected:false,id: "Q", city: "Cadsiro", country: "France" ,currentlyEditing:false},
            { selected:false,id: "R", city: "Caidsadsaro", country: "Morocco" ,currentlyEditing:false},
            { selected:false,id: "S", city: "Cadiro", country: "USA" ,currentlyEditing:false},
            { selected:false,id: "T", city: "Cairo", country: "USA" ,currentlyEditing:false},
            { selected:false,id: "U", city: "Caddiro", country: "Spain" ,currentlyEditing:false},
            { selected:false,id: "V", city: "Cadsairo", country: "Spain" ,currentlyEditing:false},
            { selected:false,id: "W", city: "Cddiro", country: "Egypt" ,currentlyEditing:false},
           
        ]
    };
    //gridOptions: GridOptions={enablePaging:true};
    //colDef: any[] = [{ header: "ID", value: "id", cellTemplate: "<a>{{value.cr}}</a>" , sortable:true }, { header: "City", value: "city" ,cellTemplate: "<a>{{value.cr}}</a>",sortable:true}]

rowVal="123";
    html = '<a>{{value}}</a>';
    //  currentView: IView = new SalesView();
    alert(): any {
        console.log("Alert pager: " + this.dataset.paging.startIndex);
        console.log("Alert pager: " + this.dataset.paging.endIndex);
        console.log("Alert pager: " + this.dataset.paging.currentPage);
        console.log("Alert sortInfo: " + this.dataset.sortInfo);
        console.log("Alert fields: " + this.dataset.sortInfo.fields);
        this.dataset = {
            enablePaging: true,
            useExternalPaging: false,
            enableSorting: false,
            useExternalSorting: false,
            data: [
                { id: "F", city: "Cairo", country: "Egypt" },
                { id: "G", city: "Cairo", country: "Egypt" },
                { id: "H", city: "Cairo", country: "Egypt" },
                { id: "I", city: "Cairo", country: "Egypt" },
                { id: "J", city: "Cairo", country: "Egypt" },
            ],
            paging: {
                startIndex: 6,
                currentPage: 2,
                totalPages: 5,
                totalRecords: 23,
                rowsPerPage: 5,
                endIndex: 10,
                oldPage: 1,
                selectedPageSize: 5
            }

        };
    }


    checkbx=false;
    myList :any[] = ['a', 'b', 'c'];
    sayHi(): void {
       console.log(this.records);
    }

    select(val): void {
        alert(val.city);
    }
    select2(): void {
       // alert('main');
    }
    deselect(): void {
       // console.log("b5");
    }
    wfGridDemoTemplate:string='<code><wf-grid [detail]="dataset" (loader)="alert()" (updater)="select($event)">\r'+ 
                                    '<group-column [value]="\'country\'" [header]="\'Country\'" >\r'+ 
                                        '<template let-name="name" let-value="value"  #cellTemplate >\r'+
                                            '<a (click)="sayHi()"> {{value}}</a >\r'+
                                        '</template >\r'+ 
                                    '</group-column >\r'+ 
                                    '<column [value]="\'selected\'" [header]="" [showCheckbox]="true" >\r'+
                                         '<template let-name="name" let-row="row"  let-col="col" #cellTemplate >\r'+
                                            '<wf-checklist id="my" [rowObj]="row" [hidden]="false" [disable]="false" [list]="myList" [checked]="row.selected"></wf-checklist >\r'+
                                        '</template >\r'+ 
                                    '</column >\r'+ 
                                    '<column [value]="\'id\'" [header]="\'Id\'" [sortable]="true" >\r'+ 
                                        
                                    '</column >\r'+ 
                                    '<column [value]="\'city\'" [header]="\'City\'" [isEditable]="true"  >\r'+ 
                                        '<template let-name="name" let-value="value" #cellTemplate >\r'+
                                            '<a contentEditable="true" (click)="sayHi()"> {{value}}</a >\r'+
                                        '</template >\r'+
                                        '<template let-name="name" let-value="value" #cellEditTemplate >\r'+
                                            '<input type="text" [value]="value" / >\r'+
                                        '</template >\r'+  
                                    '</column >\r'+ 
                            '</wf-grid ></code>';
    wfGridDemoTsCode :string='dataset: any = {\
        title: \'Cities\',\
        paging: {\
            startIndex: 1,\
            currentPage: 1,\
            totalPages: 5,\
            totalRecords: 23,\
            rowsPerPage: 5,\
            endIndex: 5,\
            oldPage: 0,\
            selectedPageSize: 5\
        },\
        enableEdit:true,\
       enableGrouping: true,\
        enableTableExpandCollapse: true,\
        enablePaging: true,\
        enableSorting: true,\
        data: [\
            {selected :true, id: "A", city: "Cairo3", country: "Morocco" ,currentlyEditing:false},\
            { selected:false,id: "B", city: "Cairoe", country: "Egypt",currentlyEditing:false },\
            {selected:false, id: "C", city: "Caiewro", country: "France",currentlyEditing:false },\
            { selected:false,id: "D", city: "Caiewro", country: "USA",currentlyEditing:false },\
            { selected:false,id: "E", city: "Ca4iro", country: "Germany",currentlyEditing:false },\
            { selected:false, id: "F", city: "Caigro", country: "Iceland",currentlyEditing:false },\
            { selected:false,id: "G", city: "Caiewro", country: "Ireland",currentlyEditing:false },\
            {selected:false, id: "H", city: "Caiefro", country: "Spain" ,currentlyEditing:false},\
            { selected:false,id: "I", city: "Cairo", country: "Egypt" ,currentlyEditing:false},\
            { selected:false,id: "J", city: "Caifzxro", country: "Germany" ,currentlyEditing:false},\
            { selected:false,id: "K", city: "Casadiro", country: "Egypt" ,currentlyEditing:false},\
            { selected:false,id: "L", city: "Caixczzro", country: "Egypt",currentlyEditing:false },\
            { selected:false,id: "M", city: "Caixro", country: "Iceland" ,currentlyEditing:false},\
            { selected:false,id: "N", city: "Cariro", country: "Egypt" ,currentlyEditing:false},\
            {selected:false, id: "O", city: "Careiro", country: "Egypt" ,currentlyEditing:false},\
            { selected:false,id: "P", city: "Caeriro", country: "Egypt" ,currentlyEditing:false},\
            { selected:false,id: "Q", city: "Cadsiro", country: "France" ,currentlyEditing:false},\
            { selected:false,id: "R", city: "Caidsadsaro", country: "Morocco" ,currentlyEditing:false},\
            { selected:false,id: "S", city: "Cadiro", country: "USA" ,currentlyEditing:false},\
            { selected:false,id: "T", city: "Cairo", country: "USA" ,currentlyEditing:false},\
            { selected:false,id: "U", city: "Caddiro", country: "Spain" ,currentlyEditing:false},\
            { selected:false,id: "V", city: "Cadsairo", country: "Spain" ,currentlyEditing:false},\
            { selected:false,id: "W", city: "Cddiro", country: "Egypt" ,currentlyEditing:false},\
        ]\
    };';
}









-------------------------------------------------------------------------------------------------------------------

<div>
	<div class="grid-label-big-lined">
		<label>Angular 2 Demo </label>
	</div>
	
	<wf-tab-set> 
		<wf-tab [tabTitle]="'WF Grid Demo'" active="true">
		<wf-grid [detail]="dataset" (loader)="alert()" (updater)="select($event)"> 
				<group-column [value]="'country'" [header]="'Country'" > 
					<template let-name="name" let-value="value"  #cellTemplate>
						<a (click)="sayHi()"> {{value}}</a>
					</template> 
				</group-column> 
				<column [value]="'selected'" [header]="" [showCheckbox]="true">
					 <template let-name="name" let-row="row"  let-col="col" #cellTemplate>
						<wf-checklist id="my" [rowObj]="row" [hidden]="false" [disable]="false" [list]="myList" [checked]="row.selected"></wf-checklist>
					</template> 
				</column> 
				<column [value]="'id'" [header]="'Id'" [sortable]="true"> 
					
				</column> 
				<column [value]="'city'" [header]="'City'" [isEditable]="true" > 
					<template let-name="name" let-value="value" #cellTemplate>
						<a contentEditable="true" (click)="sayHi()"> {{value}}</a>
					</template>
					<template let-name="name" let-value="value" #cellEditTemplate>
						<input type="text" [value]="value" />
					</template>  
				</column> 
		</wf-grid>
		<wf-tab-set> 
			<wf-tab [tabTitle]="'Component'" active="true">
				<pre>
					<code>
					{{wfGridDemoTsCode}}
					</code>
				</pre>
			</wf-tab>
			<wf-tab [tabTitle]="'Template'" >
				<pre>
					<div [innerHTML]="wfGridDemoTemplate | safe:'html'"></div>
				</pre>
			</wf-tab>
		</wf-tab-set>
		</wf-tab> 
		
		<wf-tab [tabTitle]="'WF Select'">
		Single: <wf-select [items]="myList" [(ngModel)]="rowVal"></wf-select>
		Multiple: <wf-select [items]="myList"  [multiple]="true"></wf-select>
		<label>{{rowVal}}</label>
		</wf-tab> 
		<wf-tab [tabTitle]="'NG2 bootstrap Accordion'">
			<accordion>
			  <accordion-group heading="Static Header, initially expanded">
			    This content is straight in the template.
			  </accordion-group>
			  <accordion-group #group>
			    <div accordion-heading>
			      I can have markup, too!
			      <i class="pull-right float-xs-right glyphicon"
			         [ngClass]="{'glyphicon-chevron-down': group?.isOpen, 'glyphicon-chevron-right': !group?.isOpen}"></i>
			    </div>
			    This is just some content to illustrate fancy headings.
			  </accordion-group>
			  <accordion-group heading="Content 1">
			    <p>Content 1</p>
			  </accordion-group>
			  <accordion-group heading="Content 2">
			    <p>Content 2</p>
			  </accordion-group>
			</accordion>
		</wf-tab>
		<wf-tab  [tabTitle]="'NG2 bootstrap Modal'">
			<button type="button" class="btn btn-primary" (click)="staticModal.show()">Static modal</button>
 
			<div class="modal fade" bsModal #staticModal="bs-modal" [config]="{backdrop: 'static'}"
			     tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
			  <div class="modal-dialog modal-sm">
			    <div class="modal-content">
			      <div class="modal-header">
			        <h4 class="modal-title pull-left">Static modal</h4>
			        <button type="button" class="close pull-right" aria-label="Close" (click)="staticModal.hide()">
			          <span aria-hidden="true">&times;</span>
			        </button>
			      </div>
			      <div class="modal-body">
			        This is static modal, backdrop click will not close it.
			        Click <b>&times;</b> to close modal.
			      </div>
			    </div>
			  </div>
			</div>
		</wf-tab>
	</wf-tab-set>
</div>
------------------------------------------------------------------------------------------------------------------------------------------------------
import {Pipe} from '@angular/core';
import {DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl} from '@angular/platform-browser';

@Pipe({
    name: 'safe'
})
export class SafePipe {

    constructor(protected _sanitizer: DomSanitizer) {

    }

    public transform(value: string, type: string): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
        switch (type) {
            case 'html':
                return this._sanitizer.bypassSecurityTrustHtml(value);
            case 'style':
                return this._sanitizer.bypassSecurityTrustStyle(value);
            case 'script':
                return this._sanitizer.bypassSecurityTrustScript(value);
            case 'url':
                return this._sanitizer.bypassSecurityTrustUrl(value);
            case 'resourceUrl':
                return this._sanitizer.bypassSecurityTrustResourceUrl(value);
            default:
                throw new Error(`Unable to bypass security for invalid type: ${type}`);
        }
    }

}
----------------------------------------------------------------------------------------------------------------------------------------------------------
import { Pipe, PipeTransform } from '@angular/core';


@Pipe({name: 'highlight'})
export class HighlightPipe implements PipeTransform {
  public transform(value:string, query:string):any {
    if (query.length < 1) {
      return value;
    }

    if ( query ) {
        let tagRE    = new RegExp('<[^<>]*>', 'ig');
        // get ist of tags
        let tagList  = value.match( tagRE );
        // Replace tags with token
        let tmpValue = value.replace( tagRE, '$!$');
        // Replace search words
        value = tmpValue.replace(new RegExp(this.escapeRegexp(query), 'gi'), '<strong>$&</strong>');
        // Reinsert HTML
        for (let i = 0; value.indexOf('$!$') > -1; i++) {
          value = value.replace('$!$', tagList[i]);
        }
    }
    return value;
  }
 escapeRegexp(queryToEscape:string):string {
  return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
}
}


---------------------------------------------------------
import { Component, Input, Output, EventEmitter, ElementRef, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { escapeRegexp,stripTags,OptionsBehavior,GenericBehavior,SelectItem } from './WFSelectUtil';

let styles = `
  .ui-select-toggle {
    position: relative;
  }
  /* Fix caret going into new line in Firefox */
  .ui-select-placeholder {
    float: left;
  }
  
  /* Fix Bootstrap dropdown position when inside a input-group */
  .input-group > .dropdown {
    /* Instead of relative */
    position: static;
  }
  
  .ui-select-match > .btn {
    /* Instead of center because of .btn */
    text-align: left !important;
  }
  
  .ui-select-match > .caret {
    position: absolute;
    top: 45%;
    right: 15px;
  }
  
  .ui-disabled {
    background-color: #eceeef;
    border-radius: 4px;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 5;
    opacity: 0.6;
    top: 0;
    left: 0;
    cursor: not-allowed;
  }
  
  .ui-select-choices {
    width: 100%;
    height: auto;
    max-height: 200px;
    overflow-x: hidden;
    margin-top: 0;
  }
  
  .ui-select-multiple .ui-select-choices {
    margin-top: 1px;
  }
  .ui-select-choices-row>a {
      display: block;
      padding: 3px 20px;
      clear: both;
      font-weight: 400;
      line-height: 1.42857143;
      color: #333;
      white-space: nowrap;
  }
  .ui-select-choices-row.active>a {
      color: #fff;
      text-decoration: none;
      outline: 0;
      background-color: #428bca;
  }
  
  .ui-select-multiple {
    height: auto;
    padding:3px 3px 0 3px;
  }
  
  .ui-select-multiple input.ui-select-search {
    background-color: transparent !important; /* To prevent double background when disabled */
    border: none;
    outline: none;
    box-shadow: none;
    height: 1.6666em;
    padding: 0;
    margin-bottom: 3px;
    
  }
  .ui-select-match .close {
      font-size: 1.6em;
      line-height: 0.75;
  }
  
  .ui-select-multiple .ui-select-match-item {
    outline: 0;
    margin: 0 3px 3px 0;
  }
  .ui-select-toggle > .caret {
      position: absolute;
      height: 10px;
      top: 50%;
      right: 10px;
      margin-top: -2px;
  }
`;

@Component({
  selector: 'wf-select',
  styles: [styles],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      /* tslint:disable */
      useExisting: forwardRef(() => SelectComponent),
      /* tslint:enable */
      multi: true
    }
  ],
  template: `
  <div tabindex="0"
     *ngIf="multiple === false"
     (keyup)="mainClick($event)"
     [offClick]="clickedOutside"
     class="ui-select-container dropdown open">
    <div [ngClass]="{'ui-disabled': disabled}"></div>
    <div class="ui-select-match"
         *ngIf="!inputMode">
      <span tabindex="-1"
          class="btn btn-default btn-secondary form-control ui-select-toggle"
          (click)="matchClick($event)"
          style="outline: 0;">
        <span *ngIf="active.length <= 0" class="ui-select-placeholder text-muted">{{placeholder}}</span>
        <span *ngIf="active.length > 0" class="ui-select-match-text pull-left"
              [ngClass]="{'ui-select-allow-clear': allowClear && active.length > 0}"
              [innerHTML]="sanitize(active[0].text)"></span>
        <i class="dropdown-toggle pull-right"></i>
        <i class="caret pull-right"></i>
        <a *ngIf="allowClear && active.length>0" class="btn btn-xs btn-link pull-right" style="margin-right: 10px; padding: 0;" (click)="removeClick(active[0], $event)">
           <i class="glyphicon glyphicon-remove"></i>
        </a>
      </span>
    </div>
    <input type="text" autocomplete="false" tabindex="-1"
           (keydown)="inputEvent($event)"
           (keyup)="inputEvent($event, true)"
           [disabled]="disabled"
           class="form-control ui-select-search"
           *ngIf="inputMode"
           placeholder="{{active.length <= 0 ? placeholder : ''}}">
     <!-- options template -->
     <ul *ngIf="optionsOpened && options && options.length > 0"
          class="ui-select-choices dropdown-menu" role="menu">
        <li *ngFor="let o of options" role="menuitem">
          <div class="ui-select-choices-row"
               [class.active]="isActive(o)"
               (mouseenter)="selectActive(o)"
               (click)="selectMatch(o, $event)">
            <a href="javascript:void(0)" class="dropdown-item">
              <div [innerHtml]="sanitize(o.text | highlight:inputValue)"></div>
            </a>
          </div>
        </li>
      </ul>
  </div>
  <div tabindex="0"
     *ngIf="multiple === true"
     (keyup)="mainClick($event)"
     (focus)="focusToInput('')"
     [offClick]="clickedOutside"
     class="ui-select-container ui-select-multiple dropdown form-control open">
    <div [ngClass]="{'ui-disabled': disabled}"></div>
    <span class="ui-select-match">
        <span *ngFor="let a of active">
            <span class="ui-select-match-item btn btn-default btn-secondary btn-xs"
                  tabindex="-1"
                  type="button"
                  [ngClass]="{'btn-default': true}">
               <a class="close"
                  style="margin-left: 5px; padding: 0;"
                  (click)="removeClick(a, $event)">&times;</a>
               <span [innerHtml]="sanitize(a.text)"></span>
           </span>
        </span>
    </span>
    <input type="text"
           (keydown)="inputEvent($event)"
           (keyup)="inputEvent($event, true)"
           (click)="matchClick($event)"
           [disabled]="disabled"
           autocomplete="false"
           autocorrect="off"
           autocapitalize="off"
           spellcheck="false"
           class="form-control ui-select-search"
           placeholder="{{active.length <= 0 ? placeholder : ''}}"
           role="combobox">
     <!-- options template -->
     <ul *ngIf="optionsOpened && options && options.length > 0"
          class="ui-select-choices dropdown-menu" role="menu">
        <li *ngFor="let o of options" role="menuitem">
          <div class="ui-select-choices-row"
               [class.active]="isActive(o)"
               (mouseenter)="selectActive(o)"
               (click)="selectMatch(o, $event)">
            <a href="javascript:void(0)" class="dropdown-item">
              <div [innerHtml]="sanitize(o.text | highlight:inputValue)"></div>
            </a>
          </div>
        </li>
      </ul>
  </div>
  `
})
export class SelectComponent implements OnInit, ControlValueAccessor {
  @Input() public allowClear :boolean = false;
  @Input() public placeholder:string = '';
  @Input() public idField:string = 'id';
  @Input() public textField:string = 'text';
  @Input() public multiple:boolean = false;

  @Input()
  public set items(value:Array<any>) {
    if (!value) {
      this._items = this.itemObjects = [];
    } else {
      this._items = value.filter((item:any) => {
        if ((typeof item === 'string') || (typeof item === 'object' && item && item[this.textField] && item[this.idField])) {
          return item;
        }
      });
      this.itemObjects = this._items.map((item:any) => (typeof item === 'string' ? new SelectItem(item) : new SelectItem({id: item[this.idField], text: item[this.textField]})));
    }
  }

  @Input()
  public set disabled(value:boolean) {
    this._disabled = value;
    if (this._disabled === true) {
      this.hideOptions();
    }
  }

  public get disabled():boolean {
    return this._disabled;
  }

  @Input()
  public set active(selectedItems:Array<any>) {
    if (!selectedItems || selectedItems.length === 0) {
      this._active = [];
    } else {
      let areItemsStrings = typeof selectedItems[0] === 'string';

      this._active = selectedItems.map((item:any) => {
        let data = areItemsStrings
          ? item
          : {id: item[this.idField], text: item[this.textField]};

        return new SelectItem(data);
      });
    }
  }
  public get active():Array<any> {
    return this._active;
  }
  @Output() public data:EventEmitter<any> = new EventEmitter();
  @Output() public selected:EventEmitter<any> = new EventEmitter();
  @Output() public removed:EventEmitter<any> = new EventEmitter();
  @Output() public typed:EventEmitter<any> = new EventEmitter();
  @Output() public opened:EventEmitter<any> = new EventEmitter();

  public options:Array<SelectItem> = [];
  public itemObjects:Array<SelectItem> = [];
  public activeOption:SelectItem;
  public element:ElementRef;



  private set optionsOpened(value:boolean){
    this._optionsOpened = value;
    this.opened.emit(value);
  }

  private get optionsOpened(): boolean{
    return this._optionsOpened;
  }

  protected onChange:any = Function.prototype;
  protected onTouched:any = Function.prototype;

  private inputMode:boolean = false;
  private _optionsOpened:boolean = false;
  private behavior: OptionsBehavior;
  private inputValue :string = '';
  private _items:Array<any> = [];
  private _disabled:boolean = false;
  private _active:Array<SelectItem> = [];

  public constructor(element:ElementRef, private sanitizer:DomSanitizer) {
    this.element = element;
    this.clickedOutside = this.clickedOutside.bind(this);
  }

  public sanitize(html:string):SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  public inputEvent(e:any, isUpMode:boolean = false):void {
    // tab
    if (e.keyCode === 9) {
      return;
    }
    if (isUpMode && (e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 38 ||
      e.keyCode === 40 || e.keyCode === 13)) {
      e.preventDefault();
      return;
    }
    // backspace
    if (!isUpMode && e.keyCode === 8) {
      let el:any = this.element.nativeElement
        .querySelector('div.ui-select-container > input');
      if (!el.value || el.value.length <= 0) {
        if (this.active.length > 0) {
          this.remove(this.active[this.active.length - 1]);
        }
        e.preventDefault();
      }
    }
    // esc
    if (!isUpMode && e.keyCode === 27) {
      this.hideOptions();
      this.element.nativeElement.children[0].focus();
      e.preventDefault();
      return;
    }
    // del
    if (!isUpMode && e.keyCode === 46) {
      if (this.active.length > 0) {
        this.remove(this.active[this.active.length - 1]);
      }
      e.preventDefault();
    }
    // left
    if (!isUpMode && e.keyCode === 37 && this._items.length > 0) {
      this.behavior.first();
      e.preventDefault();
      return;
    }
    // right
    if (!isUpMode && e.keyCode === 39 && this._items.length > 0) {
      this.behavior.last();
      e.preventDefault();
      return;
    }
    // up
    if (!isUpMode && e.keyCode === 38) {
      this.behavior.prev();
      e.preventDefault();
      return;
    }
    // down
    if (!isUpMode && e.keyCode === 40) {
      this.behavior.next();
      e.preventDefault();
      return;
    }
    // enter
    if (!isUpMode && e.keyCode === 13) {
      if (this.active.indexOf(this.activeOption) === -1) {
        this.selectActiveMatch();
        this.behavior.next();
      }
      e.preventDefault();
      return;
    }
    let target = e.target || e.srcElement;
    if (target && target.value) {
      this.inputValue = target.value;
      this.behavior.filter(new RegExp(escapeRegexp(this.inputValue), 'ig'));
      this.doEvent('typed', this.inputValue);
    }else {
      this.open();
    }
  }

  public ngOnInit():any {
    this.behavior = new GenericBehavior(this);
  }

  public remove(item:SelectItem):void {
    if (this._disabled === true) {
      return;
    }
    if (this.multiple === true && this.active) {
      let index = this.active.indexOf(item);
      this.active.splice(index, 1);
      this.data.next(this.active);
      this.doEvent('removed', item);
    }
    if (this.multiple === false) {
      this.active = [];
      this.data.next(this.active);
      this.doEvent('removed', item);
    }
  }

  public doEvent(type:string, value:any):void {
    if ((this as any)[type] && value) {
      (this as any)[type].next(value);
    }

    this.onTouched();
    if (type === 'selected' || type === 'removed') {
      this.onChange(this.active);
    }
  }

  public clickedOutside():void {
    this.inputMode = false;
    this.optionsOpened = false;
  }

  public writeValue(val:any):void {
    this.active = val;
    this.data.emit(this.active);
  }

  public registerOnChange(fn:(_:any) => {}):void {this.onChange = fn;}
  public registerOnTouched(fn:() => {}):void {this.onTouched = fn;}

  protected matchClick(e:any):void {
    if (this._disabled === true) {
      return;
    }
    this.inputMode = !this.inputMode;
    if (this.inputMode === true && ((this.multiple === true && e) || this.multiple === false)) {
      this.focusToInput();
      this.open();
    }
  }

  protected  mainClick(event:any):void {
    if (this.inputMode === true || this._disabled === true) {
      return;
    }
    if (event.keyCode === 46) {
      event.preventDefault();
      this.inputEvent(event);
      return;
    }
    if (event.keyCode === 8) {
      event.preventDefault();
      this.inputEvent(event, true);
      return;
    }
    if (event.keyCode === 9 || event.keyCode === 13 ||
      event.keyCode === 27 || (event.keyCode >= 37 && event.keyCode <= 40)) {
      event.preventDefault();
      return;
    }
    this.inputMode = true;
    let value = String
      .fromCharCode(96 <= event.keyCode && event.keyCode <= 105 ? event.keyCode - 48 : event.keyCode)
      .toLowerCase();
    this.focusToInput(value);
    this.open();
    let target = event.target || event.srcElement;
    target.value = value;
    this.inputEvent(event);
  }

  protected  selectActive(value:SelectItem):void {
    this.activeOption = value;
  }

  protected  isActive(value:SelectItem):boolean {
    return this.activeOption.id === value.id;
  }

  protected removeClick(value: SelectItem, event: any): void {
    event.stopPropagation();
    this.remove(value);
  }

  private focusToInput(value:string = ''):void {
    setTimeout(() => {
      let el = this.element.nativeElement.querySelector('div.ui-select-container > input');
      if (el) {
        el.focus();
        el.value = value;
      }
    }, 0);
  }

  private open():void {
    this.options = this.itemObjects
      .filter((option:SelectItem) => (this.multiple === false ||
      this.multiple === true && !this.active.find((o:SelectItem) => option.text === o.text)));

    if (this.options.length > 0) {
      this.behavior.first();
    }
    this.optionsOpened = true;
  }

  private hideOptions():void {
    this.inputMode = false;
    this.optionsOpened = false;
  }

  private selectActiveMatch():void {
    this.selectMatch(this.activeOption);
  }

  private selectMatch(value:SelectItem, e:Event = void 0):void {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (this.options.length <= 0) {
      return;
    }
    if (this.multiple === true) {
      this.active.push(value);
      this.data.next(this.active);
    }
    if (this.multiple === false) {
      this.active[0] = value;
      this.data.next(this.active[0]);
    }
    this.doEvent('selected', value);
    this.hideOptions();
    if (this.multiple === true) {
      this.focusToInput('');
    } else {
      this.focusToInput(stripTags(value.text));
      this.element.nativeElement.querySelector('.ui-select-container').focus();
    }
  }
}


---------------------------------------------------------------------------------------------------------------
import { SelectComponent } from './wfSelect.directive';


export function escapeRegexp(queryToEscape:string):string {
  return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
}

export function stripTags(input:string):string {
  let tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  let commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
  return input.replace(commentsAndPhpTags, '').replace(tags, '');
}


export class Behavior {
  public optionsMap:Map<string, number> = new Map<string, number>();

  public actor: SelectComponent;

  public constructor(actor:SelectComponent) {
    this.actor = actor;
  }

  public ensureHighlightVisible(optionsMap:Map<string, number> = void 0):void {
    let container = this.actor.element.nativeElement.querySelector('.ui-select-choices-content');
    if (!container) {
      return;
    }
    let choices = container.querySelectorAll('.ui-select-choices-row');
    if (choices.length < 1) {
      return;
    }
    let activeIndex = this.getActiveIndex(optionsMap);
    if (activeIndex < 0) {
      return;
    }
    let highlighted:any = choices[activeIndex];
    if (!highlighted) {
      return;
    }
    let posY:number = highlighted.offsetTop + highlighted.clientHeight - container.scrollTop;
    let height:number = container.offsetHeight;
    if (posY > height) {
      container.scrollTop += posY - height;
    } else if (posY < highlighted.clientHeight) {
      container.scrollTop -= highlighted.clientHeight - posY;
    }
  }

  private getActiveIndex(optionsMap:Map<string, number> = void 0):number {
    let ai = this.actor.options.indexOf(this.actor.activeOption);
    if (ai < 0 && optionsMap !== void 0) {
      ai = optionsMap.get(this.actor.activeOption.id);
    }
    return ai;
  }
}



export interface OptionsBehavior {
  first():any;
  last():any;
  prev():any;
  next():any;
  filter(query:RegExp):any;
}


export class GenericBehavior extends Behavior implements OptionsBehavior {
  public constructor(actor:SelectComponent) {
    super(actor);
  }

  public first():void {
    this.actor.activeOption = this.actor.options[0];
    super.ensureHighlightVisible();
  }

  public last():void {
    this.actor.activeOption = this.actor.options[this.actor.options.length - 1];
    super.ensureHighlightVisible();
  }

  public prev():void {
    let index = this.actor.options.indexOf(this.actor.activeOption);
    this.actor.activeOption = this.actor
      .options[index - 1 < 0 ? this.actor.options.length - 1 : index - 1];
    super.ensureHighlightVisible();
  }

  public next():void {
    let index = this.actor.options.indexOf(this.actor.activeOption);
    this.actor.activeOption = this.actor
      .options[index + 1 > this.actor.options.length - 1 ? 0 : index + 1];
    super.ensureHighlightVisible();
  }

  public filter(query:RegExp):void {
    let options = this.actor.itemObjects
      .filter((option:SelectItem) => {
        return stripTags(option.text).match(query) &&
          (this.actor.multiple === false ||
          (this.actor.multiple === true && this.actor.active.map((item:SelectItem) => item.id).indexOf(option.id) < 0));
      });
    this.actor.options = options;
    if (this.actor.options.length > 0) {
      this.actor.activeOption = this.actor.options[0];
      super.ensureHighlightVisible();
    }
  }
}


export class SelectItem {
  public id:string;
  public text:string;
  public parent:SelectItem;

  public constructor(source:any) {
    if (typeof source === 'string') {
      this.id = this.text = source;
    }
    if (typeof source === 'object') {
      this.id = source.id || source.text;
      this.text = source.text;
    }
  }
    
  public getSimilar():SelectItem {
    let r:SelectItem = new SelectItem(false);
    r.id = this.id;
    r.text = this.text;
    r.parent = this.parent;
    return r;
  }
}

------------------------------------------------------
import { Directive, HostListener, Input, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[offClick]'
})

export class OffClickDirective implements OnInit, OnDestroy {

  @Input('offClick') public offClickHandler: any;

  @HostListener('click', ['$event']) public onClick($event: MouseEvent): void {
    $event.stopPropagation();
  }

  public ngOnInit(): any {
    setTimeout(() => { if(typeof document !== 'undefined') { document.addEventListener('click', this.offClickHandler); } }, 0);
  }

  public ngOnDestroy(): any {
    if(typeof document !== 'undefined') { document.removeEventListener('click', this.offClickHandler); }
  }
}
------------------------------------------------------------------------------------------



import { NgModule }      from '@angular/core';

import {AccordionModule,ModalModule,TabsModule,TimepickerModule,DatepickerModule } from 'ng2-bootstrap';




@NgModule({
 imports: [
        AccordionModule.forRoot(),
        ModalModule.forRoot(),
        TabsModule.forRoot(), 
        TimepickerModule.forRoot(),
        DatepickerModule.forRoot()
  ],
  declarations: [],
 exports:      [ AccordionModule,ModalModule,TabsModule,TimepickerModule,DatepickerModule],
  providers: []
})
export class NG2BootstrapkModule { 

}

-----------------------------------------------------------------------------------------------------

import { FormsModule }   from '@angular/forms';
import { NgModule }      from '@angular/core';
import { CommonModule }       from '@angular/common';

import { NG2BootstrapkModule } from './bootstrap.module';

// Directives
import { WFTabSet} from '../directives/wfTab/wfTabSet.directive';
import { WFTab} from '../directives/wfTab/wfTab.directive';
import { WFFilterDirective} from '../directives/wfFilter.directive';
import { WFCheckList} from '../directives/wfCheckList.directive';

//WF Grid Directive 
import {WFGrid} from '../directives/wfGrid/wfGrid.directive';
import {WFGridPager} from '../directives/wfGrid/wfGridPager.directive';
import{WFDataCell} from '../directives/wfGrid/wfCell.component';
import{ColumnComponent }from '../directives/wfGrid/wfColumn.component';
import{GroupColumnComponent} from '../directives/wfGrid/wfGroupByColumn.component';
import{WFRow} from '../directives/wfGrid/wfRow.component';
import{SelectComponent} from "../directives/wfSelect/wfSelect.directive";
import { HighlightPipe } from '../directives/pipes/highlight.pipe';
import { OffClickDirective } from '../directives/off-click';
import { SafePipe } from '../directives/pipes/safeHTML.pipe';
//End of WF Grid Directive


@NgModule({
 imports: [
      NG2BootstrapkModule,FormsModule,CommonModule
  ],
  declarations: [ SelectComponent, 
                HighlightPipe, 
                OffClickDirective,
                WFTabSet,
                WFTab,
                WFFilterDirective,
                WFCheckList,
                WFGrid, 
                WFGridPager,
                WFDataCell, 
                GroupColumnComponent,
                ColumnComponent,
                SafePipe],
 exports:      [ NG2BootstrapkModule,  
                SelectComponent, 
                WFTabSet,
                WFTab,
                WFFilterDirective,
                WFCheckList,
                WFGrid, 
                WFGridPager,
                GroupColumnComponent,
                ColumnComponent,
                SafePipe],
  providers: []
})
export class WFFrameworkModule { 

}

----------------------------------------------
<!DOCTYPE html>
<html>
<head>
  <script>document.write('<base href="' + document.location + '" />');</script>
  <title>Angular Tour of Heroes</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link type="text/css" rel="stylesheet" href="/coreStaticWeb/css/jqueryui.css"/>
  <link href="/coreStaticWeb/css/1.15/bootstrap/3.0.2/bootstrap.min.css" rel="stylesheet">
  <!-- ng2 bootstrap css -->
  <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
  <link href="/coreStaticWeb/css/1.15/nonresponsive.css" rel="stylesheet" type="text/css">
  <link href="/coreStaticWeb/css/1.15/font-awesome/css/font-awesome.min.css" rel="stylesheet">
  <link href="/coreStaticWeb/css/1.15/core.css" rel="stylesheet" type="text/css">
  <link href="/coreStaticWeb/css/1.15/wfGrid.css" rel="stylesheet" type="text/css">
  <link href="/coreStaticWeb/css/1.15/wfModal.css" rel="stylesheet" type="text/css">
  <script src="/coreStaticWeb/js/libs/jquery/jquery.min.js"></script>
  <script src="/coreStaticWeb/js/libs/jquery/jquery-ui-modified.js"></script>
  <script src="/coreStaticWeb/js/libs/angular/1.3.0/angular.min.js"></script>
  <script src="/coreStaticWeb/js/libs/angular/1.3.0/angular-route.min.js"></script>
  <script src="/coreStaticWeb/js/libs/angular/1.3.0/angular-sanitize.min.js"></script>
  <script src="/coreStaticWeb/js/libs/jquery/jquery.superfish.js"></script>
  <script src="js/libs/coretools.angular.js"></script>

  
</head>

<body>
  <div ng-include src="pageLoadingPopUpUrl"></div>
  <div ng-controller="MenuListCtrl">
    <div ng-include src="adminHeaderUrl"></div>
    <div>

      <div id="body-panel">
        <table id="body-panel-flex">
          <tr>
            <td id="content-left-rail"ng-include src="adminMenuUrl"></td>
            <td>
              <div id="content-right"  ng-view autoscroll="true"> </div>
              <div id="footer" align="center"><label>About CORE Sales and Fulfillment | Help | Support &copy; 2014 Wells Fargo & Company</label></div>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
  <!-- angular2 -->
  <script src="angular_io/thirdparty/other/shim.min.js"></script>
  <script src="angular_io/thirdparty/other/zone.js"></script>
  <script src="angular_io/thirdparty/other/system.js"></script>
  <script src="angular_io/target/bundles/vendor.min.js"></script>
  <script src="angular_io/target/bundles/app.min.js"></script>

  <wf-alert message="alertMsg" on-close="onAlertClose"></wf-alert>

  <script type="text/javascript">
    function getURL(url) {
      return $.ajax({
        type: "GET",
        url: url,
        cache: false,
        async: false
      }).responseText;
    };
  </script>

  <script>
  	$(function() {
  		$(document).tooltip();
  		$("#topNav").superfish();
  		//.menu({ position: { my: "left bottom", at: "right-5 top+5" } });
  		$("#header-tabs").tabs({
  			active : 0
  		});

  		$("#leftMenu").menu();

  		$(".headerLink").click(function() {
  			$("#pageContent").html("<h1>" + this.innerHTML + "</h1>");
  		});
  		$("#leftMenu li a").click(function() {
  			$("#pageContent").html("<h1>" + this.innerHTML + "</h1>");
  		});
  	});

  	var sendToAdrum = (function() {
  		"use strict";

  		var userName,userRoles,jobTitle;

  		var setUserData = function(userInfo) {
  		 ADRUM.command("addUserData", "User Name", userInfo.fullName);
  		 ADRUM.command("addUserData", "Role", userInfo.staticGroups);
  		 ADRUM.command("addUserData", "Location", userInfo.userLocation);
  		  addToMap('User Name',userInfo.fullName);
  		  addToMap('Role', userInfo.staticGroups);
  		  addToMap('Location', userInfo.userLocation);
  		};

  		return {
  			setUserData : setUserData
  		};

  	}());
  </script>
</html>







