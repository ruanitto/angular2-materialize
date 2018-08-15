import {
    Directive,
    ElementRef,
    Input,
    Output,
    DoCheck,
    OnChanges,
    OnDestroy,
    AfterViewInit,
    EventEmitter,
    PLATFORM_ID,
    Inject
} from '@angular/core';
import { CustomEvent } from './custom-event-polyfill';
import { isPlatformBrowser } from '@angular/common';

declare var $: any;
declare var M: any;

// export type MaterializeOptions =
// "Collapsible" |
// "Chips" |
// "Autocomplete" |
// "Dropdown" |
// "Materialbox" |
// "ScrollSpy" |
// "Tabs" |
// "Tooltip" |
// "CharacterCounter" |
// "FormSelect" |
// "Sidenav" |
// "TapTarget" |
// "Carousel" |
// "FloatingActionButton" |
// "Parallax" |
// "Modal";

export interface MaterializeAction {
    action: string;
    params: any[];
}

@Directive({
    selector: '[materialize]'
})
export class MaterializeDirective implements AfterViewInit, DoCheck, OnChanges, OnDestroy {

    private _params: any[] = [];
    private _functionName: string = null;
    private previousValue = null;
    private previousDisabled = false;
    private _waitFunction: any = {};
    private instance: any;
    private isBrowser: boolean = isPlatformBrowser(this.platformId);

    private changeListenerShouldBeAdded = true;

    @Output() public init = new EventEmitter<void>();
    private initialized = false;

    constructor(@Inject(PLATFORM_ID) private platformId: Object, private _el: ElementRef) {
    }

    @Input()
    public set materialize(functionName: string) {
        this._functionName = functionName;
        if (this.isBrowser) {
            window.setTimeout(() => {
                this.performElementUpdates();
                this.performElementInit();
            }, 1);
        }
    }

    @Input()
    public set materializeParams(params: any) {
        this._params = params;
    }

    @Input()
    public set materializeActions(actions: EventEmitter<string | MaterializeAction>) {
        if (this.isBrowser) {
            actions.subscribe((action: string | MaterializeAction) => {
                window.setTimeout(() => {
                    if (typeof action === "string") {
                        this.performElementAction(action);
                    } else {
                        this.performElementAction(action.action, action.params);
                    }
                }, 1);
            })
        }
    }

    // this is here to trigger change detection for select elements
    @Input()
    public set materializeSelectOptions(options: any) {
    }

    //used for the datepicker at the moment
    @Input() ngModel;

    public ngAfterViewInit() {
        if (this.isBrowser) {
            this.performElementUpdates();
        }
    }

    public ngOnChanges(_unused?) {
        if (this.isBrowser) {
            if (this.isSelect()) {
                const nativeElement = this._el.nativeElement;
                const jQueryElement = $(nativeElement);

                // run performElementInit() only if dropdown closed
                // otherwise the dropdown closes unexpected
                if (!jQueryElement.attr("multiple") || jQueryElement.parent().find("input.active").length === 0) {
                    setTimeout(() => this.performElementInit(), 10);
                }
            }
        }
    }

    public ngOnDestroy() {
        if (this.isBrowser) {
            this.performElementRemotion();
        }
    }

    public ngDoCheck() {
        if (this.isBrowser) {
            const nativeElement = this._el.nativeElement;
            const jQueryElement = $(nativeElement);
            if (this.isSelect()) {
                let shouldUpdate = false;
                if (nativeElement.disabled != this.previousDisabled) {
                    this.previousDisabled = nativeElement.disabled;
                    shouldUpdate = true;
                }
                if (!jQueryElement.attr("multiple") && nativeElement.value != this.previousValue) {
                    // handle select changes of the model
                    this.previousValue = nativeElement.value;
                    shouldUpdate = true;
                }
                if (shouldUpdate) {
                    this.performElementInit();
                }
            } else if (this.isTextarea()) {
                if (nativeElement.value != this.previousValue) {
                    this.previousValue = nativeElement.value;
                    this.performElementUpdates();
                }
            }
        }
        return false;
    }

    private performElementRemotion() {
        this.performElementAction("destroy");
    }

