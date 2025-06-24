const rectHeight = 45;
const rectWidth = 60;
const fontSize = rectWidth / 3;
const rectSeparation = rectWidth + 10;

const colors = { A: "#9ed2db", T: "#ededed", C: "#70dbb6", G: "#EEF1FB" };
const infoBases = {
  A: {
    name: "Adenina",
    formula: "C5H5N5",
  },
  T: {
    name: "Timina",
    formula: "C5H6N2O2",
  },
  C: {
    name: "Citosina",
    formula: "C4H5N3O",
  },
  G: {
    name: "Guanina",
    formula: "C5H5N5O",
  },
  U: {
    name: "Uracilo",
    formula: "C4H4N2O2",
  },
};

const divInfo = d3
  .select("#container")
  .append("div")
  .style("opacity", 0)
  .attr("class", "toolTip-bases");

export function graphStrand(container, data, rectClass, classAttrRect, classAttrText) {
  container
    .selectAll(`rect.${rectClass}`)
    .data(data)
    .enter()
    .append("rect")
    .attr("class", (d, i) => {
      if (typeof classAttrRect === "string") {
        return classAttrRect;
      } else {
        return classAttrRect[i];
      }
    })
    .attr("width", rectWidth)
    .attr("height", rectHeight)
    .attr("border-radius", 10)
    .attr("fill", (d) => colors[d])
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("rx", 10)
    .attr("y", rectHeight)
    .attr("x", (d, i) => i * rectSeparation)
    .on("mouseover", function (e, d) {
      const rectNode = d3.select(this).node();
      const container = document.getElementById("container");

      const rectBox = rectNode.getBoundingClientRect();
      const containerBox = container.getBoundingClientRect();

      const leftInContainer =
        rectBox.left - containerBox.left + container.scrollLeft;
      const topInContainer =
        rectBox.top - containerBox.top + container.scrollTop;

      divInfo.transition().duration(100).style("opacity", 1);

      divInfo
        .html(
          `
        <p>Base: ${d}</p>
        <p>Nombre: ${infoBases[d].name}</p>
        <p>Fórmula: ${infoBases[d].formula}</p>
      `
        )
        .style("left", `${leftInContainer + 80}px`)
        .style("top", `${topInContainer - 15}px`);
    })
    .on("mouseout", (e, d) => {
      divInfo
        .transition(d3.transition().duration(100).ease(d3.easeLinear))
        .style("opacity", 0);
    });

  container
    .selectAll(`text.${rectClass}`)
    .data(data)
    .enter()
    .append("text")
    .text((d) => d)
    .attr("x", (d, i) => i * rectSeparation + rectWidth / 2)
    .attr("y", rectHeight + 30)
    .attr("class", (d, i) => {
      if (typeof classAttrText === "string") {
        return classAttrText;
      } else {
        return classAttrText[i];
      }
    })
    .attr("font-size", "20px")
    .attr("font-weight", "800")
    .attr("text-anchor", "middle")
    .attr("fill", "black")
    .on("mouseover", () => {
      divInfo
        .transition(d3.transition().duration(0).ease(d3.easeLinear))
        .style("opacity", 1);
    });
}
