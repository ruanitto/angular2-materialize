import { MaterializeDirective } from "@samuelberthe/angular2-materialize";
import { Component } from "@angular/core"

@Component({
    selector: "dropdown",
    template: `
     <!-- Dropdown Trigger -->
<a materialize="Dropdown" [materializeParams]="[{hover:true, coverTrigger:false}]" class='dropdown-trigger btn' href='#' data-target='dropdown1'>Drop Me!</a>
<!-- Dropdown Structure -->
     <ul id='dropdown1' class='dropdown-content'>
<li><a href="#!">one</a></li>
<li><a href="#!">two</a></li>
<li class="divider"></li>
<li><a href="#!">three</a></li>
</ul>
    `
})
export class Dropdown { }
