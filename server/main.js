/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 4991:
/*!*******************!*\
  !*** ./server.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppServerModule: () => (/* reexport safe */ _src_main_server__WEBPACK_IMPORTED_MODULE_5__.AppServerModule),
/* harmony export */   app: () => (/* binding */ app),
/* harmony export */   renderApplication: () => (/* reexport safe */ _angular_platform_server__WEBPACK_IMPORTED_MODULE_7__.renderApplication),
/* harmony export */   renderModule: () => (/* reexport safe */ _angular_platform_server__WEBPACK_IMPORTED_MODULE_7__.renderModule),
/* harmony export */   "ɵSERVER_CONTEXT": () => (/* reexport safe */ _angular_platform_server__WEBPACK_IMPORTED_MODULE_7__["ɵSERVER_CONTEXT"])
/* harmony export */ });
/* harmony import */ var zone_js_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! zone.js/node */ 650);
/* harmony import */ var zone_js_node__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(zone_js_node__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ 4228);
/* harmony import */ var _nguniversal_express_engine__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nguniversal/express-engine */ 3389);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! express */ 5162);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! node:fs */ 7561);
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! node:path */ 9411);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _src_main_server__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./src/main.server */ 8674);
/* harmony import */ var _angular_platform_server__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/platform-server */ 7014);







// The Express app is exported so that it can be used by serverless Functions.
function app() {
  const server = express__WEBPACK_IMPORTED_MODULE_2__();
  const distFolder = (0,node_path__WEBPACK_IMPORTED_MODULE_4__.join)(process.cwd(), 'dist/portfolio-2024-all-skills/browser');
  const indexHtml = (0,node_fs__WEBPACK_IMPORTED_MODULE_3__.existsSync)((0,node_path__WEBPACK_IMPORTED_MODULE_4__.join)(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';
  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/main/modules/express-engine)
  server.engine('html', (0,_nguniversal_express_engine__WEBPACK_IMPORTED_MODULE_1__.ngExpressEngine)({
    bootstrap: _src_main_server__WEBPACK_IMPORTED_MODULE_5__.AppServerModule
  }));
  server.set('view engine', 'html');
  server.set('views', distFolder);
  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express__WEBPACK_IMPORTED_MODULE_2__["static"](distFolder, {
    maxAge: '1y'
  }));
  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, {
      req,
      providers: [{
        provide: _angular_common__WEBPACK_IMPORTED_MODULE_6__.APP_BASE_HREF,
        useValue: req.baseUrl
      }]
    });
  });
  return server;
}
function run() {
  const port = process.env['PORT'] || 4000;
  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}
const mainModule = require.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}


  // EXPORTS added by @angular-devkit/build-angular
  
  

/***/ }),

/***/ 1838:
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppRoutingModule: () => (/* binding */ AppRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 8804);
/* harmony import */ var _portfolio_portfolio_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./portfolio/portfolio.component */ 6139);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 9936);




const routes = [
// default redirection
{
  path: '',
  redirectTo: 'Programming/Web Development',
  pathMatch: 'full'
}, {
  path: 'Programming',
  redirectTo: 'Programming/Web Development',
  pathMatch: 'full'
}, {
  path: 'Design',
  redirectTo: 'Design/Social Media Designs',
  pathMatch: 'full'
}, {
  path: 'Video',
  redirectTo: 'Video/Motion Graphic',
  pathMatch: 'full'
}, {
  path: 'Audio',
  redirectTo: 'Audio/Audio Engineering',
  pathMatch: 'full'
}, {
  path: 'Others',
  redirectTo: 'Others/Photography',
  pathMatch: 'full'
}, {
  path: 'Programming',
  component: _portfolio_portfolio_component__WEBPACK_IMPORTED_MODULE_0__.PortfolioComponent,
  children: [{
    path: 'Web Development',
    component: _portfolio_portfolio_component__WEBPACK_IMPORTED_MODULE_0__.PortfolioComponent
  }, {
    path: 'Ux Ui',
    component: _portfolio_portfolio_component__WEBPACK_IMPORTED_MODULE_0__.PortfolioComponent
  }, {
    path: 'Desktop',
    component: _portfolio_portfolio_component__WEBPACK_IMPORTED_MODULE_0__.PortfolioComponent
  }, {
    path: 'Game',
    component: _portfolio_portfolio_component__WEBPACK_IMPORTED_MODULE_0__.PortfolioComponent
  }]
}, {
  path: 'Design',
  component: _portfolio_portfolio_component__WEBPACK_IMPORTED_MODULE_0__.PortfolioComponent,
  children: [{
    path: 'Social Media Designs',
    component: _portfolio_portfolio_component__WEBPACK_IMPORTED_MODULE_0__.PortfolioComponent
  }, {
    path: 'Brand Design',
    component: _portfolio_portfolio_component__WEBPACK_IMPORTED_MODULE_0__.PortfolioComponent
  }, {
    path: '3d Design',
    component: _portfolio_portfolio_component__WEBPACK_IMPORTED_MODULE_0__.PortfolioComponent
  }, {
    path: 'Art & Drawing',
    component: _portfolio_portfolio_component__WEBPACK_IMPORTED_MODULE_0__.PortfolioComponent
  }]
}, {
  path: 'Video',
  component: _portfolio_portfolio_component__WEBPACK_IMPORTED_MODULE_0__.PortfolioComponent,
  children: [{
    path: 'Motion Graphic',
    component: _portfolio_portfolio_component__WEBPACK_IMPORTED_MODULE_0__.PortfolioComponent
  }, {
    path: 'Video Editing',
    component: _portfolio_portfolio_component__WEBPACK_IMPORTED_MODULE_0__.PortfolioComponent
  }]
}, {
  path: 'Audio',
  component: _portfolio_portfolio_component__WEBPACK_IMPORTED_MODULE_0__.PortfolioComponent,
  children: [{
    path: 'Audio Engineering',
    component: _portfolio_portfolio_component__WEBPACK_IMPORTED_MODULE_0__.PortfolioComponent
  }, {
    path: 'Music',
    component: _portfolio_portfolio_component__WEBPACK_IMPORTED_MODULE_0__.PortfolioComponent
  }, {
    path: 'Voice Acting',
    component: _portfolio_portfolio_component__WEBPACK_IMPORTED_MODULE_0__.PortfolioComponent
  }]
}, {
  path: 'Others',
  component: _portfolio_portfolio_component__WEBPACK_IMPORTED_MODULE_0__.PortfolioComponent,
  children: [{
    path: 'Photography',
    component: _portfolio_portfolio_component__WEBPACK_IMPORTED_MODULE_0__.PortfolioComponent
  }, {
    path: 'Behind The Scenes',
    component: _portfolio_portfolio_component__WEBPACK_IMPORTED_MODULE_0__.PortfolioComponent
  }, {
    path: 'Me',
    component: _portfolio_portfolio_component__WEBPACK_IMPORTED_MODULE_0__.PortfolioComponent
  }]
}];
class AppRoutingModule {
  static #_ = this.ɵfac = function AppRoutingModule_Factory(t) {
    return new (t || AppRoutingModule)();
  };
  static #_2 = this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineNgModule"]({
    type: AppRoutingModule
  });
  static #_3 = this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjector"]({
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking'
    }), _angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule]
  });
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsetNgModuleScope"](AppRoutingModule, {
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule]
  });
})();

/***/ }),

/***/ 6846:
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppComponent: () => (/* binding */ AppComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 9936);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 8804);
/* harmony import */ var _nav_nav_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./nav/nav.component */ 5194);
/* harmony import */ var _contact_contact_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./contact/contact.component */ 2911);




class AppComponent {
  constructor() {
    this.title = 'portfolio-2024-all-skills';
  }
  static #_ = this.ɵfac = function AppComponent_Factory(t) {
    return new (t || AppComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
    type: AppComponent,
    selectors: [["app-root"]],
    decls: 5,
    vars: 0,
    consts: [[1, "appComponent"], [1, "portfolioBody"]],
    template: function AppComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "app-contact");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](3, "app-nav")(4, "router-outlet");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      }
    },
    dependencies: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterOutlet, _nav_nav_component__WEBPACK_IMPORTED_MODULE_0__.NavComponent, _contact_contact_component__WEBPACK_IMPORTED_MODULE_1__.ContactComponent],
    styles: [".appComponent[_ngcontent-%COMP%] {\n  display: flex;\n}\n.appComponent[_ngcontent-%COMP%]   app-contact[_ngcontent-%COMP%] {\n  position: sticky;\n  background-color: #d9d9d9;\n  height: 100vh;\n  top: 0;\n}\n.appComponent[_ngcontent-%COMP%]   .portfolioBody[_ngcontent-%COMP%] {\n  flex-grow: 1;\n}\n\n@media only screen and (max-width: 630px) {\n  .appComponent[_ngcontent-%COMP%] {\n    flex-direction: column;\n  }\n  .appComponent[_ngcontent-%COMP%]   app-contact[_ngcontent-%COMP%] {\n    position: inherit;\n    height: auto;\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvYXBwLmNvbXBvbmVudC5zY3NzIiwid2VicGFjazovLy4vLi4vLi4vY29tcHJlc3NlZCUyMGNvZGVzL3BvcnRmb2xpby0yMDI0LWFsbC1za2lsbHMvc3JjL2FwcC9hcHAuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxhQUFBO0FDQ0Y7QURDRTtFQUNFLGdCQUFBO0VBQ0EseUJBQUE7RUFDQSxhQUFBO0VBQ0EsTUFBQTtBQ0NKO0FERUU7RUFDRSxZQUFBO0FDQUo7O0FESUE7RUFDRTtJQUNFLHNCQUFBO0VDREY7RURHRTtJQUNFLGlCQUFBO0lBQ0EsWUFBQTtFQ0RKO0FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIuYXBwQ29tcG9uZW50IHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG5cclxuICBhcHAtY29udGFjdCB7XHJcbiAgICBwb3NpdGlvbjogc3RpY2t5O1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2Q5ZDlkOTtcclxuICAgIGhlaWdodDogMTAwdmg7XHJcbiAgICB0b3A6IDA7XHJcbiAgfVxyXG5cclxuICAucG9ydGZvbGlvQm9keSB7XHJcbiAgICBmbGV4LWdyb3c6IDE7XHJcbiAgfVxyXG59XHJcblxyXG5AbWVkaWEgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDYzMHB4KSB7XHJcbiAgLmFwcENvbXBvbmVudCB7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG5cclxuICAgIGFwcC1jb250YWN0IHtcclxuICAgICAgcG9zaXRpb246IGluaGVyaXQ7XHJcbiAgICAgIGhlaWdodDogYXV0bztcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiLmFwcENvbXBvbmVudCB7XG4gIGRpc3BsYXk6IGZsZXg7XG59XG4uYXBwQ29tcG9uZW50IGFwcC1jb250YWN0IHtcbiAgcG9zaXRpb246IHN0aWNreTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Q5ZDlkOTtcbiAgaGVpZ2h0OiAxMDB2aDtcbiAgdG9wOiAwO1xufVxuLmFwcENvbXBvbmVudCAucG9ydGZvbGlvQm9keSB7XG4gIGZsZXgtZ3JvdzogMTtcbn1cblxuQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA2MzBweCkge1xuICAuYXBwQ29tcG9uZW50IHtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICB9XG4gIC5hcHBDb21wb25lbnQgYXBwLWNvbnRhY3Qge1xuICAgIHBvc2l0aW9uOiBpbmhlcml0O1xuICAgIGhlaWdodDogYXV0bztcbiAgfVxufSJdLCJzb3VyY2VSb290IjoiIn0= */"]
  });
}

