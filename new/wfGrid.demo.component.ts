
<div>
	<div class="grid-label-big-lined">
		<label>WFGrid Demo </label>
	</div>

	<wf-grid [detail]="dataset"  (loader)="alert()" > 
	
		<!-- <column [value]="'id'" [header]="'Id'">
			 <a>{{dataset[this.value]}}</a>
		</column> 
		<column [value]="'city'"[header]="'City'"></column> 
		<column [value]="'country'"[header]="'Country'"></column>  -->
	</wf-grid>
	
	 <form #deForm="ngForm">
    <div>
      <label for="testRec">Record Count</label>
    </div>
    <div>
      <input type="text" id="testRec" name="testRec"
        [(ngModel)]="testRec" 
        wfFilter="^[0-9]*$" #Axa="ngModel" />
    </div>
    <div
      *ngIf="Axa.errors && (Axa.dirty || Axa.touched)"
      class="alert alert-danger">
      
      <div [hidden]="!Axa.errors.pattern">Record Count must
        be a number.</div>
     
    </div>
    </form>
<!-- <column [header]="'Hi'" [value]="'No'" [componentData]="componentData"></column>

<div [column]="wfCol"></div>
<div *ngFor="let row of myList ">
<wfCell [html]="html" [val]="row"></wfCell> -->
<wf-row [id]="'5'"></wf-row>
</div>
