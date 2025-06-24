import { graphStrand } from "./graphFunc.js";
const svgWindow = document.getElementById("container");

let seq = "";
let seqArr = seq.split("");

export const F_Strand = d3.select("svg.first-strand");
export const S_Strand = d3.select("svg.second-strand");
export const ARN_Strand = d3.select("svg.arn_strand");

const divInfo = d3
  .select("#container")
  .append("div")
  .style("opacity", 0)
  .attr("class", "toolTip-bases");

// Control de los rects (SVG)
const rectHeight = 45;
const rectWidth = 60;
const fontSize = rectWidth / 3;
const rectSeparation = rectWidth + 10;
const svgHeight = rectHeight;
let svgWidth = seq.length * rectSeparation;

function getComplementADN(base) {
  return { A: "T", C: "G", T: "A", G: "C" }[base] || "-";
}

function getComplementARN(base) {
  return { A: "U", C: "G", T: "A", G: "C" }[base] || "-";
}

let comp = seqArr.map(getComplementADN);
let compARN = seqArr.map(getComplementARN);

let PAM = false;
const pamsArr = ["AGG", "TGG", "CGG", "GGG"];
export let pamsFounds = [];
const colors = { A: "#caf205", T: "#aafc5d", C: "#5dfcbd", G: "#e7fc5d" };
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

export function graphLoad() {
  F_Strand.style("width", svgWidth)
    .attr("height", svgHeight + 4)
    .attr(
      "viewBox",
      `-${(rectSeparation - rectWidth) / 2} ${
        rectHeight - 1
      } ${svgWidth} ${svgHeight}`
    );
  S_Strand.style("width", svgWidth)
    .attr("height", svgHeight + 4)
    .attr(
      "viewBox",
      `-${(rectSeparation - rectWidth) / 2} ${
        rectHeight - 1
      } ${svgWidth} ${svgHeight}`
    );
  ARN_Strand.style("width", svgWidth)
    .attr("height", svgHeight + 4)
    .attr(
      "viewBox",
      `-${(rectSeparation - rectWidth) / 2} ${
        rectHeight - 1
      } ${svgWidth} ${svgHeight}`
    );
}

export function setSeq(seqAdn) {
  seq = seqAdn;
}

export function getComp() {
  return comp.join("");
}

export function resetStrands() {
  F_Strand.selectAll("rect.top").remove();
  F_Strand.selectAll("text.top").remove();
  S_Strand.selectAll("rect.bottom").remove();
  S_Strand.selectAll("text.bottom").remove();
}

export function chargeStrands() {
  resetStrands();
  getPams();
  svgWidth = seq.length * rectSeparation;
  seqArr = seq.split("");
  comp = seqArr.map(getComplementADN);
  compARN = seqArr.map(getComplementARN);
  graphStrand(F_Strand, comp, "top", "top", "top");
  graphStrand(S_Strand, seqArr, "bottom", "bottom", "bottom");
  graphLoad();
}

function graphAddBases(seqLength, pos, newSeqAdd) {
  resetStrands();
  seqArr = seq.split("");
  comp = seqArr.map(getComplementADN);
  compARN = seqArr.map(getComplementARN);

  graphStrand(
    F_Strand,
    comp,
    "top",
    seqArr.map((e, i) => {
      if (i >= pos && i < pos + newSeqAdd.length) {
        return "top newTopBase";
      } else {
        return "top";
      }
    }),
    seqArr.map((e, i) => {
      if (i >= pos && i < pos + newSeqAdd.length) {
        return "top newTopText";
      } else {
        return "top";
      }
    })
  );

  // Animación de la introducción de las bases en posición n

  F_Strand.selectAll("rect.newTopBase")
    .attr("y", -rectHeight * 3)
    .transition()
    .attr("stroke-width", 3)
    .attr("stroke", "#334a63")
    .attr("y", rectHeight)
    .duration(200)
    .delay((d, i) => i * 200)
    .ease(d3.easeQuadOut);

  F_Strand.selectAll("text.newTopText")
    .attr("y", -rectHeight)
    .transition()
    .attr("y", rectHeight + 30)
    .duration(200)
    .delay((d, i) => i * 200)
    .ease(d3.easeQuadOut);

  //---------------------------------------------------------------

  graphStrand(
    S_Strand,
    seqArr,
    "bottom",
    comp.map((e, i) => {
      if (i >= pos && i < pos + newSeqAdd.length) {
        return "bottom newBottomRect";
      } else {
        return "bottom";
      }
    }),
    comp.map((e, i) => {
      if (i >= pos && i < pos + newSeqAdd.length) {
        return "bottom newBottomText";
      } else {
        return "bottom";
      }
    })
  );

  S_Strand.selectAll("rect.newBottomRect")
    .attr("y", rectHeight * 3)
    .transition()
    .attr("stroke-width", 3)
    .attr("stroke", "#334a63")
    .attr("y", rectHeight)
    .duration(200)
    .delay((d, i) => i * 200)
    .ease(d3.easeQuadOut);

  S_Strand.selectAll("text.newBottomText")
    .attr("y", rectHeight * 3)
    .transition()
    .attr("y", rectHeight + 30)
    .duration(200)
    .delay((d, i) => i * 200)
    .ease(d3.easeQuadOut);
}