/***/ }),

/***/ 41:
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppModule: () => (/* binding */ AppModule)
/* harmony export */ });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/platform-browser */ 1081);
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app-routing.module */ 1838);
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app.component */ 6846);
/* harmony import */ var _nav_nav_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./nav/nav.component */ 5194);
/* harmony import */ var _contact_contact_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./contact/contact.component */ 2911);
/* harmony import */ var _sub_nav_sub_nav_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./sub-nav/sub-nav.component */ 7278);
/* harmony import */ var ngx_clipboard__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ngx-clipboard */ 5577);
/* harmony import */ var _portfolio_portfolio_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./portfolio/portfolio.component */ 6139);
/* harmony import */ var _card_card_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./card/card.component */ 2801);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 9936);











class AppModule {
  static #_ = this.ɵfac = function AppModule_Factory(t) {
    return new (t || AppModule)();
  };
  static #_2 = this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineNgModule"]({
    type: AppModule,
    bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_1__.AppComponent]
  });
  static #_3 = this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineInjector"]({
    providers: [(0,_angular_platform_browser__WEBPACK_IMPORTED_MODULE_8__.provideClientHydration)()],
    imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_8__.BrowserModule, _app_routing_module__WEBPACK_IMPORTED_MODULE_0__.AppRoutingModule,
    // libraries start
    ngx_clipboard__WEBPACK_IMPORTED_MODULE_9__.ClipboardModule]
  });
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵsetNgModuleScope"](AppModule, {
    declarations: [_app_component__WEBPACK_IMPORTED_MODULE_1__.AppComponent, _nav_nav_component__WEBPACK_IMPORTED_MODULE_2__.NavComponent, _contact_contact_component__WEBPACK_IMPORTED_MODULE_3__.ContactComponent,
    // main routes start
    _portfolio_portfolio_component__WEBPACK_IMPORTED_MODULE_5__.PortfolioComponent, _card_card_component__WEBPACK_IMPORTED_MODULE_6__.CardComponent, _sub_nav_sub_nav_component__WEBPACK_IMPORTED_MODULE_4__.SubNavComponent],
    imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_8__.BrowserModule, _app_routing_module__WEBPACK_IMPORTED_MODULE_0__.AppRoutingModule,
    // libraries start
    ngx_clipboard__WEBPACK_IMPORTED_MODULE_9__.ClipboardModule]
  });
})();

/***/ }),

/***/ 1463:
/*!**************************************!*\
  !*** ./src/app/app.server.module.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppServerModule: () => (/* binding */ AppServerModule)
/* harmony export */ });
/* harmony import */ var _angular_platform_server__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-server */ 7014);
/* harmony import */ var _app_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app.module */ 41);
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app.component */ 6846);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 9936);




class AppServerModule {
  static #_ = this.ɵfac = function AppServerModule_Factory(t) {
    return new (t || AppServerModule)();
  };
  static #_2 = this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({
    type: AppServerModule,
    bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_1__.AppComponent]
  });
  static #_3 = this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjector"]({
    imports: [_app_module__WEBPACK_IMPORTED_MODULE_0__.AppModule, _angular_platform_server__WEBPACK_IMPORTED_MODULE_3__.ServerModule]
  });
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsetNgModuleScope"](AppServerModule, {
    imports: [_app_module__WEBPACK_IMPORTED_MODULE_0__.AppModule, _angular_platform_server__WEBPACK_IMPORTED_MODULE_3__.ServerModule]
  });
})();

/***/ }),

/***/ 2801:
/*!****************************************!*\
  !*** ./src/app/card/card.component.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CardComponent: () => (/* binding */ CardComponent)
/* harmony export */ });
/* harmony import */ var _utils_project__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/project */ 8088);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 8804);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ 3410);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 9936);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 4228);






