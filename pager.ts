/**
 * New typescript file
 */
import { Component, Input, OnChanges, ContentChildren, QueryList, AfterContentInit} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Injectable} from '@angular/core';
import {WFGrid} from './wfGrid.directive';
@Component({
    selector: 'wf-grid-paging',
    template:   '<div class="pagination-top-container">' +
                    '<span class="pagination-display pagination">Displaying <strong class="ng-binding">{{pageStart+1}} to {{pageEnd+1}} of {{totalRecords}}</strong></span>' +
                    '<div class="pagination-small pagination"><ul>' +
                        '<li>' +
                            '<select [(ngModel)]="pageSize"  (change)="selectPageSize();">'+
                                '<option *ngFor="let p of pageSizeOptions" [value]="p.value">{{p.display}} </option>'+
                            '</select>' +
                        '</li>' +
                        '<li>' +
                            '<span [ngClass]="{ disabled: firstDisabled}"  (click)="firstPage()" ><a>First</a></span>' +
                        '</li>' +
                        '<li>' +
                            '<span [ngClass]="{ disabled: prevDisabled}"  (click)="prevPage()" ><a>previous</a></span>' +
                        '</li>' +
                        '<li *ngFor="let page of pages">' +
                            '<span [ngClass]="{ active:page.active}"  (click)="selectPage(page.id-1)" ><a>{{page.id}}</a></span>' +
                        '</li>' +
                        '<li>' +
                            '<span [ngClass]="{ disabled: nextDisabled}" (click)="nextPage()" ><a>next</a></span>' +
                        '</li>' +
                        '<li>' +
                            '<span [ngClass]="{ disabled: lastDisabled}" (click)="lastPage()" ><a>Last</a></span>' +
                        '</li>' +
                    '</ul>' +
                   '<span class="go-to-page">Go to Page:' +
                            '<input type="number" class="form-control page-input" style="width:50px;"   [(ngModel)]="gotoPage" (change)="selectPage(gotoPage-1)">'+
                        '</span>' +
                    '</div>' +
                   
                '</div>'

})
export class WFGridPager implements OnInit {
    @Input() list: any[];
    pageSize: number = 5;
    pageSizeOptions=[{value:5,display:5},{value:10,display:10},{value:25,display:25},{value:50,display:50},{value:75,display:75},{value:100,display:100}]
    currentPage: number = 0;
    pageStart: number;//current page start index
    pageEnd: number;//current page end index
    totalNumOfPages: number;//Calculated
    totalRecords: number;
    nextDisabled: boolean = false;
    prevDisabled: boolean = true;
    firstDisabled: boolean = true;
    lastDisabled: boolean = false;
    smallLinksStart: number;
    smallLinksEnd: number;
    gotoPage: number=this.currentPage+1;
    pages: Page[] = [{ id: 1, active: false }];
    constructor(grid: WFGrid) {
        console.log("Pager constructor");
        grid.initPager(this);
    }
    ngOnInit() {
        console.log("Pager ngOnInit");
        console.log(this.list);
        //called after the constructor and called  after the first ngOnChanges() 
        this.calculateTotalPages();
        this.calculateStartAndEndIndex();
    }
    calculateTotalPages(): void {
        this.totalRecords = this.list.length;
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
    selectPageSize(){
       this.calculateTotalPages();  
        this.calculateStartAndEndIndex();
    }
    calculateStartAndEndIndex(): void {
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
            if ((this.currentPage + 1) === i) {
                this.pages[j] = { id: i, active: true };
            } else {
                this.pages[j] = { id: i, active: false };
            }
            j++;
        }


        this.pageStart = this.currentPage * this.pageSize;
        this.pageEnd = this.pageStart + (this.pageSize - 1);
        if (this.pageEnd >= this.totalRecords - 1) {
            this.pageEnd = this.totalRecords - 1;
            this.nextDisabled = true;
            this.lastDisabled = true;
        } else {
            this.nextDisabled = false;
            this.lastDisabled = false;
        }
        if (this.currentPage == 0) {
            this.firstDisabled = true;
            this.prevDisabled = true;
        } else {
            this.prevDisabled = false;
            this.firstDisabled = false;
        }
    }
    firstPage() {
        if (!this.firstDisabled) {
            this.currentPage = 0;
            this.calculateStartAndEndIndex();
        }
    }
    lastPage() {
        if (!this.lastDisabled) {
            this.currentPage = this.totalNumOfPages - 1;
            this.calculateStartAndEndIndex();
        }
    }
    prevPage() {
        if (!this.prevDisabled) {
            this.currentPage--;
            this.calculateStartAndEndIndex();
        }
    }
        selectPage(pageNumber: number) {
            if(pageNumber<this.totalNumOfPages){
            this.currentPage=pageNumber;
            this.calculateStartAndEndIndex();
            }
        
    }
    nextPage() {
        if (!this.nextDisabled) {
            this.currentPage++;
            this.calculateStartAndEndIndex();
        }
    }
}
export class Page {
    id: number;
    active: boolean;
}
