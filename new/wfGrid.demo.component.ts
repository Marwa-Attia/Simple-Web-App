import { Component } from '@angular/core';
import {CellComponent}from '../lib/cell.component';
@Component({
    moduleId: module.id,
    selector: 'wf-grid-demo',
    templateUrl: 'wfGrid.demo.html'
})

export class WFGridDemoComponent {
        wfCol: any={header:"hello",value:"hi" };
        testRec: number;
records :any[]= [
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
        colDef: [{ header: "ID", value: "id", cellTemplate: "<a onClick=\"alert('Hi')\"> {{value}} </a>" , sortable: false }, { header: "City", value: "city" ,cellTemplate: "<p> {{value}} </p>",sortable: false}],
        enableGrouping: true,
        groupInfo : {displayName : 'Country', field:'country', cellTemplate: "<a onClick=\"alert('Hi')\"> {{value}} </a>"},
        enableTableExpandCollapse:true,
        //enablePagingBottom: true,
        data: [
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
        ]
    };
    //gridOptions: GridOptions={enablePaging:true};
    //colDef: any[] = [{ header: "ID", value: "id", cellTemplate: "<a>{{value.cr}}</a>" , sortable:true }, { header: "City", value: "city" ,cellTemplate: "<a>{{value.cr}}</a>",sortable:true}]
 
     
   html= '<a>{{value}}</a>';
    //  currentView: IView = new SalesView();
  alert():any {
            console.log("Alert pager: "+this.dataset.paging.startIndex);
      console.log("Alert pager: "+this.dataset.paging.endIndex);
       console.log("Alert pager: "+this.dataset.paging.currentPage);
       console.log("Alert sortInfo: "+this.dataset.sortInfo);
       console.log("Alert fields: "+this.dataset.sortInfo.fields);
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

    } 
  }
     componentData = {
      component: CellComponent,
      inputs: {
        template: '<a>row[\'city\']</a>'
      }
    };
      
      myList=['a','b','c'];
}








