import { Component } from '@angular/core';
import {OrderByService} from '../directives/orderBy.service';
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
    myList:any[] = ['a', 'b', 'c'];
    sayHi(): void {
       console.log(this.records);
       this.records= OrderByService._sort(this.records,['-id']);
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
}









