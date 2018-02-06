/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
 * Copyright (C) 2018 Red Hat, Inc.
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var event_ts_1 = __webpack_require__(2);
var component_ts_1 = __webpack_require__(1);
var debounce = __webpack_require__(5);
var SKLink = /** @class */ (function () {
    function SKLink(name, clazz, component1, component2) {
        this.lineGenerator = d3.line().curve(d3.curveBasis);
        this.name = name;
        this.clazz = clazz;
        this.component1 = component1;
        component1.addUpdatedListenner(this.invalidate.bind(this));
        this.component2 = component2;
        component2.addUpdatedListenner(this.invalidate.bind(this));
        var gDom = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.svgG = d3.select(gDom).attr("class", this.clazz);
        // create the path
        this.svgPath = this.svgG.append("path")
            .attr("style", "marker-start: url(#markerSquare); marker-end: url(#markerSquare);");
        this.invalidate();
    }
    SKLink.prototype.endpoint = function (component, x1, y1, side) {
        var margin = 5;
        if (side === "top") {
            return [x1, y1 - component.height / 2 - margin];
        }
        if (side === "bottom") {
            return [x1, y1 + component.height / 2 + margin];
        }
        if (side === "left") {
            return [x1 - component.width / 2 - margin, y1];
        }
        if (side === "right") {
            return [x1 + component.width / 2 + margin, y1];
        }
    };
    SKLink.prototype.anchorSide = function (component, x1, y1, x2, y2) {
        var w = component.width, h = component.height;
        var slope = (y1 - y2) / (x1 - x2);
        var hsw = slope * w / 2;
        var hsh = (h / 2) / slope;
        var hh = h / 2;
        var hw = w / 2;
        /*if (-hh <= hsw && hsw <= hh) {
          if (x1 < x2) {
            return "right";
          }
          return "left";
        }*/
        if (y1 > y2) {
            return "top";
        }
        return "bottom";
    };
    SKLink.prototype.localPos = function (component) {
        var x = component.x, y = component.y, container = component.container;
        while (container && this.container !== container) {
            x += container.x;
            y += container.y;
            container = container.container;
        }
        return [x, y];
    };
    SKLink.prototype.controlPoint = function (x, y, dx, dy, side) {
        if (side === "top") {
            return [x, y - dy];
        }
        if (side === "bottom") {
            return [x, y + dy];
        }
        if (side === "left") {
            return [x - dx, y];
        }
        if (side === "right") {
            return [x + dx, y];
        }
    };
    SKLink.prototype.interpolate = function (x1, y1, s1, x2, y2, s2) {
        var points = [[x1, y1]];
        // 4 for now but could be a parameter of link.
        var dx = Math.floor((x2 - x1) / 4);
        var dy = Math.floor((y2 - y1) / 4);
        var c1 = this.controlPoint(x1, y1, dx, dy, s1);
        points.push(c1);
        var c2 = this.controlPoint(x2, y2, dx, dy, s2);
        points.push(c2);
        points.push([x2, y2]);
        return points;
    };
    SKLink.prototype.invalidate = function (event) {
        var c1 = this.component1, c2 = this.component2;
        var p1 = this.localPos(c1);
        var p2 = this.localPos(c2);
        var s1 = this.anchorSide(c1, p1[0] + c1.width / 2, p1[1] + c1.height / 2, p2[0] + c2.width / 2, p2[1] + c2.height / 2);
        var s2 = this.anchorSide(c2, p2[0] + c2.width / 2, p2[1] + c2.height / 2, p1[0] + c1.width / 2, p1[1] + c1.height / 2);
        var e1 = this.endpoint(c1, p1[0] + c1.width / 2, p1[1] + c1.height / 2, s1);
        var e2 = this.endpoint(c2, p2[0] + c2.width / 2, p2[1] + c2.height / 2, s2);
        var points = this.interpolate(e1[0], e1[1], s1, e2[0], e2[1], s2);
        var pathData = this.lineGenerator(points);
        this.svgPath.attr('d', pathData);
    };
    SKLink.prototype.render = function () {
        return this.svgG.node();
    };
    return SKLink;
}());
exports.SKLink = SKLink;
var SKContainer = /** @class */ (function (_super) {
    __extends(SKContainer, _super);
    function SKContainer(name, clazz) {
        var _this = _super.call(this, name, clazz) || this;
        _this.components = new Array();
        _this.links = new Array();
        // create the bouding box
        _this.svgRect = _this.svgG.append("rect");
        _this.svgComponent = _this.svgG.append("g");
        _this.svgLink = _this.svgG.append("g");
        _this.componentD3Data = _this.svgComponent.selectAll(".component");
        _this.linkD3Data = _this.svgLink.selectAll(".link");
        // debounced functions
        _this.notifyComponents = debounce(_this._notifyComponents.bind(_this), 100);
        _this.invalidateLinks = debounce(_this._invalidateLinks.bind(_this), 100);
        return _this;
    }
    SKContainer.prototype.addComponent = function (component) {
        this.components.push(component);
        component.container = this;
        component.addUpdatedListenner(this.invalidate.bind(this));
        this.componentD3Data = this.componentD3Data.data(this.components);
        this.componentD3Data.exit().remove();
        var enter = this.componentD3Data.enter().append(function (d) { return d.render(); });
        this.componentD3Data = enter.merge(this.componentD3Data);
        // need to be implemented by a real container
        this.invalidate();
    };
    SKContainer.prototype.addLink = function (link) {
        this.links.push(link);
        link.container = this;
        this.linkD3Data = this.linkD3Data.data(this.links);
        this.linkD3Data.exit().remove();
        var enter = this.linkD3Data.enter().append(function (d) { return d.render(); });
        this.linkD3Data = enter.merge(this.linkD3Data);
        // need to be implemented by a real container
        this.invalidate();
    };
    // debounced
    SKContainer.prototype._notifyComponents = function () {
        for (var _i = 0, _a = this.components; _i < _a.length; _i++) {
            var component = _a[_i];
            component.containerUpdated();
        }
    };
    // debounced
    SKContainer.prototype._invalidateLinks = function () {
        for (var _i = 0, _a = this.links; _i < _a.length; _i++) {
            var link = _a[_i];
            link.invalidate();
        }
    };
    SKContainer.prototype.setSize = function (width, height, event) {
        _super.prototype.setSize.call(this, width, height);
        this.svgRect.attr("width", this.width).attr("height", this.height);
        this.notifyComponents();
    };
    return SKContainer;
}(component_ts_1.SKComponent));
exports.SKContainer = SKContainer;
var SKFlowLayoutOrientation;
(function (SKFlowLayoutOrientation) {
    SKFlowLayoutOrientation[SKFlowLayoutOrientation["Horizontal"] = 0] = "Horizontal";
    SKFlowLayoutOrientation[SKFlowLayoutOrientation["Vertical"] = 1] = "Vertical";
})(SKFlowLayoutOrientation = exports.SKFlowLayoutOrientation || (exports.SKFlowLayoutOrientation = {}));
var SKHorizontalAlign;
(function (SKHorizontalAlign) {
    SKHorizontalAlign[SKHorizontalAlign["Left"] = 0] = "Left";
    SKHorizontalAlign[SKHorizontalAlign["Right"] = 1] = "Right";
    SKHorizontalAlign[SKHorizontalAlign["Center"] = 2] = "Center";
})(SKHorizontalAlign = exports.SKHorizontalAlign || (exports.SKHorizontalAlign = {}));
var SKFlowLayout = /** @class */ (function (_super) {
    __extends(SKFlowLayout, _super);
    function SKFlowLayout(name, clazz, orientation, margin, padding, halign) {
        var _this = _super.call(this, name, clazz) || this;
        _this.orientation = orientation;
        _this.padding = padding;
        _this.margin = margin;
        _this.halign = halign || SKHorizontalAlign.Center;
        return _this;
    }
    SKFlowLayout.prototype.setSize = function (width, height, event) {
        _super.prototype.setSize.call(this, width, height, event);
        // align content
        if (this.halign === SKHorizontalAlign.Center) {
            var width = 0, px = this.padding.x || 0;
            for (var _i = 0, _a = this.components; _i < _a.length; _i++) {
                var component = _a[_i];
                width += component.width + px;
            }
            width -= px;
            var x = Math.floor((this.width - width) / 2), px = this.padding.x || 0;
            if (x <= 0) {
                return;
            }
            this.componentD3Data.each(function (d, i) {
                d.setPos(x, d.y, event);
                x += d.width + px;
            });
        }
        else if (this.halign === SKHorizontalAlign.Left) {
            // TBD
        }
        else if (this.halign === SKHorizontalAlign.Right) {
            // TBD
        }
    };
    SKFlowLayout.prototype.invalidate = function (event) {
        var _this = this;
        // do not react on event that originate from myself
        if (event) {
            if (event.source === this) {
                return;
            }
        }
        else {
            event = new event_ts_1.SKEvent(this);
        }
        var ml = this.margin.left || 0, mr = this.margin.right || 0;
        var mt = this.margin.top || 0, mb = this.margin.bottom || 0;
        var x = ml, y = mt || 0, width = 0, height = 0;
        var px = this.padding.x || 0, py = this.padding.x || 0;
        this.componentD3Data.each(function (d, i) {
            d.setPos(x, y, event);
            if (_this.orientation === SKFlowLayoutOrientation.Horizontal) {
                x += d.width + px;
                if (height < d.height)
                    height = d.height;
                width += d.width + px;
            }
            else {
                y += d.height + py;
                if (width < d.width)
                    width = d.width;
                height += d.height + py;
            }
        });
        if (this.orientation === SKFlowLayoutOrientation.Horizontal) {
            width -= px;
        }
        else {
            height -= py;
        }
        this.setSize(width + ml + mr, height + mt + mb, event);
        // set content width to 100%
        this.componentD3Data.each(function (d, i) {
            if (_this.orientation === SKFlowLayoutOrientation.Vertical) {
                if (d instanceof SKContainer) {
                    d.setSize(width, d.height);
                }
            }
            else if (_this.orientation === SKFlowLayoutOrientation.Horizontal) {
                // TBD
            }
        });
        // debounced
        this.invalidateLinks();
    };
    return SKFlowLayout;
}(SKContainer));
exports.SKFlowLayout = SKFlowLayout;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
 * Copyright (C) 2018 Red Hat, Inc.
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */
exports.__esModule = true;
var event_ts_1 = __webpack_require__(2);
var SKComponent = /** @class */ (function () {
    function SKComponent(name, clazz) {
        this.width = 0;
        this.height = 0;
        this.x = 0;
        this.y = 0;
        // events
        this.onUpdatedListeners = new Array();
        this.name = name;
        this.clazz = clazz;
        var gDom = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.svgG = d3.select(gDom).attr("class", this.clazz);
    }
    SKComponent.prototype.render = function () {
        return this.svgG.node();
    };
    SKComponent.prototype.addUpdatedListenner = function (listener) {
        this.onUpdatedListeners.push(listener);
    };
    SKComponent.prototype.notifyUpdated = function (event) {
        for (var _i = 0, _a = this.onUpdatedListeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            listener(event);
        }
    };
    // called by container when updated
    SKComponent.prototype.containerUpdated = function () { };
    SKComponent.prototype.setPos = function (x, y, event) {
        var _this = this;
        if (x == this.x && y == this.y) {
            return;
        }
        this.x = x;
        this.y = y;
        this.svgG.attr("transform", function (d) { return "translate(" + _this.x + "," + _this.y + ")"; });
        if (!event) {
            event = new event_ts_1.SKEvent(this);
        }
        //this.notifyUpdated(event);
    };
    SKComponent.prototype.setSize = function (width, height, event) {
        if (width == this.width && height == this.height) {
            return;
        }
        this.width = width;
        this.height = height;
        if (!event) {
            event = new event_ts_1.SKEvent(this);
        }
        this.notifyUpdated(event);
    };
    return SKComponent;
}());
exports.SKComponent = SKComponent;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
 * Copyright (C) 2018 Red Hat, Inc.
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */
exports.__esModule = true;
var SKEvent = /** @class */ (function () {
    function SKEvent(source) {
        this.source = source;
    }
    return SKEvent;
}());
exports.SKEvent = SKEvent;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
 * Copyright (C) 2018 Red Hat, Inc.
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var component_ts_1 = __webpack_require__(1);
var intfImg = __webpack_require__(6);
var SKInterface = /** @class */ (function (_super) {
    __extends(SKInterface, _super);
    function SKInterface(name, clazz) {
        if (clazz === void 0) { clazz = "sk-interface"; }
        var _this = _super.call(this, name, clazz) || this;
        _this.name = name;
        _this.clazz = clazz;
        _this.svgImg = _this.svgG.append("image")
            .attr("xlink:href", intfImg)
            .attr("width", "32px")
            .attr("height", "32px");
        _this.svgG.append("text")
            .attr("y", 52)
            .text(_this.name);
        _this.setSize(32, 56);
        return _this;
    }
    return SKInterface;
}(component_ts_1.SKComponent));
exports.SKInterface = SKInterface;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var layout_ts_1 = __webpack_require__(0);
var interface_ts_1 = __webpack_require__(3);
var netns_ts_1 = __webpack_require__(7);
var topology_ts_1 = __webpack_require__(8);
var topology = new topology_ts_1.SKTopology("body", 1800, 800);
for (var i = 0; i != 1; i++) {
    var host = new netns_ts_1.SKNetworkNamespaceLayout("Host" + i, "host", true);
    var eth0 = new interface_ts_1.SKInterface("eth0");
    host.addComponent(eth0);
    host.addComponent(new interface_ts_1.SKInterface("eth1"));
    topology.addComponent(host);
    var ns1 = new netns_ts_1.SKNetworkNamespaceLayout("NetNS 1", "netns");
    ns1.addComponent(new interface_ts_1.SKInterface("lo"));
    ns1.addComponent(new interface_ts_1.SKInterface("eth0"));
    var ns2 = new netns_ts_1.SKNetworkNamespaceLayout("NetNS 2", "netns");
    ns2.addComponent(new interface_ts_1.SKInterface("lo"));
    var eth1 = new interface_ts_1.SKInterface("eth1");
    ns2.addComponent(eth1);
    host.addComponent(ns1);
    host.addComponent(ns2);
    host.addLink(new layout_ts_1.SKLink("SKLink", "link", eth0, eth1));
}
console.log("Started !!!!");


