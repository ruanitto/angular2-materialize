import { Component, Input, Output, EventEmitter } from "@angular/core";
import { MaterializeDirective } from "@samuelberthe/angular2-materialize";
import * as M from "@samuelberthe/angular2-materialize";
import { Option } from './option';


@Component({
    selector: "materialSelect",
    template: `
      <div class="row">
          <div class="input-field col s6">
<select [ngModel]="initialValue" (ngModelChange)="change($event)" id="selectExample" materialize="FormSelect" [materializeSelectOptions]="options">
<option value="" disabled selected>Select option ..</option>
                  <option *ngFor="let option of options" [value]="option.value">{{option.name}}</option>
              </select>
          </div>
      </div>
`
})
export class MaterialSelect {
    @Input() initialValue: string;
    @Output() modelChange = new EventEmitter();
    @Input() options: Array<Option>;

    change(newValue) {
        M.toast({ html: 'child select: ' + newValue, displayLength: 2000 });
        this.modelChange.emit(newValue);
    }
}
