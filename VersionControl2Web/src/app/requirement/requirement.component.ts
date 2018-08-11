import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { RequirementService } from '../services/requirement.service';
import { Requirement } from '../models/requirement';
import { Subscription, Observable, Observer } from 'rxjs';
import { RequirementTemplatePart } from '../models/requirement-template-part';
import { RequirementDescriptionTemplate } from '../models/requirement-description-template/requirement-description-template';
import { RequirementDescriptionTemplatePart } from '../models/requirement-description-template/requirement-description-template-part';
import { StoreService } from '../services/store.service';
import * as _ from 'lodash';

// js variable
//declare var document: any;
// ToDo replace document with Renderer2

@Component({
  selector: 'app-requirement',
  templateUrl: './requirement.component.html',
  styleUrls: ['./requirement.component.css']
})
export class RequirementComponent implements OnInit, OnDestroy {

  /*
   * in dropdown selected requirement
   */
  public selectedRequirement: Requirement = null;

  /*
   * requirements array
   */
  public requirements: Requirement[] = [];

  // subscriptions
  private subscriptions: Subscription[] = [];

  // requirement template parts of the current selected requirement
  private requirementTemplateParts: RequirementTemplatePart[] = [];

  // requirement container
  @ViewChild('requirementContainer') requirementContainer: ElementRef;

  // ToDo validation Funktion schreiben -> hilft auch beim Aufbau der Anforderung
  private descriptionTemplate: RequirementDescriptionTemplate = null;

  // variable shows if current requirement template is valid
  public requirementTemplateIsValid: boolean;

  /*
   * constructor
   */
  constructor(
    private requirementService: RequirementService,
    private renderer: Renderer2,
    private storeService: StoreService
  ) { }

  ngOnInit() {

    // subscribe to requirements
    this.subscriptions.push(
      this.storeService.requirements$.subscribe(
        (requirements: Requirement[]) => {
          this.requirements = requirements;
        },
        (error) => {
          console.log(error);
        }
      )
    );

    // subscribe to selected requirement
    this.subscriptions.push(
      this.storeService.selectedRequirement$.subscribe((requirement: Requirement) => {

        // call method
        this.onSelectedRequirement(requirement);
      })
    );

    // subscribe to requirement template validator
    this.subscriptions.push(
      this.requirementService.requirementTemplateIsValid$.subscribe(
        (validation: boolean) => this.requirementTemplateIsValid = validation
      )
    );
  }

