import { SKEvent } from "./event.ts";
import { SKComponent } from "./component.ts";
import * as intfImg from "../assets/img/intf.png";

declare var d3: any;

export class SKInterface extends SKComponent {

  protected img: string;

  // svg obj
  private svgRect: any;
  private svgImg: any;

  constructor(name: string, clazz: string = "sk-interface") {
    super(name, clazz);

    this.name = name;
    this.clazz = clazz;

    // create the bouding box
    this.svgRect = this.svgG
      .append("rect")
      .attr("width", 32).attr("height", 32);

    this.svgImg = this.svgG.append("image")
      .attr("xlink:href", intfImg)
      .attr("width", "24px")
      .attr("height", "24px");

    this.svgG.append("text")
      .attr("y", 52)
      .text(this.name);

    this.setSize(32, 56);
  }
}
