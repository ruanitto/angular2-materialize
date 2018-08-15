import { MaterializeDirective, MaterializeAction } from "@samuelberthe/angular2-materialize";
import { Component, EventEmitter } from "@angular/core"

@Component({
  selector: "dialogs",
  template: `
      <!-- Modal Trigger -->
      <a class="waves-effect waves-light btn" (click)="openModal1()">Modal 1</a>
      <a class="waves-effect waves-light btn" (click)="openModal2()">Modal 2</a>
      <button class="btn modal-trigger" data-target="modal2">Modal 2 (2)</button>

      <!-- Modal Structure -->
<div id="modal1" class="modal bottom-sheet" materialize="Modal" [materializeParams]="model1Params" [materializeActions]="modalActions1">
<div class="modal-content">
          <h4>Modal Header 1</h4>
          <p>A bunch of text</p>
        </div>
        <div class="modal-footer">
          <a class="waves-effect waves-green btn-flat" (click)="closeModal1()">Close</a>
          <a class="modal-action modal-close waves-effect waves-green btn-flat">Agree</a>
        </div>
      </div>

      <!-- Modal Structure -->
<div id="modal2" class="modal bottom-sheet" materialize="Modal" [materializeParams]="[{dismissible: false}]" [materializeActions]="modalActions2">
<div class="modal-content">
          <h4>Modal Header 2</h4>
          <p>A bunch of text</p>
        </div>
        <div class="modal-footer">
          <a class="waves-effect waves-green btn-flat" (click)="closeModal2()">Close</a>
          <a class="modal-action modal-close waves-effect waves-green btn-flat">Agree</a>
        </div>
      </div>

      <br/><br/>

      <!-- data-position can be : bottom, top, left, or right -->
      <!-- data-delay controls delay before tooltip shows (in milliseconds)-->
<a materialize="Tooltip" (click)="printSomething()" class="btn tooltipped" data-position="bottom" data-delay="10" data-tooltip="I am tooltip">Hover me!</a>

<br/><br/>

      <!-- toast -->
<a class="btn" onclick="M.toast({html: 'I am a toast', displayLength: 4000})">Toast 1!</a>
`
})
export class Dialogs {
  modalActions1 = new EventEmitter<string | MaterializeAction>();
  modalActions2 = new EventEmitter<string | MaterializeAction>();
  params = []

  model1Params = [
    {
      dismissible: true,
      complete: function () { console.log('Closed'); }
    }
  ]

  printSomething() {
    console.log("tooltip button clicked!");
  }

  openModal1() {
    this.modalActions1.emit({ action: "open", params: [] });
  }
  closeModal1() {
    this.modalActions1.emit({ action: "close", params: [] });
  }
  openModal2() {
    this.modalActions2.emit({ action: "open", params: [] });
  }
  closeModal2() {
    this.modalActions2.emit({ action: "close", params: [] });
  }
}