function CardComponent_div_0_a_1_div_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const tag_r4 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", tag_r4, " ");
  }
}
function CardComponent_div_0_a_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "a", 2)(1, "div", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](2, "img", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "div", 5)(4, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](9, CardComponent_div_0_a_1_div_9_Template, 2, 1, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const project_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("href", project_r1["link"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("src", project_r1["image"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](project_r1["title"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](project_r1["description"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", project_r1["tags"]);
  }
}
function CardComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, CardComponent_div_0_a_1_Template, 10, 5, "a", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const project_r1 = ctx.$implicit;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", project_r1["speciality"] == ctx_r0.Route);
  }
}
class CardComponent {
  constructor(route, router) {
    this.route = route;
    this.router = router;
    this.projectItems = _utils_project__WEBPACK_IMPORTED_MODULE_0__.PROJECTS;
    this.Route = '';
  }
  ngOnInit() {
    this.route.firstChild?.url.subscribe(segments => {
      if (segments.length > 0) {
        this.Route = segments[0].path;
        this.projectItems = _utils_project__WEBPACK_IMPORTED_MODULE_0__.PROJECTS.filter(project => project.speciality === this.Route);
      }
    });
    // Subscribe to the router events to detect navigation changes
    this.router.events.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.filter)(event => event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_3__.NavigationEnd)).subscribe(() => {
      // Use the child route to access the segment
      this.route.firstChild?.url.subscribe(segments => {
        if (segments.length > 0) {
          // Get the first segment, which corresponds to the child route segment
          this.Route = segments[0].path;
          this.projectItems = _utils_project__WEBPACK_IMPORTED_MODULE_0__.PROJECTS.filter(project => project.speciality === this.Route);
        }
      });
    });
  }
  static #_ = this.ɵfac = function CardComponent_Factory(t) {
    return new (t || CardComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__.Router));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: CardComponent,
    selectors: [["app-card"]],
    decls: 1,
    vars: 1,
    consts: [[4, "ngFor", "ngForOf"], ["class", "cardComponent", "target", "_blank", 3, "href", 4, "ngIf"], ["target", "_blank", 1, "cardComponent", 3, "href"], [1, "cardImage"], ["alt", "Project Image", 3, "src"], [1, "descriptionAndTags"], [1, "tags"], ["class", "tagElement", 4, "ngFor", "ngForOf"], [1, "tagElement"]],
    template: function CardComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](0, CardComponent_div_0_Template, 2, 1, "div", 0);
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.projectItems);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgIf],
    styles: [".cardComponent[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  text-align: center;\n  gap: 11px;\n  border: solid 1px #d9d9d9;\n  width: clamp(100px, 25vw, 219px);\n  padding-bottom: 15px;\n  color: #000;\n  text-decoration: none;\n}\n.cardComponent[_ngcontent-%COMP%]   .cardImage[_ngcontent-%COMP%] {\n  overflow: hidden;\n}\n.cardComponent[_ngcontent-%COMP%]   .cardImage[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: clamp(140px, 11vw, 140px);\n  object-fit: cover;\n}\n.cardComponent[_ngcontent-%COMP%]   .descriptionAndTags[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 11px;\n}\n.cardComponent[_ngcontent-%COMP%]   .descriptionAndTags[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 14px;\n  font-weight: 400;\n  transition: font-weight 0.2s ease-in-out;\n}\n.cardComponent[_ngcontent-%COMP%]   .descriptionAndTags[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: #565656;\n  padding: 0 10px;\n}\n.cardComponent[_ngcontent-%COMP%]   .descriptionAndTags[_ngcontent-%COMP%]   .tags[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  justify-content: center;\n  flex-wrap: wrap;\n  padding: 0 10px;\n}\n.cardComponent[_ngcontent-%COMP%]   .descriptionAndTags[_ngcontent-%COMP%]   .tags[_ngcontent-%COMP%]   .tagElement[_ngcontent-%COMP%] {\n  font-size: 10px;\n  font-weight: 700;\n  background-color: #5f5b58;\n  color: #fff;\n  padding: 5px 10px;\n  width: -moz-fit-content;\n  width: fit-content;\n}\n\n.cardComponent[_ngcontent-%COMP%]:hover   .descriptionAndTags[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-weight: 700;\n}\n\n@media only screen and (max-width: 990px) {\n  .cardComponent[_ngcontent-%COMP%] {\n    width: clamp(100px, 25vw, 219px);\n  }\n  .cardComponent[_ngcontent-%COMP%]   .cardImage[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n    height: clamp(140px, 17vw, 219px);\n  }\n}\n@media only screen and (max-width: 630px) {\n  .cardComponent[_ngcontent-%COMP%] {\n    width: 100%;\n    flex-direction: row;\n    gap: unset;\n    padding-bottom: 0;\n  }\n  .cardComponent[_ngcontent-%COMP%]   .cardImage[_ngcontent-%COMP%] {\n    width: clamp(140px, 45%, 300px);\n    height: 150px;\n  }\n  .cardComponent[_ngcontent-%COMP%]   .cardImage[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n    height: 100%;\n    width: 100%;\n  }\n  .cardComponent[_ngcontent-%COMP%]   .descriptionAndTags[_ngcontent-%COMP%] {\n    justify-content: center;\n    width: 160px;\n    flex-grow: 1;\n  }\n  .cardComponent[_ngcontent-%COMP%]   .descriptionAndTags[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n    justify-content: center;\n  }\n  .cardComponent[_ngcontent-%COMP%]   .descriptionAndTags[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], .cardComponent[_ngcontent-%COMP%]   .descriptionAndTags[_ngcontent-%COMP%]   .tags[_ngcontent-%COMP%] {\n    padding: 0 10px;\n  }\n  .cardComponent[_ngcontent-%COMP%]   .descriptionAndTags[_ngcontent-%COMP%]   .tags[_ngcontent-%COMP%]   .tagElement[_ngcontent-%COMP%] {\n    padding: 5px;\n  }\n}\n@media only screen and (max-width: 420px) {\n  .cardComponent[_ngcontent-%COMP%]   .cardImage[_ngcontent-%COMP%] {\n    height: 170px;\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvY2FyZC9jYXJkLmNvbXBvbmVudC5zY3NzIiwid2VicGFjazovLy4vLi4vLi4vY29tcHJlc3NlZCUyMGNvZGVzL3BvcnRmb2xpby0yMDI0LWFsbC1za2lsbHMvc3JjL2FwcC9jYXJkL2NhcmQuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxrQkFBQTtFQUNBLFNBQUE7RUFDQSx5QkFBQTtFQUNBLGdDQUFBO0VBQ0Esb0JBQUE7RUFDQSxXQUFBO0VBQ0EscUJBQUE7QUNDRjtBRENFO0VBQ0UsZ0JBQUE7QUNDSjtBRENJO0VBQ0UsV0FBQTtFQUNBLGlDQUFBO0VBQ0EsaUJBQUE7QUNDTjtBREdFO0VBQ0UsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsU0FBQTtBQ0RKO0FER0k7RUFDRSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSx3Q0FBQTtBQ0ROO0FESUk7RUFDRSxlQUFBO0VBQ0EsY0FBQTtFQUNBLGVBQUE7QUNGTjtBREtJO0VBQ0UsYUFBQTtFQUNBLFNBQUE7RUFDQSx1QkFBQTtFQUNBLGVBQUE7RUFDQSxlQUFBO0FDSE47QURLTTtFQUNFLGVBQUE7RUFDQSxnQkFBQTtFQUNBLHlCQUFBO0VBQ0EsV0FBQTtFQUNBLGlCQUFBO0VBQ0EsdUJBQUE7RUFBQSxrQkFBQTtBQ0hSOztBRFNBO0VBQ0UsZ0JBQUE7QUNORjs7QURTQTtFQUNFO0lBQ0UsZ0NBQUE7RUNORjtFRFNJO0lBQ0UsaUNBQUE7RUNQTjtBQUNGO0FEWUE7RUFDRTtJQUNFLFdBQUE7SUFDQSxtQkFBQTtJQUNBLFVBQUE7SUFDQSxpQkFBQTtFQ1ZGO0VEWUU7SUFDRSwrQkFBQTtJQUNBLGFBQUE7RUNWSjtFRFlJO0lBQ0UsWUFBQTtJQUNBLFdBQUE7RUNWTjtFRGNFO0lBQ0UsdUJBQUE7SUFDQSxZQUFBO0lBQ0EsWUFBQTtFQ1pKO0VEY0k7SUFDRSx1QkFBQTtFQ1pOO0VEZUk7O0lBRUUsZUFBQTtFQ2JOO0VEaUJNO0lBQ0UsWUFBQTtFQ2ZSO0FBQ0Y7QURxQkE7RUFFSTtJQUNFLGFBQUE7RUNwQko7QUFDRiIsInNvdXJjZXNDb250ZW50IjpbIi5jYXJkQ29tcG9uZW50IHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gIGdhcDogMTFweDtcclxuICBib3JkZXI6IHNvbGlkIDFweCAjZDlkOWQ5O1xyXG4gIHdpZHRoOiBjbGFtcCgxMDBweCwgMjV2dywgMjE5cHgpO1xyXG4gIHBhZGRpbmctYm90dG9tOiAxNXB4O1xyXG4gIGNvbG9yOiAjMDAwO1xyXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcclxuXHJcbiAgLmNhcmRJbWFnZSB7XHJcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xyXG5cclxuICAgIGltZyB7XHJcbiAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICBoZWlnaHQ6IGNsYW1wKDE0MHB4LCAxMXZ3LCAxNDBweCk7XHJcbiAgICAgIG9iamVjdC1maXQ6IGNvdmVyO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLmRlc2NyaXB0aW9uQW5kVGFncyB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGdhcDogMTFweDtcclxuXHJcbiAgICBoMiB7XHJcbiAgICAgIGZvbnQtc2l6ZTogMTRweDtcclxuICAgICAgZm9udC13ZWlnaHQ6IDQwMDtcclxuICAgICAgdHJhbnNpdGlvbjogZm9udC13ZWlnaHQgMC4ycyBlYXNlLWluLW91dDtcclxuICAgIH1cclxuXHJcbiAgICBwIHtcclxuICAgICAgZm9udC1zaXplOiAxMnB4O1xyXG4gICAgICBjb2xvcjogIzU2NTY1NjtcclxuICAgICAgcGFkZGluZzogMCAxMHB4O1xyXG4gICAgfVxyXG5cclxuICAgIC50YWdzIHtcclxuICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgZ2FwOiAxMHB4O1xyXG4gICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgICAgZmxleC13cmFwOiB3cmFwO1xyXG4gICAgICBwYWRkaW5nOiAwIDEwcHg7XHJcblxyXG4gICAgICAudGFnRWxlbWVudCB7XHJcbiAgICAgICAgZm9udC1zaXplOiAxMHB4O1xyXG4gICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogIzVmNWI1ODtcclxuICAgICAgICBjb2xvcjogI2ZmZjtcclxuICAgICAgICBwYWRkaW5nOiA1cHggMTBweDtcclxuICAgICAgICB3aWR0aDogZml0LWNvbnRlbnQ7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi5jYXJkQ29tcG9uZW50OmhvdmVyIC5kZXNjcmlwdGlvbkFuZFRhZ3MgaDIge1xyXG4gIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbn1cclxuXHJcbkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogOTkwcHgpIHtcclxuICAuY2FyZENvbXBvbmVudCB7XHJcbiAgICB3aWR0aDogY2xhbXAoMTAwcHgsIDI1dncsIDIxOXB4KTtcclxuXHJcbiAgICAuY2FyZEltYWdlIHtcclxuICAgICAgaW1nIHtcclxuICAgICAgICBoZWlnaHQ6IGNsYW1wKDE0MHB4LCAxN3Z3LCAyMTlweCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNjMwcHgpIHtcclxuICAuY2FyZENvbXBvbmVudCB7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgICBnYXA6IHVuc2V0O1xyXG4gICAgcGFkZGluZy1ib3R0b206IDA7XHJcblxyXG4gICAgLmNhcmRJbWFnZSB7XHJcbiAgICAgIHdpZHRoOiBjbGFtcCgxNDBweCwgNDUlLCAzMDBweCk7XHJcbiAgICAgIGhlaWdodDogMTUwcHg7XHJcblxyXG4gICAgICBpbWcge1xyXG4gICAgICAgIGhlaWdodDogMTAwJTtcclxuICAgICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC5kZXNjcmlwdGlvbkFuZFRhZ3Mge1xyXG4gICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgICAgd2lkdGg6IDE2MHB4O1xyXG4gICAgICBmbGV4LWdyb3c6IDE7XHJcblxyXG4gICAgICBoMiB7XHJcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHAsXHJcbiAgICAgIC50YWdzIHtcclxuICAgICAgICBwYWRkaW5nOiAwIDEwcHg7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC50YWdzIHtcclxuICAgICAgICAudGFnRWxlbWVudCB7XHJcbiAgICAgICAgICBwYWRkaW5nOiA1cHg7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5AbWVkaWEgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDQyMHB4KSB7XHJcbiAgLmNhcmRDb21wb25lbnQge1xyXG4gICAgLmNhcmRJbWFnZSB7XHJcbiAgICAgIGhlaWdodDogMTcwcHg7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIi5jYXJkQ29tcG9uZW50IHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBnYXA6IDExcHg7XG4gIGJvcmRlcjogc29saWQgMXB4ICNkOWQ5ZDk7XG4gIHdpZHRoOiBjbGFtcCgxMDBweCwgMjV2dywgMjE5cHgpO1xuICBwYWRkaW5nLWJvdHRvbTogMTVweDtcbiAgY29sb3I6ICMwMDA7XG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbn1cbi5jYXJkQ29tcG9uZW50IC5jYXJkSW1hZ2Uge1xuICBvdmVyZmxvdzogaGlkZGVuO1xufVxuLmNhcmRDb21wb25lbnQgLmNhcmRJbWFnZSBpbWcge1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiBjbGFtcCgxNDBweCwgMTF2dywgMTQwcHgpO1xuICBvYmplY3QtZml0OiBjb3Zlcjtcbn1cbi5jYXJkQ29tcG9uZW50IC5kZXNjcmlwdGlvbkFuZFRhZ3Mge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBnYXA6IDExcHg7XG59XG4uY2FyZENvbXBvbmVudCAuZGVzY3JpcHRpb25BbmRUYWdzIGgyIHtcbiAgZm9udC1zaXplOiAxNHB4O1xuICBmb250LXdlaWdodDogNDAwO1xuICB0cmFuc2l0aW9uOiBmb250LXdlaWdodCAwLjJzIGVhc2UtaW4tb3V0O1xufVxuLmNhcmRDb21wb25lbnQgLmRlc2NyaXB0aW9uQW5kVGFncyBwIHtcbiAgZm9udC1zaXplOiAxMnB4O1xuICBjb2xvcjogIzU2NTY1NjtcbiAgcGFkZGluZzogMCAxMHB4O1xufVxuLmNhcmRDb21wb25lbnQgLmRlc2NyaXB0aW9uQW5kVGFncyAudGFncyB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGdhcDogMTBweDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGZsZXgtd3JhcDogd3JhcDtcbiAgcGFkZGluZzogMCAxMHB4O1xufVxuLmNhcmRDb21wb25lbnQgLmRlc2NyaXB0aW9uQW5kVGFncyAudGFncyAudGFnRWxlbWVudCB7XG4gIGZvbnQtc2l6ZTogMTBweDtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzVmNWI1ODtcbiAgY29sb3I6ICNmZmY7XG4gIHBhZGRpbmc6IDVweCAxMHB4O1xuICB3aWR0aDogZml0LWNvbnRlbnQ7XG59XG5cbi5jYXJkQ29tcG9uZW50OmhvdmVyIC5kZXNjcmlwdGlvbkFuZFRhZ3MgaDIge1xuICBmb250LXdlaWdodDogNzAwO1xufVxuXG5AbWVkaWEgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDk5MHB4KSB7XG4gIC5jYXJkQ29tcG9uZW50IHtcbiAgICB3aWR0aDogY2xhbXAoMTAwcHgsIDI1dncsIDIxOXB4KTtcbiAgfVxuICAuY2FyZENvbXBvbmVudCAuY2FyZEltYWdlIGltZyB7XG4gICAgaGVpZ2h0OiBjbGFtcCgxNDBweCwgMTd2dywgMjE5cHgpO1xuICB9XG59XG5AbWVkaWEgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDYzMHB4KSB7XG4gIC5jYXJkQ29tcG9uZW50IHtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICAgIGdhcDogdW5zZXQ7XG4gICAgcGFkZGluZy1ib3R0b206IDA7XG4gIH1cbiAgLmNhcmRDb21wb25lbnQgLmNhcmRJbWFnZSB7XG4gICAgd2lkdGg6IGNsYW1wKDE0MHB4LCA0NSUsIDMwMHB4KTtcbiAgICBoZWlnaHQ6IDE1MHB4O1xuICB9XG4gIC5jYXJkQ29tcG9uZW50IC5jYXJkSW1hZ2UgaW1nIHtcbiAgICBoZWlnaHQ6IDEwMCU7XG4gICAgd2lkdGg6IDEwMCU7XG4gIH1cbiAgLmNhcmRDb21wb25lbnQgLmRlc2NyaXB0aW9uQW5kVGFncyB7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgd2lkdGg6IDE2MHB4O1xuICAgIGZsZXgtZ3JvdzogMTtcbiAgfVxuICAuY2FyZENvbXBvbmVudCAuZGVzY3JpcHRpb25BbmRUYWdzIGgyIHtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgfVxuICAuY2FyZENvbXBvbmVudCAuZGVzY3JpcHRpb25BbmRUYWdzIHAsXG4gIC5jYXJkQ29tcG9uZW50IC5kZXNjcmlwdGlvbkFuZFRhZ3MgLnRhZ3Mge1xuICAgIHBhZGRpbmc6IDAgMTBweDtcbiAgfVxuICAuY2FyZENvbXBvbmVudCAuZGVzY3JpcHRpb25BbmRUYWdzIC50YWdzIC50YWdFbGVtZW50IHtcbiAgICBwYWRkaW5nOiA1cHg7XG4gIH1cbn1cbkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNDIwcHgpIHtcbiAgLmNhcmRDb21wb25lbnQgLmNhcmRJbWFnZSB7XG4gICAgaGVpZ2h0OiAxNzBweDtcbiAgfVxufSJdLCJzb3VyY2VSb290IjoiIn0= */"]
  });
}

/***/ }),

/***/ 2911:
/*!**********************************************!*\
  !*** ./src/app/contact/contact.component.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ContactComponent: () => (/* binding */ ContactComponent)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ 8804);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs/operators */ 3410);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 9936);
