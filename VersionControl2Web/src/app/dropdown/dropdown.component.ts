import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Requirement } from '../models/requirement';
import { $ } from 'protractor';
import { Observable } from 'rxjs';

// office-ui-fabric variable
declare let fabric: any;

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements AfterViewInit {

  @Input() requirements: Requirement[];

  @Output()
  requirementSelected: EventEmitter<Requirement> = new EventEmitter<Requirement>();


  ngAfterViewInit() {

    var DropdownHTMLElements = document.querySelectorAll('.ms-Dropdown');
    for (var i = 0; i < DropdownHTMLElements.length; ++i) {
      let Dropdown = new fabric['Dropdown'](DropdownHTMLElements[i]);
    }
  }

  onChange($event, selectedRequirementId: string) {

    let requirement = Requirement.findById(this.requirements, selectedRequirementId);
    this.requirementSelected.emit(requirement);
    
  }

}
