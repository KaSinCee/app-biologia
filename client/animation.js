export function alertBoxShow(msg) {
  const alertStacker = document.querySelector(".alertStacker");
  const alertBox = document.createElement("div");
  alertBox.classList.add("alertBox");
  alertBox.innerHTML = `
    <div class="alertTitle">
      <i class="bi bi-exclamation-triangle-fill"></i>
      <h3>Alerta</h3>
    </div>
    <p>${msg}</p>
  `;

  alertStacker.appendChild(alertBox);

  gsap.from(alertBox, {
    opacity: 0,
    x: 400,
    duration: 0.5,
    ease: "power3.out",
    onComplete: () => {
      gsap.to(alertBox, {
        opacity: 0,
        duration: 0.3,
        delay: 4.5,
        onComplete: () => {
          alertBox.remove();
        }
      });
    }
  });
}