/* harmony import */ var ngx_clipboard__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngx-clipboard */ 5577);





class ContactComponent {
  constructor(clipboardService, route, router) {
    this.clipboardService = clipboardService;
    this.route = route;
    this.router = router;
    this.Email = 'ahmad.berkdar.sy@gmail.com';
    this.Phone = '+963997518533';
    this.Route = '';
  }
  copyToClipboard(content) {
    this.clipboardService.copy(content);
    const element = document.getElementById('copiedToClipboard');
    element.style.opacity = '1';
    setTimeout(() => {
      element.style.opacity = '0';
    }, 500);
    // alert(`${content} \n is copied to clipboard`);
  }

  ngOnInit() {
    // Subscribe to the router events to detect navigation changes
    this.router.events.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_0__.filter)(event => event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_1__.NavigationEnd)).subscribe(() => {
      // Use the child route to access the segment
      this.route.firstChild?.url.subscribe(segments => {
        if (segments.length > 0) {
          // Get the first segment, which corresponds to the child route segment
          this.Route = segments[0].path;
        }
      });
    });
  }
  static #_ = this.ɵfac = function ContactComponent_Factory(t) {
    return new (t || ContactComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](ngx_clipboard__WEBPACK_IMPORTED_MODULE_3__.ClipboardService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_1__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_1__.Router));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
    type: ContactComponent,
    selectors: [["app-contact"]],
    decls: 33,
    vars: 8,
    consts: [[1, "contactComponent"], [1, "infoSection"], [1, "imageContainer"], ["src", "../../assets/images/ahmadbayrakdar photo.jpg", "alt", "author"], [1, "titleInfo"], [1, "contactSection"], [1, "icons"], [1, "emailMe", 3, "href", "click"], ["src", "../../assets/icons/iconmonstr-email-3.svg", "alt", "Email"], ["href", "https://www.youtube.com/@ahmadbayrakdar", "target", "_blank"], ["src", "../../assets/icons/iconmonstr-youtube-6.svg", "alt", "YouTube"], ["href", "https://wa.me/+963997518533", "target", "_blank"], ["src", "../../assets/icons/iconmonstr-whatsapp-1.svg", "alt", "WhatsApp"], [1, "callMe", 3, "href", "click"], ["src", "../../assets/icons/iconmonstr-phone-1.svg", "alt", "Call Me"], [1, "aboutMe"]],
    template: function ContactComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](3, "img", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "div", 4)(5, "h1");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6, "Ahmad Bayrakdar");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](9, "div", 5)(10, "div", 6)(11, "a", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function ContactComponent_Template_a_click_11_listener() {
          return ctx.copyToClipboard(ctx.Email);
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](12, "img", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](13, "a", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](14, "img", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](15, "a", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](16, "img", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](17, "a", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function ContactComponent_Template_a_click_17_listener() {
          return ctx.copyToClipboard(ctx.Phone);
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](18, "img", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](19, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](20, "Call Me");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](21, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](22, "ahmad.berkdar.sy@gmail.com");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](23, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](24, "+963997518533");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](25, "div", 15)(26, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](27, "Who I Am..");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](28, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](29, " Passionate Person.");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](30, "br")(31, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](32, " I spend most of my life learning and experimenting which makes me grateful to the amazing people who afforded us this new world of technology so we can apply our creativity to it. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate6"](" ", ctx.Route == "Programming" ? "Programmer" : "", " ", ctx.Route == "Design" ? "Designer" : "", " ", ctx.Route == "Video" ? "Video Editor" : "", " ", ctx.Route == "Audio" ? "Sound Engineer" : "", " ", ctx.Route == "Others" ? "Multi Skilled" : "", " ", ctx.Route ? "" : "Multi Skilled", " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("href", "mailto:" + ctx.Email, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsanitizeUrl"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("href", "tel:" + ctx.Phone, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsanitizeUrl"]);
      }
    },
    styles: [".contactComponent[_ngcontent-%COMP%] {\n  width: 261px;\n  height: 100vh;\n  background-color: #d9d9d9;\n  padding: 0 20px;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-evenly;\n  text-align: center;\n}\n.contactComponent[_ngcontent-%COMP%]   .infoSection[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n.contactComponent[_ngcontent-%COMP%]   .infoSection[_ngcontent-%COMP%]   .imageContainer[_ngcontent-%COMP%] {\n  width: 161px;\n  height: 161px;\n}\n.contactComponent[_ngcontent-%COMP%]   .infoSection[_ngcontent-%COMP%]   .imageContainer[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  border-radius: 50%;\n}\n.contactComponent[_ngcontent-%COMP%]   .infoSection[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-family: \"Bonheur Royale\";\n  font-size: 30px;\n  font-weight: 400;\n  margin-top: 30px;\n}\n.contactComponent[_ngcontent-%COMP%]   .infoSection[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 14px;\n  font-weight: 400;\n  margin-top: 7px;\n}\n.contactComponent[_ngcontent-%COMP%]   .contactSection[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n.contactComponent[_ngcontent-%COMP%]   .contactSection[_ngcontent-%COMP%]   .icons[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  padding: 0 10px;\n  display: inline-block;\n}\n.contactComponent[_ngcontent-%COMP%]   .contactSection[_ngcontent-%COMP%]   .emailMe[_ngcontent-%COMP%]   *[_ngcontent-%COMP%], .contactComponent[_ngcontent-%COMP%]   .contactSection[_ngcontent-%COMP%]   .callMe[_ngcontent-%COMP%]   *[_ngcontent-%COMP%] {\n  pointer-events: none;\n}\n.contactComponent[_ngcontent-%COMP%]   .contactSection[_ngcontent-%COMP%]   .callMe[_ngcontent-%COMP%] {\n  width: 181px;\n  padding: 10px;\n  background-color: #fff;\n  margin: 22px 0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  cursor: pointer;\n  text-decoration: none;\n  transition: filter 0.2s ease-in-out;\n}\n.contactComponent[_ngcontent-%COMP%]   .contactSection[_ngcontent-%COMP%]   .callMe[_ngcontent-%COMP%]   img[_ngcontent-%COMP%], .contactComponent[_ngcontent-%COMP%]   .contactSection[_ngcontent-%COMP%]   .callMe[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0 9px;\n}\n.contactComponent[_ngcontent-%COMP%]   .contactSection[_ngcontent-%COMP%]   .callMe[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: 700;\n  text-transform: uppercase;\n  color: #000;\n}\n.contactComponent[_ngcontent-%COMP%]   .contactSection[_ngcontent-%COMP%]   .callMe[_ngcontent-%COMP%]:hover {\n  filter: invert(1);\n}\n.contactComponent[_ngcontent-%COMP%]   .contactSection[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 12px;\n}\n.contactComponent[_ngcontent-%COMP%]   .contactSection[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]:last-of-type {\n  margin-top: 10px;\n}\n.contactComponent[_ngcontent-%COMP%]   .aboutMe[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-weight: 700;\n  font-size: 14px;\n}\n.contactComponent[_ngcontent-%COMP%]   .aboutMe[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 14px;\n}\n\n@media only screen and (max-height: 795px) {\n  .contactComponent[_ngcontent-%COMP%] {\n    width: 231px;\n  }\n  .contactComponent[_ngcontent-%COMP%]   .infoSection[_ngcontent-%COMP%]   .imageContainer[_ngcontent-%COMP%] {\n    width: 143px;\n    height: 143px;\n  }\n  .contactComponent[_ngcontent-%COMP%]   .aboutMe[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n    height: 90px;\n    text-overflow: ellipsis;\n    overflow: scroll;\n  }\n  .contactComponent[_ngcontent-%COMP%]   .aboutMe[_ngcontent-%COMP%]   [_ngcontent-%COMP%]::-webkit-scrollbar, .contactComponent[_ngcontent-%COMP%]   .aboutMe[_ngcontent-%COMP%]   [_ngcontent-%COMP%]::-webkit-scrollbar-corner {\n    background-color: #d9d9d9;\n    width: 7px;\n  }\n  .contactComponent[_ngcontent-%COMP%]   .aboutMe[_ngcontent-%COMP%]   [_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n    background-color: #000;\n  }\n}\n@media only screen and (max-width: 630px) {\n  .contactComponent[_ngcontent-%COMP%] {\n    width: 100%;\n    height: clamp(115px, 36vw, 140px);\n    flex-direction: row;\n    position: relative;\n  }\n  .contactComponent[_ngcontent-%COMP%]   .contactSection[_ngcontent-%COMP%] {\n    position: absolute;\n    width: 100%;\n    flex-direction: row;\n    justify-content: space-between;\n  }\n  .contactComponent[_ngcontent-%COMP%]   .contactSection[_ngcontent-%COMP%]   .callMe[_ngcontent-%COMP%] {\n    margin: 0;\n  }\n  .contactComponent[_ngcontent-%COMP%]   .contactSection[_ngcontent-%COMP%]   .icons[_ngcontent-%COMP%], .contactComponent[_ngcontent-%COMP%]   .contactSection[_ngcontent-%COMP%]   .callMe[_ngcontent-%COMP%] {\n    flex-grow: 1;\n    width: auto;\n  }\n  .contactComponent[_ngcontent-%COMP%]   .contactSection[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n    display: none;\n  }\n  .contactComponent[_ngcontent-%COMP%]   .infoSection[_ngcontent-%COMP%] {\n    margin-top: 44px;\n    flex-direction: row;\n  }\n  .contactComponent[_ngcontent-%COMP%]   .infoSection[_ngcontent-%COMP%]   .imageContainer[_ngcontent-%COMP%] {\n    width: 77px;\n    height: 77px;\n  }\n  .contactComponent[_ngcontent-%COMP%]   .infoSection[_ngcontent-%COMP%]   .titleInfo[_ngcontent-%COMP%] {\n    display: flex;\n    flex-direction: column;\n    align-items: start;\n    margin-left: 27px;\n  }\n  .contactComponent[_ngcontent-%COMP%]   .infoSection[_ngcontent-%COMP%]   .titleInfo[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%], .contactComponent[_ngcontent-%COMP%]   .infoSection[_ngcontent-%COMP%]   .titleInfo[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n    margin: 0;\n  }\n  .contactComponent[_ngcontent-%COMP%]   .aboutMe[_ngcontent-%COMP%] {\n    display: none;\n  }\n}\n@media only screen and (max-width: 420px) {\n  .contactComponent[_ngcontent-%COMP%]   .infoSection[_ngcontent-%COMP%]   .imageContainer[_ngcontent-%COMP%] {\n    width: 64px;\n    height: 64px;\n  }\n  .contactComponent[_ngcontent-%COMP%]   .infoSection[_ngcontent-%COMP%]   .titleInfo[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n    font-size: 20px;\n  }\n  .contactComponent[_ngcontent-%COMP%]   .infoSection[_ngcontent-%COMP%]   .titleInfo[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n    font-size: 12px;\n  }\n  .contactComponent[_ngcontent-%COMP%]   .contactSection[_ngcontent-%COMP%]   .callMe[_ngcontent-%COMP%]:hover {\n    filter: none;\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvY29udGFjdC9jb250YWN0LmNvbXBvbmVudC5zY3NzIiwid2VicGFjazovLy4vLi4vLi4vY29tcHJlc3NlZCUyMGNvZGVzL3BvcnRmb2xpby0yMDI0LWFsbC1za2lsbHMvc3JjL2FwcC9jb250YWN0L2NvbnRhY3QuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxZQUFBO0VBQ0EsYUFBQTtFQUNBLHlCQUFBO0VBQ0EsZUFBQTtFQUNBLGFBQUE7RUFDQSxzQkFBQTtFQUNBLDZCQUFBO0VBQ0Esa0JBQUE7QUNDRjtBRENFO0VBQ0UsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsbUJBQUE7QUNDSjtBRENJO0VBQ0UsWUFBQTtFQUNBLGFBQUE7QUNDTjtBRENNO0VBQ0UsV0FBQTtFQUNBLFlBQUE7RUFDQSxrQkFBQTtBQ0NSO0FER0k7RUFDRSw2QkFBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtFQUNBLGdCQUFBO0FDRE47QURJSTtFQUNFLGVBQUE7RUFDQSxnQkFBQTtFQUNBLGVBQUE7QUNGTjtBRE1FO0VBQ0UsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsbUJBQUE7QUNKSjtBRE9NO0VBQ0UsZUFBQTtFQUNBLHFCQUFBO0FDTFI7QURTSTs7RUFFRSxvQkFBQTtBQ1BOO0FEVUk7RUFDRSxZQUFBO0VBRUEsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsY0FBQTtFQUNBLGFBQUE7RUFDQSx1QkFBQTtFQUNBLG1CQUFBO0VBQ0EsZUFBQTtFQUNBLHFCQUFBO0VBQ0EsbUNBQUE7QUNUTjtBRFdNOztFQUVFLGFBQUE7QUNUUjtBRFlNO0VBQ0UsZUFBQTtFQUNBLGdCQUFBO0VBQ0EseUJBQUE7RUFDQSxXQUFBO0FDVlI7QURjSTtFQUNFLGlCQUFBO0FDWk47QURlSTtFQUNFLGVBQUE7QUNiTjtBRGdCSTtFQUNFLGdCQUFBO0FDZE47QURtQkk7RUFDRSxnQkFBQTtFQUNBLGVBQUE7QUNqQk47QURtQkk7RUFDRSxlQUFBO0FDakJOOztBRHNCQTtFQUNFO0lBQ0UsWUFBQTtFQ25CRjtFRHNCSTtJQUNFLFlBQUE7SUFDQSxhQUFBO0VDcEJOO0VEeUJJO0lBQ0UsWUFBQTtJQUNBLHVCQUFBO0lBQ0EsZ0JBQUE7RUN2Qk47RUR5Qkk7O0lBRUUseUJBQUE7SUFDQSxVQUFBO0VDdkJOO0VEeUJJO0lBQ0Usc0JBQUE7RUN2Qk47QUFDRjtBRDRCQTtFQUNFO0lBQ0UsV0FBQTtJQUNBLGlDQUFBO0lBQ0EsbUJBQUE7SUFDQSxrQkFBQTtFQzFCRjtFRDRCRTtJQUNFLGtCQUFBO0lBQ0EsV0FBQTtJQUNBLG1CQUFBO0lBQ0EsOEJBQUE7RUMxQko7RUQ0Qkk7SUFDRSxTQUFBO0VDMUJOO0VENkJJOztJQUVFLFlBQUE7SUFDQSxXQUFBO0VDM0JOO0VEOEJJO0lBQ0UsYUFBQTtFQzVCTjtFRGdDRTtJQUNFLGdCQUFBO0lBQ0EsbUJBQUE7RUM5Qko7RURnQ0k7SUFDRSxXQUFBO0lBQ0EsWUFBQTtFQzlCTjtFRGlDSTtJQUNFLGFBQUE7SUFDQSxzQkFBQTtJQUNBLGtCQUFBO0lBQ0EsaUJBQUE7RUMvQk47RURpQ007O0lBRUUsU0FBQTtFQy9CUjtFRG9DRTtJQUNFLGFBQUE7RUNsQ0o7QUFDRjtBRHNDQTtFQUdNO0lBQ0UsV0FBQTtJQUNBLFlBQUE7RUN0Q047RUQyQ007SUFDRSxlQUFBO0VDekNSO0VEMkNNO0lBQ0UsZUFBQTtFQ3pDUjtFRDhDSTtJQUNFLFlBQUE7RUM1Q047QUFDRiIsInNvdXJjZXNDb250ZW50IjpbIi5jb250YWN0Q29tcG9uZW50IHtcclxuICB3aWR0aDogMjYxcHg7XHJcbiAgaGVpZ2h0OiAxMDB2aDtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZDlkOWQ5O1xyXG4gIHBhZGRpbmc6IDAgMjBweDtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XHJcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG5cclxuICAuaW5mb1NlY3Rpb24ge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG5cclxuICAgIC5pbWFnZUNvbnRhaW5lciB7XHJcbiAgICAgIHdpZHRoOiAxNjFweDtcclxuICAgICAgaGVpZ2h0OiAxNjFweDtcclxuXHJcbiAgICAgIGltZyB7XHJcbiAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGgxIHtcclxuICAgICAgZm9udC1mYW1pbHk6IFwiQm9uaGV1ciBSb3lhbGVcIjtcclxuICAgICAgZm9udC1zaXplOiAzMHB4O1xyXG4gICAgICBmb250LXdlaWdodDogNDAwO1xyXG4gICAgICBtYXJnaW4tdG9wOiAzMHB4O1xyXG4gICAgfVxyXG5cclxuICAgIGgyIHtcclxuICAgICAgZm9udC1zaXplOiAxNHB4O1xyXG4gICAgICBmb250LXdlaWdodDogNDAwO1xyXG4gICAgICBtYXJnaW4tdG9wOiA3cHg7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAuY29udGFjdFNlY3Rpb24ge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG5cclxuICAgIC5pY29ucyB7XHJcbiAgICAgIGEge1xyXG4gICAgICAgIHBhZGRpbmc6IDAgMTBweDtcclxuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAuZW1haWxNZSAqLFxyXG4gICAgLmNhbGxNZSAqIHtcclxuICAgICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XHJcbiAgICB9XHJcblxyXG4gICAgLmNhbGxNZSB7XHJcbiAgICAgIHdpZHRoOiAxODFweDtcclxuICAgICAgLy8gaGVpZ2h0OiA0NHB4O1xyXG4gICAgICBwYWRkaW5nOiAxMHB4O1xyXG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xyXG4gICAgICBtYXJnaW46IDIycHggMDtcclxuICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xyXG4gICAgICB0cmFuc2l0aW9uOiBmaWx0ZXIgMC4ycyBlYXNlLWluLW91dDtcclxuXHJcbiAgICAgIGltZyxcclxuICAgICAgaDMge1xyXG4gICAgICAgIG1hcmdpbjogMCA5cHg7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGgzIHtcclxuICAgICAgICBmb250LXNpemU6IDEycHg7XHJcbiAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgICAgIGNvbG9yOiAjMDAwO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLmNhbGxNZTpob3ZlciB7XHJcbiAgICAgIGZpbHRlcjogaW52ZXJ0KDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHAge1xyXG4gICAgICBmb250LXNpemU6IDEycHg7XHJcbiAgICB9XHJcblxyXG4gICAgcDpsYXN0LW9mLXR5cGUge1xyXG4gICAgICBtYXJnaW4tdG9wOiAxMHB4O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLmFib3V0TWUge1xyXG4gICAgaDIge1xyXG4gICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICBmb250LXNpemU6IDE0cHg7XHJcbiAgICB9XHJcbiAgICBwIHtcclxuICAgICAgZm9udC1zaXplOiAxNHB4O1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LWhlaWdodDogNzk1cHgpIHtcclxuICAuY29udGFjdENvbXBvbmVudCB7XHJcbiAgICB3aWR0aDogMjMxcHg7XHJcblxyXG4gICAgLmluZm9TZWN0aW9uIHtcclxuICAgICAgLmltYWdlQ29udGFpbmVyIHtcclxuICAgICAgICB3aWR0aDogMTQzcHg7XHJcbiAgICAgICAgaGVpZ2h0OiAxNDNweDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC5hYm91dE1lIHtcclxuICAgICAgcCB7XHJcbiAgICAgICAgaGVpZ2h0OiA5MHB4O1xyXG4gICAgICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xyXG4gICAgICAgIG92ZXJmbG93OiBzY3JvbGw7XHJcbiAgICAgIH1cclxuICAgICAgOjotd2Via2l0LXNjcm9sbGJhcixcclxuICAgICAgOjotd2Via2l0LXNjcm9sbGJhci1jb3JuZXIge1xyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNkOWQ5ZDk7XHJcbiAgICAgICAgd2lkdGg6IDdweDtcclxuICAgICAgfVxyXG4gICAgICA6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5AbWVkaWEgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDYzMHB4KSB7XHJcbiAgLmNvbnRhY3RDb21wb25lbnQge1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBoZWlnaHQ6IGNsYW1wKDExNXB4LCAzNnZ3LCAxNDBweCk7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG5cclxuICAgIC5jb250YWN0U2VjdGlvbiB7XHJcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuXHJcbiAgICAgIC5jYWxsTWUge1xyXG4gICAgICAgIG1hcmdpbjogMDtcclxuICAgICAgfVxyXG5cclxuICAgICAgLmljb25zLFxyXG4gICAgICAuY2FsbE1lIHtcclxuICAgICAgICBmbGV4LWdyb3c6IDE7XHJcbiAgICAgICAgd2lkdGg6IGF1dG87XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHAge1xyXG4gICAgICAgIGRpc3BsYXk6IG5vbmU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAuaW5mb1NlY3Rpb24ge1xyXG4gICAgICBtYXJnaW4tdG9wOiA0NHB4O1xyXG4gICAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xyXG5cclxuICAgICAgLmltYWdlQ29udGFpbmVyIHtcclxuICAgICAgICB3aWR0aDogNzdweDtcclxuICAgICAgICBoZWlnaHQ6IDc3cHg7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC50aXRsZUluZm8ge1xyXG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgICAgICBhbGlnbi1pdGVtczogc3RhcnQ7XHJcbiAgICAgICAgbWFyZ2luLWxlZnQ6IDI3cHg7XHJcblxyXG4gICAgICAgIGgxLFxyXG4gICAgICAgIGgyIHtcclxuICAgICAgICAgIG1hcmdpbjogMDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAuYWJvdXRNZSB7XHJcbiAgICAgIGRpc3BsYXk6IG5vbmU7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5AbWVkaWEgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDQyMHB4KSB7XHJcbiAgLmNvbnRhY3RDb21wb25lbnQge1xyXG4gICAgLmluZm9TZWN0aW9uIHtcclxuICAgICAgLmltYWdlQ29udGFpbmVyIHtcclxuICAgICAgICB3aWR0aDogNjRweDtcclxuICAgICAgICBoZWlnaHQ6IDY0cHg7XHJcbiAgICAgICAgaW1nIHtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgLnRpdGxlSW5mbyB7XHJcbiAgICAgICAgaDEge1xyXG4gICAgICAgICAgZm9udC1zaXplOiAyMHB4O1xyXG4gICAgICAgIH1cclxuICAgICAgICBoMiB7XHJcbiAgICAgICAgICBmb250LXNpemU6IDEycHg7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAuY29udGFjdFNlY3Rpb24ge1xyXG4gICAgICAuY2FsbE1lOmhvdmVyIHtcclxuICAgICAgICBmaWx0ZXI6IG5vbmU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiLmNvbnRhY3RDb21wb25lbnQge1xuICB3aWR0aDogMjYxcHg7XG4gIGhlaWdodDogMTAwdmg7XG4gIGJhY2tncm91bmQtY29sb3I6ICNkOWQ5ZDk7XG4gIHBhZGRpbmc6IDAgMjBweDtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbn1cbi5jb250YWN0Q29tcG9uZW50IC5pbmZvU2VjdGlvbiB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG4uY29udGFjdENvbXBvbmVudCAuaW5mb1NlY3Rpb24gLmltYWdlQ29udGFpbmVyIHtcbiAgd2lkdGg6IDE2MXB4O1xuICBoZWlnaHQ6IDE2MXB4O1xufVxuLmNvbnRhY3RDb21wb25lbnQgLmluZm9TZWN0aW9uIC5pbWFnZUNvbnRhaW5lciBpbWcge1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xuICBib3JkZXItcmFkaXVzOiA1MCU7XG59XG4uY29udGFjdENvbXBvbmVudCAuaW5mb1NlY3Rpb24gaDEge1xuICBmb250LWZhbWlseTogXCJCb25oZXVyIFJveWFsZVwiO1xuICBmb250LXNpemU6IDMwcHg7XG4gIGZvbnQtd2VpZ2h0OiA0MDA7XG4gIG1hcmdpbi10b3A6IDMwcHg7XG59XG4uY29udGFjdENvbXBvbmVudCAuaW5mb1NlY3Rpb24gaDIge1xuICBmb250LXNpemU6IDE0cHg7XG4gIGZvbnQtd2VpZ2h0OiA0MDA7XG4gIG1hcmdpbi10b3A6IDdweDtcbn1cbi5jb250YWN0Q29tcG9uZW50IC5jb250YWN0U2VjdGlvbiB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG4uY29udGFjdENvbXBvbmVudCAuY29udGFjdFNlY3Rpb24gLmljb25zIGEge1xuICBwYWRkaW5nOiAwIDEwcHg7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbn1cbi5jb250YWN0Q29tcG9uZW50IC5jb250YWN0U2VjdGlvbiAuZW1haWxNZSAqLFxuLmNvbnRhY3RDb21wb25lbnQgLmNvbnRhY3RTZWN0aW9uIC5jYWxsTWUgKiB7XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xufVxuLmNvbnRhY3RDb21wb25lbnQgLmNvbnRhY3RTZWN0aW9uIC5jYWxsTWUge1xuICB3aWR0aDogMTgxcHg7XG4gIHBhZGRpbmc6IDEwcHg7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XG4gIG1hcmdpbjogMjJweCAwO1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gIHRyYW5zaXRpb246IGZpbHRlciAwLjJzIGVhc2UtaW4tb3V0O1xufVxuLmNvbnRhY3RDb21wb25lbnQgLmNvbnRhY3RTZWN0aW9uIC5jYWxsTWUgaW1nLFxuLmNvbnRhY3RDb21wb25lbnQgLmNvbnRhY3RTZWN0aW9uIC5jYWxsTWUgaDMge1xuICBtYXJnaW46IDAgOXB4O1xufVxuLmNvbnRhY3RDb21wb25lbnQgLmNvbnRhY3RTZWN0aW9uIC5jYWxsTWUgaDMge1xuICBmb250LXNpemU6IDEycHg7XG4gIGZvbnQtd2VpZ2h0OiA3MDA7XG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gIGNvbG9yOiAjMDAwO1xufVxuLmNvbnRhY3RDb21wb25lbnQgLmNvbnRhY3RTZWN0aW9uIC5jYWxsTWU6aG92ZXIge1xuICBmaWx0ZXI6IGludmVydCgxKTtcbn1cbi5jb250YWN0Q29tcG9uZW50IC5jb250YWN0U2VjdGlvbiBwIHtcbiAgZm9udC1zaXplOiAxMnB4O1xufVxuLmNvbnRhY3RDb21wb25lbnQgLmNvbnRhY3RTZWN0aW9uIHA6bGFzdC1vZi10eXBlIHtcbiAgbWFyZ2luLXRvcDogMTBweDtcbn1cbi5jb250YWN0Q29tcG9uZW50IC5hYm91dE1lIGgyIHtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgZm9udC1zaXplOiAxNHB4O1xufVxuLmNvbnRhY3RDb21wb25lbnQgLmFib3V0TWUgcCB7XG4gIGZvbnQtc2l6ZTogMTRweDtcbn1cblxuQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LWhlaWdodDogNzk1cHgpIHtcbiAgLmNvbnRhY3RDb21wb25lbnQge1xuICAgIHdpZHRoOiAyMzFweDtcbiAgfVxuICAuY29udGFjdENvbXBvbmVudCAuaW5mb1NlY3Rpb24gLmltYWdlQ29udGFpbmVyIHtcbiAgICB3aWR0aDogMTQzcHg7XG4gICAgaGVpZ2h0OiAxNDNweDtcbiAgfVxuICAuY29udGFjdENvbXBvbmVudCAuYWJvdXRNZSBwIHtcbiAgICBoZWlnaHQ6IDkwcHg7XG4gICAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XG4gICAgb3ZlcmZsb3c6IHNjcm9sbDtcbiAgfVxuICAuY29udGFjdENvbXBvbmVudCAuYWJvdXRNZSA6Oi13ZWJraXQtc2Nyb2xsYmFyLFxuICAuY29udGFjdENvbXBvbmVudCAuYWJvdXRNZSA6Oi13ZWJraXQtc2Nyb2xsYmFyLWNvcm5lciB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2Q5ZDlkOTtcbiAgICB3aWR0aDogN3B4O1xuICB9XG4gIC5jb250YWN0Q29tcG9uZW50IC5hYm91dE1lIDo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWIge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICMwMDA7XG4gIH1cbn1cbkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNjMwcHgpIHtcbiAgLmNvbnRhY3RDb21wb25lbnQge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGhlaWdodDogY2xhbXAoMTE1cHgsIDM2dncsIDE0MHB4KTtcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgfVxuICAuY29udGFjdENvbXBvbmVudCAuY29udGFjdFNlY3Rpb24ge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgfVxuICAuY29udGFjdENvbXBvbmVudCAuY29udGFjdFNlY3Rpb24gLmNhbGxNZSB7XG4gICAgbWFyZ2luOiAwO1xuICB9XG4gIC5jb250YWN0Q29tcG9uZW50IC5jb250YWN0U2VjdGlvbiAuaWNvbnMsXG4gIC5jb250YWN0Q29tcG9uZW50IC5jb250YWN0U2VjdGlvbiAuY2FsbE1lIHtcbiAgICBmbGV4LWdyb3c6IDE7XG4gICAgd2lkdGg6IGF1dG87XG4gIH1cbiAgLmNvbnRhY3RDb21wb25lbnQgLmNvbnRhY3RTZWN0aW9uIHAge1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gIH1cbiAgLmNvbnRhY3RDb21wb25lbnQgLmluZm9TZWN0aW9uIHtcbiAgICBtYXJnaW4tdG9wOiA0NHB4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gIH1cbiAgLmNvbnRhY3RDb21wb25lbnQgLmluZm9TZWN0aW9uIC5pbWFnZUNvbnRhaW5lciB7XG4gICAgd2lkdGg6IDc3cHg7XG4gICAgaGVpZ2h0OiA3N3B4O1xuICB9XG4gIC5jb250YWN0Q29tcG9uZW50IC5pbmZvU2VjdGlvbiAudGl0bGVJbmZvIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgYWxpZ24taXRlbXM6IHN0YXJ0O1xuICAgIG1hcmdpbi1sZWZ0OiAyN3B4O1xuICB9XG4gIC5jb250YWN0Q29tcG9uZW50IC5pbmZvU2VjdGlvbiAudGl0bGVJbmZvIGgxLFxuICAuY29udGFjdENvbXBvbmVudCAuaW5mb1NlY3Rpb24gLnRpdGxlSW5mbyBoMiB7XG4gICAgbWFyZ2luOiAwO1xuICB9XG4gIC5jb250YWN0Q29tcG9uZW50IC5hYm91dE1lIHtcbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG59XG5AbWVkaWEgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDQyMHB4KSB7XG4gIC5jb250YWN0Q29tcG9uZW50IC5pbmZvU2VjdGlvbiAuaW1hZ2VDb250YWluZXIge1xuICAgIHdpZHRoOiA2NHB4O1xuICAgIGhlaWdodDogNjRweDtcbiAgfVxuICAuY29udGFjdENvbXBvbmVudCAuaW5mb1NlY3Rpb24gLnRpdGxlSW5mbyBoMSB7XG4gICAgZm9udC1zaXplOiAyMHB4O1xuICB9XG4gIC5jb250YWN0Q29tcG9uZW50IC5pbmZvU2VjdGlvbiAudGl0bGVJbmZvIGgyIHtcbiAgICBmb250LXNpemU6IDEycHg7XG4gIH1cbiAgLmNvbnRhY3RDb21wb25lbnQgLmNvbnRhY3RTZWN0aW9uIC5jYWxsTWU6aG92ZXIge1xuICAgIGZpbHRlcjogbm9uZTtcbiAgfVxufSJdLCJzb3VyY2VSb290IjoiIn0= */"]
  });
}

