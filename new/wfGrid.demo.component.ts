import { Component } from '@angular/core';
//import {  SalesView,IView}from '../lib/wfGrid.directive';
@Component({
    moduleId: module.id,
    selector: 'wf-grid-demo',
    templateUrl: 'wfGrid.demo.html'
})

export class WFGridDemoComponent {
        wfCol: any={header:"hello",value:"hi" };
        testRec: number;
records:any[]= [
            { id: "A", city: "Cairo", country: "Egypt" },
            { id: "B", city: "Cairo", country: "Egypt" },
            { id: "C", city: "Cairo", country: "Egypt" },
            { id: "D", city: "Cairo", country: "Egypt" },
            { id: "E", city: "Cairo", country: "Egypt" },
            { id: "F", city: "Cairo", country: "Egypt" },
            { id: "G", city: "Cairo", country: "Egypt" },
            { id: "H", city: "Cairo", country: "Egypt" },
            { id: "I", city: "Cairo", country: "Egypt" },
            { id: "J", city: "Cairo", country: "Egypt" },
            { id: "K", city: "Cairo", country: "Egypt" },
            { id: "L", city: "Cairo", country: "Egypt" },
            { id: "M", city: "Cairo", country: "Egypt" },
            { id: "N", city: "Cairo", country: "Egypt" },
            { id: "O", city: "Cairo", country: "Egypt" },
            { id: "P", city: "Cairo", country: "Egypt" },
            { id: "Q", city: "Cairo", country: "Egypt" },
            { id: "R", city: "Cairo", country: "Egypt" },
            { id: "S", city: "Cairo", country: "Egypt" },
            { id: "T", city: "Cairo", country: "Egypt" },
            { id: "U", city: "Cairo", country: "Egypt" },
            { id: "V", city: "Cairo", country: "Egypt" },
            { id: "W", city: "Cairo", country: "Egypt" }
        ];
    dataset: any = {
        enablePaging: true,
        useExternalPaging: true,
        enableSorting: true,
        useExternalSorting: true,
        sortInfo:{fields:['id','city'],directions:['-','-']},
        data: [
         { id: "A", city: "Cairo3", country: "Egypt" },
            { id: "B", city: "Cairoe", country: "Egypt" },
            { id: "C", city: "Caiewro", country: "Egypt" },
            { id: "D", city: "Caiewro", country: "Egypt" },
            { id: "E", city: "Ca4iro", country: "Egypt" },
            { id: "F", city: "Caigro", country: "Egypt" },
            { id: "G", city: "Caiewro", country: "Egypt" },
            { id: "H", city: "Caiefro", country: "Egypt" },
            { id: "I", city: "Cairo", country: "Egypt" },
            { id: "J", city: "Caifzxro", country: "Egypt" },
            { id: "K", city: "Casadiro", country: "Egypt" },
            { id: "L", city: "Caixczzro", country: "Egypt" },
            { id: "M", city: "Caixro", country: "Egypt" },
            { id: "N", city: "Cariro", country: "Egypt" },
            { id: "O", city: "Careiro", country: "Egypt" },
            { id: "P", city: "Caeriro", country: "Egypt" },
            { id: "Q", city: "Cadsiro", country: "Egypt" },
            { id: "R", city: "Caidsadsaro", country: "Egypt" },
            { id: "S", city: "Cadiro", country: "Egypt" },
            { id: "T", city: "Cairo", country: "Egypt" },
            { id: "U", city: "Caddiro", country: "Egypt" },
            { id: "V", city: "Cadsairo", country: "Egypt" },
            { id: "W", city: "Cddiro", country: "Egypt" }
        
        
        
        
        
            
        ],
        paging: {
            startIndex: 1,
            currentPage: 1,
            totalPages: 5,
            totalRecords: 23,
            rowsPerPage: 5,
            endIndex: 5,
            oldPage: 0,
            selectedPageSize: 5
        }

    };
    //gridOptions: GridOptions={enablePaging:true};
    colDef: any[] = [{ header: "ID", value: "id", cellTemplate: { nativeElement: "<a>{{rec[col.value]}}</a>" }, sortable:true }, { header: "City", value: "city" ,sortable:true}, { header: "Country", value: "country",sortable:false }
 
     ]
    //  currentView: IView = new SalesView();
  alert():any {
            console.log("Alert pager: "+this.dataset.paging.startIndex);
      console.log("Alert pager: "+this.dataset.paging.endIndex);
       console.log("Alert pager: "+this.dataset.paging.currentPage);
       console.log("Alert sortInfo: "+this.dataset.sortInfo);
       console.log("Alert fields: "+this.dataset.sortInfo.fields);
  this.dataset = {
        enablePaging: true,
        useExternalPaging: true,
        enableSorting: true,
        useExternalSorting: true,
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
}