export function getPamPos(index) {
  return pamsFounds[index].pos;
}

export function getPams() {
  pamsFounds = [];
  comp = seqArr.map(getComplementADN);
  for (let i = 0; i < pamsArr.length; i++) {
    for (let j = 0; j <= comp.join("").length - 2; j++) {
      if (comp.join("").slice(j, j + 3) == pamsArr[i]) {
        PAM = true;
        pamsFounds.push({ pam: pamsArr[i], pos: j });
      }
    }
  }
  pamsFounds.sort((a, b) => a.pos - b.pos);
}

export function selectPam(index) {
  F_Strand.selectAll("rect.top")
    .style("stroke-dasharray", 0)
    .style("stroke-width", 2);

  F_Strand.selectAll("rect.newTopBase")
  .style("stroke-width", 3);

  for (let i = 0; i <= 2; i++) {
    let pam = F_Strand.selectAll("rect.top").nodes()[pamsFounds[index].pos + i];
    d3.select(pam)
      .style("stroke-dasharray", 10)
      .style("stroke-width", 3)
      .style("animation", "selectPam 0.5s linear infinite");
  }
  svgWindow.scroll((pamsFounds[index].pos - 2) * rectSeparation, 0);
}

export function cutStrands(index) {
  for (let i = index - 3; i < seq.length; i++) {
    d3.select(F_Strand.selectAll("rect.top").nodes()[i])
      .transition()
      .duration(200)
      .ease(d3.easeQuadOut)
      .attr("x", (i + 0.5) * rectSeparation);
    d3.select(F_Strand.selectAll("text.top").nodes()[i])
      .transition()
      .duration(200)
      .ease(d3.easeQuadOut)
      .attr("x", (i + 0.5) * rectSeparation + rectWidth / 2);
    d3.select(S_Strand.selectAll("rect.bottom").nodes()[i])
      .transition()
      .duration(200)
      .ease(d3.easeQuadOut)
      .attr("x", (i + 0.5) * rectSeparation);
    d3.select(S_Strand.selectAll("text.bottom").nodes()[i])
      .transition()
      .duration(200)
      .ease(d3.easeQuadOut)
      .attr("x", (i + 0.5) * rectSeparation + rectWidth / 2);
  }
}

export function addBases(pos, newSeqAdd) {
  seq = seq.slice(0, pos) + newSeqAdd + seq.slice(pos); // Actualizamos el seq
  let seqLength = seq.length;
  svgWidth = seq.length * rectSeparation;
  graphLoad();
  graphAddBases(seqLength, pos, newSeqAdd);
  getPams();
  svgWindow.scroll((pos - 3) * rectSeparation, 0);
  deleteARNg();
}

export function deleteARNg() {
  ARN_Strand.selectAll("rect.arn_strand")
    .transition()
    .duration(400)
    .attr("y", rectHeight * 3)
    .ease(d3.easeQuadOut)
    .remove();

  ARN_Strand.selectAll("text.arn_text_strand")
    .transition()
    .attr("y", rectHeight * 3)
    .duration(400)
    .ease(d3.easeBackOut)
    .remove();
}

export function addARNg(index) {
  if (PAM) {
    let posPam = pamsFounds[index].pos,
      dataArn = [],
      xOffset;

    if (posPam >= 20) {
      xOffset = posPam - 20;
      dataArn = compARN.slice(xOffset, posPam);
    } else {
      xOffset = 0;
      dataArn = compARN.slice(xOffset, posPam);
    }

    ARN_Strand.selectAll("rect.arn_strand")
      .data(dataArn)
      .enter()
      .append("rect")
      .attr("class", "arn_strand")
      .attr("width", rectWidth)
      .attr("height", rectHeight)
      .attr("border-radius", 10)
      .attr("rx", 10)
      .attr("fill", "#ebf2ee")
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("x", (d, i) => (xOffset + i) * rectSeparation)
      .attr("y", rectHeight * 3)
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
      .on("mouseout", () => {
        divInfo
          .transition(d3.transition().duration(100).ease(d3.easeLinear))
          .style("opacity", 0);
      })
      .transition()
      .attr("y", rectHeight)
      .duration(400)
      .ease(d3.easeBackOut);

    ARN_Strand.selectAll("text.arn_strand")
      .data(dataArn)
      .enter()
      .append("text")
      .text((d) => d)
      .attr("x", (d, i) => (xOffset + i) * rectSeparation + rectWidth / 2)
      .attr("y", rectHeight * 3)
      .attr("class", "arn_text_strand")
      .attr("font-size", "20px")
      .attr("font-weight", "800")
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .on("mouseover", () => {
        divInfo
          .transition(d3.transition().duration(0).ease(d3.easeLinear))
          .style("opacity", 1);
      })
      .transition()
      .attr("y", rectHeight + 30)
      .duration(400)
      .ease(d3.easeSinOut);
  } else {
    console.log("No hay PAM en la secuencia");
  }
}