/***/ }),

/***/ 5194:
/*!**************************************!*\
  !*** ./src/app/nav/nav.component.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NavComponent: () => (/* binding */ NavComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 9936);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ 8804);


class NavComponent {
  static #_ = this.ɵfac = function NavComponent_Factory(t) {
    return new (t || NavComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
    type: NavComponent,
    selectors: [["app-nav"]],
    decls: 22,
    vars: 0,
    consts: [[1, "navComponent", "desktop"], ["routerLink", "/Programming", "routerLinkActive", "active"], ["routerLink", "/Design", "routerLinkActive", "active"], ["routerLink", "/Video", "routerLinkActive", "active"], ["routerLink", "/Audio", "routerLinkActive", "active"], ["routerLink", "/Others", "routerLinkActive", "active"], [1, "navComponent", "tablet"]],
    template: function NavComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "a", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, " Programming & Engineering ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, "Design & Art");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "a", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, "Video & Motion");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "a", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "Audio & Songs");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "a", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10, "Others");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "div", 6)(12, "a", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, " Programming ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "Design");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "a", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, "Video");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "a", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](19, "Audio");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "a", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](21, "Others");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      }
    },
    dependencies: [_angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterLink, _angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterLinkActive],
    styles: [".navComponent[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  justify-content: space-between;\n  background-color: #5f5b58;\n  height: 122px;\n}\n.navComponent[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  text-decoration: none;\n  color: #fff;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  text-align: center;\n  flex-grow: 1;\n  font-size: 16px;\n  transition: all 0.2s ease-in-out;\n  padding: 0 10px;\n}\n.navComponent[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  background-color: #545251;\n}\n.navComponent[_ngcontent-%COMP%]   a.active[_ngcontent-%COMP%] {\n  background-color: #000;\n}\n\n.navComponent.tablet[_ngcontent-%COMP%] {\n  display: none;\n}\n.navComponent.tablet[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  font-size: 14px;\n  flex-grow: 1;\n}\n\n@media only screen and (max-width: 990px) {\n  .navComponent.desktop[_ngcontent-%COMP%] {\n    display: none;\n  }\n  .navComponent.tablet[_ngcontent-%COMP%] {\n    display: flex;\n  }\n}\n@media only screen and (max-width: 420px) {\n  .navComponent.tablet[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n    font-size: 12px;\n    padding: 0 5px;\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbmF2L25hdi5jb21wb25lbnQuc2NzcyIsIndlYnBhY2s6Ly8uLy4uLy4uL2NvbXByZXNzZWQlMjBjb2Rlcy9wb3J0Zm9saW8tMjAyNC1hbGwtc2tpbGxzL3NyYy9hcHAvbmF2L25hdi5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLFdBQUE7RUFDQSxhQUFBO0VBQ0EsOEJBQUE7RUFDQSx5QkFBQTtFQUNBLGFBQUE7QUNDRjtBRENFO0VBQ0UscUJBQUE7RUFDQSxXQUFBO0VBQ0EsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7RUFDQSxrQkFBQTtFQUNBLFlBQUE7RUFDQSxlQUFBO0VBQ0EsZ0NBQUE7RUFDQSxlQUFBO0FDQ0o7QURFRTtFQUNFLHlCQUFBO0FDQUo7QURHRTtFQUNFLHNCQUFBO0FDREo7O0FES0E7RUFDRSxhQUFBO0FDRkY7QURJRTtFQUNFLGVBQUE7RUFDQSxZQUFBO0FDRko7O0FETUE7RUFDRTtJQUNFLGFBQUE7RUNIRjtFREtBO0lBQ0UsYUFBQTtFQ0hGO0FBQ0Y7QURNQTtFQUVJO0lBQ0UsZUFBQTtJQUNBLGNBQUE7RUNMSjtBQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLm5hdkNvbXBvbmVudCB7XHJcbiAgd2lkdGg6IDEwMCU7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogIzVmNWI1ODtcclxuICBoZWlnaHQ6IDEyMnB4O1xyXG5cclxuICBhIHtcclxuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcclxuICAgIGNvbG9yOiAjZmZmO1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgIGZsZXgtZ3JvdzogMTtcclxuICAgIGZvbnQtc2l6ZTogMTZweDtcclxuICAgIHRyYW5zaXRpb246IGFsbCAwLjJzIGVhc2UtaW4tb3V0O1xyXG4gICAgcGFkZGluZzogMCAxMHB4O1xyXG4gIH1cclxuXHJcbiAgYTpob3ZlciB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjNTQ1MjUxO1xyXG4gIH1cclxuXHJcbiAgYS5hY3RpdmUge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDtcclxuICB9XHJcbn1cclxuXHJcbi5uYXZDb21wb25lbnQudGFibGV0IHtcclxuICBkaXNwbGF5OiBub25lO1xyXG5cclxuICBhIHtcclxuICAgIGZvbnQtc2l6ZTogMTRweDtcclxuICAgIGZsZXgtZ3JvdzogMTtcclxuICB9XHJcbn1cclxuXHJcbkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogOTkwcHgpIHtcclxuICAubmF2Q29tcG9uZW50LmRlc2t0b3Age1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxuICB9XHJcbiAgLm5hdkNvbXBvbmVudC50YWJsZXQge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICB9XHJcbn1cclxuXHJcbkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNDIwcHgpIHtcclxuICAubmF2Q29tcG9uZW50LnRhYmxldCB7XHJcbiAgICBhIHtcclxuICAgICAgZm9udC1zaXplOiAxMnB4O1xyXG4gICAgICBwYWRkaW5nOiAwIDVweDtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiLm5hdkNvbXBvbmVudCB7XG4gIHdpZHRoOiAxMDAlO1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIGJhY2tncm91bmQtY29sb3I6ICM1ZjViNTg7XG4gIGhlaWdodDogMTIycHg7XG59XG4ubmF2Q29tcG9uZW50IGEge1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gIGNvbG9yOiAjZmZmO1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBmbGV4LWdyb3c6IDE7XG4gIGZvbnQtc2l6ZTogMTZweDtcbiAgdHJhbnNpdGlvbjogYWxsIDAuMnMgZWFzZS1pbi1vdXQ7XG4gIHBhZGRpbmc6IDAgMTBweDtcbn1cbi5uYXZDb21wb25lbnQgYTpob3ZlciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICM1NDUyNTE7XG59XG4ubmF2Q29tcG9uZW50IGEuYWN0aXZlIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDtcbn1cblxuLm5hdkNvbXBvbmVudC50YWJsZXQge1xuICBkaXNwbGF5OiBub25lO1xufVxuLm5hdkNvbXBvbmVudC50YWJsZXQgYSB7XG4gIGZvbnQtc2l6ZTogMTRweDtcbiAgZmxleC1ncm93OiAxO1xufVxuXG5AbWVkaWEgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDk5MHB4KSB7XG4gIC5uYXZDb21wb25lbnQuZGVza3RvcCB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgfVxuICAubmF2Q29tcG9uZW50LnRhYmxldCB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgfVxufVxuQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA0MjBweCkge1xuICAubmF2Q29tcG9uZW50LnRhYmxldCBhIHtcbiAgICBmb250LXNpemU6IDEycHg7XG4gICAgcGFkZGluZzogMCA1cHg7XG4gIH1cbn0iXSwic291cmNlUm9vdCI6IiJ9 */"]
  });
}

