'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`<nav>
    <ul class="list">
        <li class="title">
            <a href="index.html" data-type="index-link">version-control documentation</a>
        </li>
        <li class="divider"></li>
        ${ isNormalMode ? `<div id="book-search-input" role="search">
    <input type="text" placeholder="Type to search">
</div>
` : '' }
        <li class="chapter">
            <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
            <ul class="links">
                    <li class="link">
                        <a href="overview.html" data-type="chapter-link">
                            <span class="icon ion-ios-keypad"></span>Overview
                        </a>
                    </li>
                    <li class="link">
                        <a href="index.html" data-type="chapter-link">
                            <span class="icon ion-ios-paper"></span>README
                        </a>
                    </li>
                    <li class="link">
                        <a href="dependencies.html"
                            data-type="chapter-link">
                            <span class="icon ion-ios-list"></span>Dependencies
                        </a>
                    </li>
            </ul>
        </li>
        <li class="chapter modules">
            <a data-type="chapter-link" href="modules.html">
                <div class="menu-toggler linked" data-toggle="collapse"
                    ${ isNormalMode ? 'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                    <span class="icon ion-ios-archive"></span>
                    <span class="link-name">Modules</span>
                    <span class="icon ion-ios-arrow-down"></span>
                </div>
            </a>
            <ul class="links collapse"
            ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                    <li class="link">
                        <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-AppModule-196475673af852208a79c771f6c5141f"' : 'data-target="#xs-components-links-module-AppModule-196475673af852208a79c771f6c5141f"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-AppModule-196475673af852208a79c771f6c5141f"' : 'id="xs-components-links-module-AppModule-196475673af852208a79c771f6c5141f"' }>
                                        <li class="link">
                                            <a href="components/AlertComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">AlertComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/HeaderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">HeaderComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/NotFoundComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">NotFoundComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/RequirementComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">RequirementComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/RequirementDetailsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">RequirementDetailsComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/RequirementEditComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">RequirementEditComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/RequirementListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">RequirementListComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/RequirementsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">RequirementsComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/SigninComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">SigninComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/XmlComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">XmlComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/XmlDebugComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">XmlDebugComponent</a>
                                        </li>
                                </ul>
                            </li>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#injectables-links-module-AppModule-196475673af852208a79c771f6c5141f"' : 'data-target="#xs-injectables-links-module-AppModule-196475673af852208a79c771f6c5141f"' }>
                                    <span class="icon ion-md-arrow-round-down"></span>
                                    <span>Injectables</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="injectables-links-module-AppModule-196475673af852208a79c771f6c5141f"' : 'id="xs-injectables-links-module-AppModule-196475673af852208a79c771f6c5141f"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LocalStorageService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>LocalStorageService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/OfficeService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>OfficeService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/OoxmlParser.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>OoxmlParser</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RequirementAPIService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>RequirementAPIService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RequirementDescriptionTemplateService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>RequirementDescriptionTemplateService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RequirementService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>RequirementService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RequirementTemplatePartService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>RequirementTemplatePartService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/StoreService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>StoreService</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                    </li>
            </ul>
        </li>
        <li class="chapter">
            <div class="simple menu-toggler" data-toggle="collapse"
            ${ isNormalMode ? 'data-target="#classes-links"' : 'data-target="#xs-classes-links"' }>
                <span class="icon ion-ios-paper"></span>
                <span>Classes</span>
                <span class="icon ion-ios-arrow-down"></span>
            </div>
            <ul class="links collapse"
            ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                    <li class="link">
                        <a href="classes/CustomEncoder.html" data-type="entity-link">CustomEncoder</a>
                    </li>
                    <li class="link">
                        <a href="classes/Requirement.html" data-type="entity-link">Requirement</a>
                    </li>
                    <li class="link">
                        <a href="classes/RequirementDescriptionTemplate.html" data-type="entity-link">RequirementDescriptionTemplate</a>
                    </li>
                    <li class="link">
                        <a href="classes/RequirementDescriptionTemplatePart.html" data-type="entity-link">RequirementDescriptionTemplatePart</a>
                    </li>
                    <li class="link">
                        <a href="classes/RequirementTemplatePart.html" data-type="entity-link">RequirementTemplatePart</a>
                    </li>
            </ul>
        </li>
                <li class="chapter">
                    <div class="simple menu-toggler" data-toggle="collapse"
                        ${ isNormalMode ? 'data-target="#injectables-links"' : 'data-target="#xs-injectables-links"' }>
                        <span class="icon ion-md-arrow-round-down"></span>
                        <span>Injectables</span>
                        <span class="icon ion-ios-arrow-down"></span>
                    </div>
                    <ul class="links collapse"
                    ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                            <li class="link">
                                <a href="injectables/AuthService.html" data-type="entity-link">AuthService</a>
                            </li>
                            <li class="link">
                                <a href="injectables/LocalStorageService.html" data-type="entity-link">LocalStorageService</a>
                            </li>
                            <li class="link">
                                <a href="injectables/OfficeService.html" data-type="entity-link">OfficeService</a>
                            </li>
                            <li class="link">
                                <a href="injectables/OoxmlParser.html" data-type="entity-link">OoxmlParser</a>
                            </li>
                            <li class="link">
                                <a href="injectables/RequirementAPIService.html" data-type="entity-link">RequirementAPIService</a>
                            </li>
                            <li class="link">
                                <a href="injectables/RequirementDescriptionTemplateService.html" data-type="entity-link">RequirementDescriptionTemplateService</a>
                            </li>
                            <li class="link">
                                <a href="injectables/RequirementService.html" data-type="entity-link">RequirementService</a>
                            </li>
                            <li class="link">
                                <a href="injectables/RequirementTemplatePartService.html" data-type="entity-link">RequirementTemplatePartService</a>
                            </li>
                            <li class="link">
                                <a href="injectables/StoreService.html" data-type="entity-link">StoreService</a>
                            </li>
                    </ul>
                </li>
        <li class="chapter">
            <div class="simple menu-toggler" data-toggle="collapse"
            ${ isNormalMode ? 'data-target="#interceptors-links"' : 'data-target="#xs-interceptors-links"' }>
                <span class="icon ion-ios-swap"></span>
                <span>Interceptors</span>
                <span class="icon ion-ios-arrow-down"></span>
            </div>
            <ul class="links collapse"
            ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                    <li class="link">
                        <a href="interceptors/TokenInterceptor.html" data-type="entity-link">TokenInterceptor</a>
                    </li>
            </ul>
        </li>
        <li class="chapter">
            <div class="simple menu-toggler" data-toggle="collapse"
                 ${ isNormalMode ? 'data-target="#guards-links"' : 'data-target="#xs-guards-links"' }>
            <span class="icon ion-ios-lock"></span>
            <span>Guards</span>
            <span class="icon ion-ios-arrow-down"></span>
            </div>
            <ul class="links collapse"
                ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                <li class="link">
                    <a href="guards/AuthGuardService.html" data-type="entity-link">AuthGuardService</a>
                </li>
            </ul>
            </li>
        <li class="chapter">
            <div class="simple menu-toggler" data-toggle="collapse"
            ${ isNormalMode ? 'data-target="#miscellaneous-links"' : 'data-target="#xs-miscellaneous-links"' }>
                <span class="icon ion-ios-cube"></span>
                <span>Miscellaneous</span>
                <span class="icon ion-ios-arrow-down"></span>
            </div>
            <ul class="links collapse"
            ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                    <li class="link">
                      <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                    </li>
                    <li class="link">
                      <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                    </li>
            </ul>
        </li>
        <li class="chapter">
            <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
        </li>
        <li class="divider"></li>
        <li class="copyright">
                Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.svg" class="img-responsive" data-type="compodoc-logo">
                </a>
        </li>
    </ul>
</nav>`);
        this.innerHTML = tp.strings;
    }
});
