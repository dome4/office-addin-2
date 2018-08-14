import { Component, OnInit, OnDestroy } from '@angular/core';
import { StoreService } from '../../../services/store.service';
import { Requirement } from '../../../models/requirement';
import { Subscription, merge } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { RequirementService } from '../../../services/requirement/requirement.service';

@Component({
  selector: 'app-requirement-details',
  templateUrl: './requirement-details.component.html',
  styleUrls: ['./requirement-details.component.css']
})
export class RequirementDetailsComponent implements OnInit, OnDestroy {

  // selected requirement
  public selectedRequirement: Requirement;

  // requirements
  public requirements: Requirement[];

  // selected requirement id
  private selectedRequirementId: string;

  // subscriptions
  private subscriptions: Subscription[] = [];

  constructor(
    private storeService: StoreService,
    private route: ActivatedRoute,
    private requirementService: RequirementService
  ) { }

  ngOnInit() {

    // subscribe to requirements and route params
    this.subscriptions.push(
      merge(
        this.storeService.requirements$,
        this.route.params
      )
        .subscribe((data: Requirement[] | Params) => {

          // app is loading
          this.storeService.appLoading$.next(true);

          // requirements$ is a BehaviorSubject with null inital value
          if (data) {

            // set new data
            if (data.constructor == Object) {
              // data is of type Params

              // set selected requirement id
              this.selectedRequirementId = data['id'];

            } else if (data.constructor == Array) {
              // data is of type Requirement[]

              // set requirements
              this.requirements = <Requirement[]>data;

            } else {
              throw new Error('RequirementComponent - data is neither of type Requirement[] nor Params');
            }

            // update current data if all observables emitted
            if (this.selectedRequirementId && this.requirements) {

              // set selected requirement
              this.selectedRequirement = this.requirements.find((requirement: Requirement) => requirement._id === this.selectedRequirementId);
            }

            // app loading completed
            this.storeService.appLoading$.next(false);

          }
        }, (error) => {
          console.log('RequirementDetailsComponent - error occurred in ngOnInit()');
          console.log(error);
        })
    );
  }

  ngOnDestroy() {
    // unsubscribe all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * save changes to the api
   *
   */
  onRequirementSave() {

    // app starts loading
    this.storeService.appLoading$.next(true);

    // update current changes requirement (http observable)
    this.requirementService.updateRequirement(this.selectedRequirement)
      .subscribe(
      (requirement: Requirement) => {
        console.log('onRequirementSave() - requirement save successfull');

        // reload requirements
        this.requirementService.reloadRequirements();

        // app loading finished
        this.storeService.appLoading$.next(false);

      }, (error) => {
        console.log('onRequirementSave() - error occurred');
        console.log(error);

        // app loading finished
        this.storeService.appLoading$.next(false);
      }
      );
  }
}