    private performElementAction(action: string, params: any[] = []) {
        const instance = this.getInstance();
        if (!!instance && !!instance[action])
            instance[action](...params);
    }

    private performElementUpdates() {
        // it should have been created by now, but confirm anyway
        if (M && M.updateTextFields) {
            M.updateTextFields();
        }

        // handle select changes from the HTML
        if (this.isSelect() && this.changeListenerShouldBeAdded) {
            const nativeElement = this._el.nativeElement;
            const jQueryElement = $(nativeElement);
            jQueryElement.on("change", e => {
                if (!e.originalEvent || !e.originalEvent.internalToMaterialize) {
                    const event: any = document.createEvent("CustomEvent");
                    //if (jQueryElement.attr("multiple")) {
                    //event.initCustomEvent("input",false,false,undefined);
                    //}
                    //else {
                    event.initCustomEvent("change", false, false, undefined);
                    //}

                    event.internalToMaterialize = true;
                    nativeElement.dispatchEvent(event);
                }
            });
            this.changeListenerShouldBeAdded = false;
        }

        if (this.isAutocomplete()) {
            const nativeElement = this._el.nativeElement;
            const jQueryElement = $(nativeElement);

            jQueryElement.on("change", e => nativeElement.dispatchEvent((<any>CustomEvent("input"))));
        }

        if (this.isDatePicker() || this.isTimePicker()) {
            const nativeElement = this._el.nativeElement;
            const jQueryElement = $(nativeElement);

            jQueryElement.on("change", e => nativeElement.dispatchEvent((<any>CustomEvent("input"))));
        }

        if (this.isChips()) {
            const nativeElement = this._el.nativeElement;
            const jQueryElement = $(nativeElement);
            jQueryElement.on("chip.add", (e, chip) => nativeElement.dispatchEvent((<any>CustomEvent("chip.add", chip))));
            jQueryElement.on("chip.delete", (e, chip) => nativeElement.dispatchEvent((<any>CustomEvent("chip.delete", chip))));
            jQueryElement.on("chip.select", (e, chip) => nativeElement.dispatchEvent((<any>CustomEvent("chip.select", chip))));
        }

        if (this.isTextarea()) {
            this._el.nativeElement.dispatchEvent((<any>CustomEvent("autoresize", {
                bubbles: true,
                cancelable: false,
                detail: undefined
            })));
        }
    }

    private performElementInit(functionName = this._functionName, params = this._params) {
        if (this._waitFunction[functionName]) {
            return;
        }

        this._waitFunction[functionName] = true;

        $(document).ready(() => {
            // console.log(functionName, params, this._el.nativeElement);
            this._waitFunction[functionName] = false;

            if (functionName) {
                const jQueryElement = $(this._el.nativeElement);
                if (!!M[functionName] && !!M[functionName].init) {
                    if (params && params instanceof Array && params.length > 0) {
                        this.instance = M[functionName].init(this._el.nativeElement, ...params);
                    } else {
                        this.instance = M[functionName].init(this._el.nativeElement);
                    }
                } else {
                    throw new Error("Couldn't find materialize function ''" + functionName + "' on element or the global Materialize object.");
                }

                if (!this.initialized) {
                    this.initialized = true;
                    this.init.emit();
                }

            }

        });
    }

    private getInstance() {
        const elem = this._el.nativeElement;
        if (!!this._functionName && !!M[this._functionName] && !!M[this._functionName].getInstance)
            return M[this._functionName].getInstance(elem);
        return null;
    }

    private isTooltip() {
        return (this._functionName && this._functionName === "Tooltip");
    }

    private isSelect() {
        return (this._functionName && this._functionName === "FormSelect");
    }

    private isDatePicker() {
        return (this._functionName && this._functionName === "Datepicker");
    }

    private isTimePicker() {
        return (this._functionName && this._functionName === "Timepicker");
    }

    private isChips() {
        return (this._functionName && this._functionName === "Chips");
    }

    private isAutocomplete() {
        return (this._functionName && this._functionName === "Autocomplete");
    }

    private isTextarea() {
        return this._el.nativeElement.nodeName == "TEXTAREA";
    }

}