/***/ }),

/***/ 6139:
/*!**************************************************!*\
  !*** ./src/app/portfolio/portfolio.component.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PortfolioComponent: () => (/* binding */ PortfolioComponent)
/* harmony export */ });
/* harmony import */ var _utils_routes_names__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/routes-names */ 3181);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 9936);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 8804);
/* harmony import */ var _card_card_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../card/card.component */ 2801);
/* harmony import */ var _sub_nav_sub_nav_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../sub-nav/sub-nav.component */ 7278);





class PortfolioComponent {
  constructor(route) {
    this.route = route;
    this.itemLinks = [''];
    this.Route = '';
  }
  ngOnInit() {
    this.route.url.subscribe(segments => {
      const path = segments.map(segment => segment.path).join('/');
      this.Route = path;
      this.itemLinks = _utils_routes_names__WEBPACK_IMPORTED_MODULE_0__.ROUTES_NAMES[path];
    });
  }
  static #_ = this.ɵfac = function PortfolioComponent_Factory(t) {
    return new (t || PortfolioComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__.ActivatedRoute));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
    type: PortfolioComponent,
    selectors: [["app-portfolio"]],
    decls: 4,
    vars: 2,
    consts: [[3, "subLinks", "mainRoute"], [1, "cardsContiner"]],
    template: function PortfolioComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](1, "app-sub-nav", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](2, "span", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](3, "app-card");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("subLinks", ctx.itemLinks)("mainRoute", ctx.Route);
      }
    },
    dependencies: [_card_card_component__WEBPACK_IMPORTED_MODULE_1__.CardComponent, _sub_nav_sub_nav_component__WEBPACK_IMPORTED_MODULE_2__.SubNavComponent],
    styles: [".cardsContiner[_ngcontent-%COMP%]   app-card[_ngcontent-%COMP%] {\n  padding: 10px;\n  display: flex;\n  justify-content: center;\n  flex-wrap: wrap;\n  margin-bottom: 50px;\n  gap: 25px;\n}\n\n@media only screen and (max-width: 630px) {\n  app-card[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcG9ydGZvbGlvL3BvcnRmb2xpby5jb21wb25lbnQuc2NzcyIsIndlYnBhY2s6Ly8uLy4uLy4uL2NvbXByZXNzZWQlMjBjb2Rlcy9wb3J0Zm9saW8tMjAyNC1hbGwtc2tpbGxzL3NyYy9hcHAvcG9ydGZvbGlvL3BvcnRmb2xpby5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDRTtFQUNFLGFBQUE7RUFDQSxhQUFBO0VBQ0EsdUJBQUE7RUFDQSxlQUFBO0VBQ0EsbUJBQUE7RUFDQSxTQUFBO0FDQUo7O0FESUE7RUFDRTtJQUNFLFdBQUE7RUNERjtBQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLmNhcmRzQ29udGluZXIge1xyXG4gIGFwcC1jYXJkIHtcclxuICAgIHBhZGRpbmc6IDEwcHg7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICBmbGV4LXdyYXA6IHdyYXA7XHJcbiAgICBtYXJnaW4tYm90dG9tOiA1MHB4O1xyXG4gICAgZ2FwOiAyNXB4O1xyXG4gIH1cclxufVxyXG5cclxuQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA2MzBweCkge1xyXG4gIGFwcC1jYXJkIHtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gIH1cclxufVxyXG4iLCIuY2FyZHNDb250aW5lciBhcHAtY2FyZCB7XG4gIHBhZGRpbmc6IDEwcHg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBmbGV4LXdyYXA6IHdyYXA7XG4gIG1hcmdpbi1ib3R0b206IDUwcHg7XG4gIGdhcDogMjVweDtcbn1cblxuQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA2MzBweCkge1xuICBhcHAtY2FyZCB7XG4gICAgd2lkdGg6IDEwMCU7XG4gIH1cbn0iXSwic291cmNlUm9vdCI6IiJ9 */"]
  });
}

