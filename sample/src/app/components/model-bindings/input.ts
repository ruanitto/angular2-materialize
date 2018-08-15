import { Component, EventEmitter } from "@angular/core";
import { MaterializeDirective } from "@samuelberthe/angular2-materialize";
import * as M from "@samuelberthe/angular2-materialize";

@Component({
    selector: "materialInput",
    inputs: ['model: model'],
    outputs: ['modelChange'],
    template: `
      <div class="row">
          <div class="input-field col s6">
            <input [ngModel]="model" (ngModelChange)="change($event)" id="last_name" type="text" class="validate">
            <label for="last_name">Last Name</label>
          </div>
      </div>
`
})
export class MaterialInput {
    model: string;
    modelChange = new EventEmitter();

    change(newValue) {
        M.toast({ html: `child input: ${newValue}`, displayLength: 500 });
        this.model = newValue;
        this.modelChange.emit(newValue);
    }
}
