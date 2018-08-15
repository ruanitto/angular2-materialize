import { MaterializeDirective, MaterializeAction } from "@samuelberthe/angular2-materialize";
import { Component, EventEmitter } from "@angular/core"

@Component({
    selector: "collapsible",
    template: `
        <a class="waves-effect waves-light btn" (click)="openFirst()">Open First</a>
        <a class="waves-effect waves-light btn" (click)="closeFirst()">Close First</a>
        <br/><br/>
<ul materialize="Collapsible" class="collapsible" [materializeParams]="params" [materializeActions]="actions1">
<li>
            <div class="collapsible-header"><i class="material-icons">filter_drama</i>First</div>
            <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
          </li>
          <li>
            <div class="collapsible-header active"><i class="material-icons">place</i>Second</div>
            <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
          </li>
          <li>
            <div class="collapsible-header"><i class="material-icons">whatshot</i>Third</div>
            <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
          </li>
        </ul>
        <br/><br/>
<ul materialize="Collapsible" class="collapsible popout">
<li *ngFor="let value of values">
            <div class="collapsible-header">{{value}}</div>
            <div class="collapsible-body"><p>{{value}}</p></div>
          </li>
        </ul>
    `
})
export class Collapsible {

    actions1 = new EventEmitter<string | MaterializeAction>();


    params = [
        {
            accordion: false,
            onOpenStart: (el) => {
                console.log("Collapsible open", el);
            },
            onCloseStart: (el) => {
                console.log("Collapsible close", el);
            }
        }
    ];

    values = ["First", "Second", "Third"];

    openFirst() {
        this.actions1.emit({ action: "open", params: [0] });
    }

    closeFirst() {
        this.actions1.emit({ action: "close", params: [0] });
    }
}
