import { MaterializeDirective } from "@samuelberthe/angular2-materialize";
import { Component } from "@angular/core"
import { Location } from '@angular/common';

@Component({
    selector: "sidenav",
    styles: [`

`],
    template: `
<!--<nav></nav>-->
<ul id="slide-out" class="sidenav sidenav-fixed" materialize="Sidenav" [materializeParams]="[{edge:'left'}]">
<li *ngFor="let routeName of routeNames" routerLinkActive="active"><a [routerLink]="[routeName]">{{routeName}}</a></li>
</ul>
<a href="#" data-target="slide-out" class="sidenav-trigger"><i class="material-icons">menu</i></a>
    `
})
export class SideNav {
    routeNames = ["Buttons", "Carousel", "Chips", "Collapsible", "Dialogs", "Dropdown", "Forms", "Tabs", "DatePicker", "Parallax", "ModelBindings"];
}
