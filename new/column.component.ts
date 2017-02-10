import {Component, Input, ElementRef, ViewChild, OnInit, AfterContentInit, ComponentFactoryResolver } from '@angular/core';
import {WFGrid} from './wfGrid.directive';

@Component({
    selector: 'column,[column]',
    template: `<div #cellTemplate>Header: {{header}}</div>`,

})

export class ColumnComponent implements OnInit, AfterContentInit {
    @Input() value: string;
    @Input() header: string;
    @Input() column: Column;
    @ViewChild('cellTemplate') cellTemplate: ElementRef ;
      //  @Input() cellTemplate:
    //    constructor(table: WFGrid) {
    //         //  table.addColumn(this)
    //         //    }
     interval: any;
    constructor(private _componentFactoryResolver: ComponentFactoryResolver) { }
    ngOnInit() {

        //console.log(this.cellTemplate.nativeElement.innerHTML);
    }
      loadComponent() {
   
          
    let componentFactory = this._componentFactoryResolver.resolveComponentFactory(ElementRef);
    let viewContainerRef = this.cellTemplate;
    
    let componentRef = viewContainerRef.createComponent(componentFactory);
    
  }
  getAds() {
    this.interval = setInterval(() => {
      this.loadComponent();
    }, 3000);
  }
    ngAfterContentInit() {
        // get all active tabs
        console.log("column ngAfterContentInit:" + this.header);
        console.log("this.column ngAfterContentInit:" + this.column);
        if (this.column) {
            this.header = this.column.header;
            this.value = this.column.value;
        }
        this.loadComponent();
        this.getAds;
    }

}

interface IView {
    template: string;
}

class SalesView implements IView {
    sales: number = 100;
    template = "<p>Current sales: {{model.sales}} widgets.<p>";
}

class CalendarView implements IView {
    eventName: string = "Christmas Party";
    template = "<p>Next event: {{model.eventName}}.<p>";
}
export class Column {
    value: string;
    header: string;
    //@ViewChild('cellTemplate') cellTemplate:ElementRef ;
    //cellTemplate: ElementRef;
    constructor(table: WFGrid) {
        //table.addColumn(this)
    }


    /*
        import { bootstrap, Component, DynamicComponentLoader, ElementRef, Input, SimpleChange, } from 'angular2/angular2';
    
    interface IView {
        template: string;
    }
    
    class SalesView implements IView  {
        sales: number = 100;
        get template() { return "<p>Current sales: {{model.sales}} widgets.<p>"; }
    }
    
    class CalendarView implements IView {
        eventName: string = "Christmas Party";
        get template() { return "<p>Next event: {{model.eventName}}.<p>"; }
    }
    
    @Component({
      selector: 'view',
      template: '<div #attach></div>',
    })
    export class myView {
        @Input() model: IView;
    
        savedComp: Component = null;
    
        constructor(private loader: DynamicComponentLoader, private element: ElementRef) {
        }
    
        onChanges(changes: {[key: string]: SimpleChange}) {
            console.log('changes');
            if (changes.model) {
                var model = changes.model.currentValue;
                @Component({
                    selector: 'viewRenderer',
                    template: model.template,
                })
                class DynamicComponent {
                    model: any;
                }
                
                if (this.savedComp) {
                  this.savedComp.dispose();
                }
                //var e = $(this.element.nativeElement).find('div').siblings();
                //e.remove(); // commenting in this line breaks loading the new component
                this.loader.loadIntoLocation(DynamicComponent, this.element, 'attach')
                    .then((res) => {res.instance.model = model; this.savedComp = res;});
            }
        }
    }
    
    @Component({
        selector: 'app',
        template: `
            <view [model]='currentView'></view>
            <button (click)='changeView()'>Change View</button>
        `,
        directives: [myView]
    })
        
        */
}