/***/ }),

/***/ 7278:
/*!**********************************************!*\
  !*** ./src/app/sub-nav/sub-nav.component.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SubNavComponent: () => (/* binding */ SubNavComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 9936);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 4228);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 8804);



function SubNavComponent_a_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "a", 2)(1, "div", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const i_r1 = ctx.$implicit;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate2"]("routerLink", "/", ctx_r0.mainRoute, "/", i_r1, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", i_r1, " ");
  }
}
class SubNavComponent {
  constructor() {
    this.subLinks = [];
    this.mainRoute = '';
  }
  static #_ = this.ɵfac = function SubNavComponent_Factory(t) {
    return new (t || SubNavComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
    type: SubNavComponent,
    selectors: [["app-sub-nav"]],
    inputs: {
      subLinks: "subLinks",
      mainRoute: "mainRoute"
    },
    decls: 2,
    vars: 1,
    consts: [[1, "subNavComponent"], ["routerLinkActive", "active", 3, "routerLink", 4, "ngFor", "ngForOf"], ["routerLinkActive", "active", 3, "routerLink"], [1, "linkText"]],
    template: function SubNavComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, SubNavComponent_a_1_Template, 3, 3, "a", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.subLinks);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.NgForOf, _angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterLink, _angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterLinkActive],
    styles: [".subNavComponent[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  justify-content: center;\n  padding: 25px 0;\n}\n.subNavComponent[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  text-decoration: none;\n  color: #000;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  text-align: center;\n  padding: 10px 15px 0;\n  position: relative;\n}\n.subNavComponent[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]   .linkText[_ngcontent-%COMP%] {\n  padding: 0 0 10px;\n}\n.subNavComponent[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]   .linkText[_ngcontent-%COMP%] {\n  border-bottom: solid 2px rgba(255, 255, 255, 0);\n  font-size: 14px;\n  position: relative;\n}\n.subNavComponent[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]   .linkText[_ngcontent-%COMP%]::after {\n  content: \"\";\n  position: absolute;\n  width: 100%;\n  background-color: #fff;\n  height: 6px;\n  right: 0;\n  bottom: -4px;\n  transition: width 0.3s ease-in-out;\n}\n.subNavComponent[_ngcontent-%COMP%]   a.active[_ngcontent-%COMP%]   .linkText[_ngcontent-%COMP%] {\n  border-color: #000;\n}\n.subNavComponent[_ngcontent-%COMP%]   a.active[_ngcontent-%COMP%]   .linkText[_ngcontent-%COMP%]::after {\n  width: 0%;\n}\n\n@media only screen and (max-width: 420px) {\n  .subNavComponent[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n    padding: 5px 7px 0;\n  }\n  .subNavComponent[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]   .linkText[_ngcontent-%COMP%] {\n    font-size: 12px;\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc3ViLW5hdi9zdWItbmF2LmNvbXBvbmVudC5zY3NzIiwid2VicGFjazovLy4vLi4vLi4vY29tcHJlc3NlZCUyMGNvZGVzL3BvcnRmb2xpby0yMDI0LWFsbC1za2lsbHMvc3JjL2FwcC9zdWItbmF2L3N1Yi1uYXYuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxXQUFBO0VBQ0EsYUFBQTtFQUNBLHVCQUFBO0VBQ0EsZUFBQTtBQ0NGO0FEQ0U7RUFDRSxxQkFBQTtFQUNBLFdBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtFQUNBLGtCQUFBO0VBQ0Esb0JBQUE7RUFFQSxrQkFBQTtBQ0FKO0FERUk7RUFDRSxpQkFBQTtBQ0FOO0FESUU7RUFDRSwrQ0FBQTtFQUNBLGVBQUE7RUFDQSxrQkFBQTtBQ0ZKO0FES0U7RUFDRSxXQUFBO0VBQ0Esa0JBQUE7RUFDQSxXQUFBO0VBQ0Esc0JBQUE7RUFDQSxXQUFBO0VBQ0EsUUFBQTtFQUNBLFlBQUE7RUFDQSxrQ0FBQTtBQ0hKO0FETUU7RUFDRSxrQkFBQTtBQ0pKO0FET0U7RUFDRSxTQUFBO0FDTEo7O0FEU0E7RUFFSTtJQUNFLGtCQUFBO0VDUEo7RURTSTtJQUNFLGVBQUE7RUNQTjtBQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLnN1Yk5hdkNvbXBvbmVudCB7XHJcbiAgd2lkdGg6IDEwMCU7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICBwYWRkaW5nOiAyNXB4IDA7XHJcblxyXG4gIGEge1xyXG4gICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xyXG4gICAgY29sb3I6ICMwMDA7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgcGFkZGluZzogMTBweCAxNXB4IDA7XHJcbiAgICAvLyBtYXJnaW46IDAgMTVweDtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuXHJcbiAgICAubGlua1RleHQge1xyXG4gICAgICBwYWRkaW5nOiAwIDAgMTBweDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGEgLmxpbmtUZXh0IHtcclxuICAgIGJvcmRlci1ib3R0b206IHNvbGlkIDJweCAjZmZmMDtcclxuICAgIGZvbnQtc2l6ZTogMTRweDtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICB9XHJcblxyXG4gIGEgLmxpbmtUZXh0OjphZnRlciB7XHJcbiAgICBjb250ZW50OiBcIlwiO1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xyXG4gICAgaGVpZ2h0OiA2cHg7XHJcbiAgICByaWdodDogMDtcclxuICAgIGJvdHRvbTogLTRweDtcclxuICAgIHRyYW5zaXRpb246IHdpZHRoIDAuM3MgZWFzZS1pbi1vdXQ7XHJcbiAgfVxyXG5cclxuICBhLmFjdGl2ZSAubGlua1RleHQge1xyXG4gICAgYm9yZGVyLWNvbG9yOiAjMDAwO1xyXG4gIH1cclxuXHJcbiAgYS5hY3RpdmUgLmxpbmtUZXh0OjphZnRlciB7XHJcbiAgICB3aWR0aDogMCU7XHJcbiAgfVxyXG59XHJcblxyXG5AbWVkaWEgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDQyMHB4KSB7XHJcbiAgLnN1Yk5hdkNvbXBvbmVudCB7XHJcbiAgICBhIHtcclxuICAgICAgcGFkZGluZzogNXB4IDdweCAwO1xyXG5cclxuICAgICAgLmxpbmtUZXh0IHtcclxuICAgICAgICBmb250LXNpemU6IDEycHg7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiLnN1Yk5hdkNvbXBvbmVudCB7XG4gIHdpZHRoOiAxMDAlO1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgcGFkZGluZzogMjVweCAwO1xufVxuLnN1Yk5hdkNvbXBvbmVudCBhIHtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICBjb2xvcjogIzAwMDtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgcGFkZGluZzogMTBweCAxNXB4IDA7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbn1cbi5zdWJOYXZDb21wb25lbnQgYSAubGlua1RleHQge1xuICBwYWRkaW5nOiAwIDAgMTBweDtcbn1cbi5zdWJOYXZDb21wb25lbnQgYSAubGlua1RleHQge1xuICBib3JkZXItYm90dG9tOiBzb2xpZCAycHggcmdiYSgyNTUsIDI1NSwgMjU1LCAwKTtcbiAgZm9udC1zaXplOiAxNHB4O1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG59XG4uc3ViTmF2Q29tcG9uZW50IGEgLmxpbmtUZXh0OjphZnRlciB7XG4gIGNvbnRlbnQ6IFwiXCI7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgd2lkdGg6IDEwMCU7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XG4gIGhlaWdodDogNnB4O1xuICByaWdodDogMDtcbiAgYm90dG9tOiAtNHB4O1xuICB0cmFuc2l0aW9uOiB3aWR0aCAwLjNzIGVhc2UtaW4tb3V0O1xufVxuLnN1Yk5hdkNvbXBvbmVudCBhLmFjdGl2ZSAubGlua1RleHQge1xuICBib3JkZXItY29sb3I6ICMwMDA7XG59XG4uc3ViTmF2Q29tcG9uZW50IGEuYWN0aXZlIC5saW5rVGV4dDo6YWZ0ZXIge1xuICB3aWR0aDogMCU7XG59XG5cbkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNDIwcHgpIHtcbiAgLnN1Yk5hdkNvbXBvbmVudCBhIHtcbiAgICBwYWRkaW5nOiA1cHggN3B4IDA7XG4gIH1cbiAgLnN1Yk5hdkNvbXBvbmVudCBhIC5saW5rVGV4dCB7XG4gICAgZm9udC1zaXplOiAxMnB4O1xuICB9XG59Il0sInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }),

/***/ 8088:
/*!**********************************!*\
  !*** ./src/app/utils/project.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PROJECTS: () => (/* binding */ PROJECTS)
