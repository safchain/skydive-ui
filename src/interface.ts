import { SKEvent } from "./event.ts";
import { SKComponent } from "./component.ts";
import * as intfImg from "../assets/img/intf.png";

declare var d3: any;

export class SKInterface extends SKComponent {

  protected img: string;

  // svg obj
  private svgImg: any;

  constructor(name: string, clazz: string = "sk-interface") {
    super(name, clazz);

    this.name = name;
    this.clazz = clazz;

    this.svgImg = this.svgG.append("image")
      .attr("xlink:href", intfImg)
      .attr("width", "32px")
      .attr("height", "32px");

    this.svgG.append("text")
      .attr("y", 52)
      .text(this.name);

    this.setSize(32, 56);
  }
}
