/**
 * New typescript file
 */
import { Component, Input, OnInit,Output,EventEmitter} from '@angular/core';
import {WFGrid} from './wfGrid.directive';
@Component({
    selector: 'wf-grid-paging',
    template:   '<div class="pagination-top-container">' +
                    '<span class="pagination-display pagination">Displaying <strong class="ng-binding">{{pageStart}} to {{pageEnd}} of {{totalRecords}}</strong></span>' +
                    '<div class="pagination-small pagination">'+
                        '<ul>' +
                            '<li>' +
                                '<select [(ngModel)]="pageSize"  (change)="selectPageSize();">'+
                                    '<option *ngFor="let p of pageSizeOptions" [value]="p">{{p}} </option>'+
                                '</select>' +
                            '</li>' +
                            '<li>' +
                                '<span [ngClass]="{ disabled: firstDisabled}"  (click)="firstPage()" ><a>First</a></span>' +
                            '</li>' +
                            '<li>' +
                                '<span [ngClass]="{ disabled: prevDisabled}"  (click)="prevPage()" ><a>previous</a></span>' +
                            '</li>' +
                            '<li *ngFor="let page of pages">' +
                                '<span [ngClass]="{ active:page.active}"  (click)="selectPage(page.id)" ><a>{{page.id}}</a></span>' +
                            '</li>' +
                            '<li>' +
                                '<span [ngClass]="{ disabled: nextDisabled}" (click)="nextPage()" ><a>next</a></span>' +
                            '</li>' +
                            '<li>' +
                                '<span [ngClass]="{ disabled: lastDisabled}" (click)="lastPage()" ><a>Last</a></span>' +
                            '</li>' +
                        '</ul>' +
                        '<div class="go-to-page">'+
                            '<span >Go to Page:</span>' +
                            '<input type="number" class="form-control page-input" [(ngModel)]="gotoPage" (change)="selectPage(gotoPage)">'+
                        '</div>' +
                    '</div>' +
                '</div>'

})
export class WFGridPager implements OnInit {
    @Input() pagerInfo: GridOptions;
    loader = new EventEmitter();
    pageSize: number = 5;
    pageSizeOptions = [5, 10, 25, 50, 75, 100]
    currentPage: number = 1;
    pageStart: number = 1;//current page start index
    pageEnd: number;//current page end index
    totalNumOfPages: number;//Calculated
    totalRecords: number;
    nextDisabled: boolean = false;
    prevDisabled: boolean = true;
    firstDisabled: boolean = true;
    lastDisabled: boolean = false;
    smallLinksStart: number;
    smallLinksEnd: number;
    gotoPage: number = this.currentPage;

    showFirstOrPreviousPageLink: boolean = false;
    showLastOrNextPageLink: boolean = false;
    useExternalPaging: boolean = false;
    pages: Page[] = [{ id: 1, active: false }];
    constructor(grid: WFGrid) {
        
        grid.initPager(this);
    }

    ngOnInit() {
       
        this.totalRecords = this.pagerInfo.totalRecords;
        this.pageSize = this.pagerInfo.rowsPerPage;
        if (this.useExternalPaging == true) {
           
            this.currentPage = this.pagerInfo.currentPage;
            this.pageStart = this.pagerInfo.startIndex;
            this.pageEnd = this.pagerInfo.endIndex;
            this.totalNumOfPages = this.pagerInfo.totalPages;
        } else {
           
            this.calculateTotalPages();
            this.calculateStartAndEndIndex();
        }

        //called after the constructor and called  after the first ngOnChanges() 

        this.calculateSmallLinks();
        this.setLinkFlags();
       
    }
    calculateTotalPages(): void {
        if (this.pageSize > 0) {
            if (this.totalRecords % this.pageSize == 0) {
                this.totalNumOfPages = this.totalRecords / this.pageSize;
            } else {
                this.totalNumOfPages = Math.floor(this.totalRecords / this.pageSize) + 1;
            }
        } else {
            this.totalNumOfPages = 1;
        }
    }
    selectPageSize() {
        this.currentPage = 1;
        this.calculateTotalPages();
        this.calculateStartAndEndIndex();
    }
    calculateStartAndEndIndex(): void {
        this.gotoPage = this.currentPage;
        this.pageEnd = this.currentPage * this.pageSize
        this.pageStart = this.pageEnd - (this.pageSize - 1);
        if (this.useExternalPaging == true) {
           this.pagerInfo.currentPage= this.currentPage  ;
           this.pagerInfo.startIndex= this.pageStart  ;
           this.pagerInfo.endIndex=this.pageEnd  ;
            this.loader.emit();
        }
         console.log("this.pageStart: " + this.pageStart);
        console.log("this.pageEnd: " + this.pageEnd);
    }
    setLinkFlags() {

        if (this.pageEnd >= this.totalRecords) {
            this.pageEnd = this.totalRecords;
            this.nextDisabled = true;
            this.lastDisabled = true;
        } else {
            this.nextDisabled = false;
            this.lastDisabled = false;
        }
        if (this.currentPage == 1) {
            this.firstDisabled = true;
            this.prevDisabled = true;
        } else {
            this.prevDisabled = false;
            this.firstDisabled = false;
        }
       
    }
    calculateSmallLinks() {
        this.smallLinksStart = this.currentPage - 1;
        if (this.smallLinksStart < 1) {
            this.smallLinksStart = 1;
        }
        this.smallLinksEnd = this.currentPage + 3;
        if (this.smallLinksEnd > this.totalNumOfPages) {
            this.smallLinksEnd = this.totalNumOfPages;
        }
        this.pages = [{ id: 1, active: false }];
        let j = 0;
        for (let i = this.smallLinksStart; i <= this.smallLinksEnd; i++) {
            if ((this.currentPage) === i) {
                this.pages[j] = { id: i, active: true };
            } else {
                this.pages[j] = { id: i, active: false };
            }
            j++;
        }
    }
    firstPage() {
        if (!this.firstDisabled) {
            this.currentPage = 1;
            this.calculateStartAndEndIndex();
            this.calculateSmallLinks();
            this.setLinkFlags();
        }
    }
    lastPage() {
        if (!this.lastDisabled) {
            this.currentPage = this.totalNumOfPages;
            this.calculateStartAndEndIndex();
            this.calculateSmallLinks();
            this.setLinkFlags();
        }
    }
    prevPage() {
        if (!this.prevDisabled) {
            this.currentPage--;
            this.calculateStartAndEndIndex();
            this.calculateSmallLinks();
            this.setLinkFlags();
        }
    }
    selectPage(pageNumber: number) {
        if (pageNumber <= this.totalNumOfPages && pageNumber > 0) {
            this.currentPage = pageNumber;
            this.calculateStartAndEndIndex();
            this.calculateSmallLinks();
            this.setLinkFlags();
        } else {
            this.gotoPage = this.currentPage;
        }

    }
    nextPage() {
        if (!this.nextDisabled) {
            this.currentPage++;
            this.calculateStartAndEndIndex();
            this.calculateSmallLinks();
            this.setLinkFlags();
        }
    }
}
export class Page {
    id: number;
    active: boolean;
}
export class GridOptions {
    enablePaging: boolean = false;
    startIndex: number = 1;
    currentPage: number = 1;
    totalPages: number = 1;
    totalRecords: number = 1;
    rowsPerPage: number = 1;
    endIndex: number = 1;
    oldPage: number = 1;
    selectedPageSize: number = 1;
}