  ngOnDestroy() {

    // unsubscribe all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * update local variables and run methods if selected requirement changes
   *
   * @param requirement selected requirement
   */
  onSelectedRequirement(requirement: Requirement) {

    // check if new requirement was created
    if (requirement._id === 'new') {

      // set selected requirement 
      this.selectedRequirement = requirement;

      // delete content of current requirement-container
      this.requirementContainer.nativeElement.innerHTML = '';

      // debug
      console.log('requirement component: new requirement selected');
      console.log(this.selectedRequirement);


    } else {

      // set selected requirement 
      this.selectedRequirement = requirement;

      // set requirement template parts
      this.requirementTemplateParts = this.selectedRequirement.descriptionParts;

      // set description template
      this.descriptionTemplate = this.selectedRequirement.descriptionTemplate;

      // update description template to be a list of objects
      this.descriptionTemplate.template = this.descriptionTemplate.template.map(element => this.requirementService.createObject(element));

      // set container id
      this.requirementContainer.nativeElement.setAttribute('id', 'requirementId_' + this.selectedRequirement._id);

      // render selected requirement template
      this.renderRequirementTemplate();

      // debug
      console.log('requirement selected');
      console.log(this.selectedRequirement);
      // debug

      // validate requirement template
      this.requirementService.validateRequirementTemplate(this.requirementTemplateParts, this.descriptionTemplate);

    }
  }

  /**
  *
  * render requirement template
  *
  */
  renderRequirementTemplate() {

    // delete content of current requirement-container
    this.requirementContainer.nativeElement.innerHTML = '';

    // create new DOM elements for the description template
    this.requirementTemplateParts
      .forEach((element: RequirementTemplatePart) => {

        let newPart = this.createNewRequirementTemplatePart(element);

        // add new created element as the last child of the requirement container to the DOM
        this.requirementContainer.nativeElement.appendChild(newPart);
      });
  }

  /**
   * creates new element
   * 
   * @param templatePart requirement template part
   */
  createNewRequirementTemplatePart(templatePart: RequirementTemplatePart) {

    // prevent type errors
    templatePart = this.requirementService.createObject(templatePart);

    // create new element to insert
    let newPart = null;

    // handle element type -> ToDo add id and added attributes
    switch (templatePart.type) {
      case 'dropdown':
        newPart = document.createElement('select');

        // create all select options
        for (var i = 0; i < templatePart.descriptionTemplateValue.length; i++) {
          var option = document.createElement('option');
          option.setAttribute('value', templatePart.value[i]);
          option.innerHTML = templatePart.descriptionTemplateValue[i];

          // set active option
          if (templatePart.descriptionTemplateValue[i].toString() === templatePart.value.toString()) {
            option.selected = true;
          }
          newPart.appendChild(option);
        }

        // event listener
        newPart.addEventListener('change', this.onRequirementPartChanged.bind(this))
        break;

      case 'text':
        newPart = document.createElement('div');
        newPart.innerHTML = templatePart.value;
        newPart.setAttribute('style', 'display:inline;');
        break;

      case 'input':
        newPart = document.createElement('input');
        newPart.placeholder = templatePart.descriptionTemplateValue;
        newPart.value = templatePart.value;

        // event listener
        newPart.addEventListener('change', this.onRequirementPartChanged.bind(this));
        break;

      case 'table':
        newPart = this.tableHandler(templatePart, newPart);
        break;

      case 'wrapper':
        newPart = this.wrapperHandler(templatePart, newPart);
        break;

      default:
        console.log('createNewRequirementTemplatePart: chosen type not implemented: ' + templatePart.type);
    }

    // set id and classname
    newPart.id = templatePart._id;
    newPart.classList.add('requirement-part')


    return newPart;

  }

  /**
   * create table and its sub elements
   * 
   * @param templatePart
   * @param newPart
   */
  tableHandler(templatePart: RequirementTemplatePart, newPart: any) {

    // create new dom node
    newPart = document.createElement('table');
    newPart.setAttribute('style', 'display:inline;'); // ToDo check if necessary

    // add children elements
    // descriptionTemplateValue -> all possible options are stored here -> iterate the length often
    for (let i = 0; i < templatePart.descriptionTemplateValue.length; i++) {

      // local variables
      let tableChildElement = templatePart.descriptionTemplateValue[i];
      let newChildElement;

      /*
       * create new DOM element
       * correct data necessary
       *
       * start
       */
      // ToDo implement all subelement of table   

      // if requirement type === description type -> descriptionTemplateValue param necessary
      if (tableChildElement.type === templatePart.value.type) {

        if (
          templatePart.value.type === 'text' &&
          tableChildElement.value === templatePart.value.value
        ) {
          // table subelement text

          // create new child element of choosen option 
          newChildElement = this.createNewRequirementTemplatePart(templatePart.value);

        } else if (
          templatePart.value.type === 'wrapper'
        ) {
          // table subelement wrapper

          // create new child element of choosen option 
          newChildElement = this.createNewRequirementTemplatePart(templatePart.value);

        } else {
          // create new child element of not choosen option 
          newChildElement = this.createNewRequirementTemplatePart(tableChildElement);
        }

      } else {
        // types are not equal

        // clone deep -> prevent side effects
        let descriptionTemplateElement = _.cloneDeep(tableChildElement);

        // modify subelement values
        descriptionTemplateElement.value.forEach(subPart => {

          // set placeholder for creation of subelement
          subPart.descriptionTemplateValue = subPart.value;
          subPart.value = '';

          // check sideeffects on description template
        });

        // create new child element of not choosen option 
        newChildElement = this.createNewRequirementTemplatePart(descriptionTemplateElement);
      }
      /*
       * end
       */

      // create new row
      let newRow = document.createElement('tr');
      this.renderer.addClass(newRow, 'vc-req-table');

      // local variables
      let descriptionTemplatePart = this.requirementService.createObject(templatePart.descriptionTemplateValue[i]);
      let requirementTemplatePart = this.requirementService.createObject(templatePart.value);

      // set choosen subtype as active
      this.setChoosenTableOptionActive(descriptionTemplatePart, requirementTemplatePart, newRow);

      // event listener
      newRow.addEventListener('click', this.onRequirementPartChanged.bind(this))

      // value cell
      let newCell1 = document.createElement('td');
      newCell1.setAttribute('align', 'center');

      // append new created child element
      newCell1.appendChild(newChildElement);

      // button cell
      let newCell2 = document.createElement('td');
      // add new button
      // ToDo check what this method does
      //newCell2.appendChild(getNewButton(requirementId, childReqElementType, parentId));

      // append new created elements
      newRow.appendChild(newCell1);
      newRow.appendChild(newCell2);
      newPart.appendChild(newRow);
    }

    return newPart;
  }

  /**
   * create the wrapper div and its sub elements
   * 
   * @param templatePart
   * @param newPart
   */
  wrapperHandler(templatePart: RequirementTemplatePart, newPart: any) {

    // create new dom node
    newPart = document.createElement('div');
    newPart.style.display = 'inline';

    // add children elements
    for (var i = 0; i < templatePart.value.length; i++) {

      var tableChildElement = templatePart.value[i];

      // create new child element
      // ToDo handle errors if array is not valid
      var newChildElement = this.createNewRequirementTemplatePart(tableChildElement);

      // append new elements to wrapper
      newPart.appendChild(newChildElement);

    }

    return newPart;

  }

  /**
   * set the choosen table option as active
   * valid subtypes of table: wrapper, dropdown, input, text
   * 
   * @param descriptionTemplatePart
   * @param requirementTemplatePart
   * @param newRow
   */
  setChoosenTableOptionActive(descriptionTemplatePart: RequirementDescriptionTemplatePart, requirementTemplatePart: RequirementDescriptionTemplatePart, newRow: HTMLTableRowElement) {

    if (requirementTemplatePart.type === 'text') {
      // subtype text

      // if type and value are equal
      if (
        descriptionTemplatePart.type === requirementTemplatePart.type &&
        descriptionTemplatePart.value === requirementTemplatePart.value
      ) {

        // set option as active
        newRow.classList.add('active');
      }

    } else if (requirementTemplatePart.type === 'wrapper') {
      // subtype wrapper

      // both types have to be 'wrapper'
      if (descriptionTemplatePart.type === requirementTemplatePart.type) {

        // check sub elements
        requirementTemplatePart.value.forEach((subPart, i) => {
          this.setChoosenTableOptionActive(subPart, descriptionTemplatePart.value[i], newRow);
          // ToDo: issue - if only one subelement is valid, the row gets the active class anyway
        });
      }

    } else if (requirementTemplatePart.type === 'input') {
      // subtype input

      // types are equal and value is not empty
      if (
        descriptionTemplatePart.type === requirementTemplatePart.type &&
        requirementTemplatePart.value !== ''
      ) {
        newRow.classList.add('active');
      }

    } else if (requirementTemplatePart.type === 'dropdown') {
      // subtype dropdown

      // ToDo: case dropdown not debugged yet
      console.log('case dropdown in has not been debugged yet');

      // search for option in description template
      let optionsChoosen = Array.from(descriptionTemplatePart.value).find((option: string) => option === requirementTemplatePart.value[0]);

      if (
        descriptionTemplatePart.type === requirementTemplatePart.type &&
        optionsChoosen
      ) {
        newRow.classList.add('active');
      }

    } else {

      // ToDo update error
      throw new Error('datatype not valid')
    }
  }

  /**
   * methods gets executed each time an event occurres on one of the requirement template parts
   * 
   * @param event
   */
  onRequirementPartChanged(event) {

    if (event.type === 'change') {
      // dropdown or input
      console.log('dropdown or input');
      console.log(event.target);

      let templatePartId = event.target.id;
      let changedTemplatePart: RequirementTemplatePart;

      if (templatePartId !== 'undefined') {

        // find changed template part -> reference
        changedTemplatePart = RequirementTemplatePart.findById(this.selectedRequirement.descriptionParts, templatePartId);

        if (event.target.nodeName.toLowerCase() === 'input') {
          // input

          // set changed value to requirement
          changedTemplatePart.value = event.target.value;
        } else if (event.target.nodeName.toLowerCase() === 'select') {
          // dropdown

          // local variable
          let select: HTMLSelectElement = event.target;

          // set changed value to requirement -> array necessary !
          changedTemplatePart.value = [select.options[select.selectedIndex].textContent];
        }


      } else {
        // nested elements hava an id === 'undefined'

        new Observable((observer: Observer<string>) => {

          /**
           * find next parent with requirement template part id
           * 
           * @param element start node
           */
          let findValidParentId = (element) => {

            if ((<string>element.id).includes('requirementId')) {
              // no valid table or wrapper id found
              observer.error('onRequirementPartChanged() - root level of requirement reached');
              observer.complete();

            } else if (element.id && element.id !== 'undefined') {
              // return id result
              observer.next(element.id);
              observer.complete();

            } else {
              // recursive method call
              findValidParentId(element.parentElement);

            }
          };

          // execute function
          findValidParentId(event.target);

        }).subscribe((templatePartId: string) => {

          // find template part -> is a table (see definition, wrapper-elements are always subelements of a table)
          let templatePart: RequirementTemplatePart = RequirementTemplatePart.findById(this.selectedRequirement.descriptionParts, templatePartId);

          /**
           * search in descriptionTemplateValue for option which was clicked on (or changed)
           *
           * @param templatePart modified requirement template part
           * @param searchParam placeholder (input) or options-array(dropdown)
           * @param modifiedValue event.target.value(input) or selected option(dropdown)
           *
           */
          let findModifiedElementInDescriptionTemplate = (templatePart: RequirementTemplatePart, searchParam, modifiedValue) => {

            // iterate over
            templatePart.descriptionTemplateValue.forEach((option: RequirementDescriptionTemplatePart) => {

              // handle all possible sub elements of a table
              // here are only three cases possible: input, dropdown and wrapper (due to the event type)
              if (
                (option.type === 'input' || option.type === 'dropdown') &&
                option.value === searchParam
              ) {
                // input or dropdown as direct subelement of table
                // set these option as value
                templatePart.value = _.cloneDeep(option);
                templatePart.value.value = modifiedValue; // Issue: only works for input!!
              } else if (option.type === 'wrapper') {

                // search in subelements of wrapper.value
                let subElement = option.value.filter((wrapperOption: RequirementDescriptionTemplatePart) => {
                  // handle all possible subtypes of wrapper
                  // dropdown, input, text -> text not possible here due to change event
                  if (
                    (wrapperOption.type === 'input' || wrapperOption.type === 'dropdown') &&
                    wrapperOption.value === searchParam
                  ) {
                    return true;
                  }
                  return false;
                });

                // if not subElement exists and contains only on object => throw error
                if (!(subElement && subElement.length == 1)) {
                  throw new Error('findModifiedElementInDescriptionTemplate() - wrapper options not valid or searchParam not found');
                }

                // set value to wrapper template
                // correct place to set because search in options.value was successfull
                templatePart.value = _.cloneDeep(option);

                // prepare subelement for insertion
                let newSubElement: RequirementTemplatePart = _.cloneDeep(subElement[0]);
                newSubElement.descriptionTemplateValue = _.clone(newSubElement.value);
                newSubElement.value = modifiedValue; // Issue: does only work for input, not for dropdown

                // wrapper conatins a few elements -> replace the correct one
                templatePart.value.value.filter((wrapperTemplateOption) => {
                  if (
                    wrapperTemplateOption.type === newSubElement.type &&
                    wrapperTemplateOption.value === newSubElement.descriptionTemplateValue
                  ) {
                    return true;
                  }
                  return false;

                }).map((optionToReplace) => {

                  // modify matched description template option
                  optionToReplace.descriptionTemplateValue = newSubElement.descriptionTemplateValue;
                  optionToReplace.value = newSubElement.value;
                });
              }
            })
          };
          /*
           * findModifiedElementInDescriptionTemplate() - end
           */

          /*
           * continue with subscription logic
           */
          if (event.target.nodeName.toLowerCase() === 'input') {
            // input

            // local variable
            let modifiedInput: HTMLInputElement = event.target;

            // execute method from above
            findModifiedElementInDescriptionTemplate(templatePart, modifiedInput.placeholder, modifiedInput.value);

          } else if (event.target.nodeName.toLowerCase() === 'select') {
            // dropdown

            // ToDo if dropdown is in an table element
            throw new Error('onRequirementPartChanged() - dropdown case not implemented yet');

            // Issue: findModifiedElementInDescriptionTemplate() does not work for dropdown yet
            // because value is set to '' and not to[]
          } else {
            throw new Error('onRequirementPartChanged() - neither input nor dropdown element');
          }
        });
      }
    } else if (event.type === 'click') {
      // table
      console.log('table');
      console.log(event.target);

      new Observable((observer: Observer<HTMLTableRowElement>) => {

        /**
         * find next table row parent
         * 
         * @param node
         */
        let findParentRow = (node) => {

          if (node.nodeName.toLowerCase() === 'tr') {
            // return result
            observer.next(node);

            // complete observable -> no need to unsubscribe
            observer.complete();

          } else if (node.id.includes('requirementId')) {
            // table node found (upper bound)
            observer.error('onRequirementPartChanged() - root level of requirement reached');
            observer.complete();
          } else {
            // go to next parent node
            findParentRow(node.parentNode);
          }
        };

        // execute function
        findParentRow(event.target);
      }).subscribe(
        (node: HTMLTableRowElement) => {
          // debug
          console.log('clicked table row');
          console.log(node);

          // save value to requirement template part
          // ToDo




          // set table row active
          // ToDo


        },
        error => console.log(error)
      )




    } else {
      throw new Error('onRequirementPartChanged() - event type not supported');
    }


    // debug
    console.log(this.requirements);

    // ToDo validate updated requirement parts
    //this.requirementService.validateRequirementTemplate(this.requirementTemplateParts, this.descriptionTemplate); 

    // ToDo API call
  }

  /**
   * method should be executed everytime the requirement changes
   *
   */
  onRequirementChanged() {
    // validate updated requirement
    this.requirementService.validateRequirementTemplate(this.requirementTemplateParts, this.descriptionTemplate);
  }
}
