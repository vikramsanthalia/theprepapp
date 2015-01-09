angular.module('vizCentral.templates', ['ext/createQuestions/createQuestion.html', 'ext/home/home.html', 'ext/home/slide1.html', 'ext/home/slide2.html', 'ext/home/slide3.html', 'ext/intermediate/intermediate.html', 'ext/partner/partner.html']);

angular.module("ext/createQuestions/createQuestion.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("ext/createQuestions/createQuestion.html",
    "\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-sm-12\">\n" +
    "    <div class=\"set set-details\">\n" +
    "      <div class=\"row input-container\">\n" +
    "        <div class=\"col-sm-2\">\n" +
    "          <label>Category / Exam Name : </label>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-4\">\n" +
    "          <input type=\"text\" placeholder=\"\" class=\"form-control input-sm\"/>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-6\"> <span>enter the name of the subject, this may be prepopulated</span></div>\n" +
    "      </div>\n" +
    "      <div class=\"row input-container\">\n" +
    "        <div class=\"col-sm-2\">\n" +
    "          <label>Sub-Category :</label>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-4\">\n" +
    "          <input type=\"text\" placeholder=\"\" class=\"form-control input-sm\"/>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-6\"><span>enter sub-category/sections the sub, this may also be prepopulated</span></div>\n" +
    "      </div>\n" +
    "      <div class=\"row input-container\">\n" +
    "        <div class=\"col-sm-2\">\n" +
    "          <label>Set Name :</label>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-4\">\n" +
    "          <input type=\"text\" placeholder=\"\" class=\"form-control input-sm\"/>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-6\"><span>give this set a name/alias for your future reference</span></div>\n" +
    "      </div>\n" +
    "      <div class=\"row input-container\">\n" +
    "        <div class=\"col-sm-2\">\n" +
    "          <label>Created By :</label>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-4\">\n" +
    "          <input type=\"text\" placeholder=\"\" class=\"form-control input-sm\"/>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-6\"><span>enter the name of the creator to keep track of who created what</span></div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-sm-9\">\n" +
    "    <div class=\"set set-body\">\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-sm-1 col-sm-custon-1\"><span class=\"sequence s-question\">{{selectedQuestion.sequence}} &#46;</span></div>\n" +
    "        <div class=\"col-sm-11 col-sm-custon-11\">\n" +
    "          <textarea msd-elastic=\"\n" +
    "\" ng-model=\"selectedQuestion.questionDesc\" class=\"animate form-control\"></textarea>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-sm-1 col-sm-custon-1\"><span ng-click=\"changeCorrectOption(1,selectedQuestion.sequence)\" ng-class=\"selectedQuestion.options[0].correct ? 'correctoption' : 'wrongoption'\" class=\"sequence s-option\"><i ng-class=\"selectedQuestion.options[0].correct ? 'fa-check' : 'fa-times'\" class=\"fa\">&nbsp;a&#41;</i></span></div>\n" +
    "        <div class=\"col-sm-5 col-sm-custon-5\">\n" +
    "          <textarea msd-elastic=\"\n" +
    "\" ng-model=\"selectedQuestion.options[0].label\" class=\"animate form-control\"></textarea>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-1 col-sm-custon-1\"><span ng-click=\"changeCorrectOption(2,selectedQuestion.sequence)\" ng-class=\"selectedQuestion.options[1].correct ? 'correctoption' : 'wrongoption'\" class=\"sequence s-option\"><i ng-class=\"selectedQuestion.options[1].correct ? 'fa-check' : 'fa-times'\" class=\"fa\">&nbsp;b&#41;</i></span></div>\n" +
    "        <div class=\"col-sm-5 col-sm-custon-5\">\n" +
    "          <textarea msd-elastic=\"\n" +
    "\" ng-model=\"selectedQuestion.options[1].label\" class=\"animate form-control\"></textarea>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-sm-1 col-sm-custon-1\"><span ng-click=\"changeCorrectOption(3,selectedQuestion.sequence)\" ng-class=\"selectedQuestion.options[2].correct ? 'correctoption' : 'wrongoption'\" class=\"sequence s-option\"><i ng-class=\"selectedQuestion.options[2].correct ? 'fa-check' : 'fa-times'\" class=\"fa\">&nbsp;c&#41;</i></span></div>\n" +
    "        <div class=\"col-sm-5 col-sm-custon-5\">\n" +
    "          <textarea msd-elastic=\"\n" +
    "\" ng-model=\"selectedQuestion.options[2].label\" class=\"animate form-control\"></textarea>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-1 col-sm-custon-1\"><span ng-click=\"changeCorrectOption(4,selectedQuestion.sequence)\" ng-class=\"selectedQuestion.options[3].correct ? 'correctoption' : 'wrongoption'\" class=\"sequence s-option\"><i ng-class=\"selectedQuestion.options[3].correct ? 'fa-check' : 'fa-times'\" class=\"fa\">&nbsp;d&#41;</i></span></div>\n" +
    "        <div class=\"col-sm-5 col-sm-custon-5\">\n" +
    "          <textarea msd-elastic=\"\n" +
    "\" ng-model=\"selectedQuestion.options[3].label\" class=\"animate form-control\"></textarea>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-sm-4 col-sm-offset-8 margin-top-20\">\n" +
    "          <div class=\"btn-group pull-right\">\n" +
    "            <label uncheckable=\"\" ng-click=\"clearQuestion(selectedQuestion.sequence)\" class=\"btn btn-warning\"><i class=\"fa fa-times-circle\">&nbsp;Clear Changes</i></label>\n" +
    "            <label uncheckable=\"\" ng-disabled=\"selectedQuestion.sequence === setLength\" ng-click=\"gotoQuestion(selectedQuestion.sequence)\" class=\"btn btn-primary\">Goto Next Question &nbsp;<i class=\"fa fa-angle-double-right\"></i></label>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"col-sm-3\">\n" +
    "    <div class=\"set set-nav\"><span ng-click=\"gotoQuestion($index)\" ng-class=\"{'active' : selectedQuestion.sequence == ($index+1)}\" ng-repeat=\"label in questionLabels\" class=\"label label-question {{label.labelClass}}\">{{label.sequence}}</span>\n" +
    "      <div class=\"row save-buttons\">\n" +
    "        <div class=\"col-sm-12\">\n" +
    "          <div class=\"btn-group\">\n" +
    "            <label uncheckable=\"\" class=\"btn btn-warning btn-sm\"><i class=\"fa fa-star-half-o\">&nbsp;Complete Later</i></label>\n" +
    "            <label uncheckable=\"\" class=\"btn btn-primary btn-sm\"><i class=\"fa fa-star\">&nbsp;Save Set Now</i></label>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("ext/home/home.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("ext/home/home.html",
    "\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"nav-header\">\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-sm-5 col-sm-offset-1 logo\"> <span>PrepApp</span></div>\n" +
    "      <div class=\"col-sm-6\">\n" +
    "        <div class=\"row\">\n" +
    "          <div ng-repeat=\"tab in tabs\" ng-class=\"{'active' : tab.active}\" ng-click=\"activated($index)\" class=\"{{tab.className}}\"><span>{{tab.label}}\n" +
    "              <div ng-show=\"tabs[5].active &amp;&amp; $index === 5\" ng-cloak=\"\" class=\"down-arrow\"></div></span></div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div ng-show=\"tabs[5].active\" ng-cloak=\"\" class=\"login-page animated fadeIn\">\n" +
    "  <div class=\"message-container\">\n" +
    "    <div ng-class=\"loginError.show ? 'enableVisibility animated bounceIn' : 'disableVisibility animated bounceOut'\" ng-cloak=\"\" class=\"message\"><i class=\"fa fa-exclamation-triangle\"></i><span> </span>{{loginError.message}}</div>\n" +
    "  </div>\n" +
    "  <form role=\"form\" name=\"loginform\" novalidate=\"novalidate\" autocomplete=\"off\">\n" +
    "    <fieldset class=\"fields\">\n" +
    "      <div class=\"row input-ele\">\n" +
    "        <div class=\"col-sm-12\">\n" +
    "          <input id=\"username\" type=\"text\" placeholder=\"Username\" ng-model=\"username\" ng-disabled=\"isLoading\" autofocus=\"autofocus\" class=\"form-control input-lg\"/>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"row input-ele\">\n" +
    "        <div class=\"col-sm-12\">\n" +
    "          <input id=\"password\" type=\"password\" placeholder=\"Password\" ng-model=\"password\" ng-disabled=\"isLoading\" ng-trim=\"false\" class=\"form-control input-lg\"/>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"row input-ele\">\n" +
    "        <div class=\"col-sm-12\">\n" +
    "          <button id=\"submit\" ng-disabled=\"isLoading\" type=\"submit\" ng-click=\"doLogin()\" class=\"btn btn-danger btn-block btn-lg\"><span ng-if=\"!isLoading\"><span>Login</span><span> »</span></span><span ng-if=\"isLoading\"><i class=\"fa fa-spinner fa-spin\"> </i>Please Wait</span></button>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"row input-ele\">\n" +
    "        <div class=\"col-sm-12\"><span>Forgot Password (let us know)</span></div>\n" +
    "      </div>\n" +
    "    </fieldset>\n" +
    "  </form>\n" +
    "</div>\n" +
    "<div class=\"scroll-box\">\n" +
    "  <div class=\"row\">\n" +
    "    <div id=\"homelink\" class=\"block\"></div>\n" +
    "  </div>\n" +
    "  <div class=\"row\">\n" +
    "    <div id=\"whyus\" class=\"block\">\n" +
    "      <div ng-repeat=\"block in sliderBlocks\" class=\"slider-container\">\n" +
    "        <div ng-if=\"block.isActive\" ng-include=\"block.content\" class=\"slides\"></div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"row\">\n" +
    "    <div id=\"partners\" class=\"block\"></div>\n" +
    "  </div>\n" +
    "  <div class=\"row\">\n" +
    "    <div id=\"blog\" class=\"block\"></div>\n" +
    "  </div>\n" +
    "  <div class=\"row\">\n" +
    "    <div id=\"contactus\" class=\"block\"></div>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("ext/home/slide1.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("ext/home/slide1.html",
    "\n" +
    "<div class=\"slide1\">\n" +
    "  <h1>this is slide 1</h1>\n" +
    "</div>");
}]);

