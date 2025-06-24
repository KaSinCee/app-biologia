const title = document.querySelector(".title-container h1");
const titleGroup = document.querySelector(".title-container h3");
const cripsrSpan = document.querySelector(".title-container span")
const ADNpath = document.querySelector("#pathADN");

gsap.registerPlugin(SplitText);
gsap.registerPlugin(DrawSVGPlugin);

let tl = gsap.timeline();
let split = SplitText.create(title, { type: "words" });
let splitGroup = SplitText.create(titleGroup, { type: "words, chars" });
let splitCrispr = SplitText.create(cripsrSpan, { type: "chars" });

tl.from(splitGroup.words, {
  duration: 0.3,
  y: -20,
  autoAlpha: 0,
  stagger: 0.1,
}).from(split.words, {
  duration: 0.6,
  y: 20,
  autoAlpha: 0,
  stagger: 0.1,
}).to(splitCrispr.chars, {
    color: "#349371",
    duration: .2,
    stagger: 0.05,
});


gsap.from("#pathADN", {
    drawSVG: "0",
    duration: 5,
    ease:"power1.inOut"
});