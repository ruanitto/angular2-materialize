import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { MaterializeAction } from "@samuelberthe/angular2-materialize"

declare var M: any;

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss']
})
export class ButtonsComponent implements OnInit {

  tapTargetActions = new EventEmitter<MaterializeAction>();

  constructor(private router: Router) { }

  ngOnInit() {
  }

  gotoCollapsible() {
    this.router.navigate(['/Collapsible']);
  }

  updateTextFields() {
    M.updateTextFields();
    console.log("updateTextFields called");
  }

  openTapTarget() {
    this.tapTargetActions.emit({ action: "open", params: [] });
    // this.tapTargetActions.emit({action:"next", params:[]});
  }
  closeTapTarget() {
    this.tapTargetActions.emit({ action: "close", params: [] });
  }
}