/* harmony export */ });
const PROJECTS = [{
  title: 'Project',
  description: 'Project',
  link: 'https://github.com/',
  image: '../assets/images/projectImage.jpg',
  tags: ['Angular Universal', 'Html', 'Scss'],
  speciality: 'Web Development'
}, {
  title: 'Project',
  description: 'Project',
  link: 'https://github.com/',
  image: '../assets/images/projectImage.jpg',
  tags: ['Angular Universal', 'Html', 'Scss'],
  speciality: 'Ux Ui'
}, {
  title: 'Project',
  description: 'Project',
  link: 'https://github.com/',
  image: '../assets/images/projectImage.jpg',
  tags: ['Angular Universal', 'Html', 'Scss'],
  speciality: 'Ux Ui'
}];

/***/ }),

/***/ 3181:
/*!***************************************!*\
  !*** ./src/app/utils/routes-names.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ROUTES_NAMES: () => (/* binding */ ROUTES_NAMES)
/* harmony export */ });
const ROUTES_NAMES = {
  'Programming': ['Web Development', 'Ux Ui', 'Desktop', 'Game'],
  'Design': ['Social Media Designs', 'Brand Design', '3d Design', 'Art & Drawing'],
  'Video': ['Motion Graphic', 'Video Editing'],
  'Audio': ['Audio Engineering', 'Music', 'Voice Acting'],
  'Others': ['Photography', 'Behind The Scenes', 'Me']
};

/***/ }),

/***/ 8674:
/*!****************************!*\
  !*** ./src/main.server.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppServerModule: () => (/* reexport safe */ _app_app_server_module__WEBPACK_IMPORTED_MODULE_0__.AppServerModule)
/* harmony export */ });
/* harmony import */ var _app_app_server_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app/app.server.module */ 1463);


/***/ }),

/***/ 8967:
/*!****************************************!*\
  !*** ./node_modules/express/lib/ sync ***!
  \****************************************/
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = 8967;
module.exports = webpackEmptyContext;

/***/ }),

/***/ 852:
/*!******************************!*\
  !*** external "async_hooks" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("async_hooks");

/***/ }),

/***/ 4300:
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ 6113:
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 2361:
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 7147:
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 3685:
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 5687:
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 1808:
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ 7561:
/*!**************************!*\
  !*** external "node:fs" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:fs");

/***/ }),

/***/ 9411:
/*!****************************!*\
  !*** external "node:path" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:path");

/***/ }),

/***/ 2037:
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 4822:
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 3477:
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("querystring");

/***/ }),

/***/ 2781:
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ 1576:
/*!*********************************!*\
  !*** external "string_decoder" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("string_decoder");

/***/ }),

/***/ 9512:
/*!*************************!*\
  !*** external "timers" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("timers");

/***/ }),

/***/ 6224:
/*!**********************!*\
  !*** external "tty" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tty");

/***/ }),

/***/ 7310:
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ 3837:
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ 9796:
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// the startup function
/******/ 	__webpack_require__.x = () => {
/******/ 		// Load entry module and return exports
/******/ 		// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 		__webpack_require__.O(undefined, [736], () => (__webpack_require__(6394)))
/******/ 		var __webpack_exports__ = __webpack_require__.O(undefined, [736], () => (__webpack_require__(4991)))
/******/ 		__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 		return __webpack_exports__;
/******/ 	};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks and sibling chunks for the entrypoint
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + (chunkId === 736 ? "vendor" : chunkId) + ".js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get mini-css chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks and sibling chunks for the entrypoint
/******/ 		__webpack_require__.miniCssF = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return undefined;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/require chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "loaded", otherwise not loaded yet
/******/ 		var installedChunks = {
/******/ 			179: 1
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.O.require = (chunkId) => (installedChunks[chunkId]);
/******/ 		
/******/ 		var installChunk = (chunk) => {
/******/ 			var moreModules = chunk.modules, chunkIds = chunk.ids, runtime = chunk.runtime;
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			for(var i = 0; i < chunkIds.length; i++)
/******/ 				installedChunks[chunkIds[i]] = 1;
/******/ 			__webpack_require__.O();
/******/ 		};
/******/ 		
/******/ 		// require() chunk loading for javascript
/******/ 		__webpack_require__.f.require = (chunkId, promises) => {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				if(true) { // all chunks have JS
/******/ 					installChunk(require("./" + __webpack_require__.u(chunkId)));
/******/ 				} else installedChunks[chunkId] = 1;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		// no external install chunk
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/startup chunk dependencies */
/******/ 	(() => {
/******/ 		var next = __webpack_require__.x;
/******/ 		__webpack_require__.x = () => {
/******/ 			__webpack_require__.e(736);
/******/ 			return next();
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// run startup
/******/ 	var __webpack_exports__ = __webpack_require__.x();
/******/ 	var __webpack_export_target__ = exports;
/******/ 	for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
/******/ 	if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ 	
/******/ })()
;
//# sourceMappingURL=main.js.map