/***/ }),
/* 5 */
/***/ (function(module, exports) {

/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing. The function also has a property 'clear' 
 * that is a function which will clear the timer to prevent previously scheduled executions. 
 *
 * @source underscore.js
 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
 * @param {Function} function to wrap
 * @param {Number} timeout in ms (`100`)
 * @param {Boolean} whether to execute at the beginning (`false`)
 * @api public
 */

module.exports = function debounce(func, wait, immediate){
  var timeout, args, context, timestamp, result;
  if (null == wait) wait = 100;

  function later() {
    var last = Date.now() - timestamp;

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        context = args = null;
      }
    }
  };

  var debounced = function(){
    context = this;
    args = arguments;
    timestamp = Date.now();
    var callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };

  debounced.clear = function() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };
  
  debounced.flush = function() {
    if (timeout) {
      result = func.apply(context, args);
      context = args = null;
      
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAiEgAAIhIBv2R/3AAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAASCSURBVHic7Zs9aBxHFMf/b07DEYRQwMTIJCnCIdIErbibvcPpA+lCKqcwDqRIYRdOFURcRDIkURkMThEwhBCMrSIBF6lTXSztrNBBWhHIBxI2jmJEMMd656WZM6e5Pdl77Ic+9tfoNPPe7v+9fTe77M0jZsY4PM87K6X0mVkJIVrMrACcG+twNNghIm2MCYlIR1EU9Hq9B+OMKSkBSilJRNeY+TMAMk+1BRAx8xdE9KXWOnInRxLQbrcXjTHfAfAKElgUPWPMh5ubm73hQTH8j1LqsjFmAycveADwhBCBUury8OCzCrBXfgOHl7wBsJ+fxkyYgXNhHSJjjD+oBGJmKKUkgADJV34XwKoQIuj3+71er/df9pqzw/O86Xq97hljfABLAOYSzHoAfK11NAUAdsEbCZ6I7gohrqyvrz/KV3Z22AvUBdDtdDo/GGNuMvMFx8wjomsAlmlhYeGslPIvOKVPRHeDIPigIN254vv+nYQkRFEUvSaklD5Gv/e7QogrBenLHRvLrjMspZS+sA83LqvHqeyfh41l1R23D3ii5U4IIYJClBVIUkxCiFZSBZh+v99zjY87NiYzPMbMSmD02X7/qN/qJsHG5D7DnDvsgeFUMFXUiTzPm5ZSvsXMdJgdEXEURb8VVYWFJEAptSSlXAIwS3Ro/AAAKeVjpdSq1npk5c6a3L8C7XZ7DsB1ALMp3GYBXLe+uZJ7Apj5HUz2TkFa31zJPQHGmFoZvi/Kqb8LVAkoW0DZTHQbbLVa7wshPmbmN55nS0RpVn/X9yul1NIL2P1ujPk2DMOf0p4jdQKazeZ5IcSPh71Oz5A5JL/ROQAzv0lE7zabzbc3Nzd/TXOC1F8BIcRHaX2KYhJtk6wBr0zgUxSptZ36RbBKQNkCyqZKQNkCyqZKQNkCyqZKQNkCyqZKQNkCyqZKQNkCyiaPBNxg5jtj5u4z8zKAvYS5PTt3P8nRHvNGJgqHyDQBzNzVWl9tNBoXAYzszYvj+FIYhisAbiW43wrDcCWO40sJcw8ajcZFrfVVZu5mqTnTBBDRQwBYW1uLkXyVH9q/SXsPHjk2w+zZYz47R1ZUa0DZAsqmSkDZAsomdQKIKM5DSBZMom2SCvh5Ap+iSK0tdQKklLeZ+R6Ao1QJMTPfk1LeTuuY+pehbrf7BMB7i4uLr9ZqtdcPHGxq6p/BZ2PMBSJ6aXh+fn5+3859T0S/DM8x8x8Dm+3t7fPO3JPB51qt9unTp08P7ByJ4/jPra2tv9PGAgDUarXc37gea61fnuRgRx2l1L9wdqpUdwEAO87YjOd502WIyRMb04wzvCOISDuDol6vn7iOERvTgYonIi2MMaFrbJsNThRJMRljwqQKAIClTqdzpgBdhWBjGdloQURaRFEUAHDbyeaMMTcLUVcANhZ3o0UURVFAzAzf95eZ+XPX8Ti2zAzT6XTOjGmZARGtBEGwfOqbpqq2ueHNTrap8Gsc/3bZcUQAPtFafzMYqFpnXauNjY0tAD4RrWD07nAciezrdt8NHhjTPT7gNLTP/w/2Wg/RCVel1AAAAABJRU5ErkJggg=="

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
 * Copyright (C) 2018 Red Hat, Inc.
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var component_ts_1 = __webpack_require__(1);
var interface_ts_1 = __webpack_require__(3);
var layout_ts_1 = __webpack_require__(0);
var title = /** @class */ (function (_super) {
    __extends(title, _super);
    function title(name, clazz) {
        if (clazz === void 0) { clazz = "sk-netns-title"; }
        var _this = _super.call(this, name, clazz) || this;
        _this.name = name;
        _this.clazz = clazz;
        _this.svgText = _this.svgG
            .append("text")
            .attr("text-anchor", "middle")
            .attr('visibility', 'hidden')
            .text(_this.name);
        // fake height because of padding
        _this.height = 28;
        return _this;
    }
    title.prototype.containerUpdated = function () {
        this.width = this.container.width;
        this.svgText
            .attr('visibility', 'visible')
            .attr('y', 20);
    };
    return title;
}(component_ts_1.SKComponent));
exports.title = title;
var header = /** @class */ (function (_super) {
    __extends(header, _super);
    function header() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    header.prototype.containerUpdated = function () {
        this.width = this.container.width;
        this.setSize(this.width, this.height);
    };
    return header;
}(layout_ts_1.SKFlowLayout));
exports.header = header;
var SKNetworkNamespaceLayout = /** @class */ (function (_super) {
    __extends(SKNetworkNamespaceLayout, _super);
    function SKNetworkNamespaceLayout(name, clazz, dropShadow) {
        var _this = _super.call(this, name, clazz, layout_ts_1.SKFlowLayoutOrientation.Vertical, { top: 0, bottom: 0 }, {}) || this;
        _this.layerMargin = { left: 20, right: 20, top: 20, bottom: 20 };
        _this.layerPadding = { x: 20, y: 20 };
        _this.layer1 = new layout_ts_1.SKFlowLayout("layer1", "sk-netns-intf-layer1", layout_ts_1.SKFlowLayoutOrientation.Horizontal, _this.layerMargin, _this.layerPadding);
        _this.layer2 = new layout_ts_1.SKFlowLayout("layer2", "sk-netns-intf-layer2", layout_ts_1.SKFlowLayoutOrientation.Horizontal, _this.layerMargin, _this.layerPadding);
        _this.layer3 = new layout_ts_1.SKFlowLayout("layer3", "sk-netns-intf-layer3", layout_ts_1.SKFlowLayoutOrientation.Horizontal, _this.layerMargin, _this.layerPadding);
        _this.layer4 = new layout_ts_1.SKFlowLayout("layer4", "sk-netns-intf-layer4", layout_ts_1.SKFlowLayoutOrientation.Horizontal, _this.layerMargin, _this.layerPadding);
        if (dropShadow) {
            _this.svgRect
                .style("filter", "url(#drop-shadow)");
        }
        var titleContainer = new header("header", "sk-netns-header", layout_ts_1.SKFlowLayoutOrientation.Horizontal, {}, {});
        titleContainer.addComponent(new title(_this.name));
        _super.prototype.addComponent.call(_this, titleContainer);
        _super.prototype.addComponent.call(_this, _this.layer1);
        _super.prototype.addComponent.call(_this, _this.layer2);
        _super.prototype.addComponent.call(_this, _this.layer3);
        _super.prototype.addComponent.call(_this, _this.layer4);
        return _this;
    }
    SKNetworkNamespaceLayout.prototype.addComponent = function (component) {
        if (component instanceof interface_ts_1.SKInterface) {
            this.layer1.addComponent(component);
        }
        if (component instanceof SKNetworkNamespaceLayout) {
            this.layer4.addComponent(component);
        }
    };
    return SKNetworkNamespaceLayout;
}(layout_ts_1.SKFlowLayout));
exports.SKNetworkNamespaceLayout = SKNetworkNamespaceLayout;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
 * Copyright (C) 2018 Red Hat, Inc.
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var layout_ts_1 = __webpack_require__(0);
var SKTopology = /** @class */ (function (_super) {
    __extends(SKTopology, _super);
    function SKTopology(selector, width, height) {
        var _this = _super.call(this, "Topology", "topology", layout_ts_1.SKFlowLayoutOrientation.Horizontal, { left: 20, top: 20, right: 20, bottom: 20 }, { x: 20, y: 20 }) || this;
        _this.svg = d3.select(selector)
            .append("svg")
            .attr("width", width)
            .attr("height", height);
        _this.addDropShadowDefs();
        _this.svg.node().appendChild(_this.render());
        return _this;
    }
    SKTopology.prototype.addDropShadowDefs = function () {
        var defs = this.svg.append("defs");
        var filter = defs.append("filter")
            .attr("id", "drop-shadow")
            .attr("height", "130%");
        filter.append("feGaussianBlur")
            .attr("in", "SourceAlpha")
            .attr("stdDeviation", 5)
            .attr("result", "blur");
        filter.append("feOffset")
            .attr("in", "blur")
            .attr("dx", 0)
            .attr("dy", 3)
            .attr("result", "offsetBlur");
        var feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode")
            .attr("in", "offsetBlur");
        feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic");
        var marker = defs.append("marker")
            .attr("id", "markerSquare")
            .attr("markerWidth", 7)
            .attr("markerHeight", 7)
            .attr("refX", 4)
            .attr("refY", 4);
        marker.append("rect")
            .attr("x", 1)
            .attr("y", 1)
            .attr("width", 5)
            .attr("height", 5)
            .attr("style", "stroke: none; fill:#000000;");
    };
    SKTopology.prototype.setSize = function (width, height, event) {
        // do not react on event that originate from containers
        if (event && event.source === this) {
            return;
        }
        this.svg.attr('width', width);
        this.svg.attr('height', height);
    };
    return SKTopology;
}(layout_ts_1.SKFlowLayout));
exports.SKTopology = SKTopology;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map