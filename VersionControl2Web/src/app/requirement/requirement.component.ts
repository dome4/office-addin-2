import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RequirementService } from '../services/requirement.service';
import { Requirement } from '../models/requirement';
import { Observable } from 'rxjs';
import 'rxjs';
import { trigger, transition, animate, style, animateChild } from '@angular/animations';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { OfficeService } from '../services/office.service';
import { ChangeDetectorRef } from '@angular/core';

// Office variable
declare let Office: any;

@Component({
  animations: [
    trigger('expandNodeLeft', [
      transition('void => *', [
        style({
          transform: 'translateX(100px)',
          opacity: 0
        }),
        animate(1000, style({
          transform: 'translateX(0)',
          opacity: 1
        }))
      ]),
      transition('* => void', [
        style({
          transform: 'translateX(0)',
          opacity: 1
        }),
        animate(1000, style({
          transform: 'translateX(100px)',
          opacity: 0
        }))
      ])
    ]),
    trigger('expandNodeRight', [
      transition('void => *', [
        style({
          transform: 'translateX(-100px)',
          opacity: 0
        }),
        animate(1000, style({
          transform: 'translateX(0)',
          opacity: 1
        }))
      ]),
      transition('* => void', [
        style({
          transform: 'translateX(0)',
          opacity: 1
        }),
        animate(1000, style({
          transform: 'translateX(-100px)',
          opacity: 0
        }))
      ])
    ]),
    trigger('expandNodeMiddle', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 }))
      ]),
      transition('* => void', [
        style({ opacity: 1 }),
        animate(1000, style({ opacity: 0 }))
      ])
    ])
  ],
  selector: 'app-requirement',
  templateUrl: './requirement.component.html',
  styleUrls: ['./requirement.component.css']
})
export class RequirementComponent implements OnInit {

  // debug string
  public xmlMessage: string = '';

  public state: string = 'active';

  /*
   * in dropdown selected requirement
   */
  public selectedRequirement: Requirement = null;

  /*
   * requirements observable
   */
  private requirements$: Observable<Requirement[]> = null;

  /*
   * requirements array
   */
  public requirements: Requirement[] = [];

  // reactive form
  public requirementForm: FormGroup;

  /*
   * constructor
   */
  constructor(private requirementService: RequirementService,
              private fb: FormBuilder,
              private officeService: OfficeService,
              private changeDetector: ChangeDetectorRef) {
    this.createEmptyForm();
  }

  ngOnInit() {
    this.requirements$ = this.requirementService.getRequirements();

    this.requirements$.subscribe(
      (requirements: Requirement[]) => {
        this.requirements = requirements;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /*
   * change selectedRequirement-variable
   */
  onSelectedRequirement(requirement: Requirement) {

    // set selected requirement
    this.selectedRequirement = requirement;
    console.log('requirement selected');
    console.log(this.selectedRequirement);

    // ToDo: update form

  }

  onSelected(event) {
    console.log(event.target);
  }

  onChangeState() {
    this.state == 'active' ? this.state = 'inactive' : this.state = 'active';
  }

  // reactive form
  createEmptyForm() {  

    this.requirementForm = this.fb.group({
      fullName: ['', Validators.required],
      address: this.fb.group({
        postalCode: ['', Validators.required],
        country: ['', Validators.required]
      }),
      templateParts: this.fb.array([
        this.initTemplateParts(),
      ])
    });
  }

  initTemplateParts() {
    // initialize template parts
    return this.fb.group({
      version: [''],
      value: ['']
    });
  }

  submitted = false;
  onSubmit() {
    console.log('form submitted');
  }

  addNewEmployeeAddress() {
    this.requirementForm.reset();
    this.submitted = false;
  }

  addEmptyTemplatePart() {
    // add address to the list
    const control = <FormArray>this.requirementForm.controls['templateParts'];
    control.push(this.initTemplateParts());
  }

  removeTemplatePart(index: number) {
    // remove address from the list
    const control = <FormArray>this.requirementForm.controls['templateParts'];
    control.removeAt(index);
  }

  // ToDo: get / set values from requirement in form

  onMouseEnter(event: any) {
    event.target.classList.add('label'); // create labels of text

    //event.target.style.backgroundColor = '#eee';
    //event.target.style.borderRadius = '8px';

  }

  onMouseLeave(event: any) {
    event.target.classList.remove('label'); // create labels of text

    //event.target.style.backgroundColor = 'transparent'; 
    //event.target.style.borderRadius = '0px';
  }

  // access office document
  onAccessDocument() {

    /*
     * changes in the rich text field 'input' are submitted to the rich text field 'message' with event handler
     *
     */

    // add text binding to message text box
    this.officeService.addBindingFromNamedItem('message', Office.BindingType.Text, 'message');

    // add event handler to input text field and display text in message text field
    //this.officeService.addBindingFromNamedItem('input', Office.BindingType.Text, 'input', (asyncResult) => {
    this.officeService.addBindingFromNamedItem('input', Office.BindingType.Text, 'input', () => {

      // add handler
      Office.select("bindings#input").addHandlerAsync(Office.EventType.BindingDataChanged, (result) => {

        // get data from input and set to message
        Office.select("bindings#input").getDataAsync({ coercionType: "text" },
          (inputText) => {
            if (inputText.status == Office.AsyncResultStatus.Failed) {
              console.log('Error: ' + inputText.error.message);
            } else {
              Office.select("bindings#message").setDataAsync(inputText.value, { coercionType: "text" },
                (asyncResult) => {
                  if (asyncResult.status == Office.AsyncResultStatus.Failed) {
                    console.log('Error: ' + asyncResult.error.message);
                  }
                });
            }
          });
      });
    });
  }

  onInsertExample() {

    // Get the OOXML for the data at the point of insertion
    // and add a table at the beginning of the selection.
    //Office.context.document.getSelectedDataAsync(
    //  Office.CoercionType.Ooxml,
    //  {
    //    valueFormat: Office.ValueFormat.Formatted,
    //    filterType: Office.FilterType.All
    //  },
    //  (result) => {
    //    if (result.status == "succeeded") {
    //      // Get the OOXML returned from the getSelectedDataAsync call.
    //      var selectedData = result.value.toString();

    //      // debug
    //      //this.xmlMessage = selectedData;

    //      //console.log(selectedData);
    //    } else {
    //      console.log('Error: ' + result.error.message);
    //    }
    //  });

    Office.select("bindings#input").getDataAsync(
      {
        coercionType: Office.CoercionType.Ooxml,
        valueFormat: Office.ValueFormat.Formatted,
        filterType: Office.FilterType.All
      },
      (result) => {

        if (result.status == "succeeded") {
          // Get the OOXML returned from the getSelectedDataAsync call.
          var selectedData = result.value.toString();

          // debug
          this.xmlMessage = selectedData;

          // change detector necessary to reload view
          this.changeDetector.detectChanges();

          console.log(selectedData);
        } else {
          console.log('Error: ' + result.error.message);
        }
      });
  }
}
