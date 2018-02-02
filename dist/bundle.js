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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var SKEvent = /** @class */ (function () {
    function SKEvent(source) {
        this.source = source;
    }
    return SKEvent;
}());
exports.SKEvent = SKEvent;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var event_ts_1 = __webpack_require__(0);
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
    SKComponent.prototype.setPos = function (x, y, event) {
        var _this = this;
        this.x = x;
        this.y = y;
        this.svgG.attr("transform", function (d) { return "translate(" + _this.x + "," + _this.y + ")"; });
        if (!event) {
            event = new event_ts_1.SKEvent(this);
        }
        this.notifyUpdated(event);
    };
    SKComponent.prototype.setSize = function (width, height, event) {
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

exports.__esModule = true;
var layout_ts_1 = __webpack_require__(3);
var interface_ts_1 = __webpack_require__(4);
var svg = d3.select("body").append("svg")
    .attr("width", 600)
    .attr("height", 600)
    .append("g");
var main = new layout_ts_1.SKFlowLayout("Main", "layout", layout_ts_1.SKFlowLayoutOrientation.Vertical, 50, 50);
var layout1 = new layout_ts_1.SKFlowLayout("SKInterfacesA", "layout1", layout_ts_1.SKFlowLayoutOrientation.Horizontal, 50, 50);
var intf1 = new interface_ts_1.SKInterface("eth0");
var intf2 = new interface_ts_1.SKInterface("eth1");
layout1.addComponent(intf1);
layout1.addComponent(intf2);
var layout2 = new layout_ts_1.SKFlowLayout("SKInterfacesB", "layout2", layout_ts_1.SKFlowLayoutOrientation.Horizontal, 50, 50);
var intf3 = new interface_ts_1.SKInterface("eth0");
var intf4 = new interface_ts_1.SKInterface("eth1");
layout2.addComponent(intf3);
layout2.addComponent(intf4);
var link1 = new layout_ts_1.SKLink("SKLink1", "link1", intf1, intf4);
main.addLink(link1);
var components = [main];
main.addComponent(layout1);
main.addComponent(layout2);
// append the rectangles for the bar chart
svg.selectAll(".bar")
    .data(components)
    .enter()
    .append(function (d) {
    return d.render();
});
console.log("Started !!!!");


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
var event_ts_1 = __webpack_require__(0);
var component_ts_1 = __webpack_require__(1);
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
        this.svgPath = this.svgG.append("path");
        this.invalidate();
    }
    SKLink.prototype.endpoint = function (component, x1, y1, side) {
        if (side === "top") {
            return [x1, y1 - component.height / 2];
        }
        if (side === "bottom") {
            return [x1, y1 + component.height / 2];
        }
        if (side === "left") {
            return [x1 - component.width / 2, y1];
        }
        if (side === "right") {
            return [x1 + component.width / 2, y1];
        }
    };
    SKLink.prototype.anchorSide = function (component, x1, y1, x2, y2) {
        var w = component.width, h = component.height;
        var slope = (y1 - y2) / (x1 - x2);
        var hsw = slope * w / 2;
        var hsh = (h / 2) / slope;
        var hh = h / 2;
        var hw = w / 2;
        if (-hh <= hsw && hsw <= hh) {
            if (x1 < x2) {
                return "right";
            }
            return "left";
        }
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
        _this.svgRect = _this.svgG
            .append("rect")
            .attr('rx', 5)
            .attr('ry', 5);
        _this.svgComponent = _this.svgG.append("g");
        _this.svgLink = _this.svgG.append("g");
        _this.componentD3Data = _this.svgComponent.selectAll(".component");
        _this.linkD3Data = _this.svgLink.selectAll(".link");
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
    SKContainer.prototype.setSize = function (width, height, event) {
        _super.prototype.setSize.call(this, width, height);
        this.svgRect.attr("width", this.width).attr("height", this.height);
    };
    return SKContainer;
}(component_ts_1.SKComponent));
exports.SKContainer = SKContainer;
var SKFlowLayoutOrientation;
(function (SKFlowLayoutOrientation) {
    SKFlowLayoutOrientation[SKFlowLayoutOrientation["Horizontal"] = 0] = "Horizontal";
    SKFlowLayoutOrientation[SKFlowLayoutOrientation["Vertical"] = 1] = "Vertical";
})(SKFlowLayoutOrientation = exports.SKFlowLayoutOrientation || (exports.SKFlowLayoutOrientation = {}));
var SKFlowLayout = /** @class */ (function (_super) {
    __extends(SKFlowLayout, _super);
    function SKFlowLayout(name, clazz, orientation, padding, margin) {
        var _this = _super.call(this, name, clazz) || this;
        _this.orientation = orientation;
        _this.padding = padding || 0;
        _this.margin = margin || 0;
        return _this;
    }
    SKFlowLayout.prototype.invalidate = function (event) {
        var _this = this;
        var x = this.margin, y = this.margin, width = 0, height = 0;
        // do not react on event that originate from myself
        if (event && event.source === this) {
            return;
        }
        var event = new event_ts_1.SKEvent(this);
        this.componentD3Data.each(function (d, i) {
            d.setPos(x, y, event);
            if (_this.orientation === SKFlowLayoutOrientation.Horizontal) {
                x += d.width + _this.padding;
                if (height < d.height)
                    height = d.height;
                width += d.width + _this.padding;
            }
            else {
                y += d.height + _this.padding;
                if (width < d.width)
                    width = d.width;
                height += d.height + _this.padding;
            }
        });
        if (this.orientation === SKFlowLayoutOrientation.Horizontal) {
            width -= this.padding;
        }
        else {
            height -= this.padding;
        }
        this.setSize(width + this.margin * 2, height + this.margin * 2, event);
        for (var _i = 0, _a = this.links; _i < _a.length; _i++) {
            var link = _a[_i];
            link.invalidate();
        }
    };
    return SKFlowLayout;
}(SKContainer));
exports.SKFlowLayout = SKFlowLayout;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
var intfImg = __webpack_require__(5);
var SKInterface = /** @class */ (function (_super) {
    __extends(SKInterface, _super);
    function SKInterface(name, clazz) {
        if (clazz === void 0) { clazz = "sk-interface"; }
        var _this = _super.call(this, name, clazz) || this;
        _this.name = name;
        _this.clazz = clazz;
        // create the bouding box
        _this.svgRect = _this.svgG
            .append("rect")
            .attr("width", 32).attr("height", 32);
        _this.svgImg = _this.svgG.append("image")
            .attr("xlink:href", intfImg)
            .attr("width", "24px")
            .attr("height", "24px");
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
/* 5 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAiEgAAIhIBv2R/3AAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAASCSURBVHic7Zs9aBxHFMf/b07DEYRQwMTIJCnCIdIErbibvcPpA+lCKqcwDqRIYRdOFURcRDIkURkMThEwhBCMrSIBF6lTXSztrNBBWhHIBxI2jmJEMMd656WZM6e5Pdl77Ic+9tfoNPPe7v+9fTe77M0jZsY4PM87K6X0mVkJIVrMrACcG+twNNghIm2MCYlIR1EU9Hq9B+OMKSkBSilJRNeY+TMAMk+1BRAx8xdE9KXWOnInRxLQbrcXjTHfAfAKElgUPWPMh5ubm73hQTH8j1LqsjFmAycveADwhBCBUury8OCzCrBXfgOHl7wBsJ+fxkyYgXNhHSJjjD+oBGJmKKUkgADJV34XwKoQIuj3+71er/df9pqzw/O86Xq97hljfABLAOYSzHoAfK11NAUAdsEbCZ6I7gohrqyvrz/KV3Z22AvUBdDtdDo/GGNuMvMFx8wjomsAlmlhYeGslPIvOKVPRHeDIPigIN254vv+nYQkRFEUvSaklD5Gv/e7QogrBenLHRvLrjMspZS+sA83LqvHqeyfh41l1R23D3ii5U4IIYJClBVIUkxCiFZSBZh+v99zjY87NiYzPMbMSmD02X7/qN/qJsHG5D7DnDvsgeFUMFXUiTzPm5ZSvsXMdJgdEXEURb8VVYWFJEAptSSlXAIwS3Ro/AAAKeVjpdSq1npk5c6a3L8C7XZ7DsB1ALMp3GYBXLe+uZJ7Apj5HUz2TkFa31zJPQHGmFoZvi/Kqb8LVAkoW0DZTHQbbLVa7wshPmbmN55nS0RpVn/X9yul1NIL2P1ujPk2DMOf0p4jdQKazeZ5IcSPh71Oz5A5JL/ROQAzv0lE7zabzbc3Nzd/TXOC1F8BIcRHaX2KYhJtk6wBr0zgUxSptZ36RbBKQNkCyqZKQNkCyqZKQNkCyqZKQNkCyqZKQNkCyqZKQNkCyiaPBNxg5jtj5u4z8zKAvYS5PTt3P8nRHvNGJgqHyDQBzNzVWl9tNBoXAYzszYvj+FIYhisAbiW43wrDcCWO40sJcw8ajcZFrfVVZu5mqTnTBBDRQwBYW1uLkXyVH9q/SXsPHjk2w+zZYz47R1ZUa0DZAsqmSkDZAsomdQKIKM5DSBZMom2SCvh5Ap+iSK0tdQKklLeZ+R6Ao1QJMTPfk1LeTuuY+pehbrf7BMB7i4uLr9ZqtdcPHGxq6p/BZ2PMBSJ6aXh+fn5+3859T0S/DM8x8x8Dm+3t7fPO3JPB51qt9unTp08P7ByJ4/jPra2tv9PGAgDUarXc37gea61fnuRgRx2l1L9wdqpUdwEAO87YjOd502WIyRMb04wzvCOISDuDol6vn7iOERvTgYonIi2MMaFrbJsNThRJMRljwqQKAIClTqdzpgBdhWBjGdloQURaRFEUAHDbyeaMMTcLUVcANhZ3o0UURVFAzAzf95eZ+XPX8Ti2zAzT6XTOjGmZARGtBEGwfOqbpqq2ueHNTrap8Gsc/3bZcUQAPtFafzMYqFpnXauNjY0tAD4RrWD07nAciezrdt8NHhjTPT7gNLTP/w/2Wg/RCVel1AAAAABJRU5ErkJggg=="

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map