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
var SKEvent = /** @class */ (function () {
    function SKEvent(source) {
        this.source = source;
    }
    return SKEvent;
}());
// something drawable
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
        // create the bouding box
        this.svgRect = this.svgG.append("rect");
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
            event = new SKEvent(this);
        }
        this.notifyUpdated(event);
    };
    SKComponent.prototype.setSize = function (width, height, event) {
        this.width = width;
        this.height = height;
        this.svgRect.attr("width", this.width).attr("height", this.height);
        if (!event) {
            event = new SKEvent(this);
        }
        this.notifyUpdated(event);
    };
    // called when the view is invalidate, meaning needs to redraw
    SKComponent.prototype.invalidate = function (event) {
    };
    return SKComponent;
}());
var SKInterface = /** @class */ (function (_super) {
    __extends(SKInterface, _super);
    function SKInterface(name, clazz) {
        var _this = _super.call(this, name, clazz) || this;
        _this.name = name;
        _this.clazz = clazz;
        _this.setSize(20, 20);
        return _this;
    }
    return SKInterface;
}(SKComponent));
var SKLink = /** @class */ (function () {
    function SKLink(name, clazz, component1, component2) {
        this.lineGenerator = d3.line().curve(d3.curveCardinal);
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
    SKLink.prototype.localPos = function (component) {
        var x = component.x, y = component.y, container = component.container;
        while (container && this.container !== container) {
            x += container.x;
            y += container.y;
            container = container.container;
        }
        return [x, y];
    };
    SKLink.prototype.invalidate = function (event) {
        var points = [
            this.localPos(this.component1),
            this.localPos(this.component2)
        ];
        var pathData = this.lineGenerator(points);
        this.svgPath.attr('d', pathData);
    };
    SKLink.prototype.render = function () {
        return this.svgG.node();
    };
    return SKLink;
}());
var SKContainer = /** @class */ (function (_super) {
    __extends(SKContainer, _super);
    function SKContainer(name, clazz) {
        var _this = _super.call(this, name, clazz) || this;
        _this.components = new Array();
        _this.links = new Array();
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
    return SKContainer;
}(SKComponent));
var SKFlowLayoutOrientation;
(function (SKFlowLayoutOrientation) {
    SKFlowLayoutOrientation[SKFlowLayoutOrientation["Horizontal"] = 0] = "Horizontal";
    SKFlowLayoutOrientation[SKFlowLayoutOrientation["Vertical"] = 1] = "Vertical";
})(SKFlowLayoutOrientation || (SKFlowLayoutOrientation = {}));
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
        var event = new SKEvent(this);
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
//# sourceMappingURL=layout.js.map