angular.module("ext/home/slide2.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("ext/home/slide2.html",
    "\n" +
    "<div class=\"slide2\">\n" +
    "  <h1>this is slide 2</h1>\n" +
    "</div>");
}]);

angular.module("ext/home/slide3.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("ext/home/slide3.html",
    "\n" +
    "<div class=\"slide3\">\n" +
    "  <h1>this is slide 3</h1>\n" +
    "</div>");
}]);

angular.module("ext/intermediate/intermediate.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("ext/intermediate/intermediate.html",
    "\n" +
    "<div class=\"row intermediate-container\">\n" +
    "  <div class=\"col-sm-8 col-sm-offset-2\">\n" +
    "    <div class=\"intermediate\">\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-sm-12 logo\"><span>PrepApp</span></div>\n" +
    "      </div>\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-sm-12\"><span class=\"fa\"><i class=\"fa fa-cog fa-spin\">&nbsp;</i>Just a few Seconds! We are loading your Dashboard. </span></div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("ext/partner/partner.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("ext/partner/partner.html",
    "\n" +
    "<div class=\"row partner\">\n" +
    "  <div class=\"app-header\">\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-sm-5 col-sm-offset-1 logo\"> <span>PrepApp</span></div>\n" +
    "      <div class=\"col-sm-4 col-sm-offset-1\">\n" +
    "        <div class=\"row logout\">\n" +
    "          <div ng-click=\"logout()\" class=\"btn btn-sm btn-primary pull-right\"><i class=\"fa fa-sign-out\"></i>&nbsp; Logout</div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div ui-view=\"\" class=\"partner-container\"></div>\n" +
    "</div>");
}]);
