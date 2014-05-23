"use strict";
var Ember = require("ember")["default"] || require("ember");
exports["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  


  data.buffer.push("eb-label {\n  display: inline;\n  padding: 0.2em 0.6em 0.3em;\n  font-size: 75%;\n  font-weight: 700;\n  line-height: 1;\n  text-align: center;\n  white-space: nowrap;\n  vertical-align: baseline;\n  border-radius: 0.25em; }\n  eb-label.info, eb-label.success, eb-label.warn, eb-label.danger {\n    color: #ffffff; }\n  eb-label.info {\n    background-color: #5bc0de; }\n  eb-label.success {\n    background-color: #5cb85c; }\n  eb-label.warn {\n    background-color: #f0ad4e; }\n  eb-label.danger {\n    background-color: #d9534f; }\n\neb-control {\n  cursor: pointer;\n  display: inline-block;\n  color: #000000;\n  text-align: center;\n  text-decoration: none;\n  white-space: nowrap;\n  vertical-align: baseline; }\n  eb-control.activated {\n    opacity: 1; }\n  eb-control.disabled {\n    cursor: not-allowed;\n    pointer-events: none;\n    opacity: 0.65; }\n  eb-control:hover {\n    text-decoration: underline; }\n");
  
});