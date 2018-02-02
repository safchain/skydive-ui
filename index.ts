import {
  SKFlowLayout,
  SKFlowLayoutOrientation,
  SKLink } from "./src/layout.ts";
import { SKInterface } from "./src/interface.ts";

declare var d3: any;

var svg = d3.select("body").append("svg")
    .attr("width", 600)
    .attr("height", 600)
  .append("g");

var main = new SKFlowLayout("Main", "layout", SKFlowLayoutOrientation.Vertical, 50, 50);

var layout1 = new SKFlowLayout("SKInterfacesA", "layout1", SKFlowLayoutOrientation.Horizontal, 50, 50);
var intf1 = new SKInterface("eth0");
var intf2 = new SKInterface("eth1");
layout1.addComponent(intf1);
layout1.addComponent(intf2);

var layout2 = new SKFlowLayout("SKInterfacesB", "layout2", SKFlowLayoutOrientation.Horizontal, 50, 50);
var intf3 = new SKInterface("eth0");
var intf4 = new SKInterface("eth1");
layout2.addComponent(intf3);
layout2.addComponent(intf4);

var link1 = new SKLink("SKLink1", "link1", intf1, intf4);
main.addLink(link1);

var components = [main];


main.addComponent(layout1);
main.addComponent(layout2);

// append the rectangles for the bar chart
svg.selectAll(".bar")
  .data(components)
.enter()
  .append(function(d) {
    return d.render();
  });


console.log("Started !!!!");
