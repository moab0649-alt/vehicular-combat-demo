// Mirror of the inline module source in index.html so the scaffold can boot from file:// in Chrome.
const canvas = document.getElementById("arena-canvas");
const ctx = canvas.getContext("2d");

const ui = {
  stateLabel: document.getElementById("state-label"),
  screenTitle: document.getElementById("screen-title"),
  screenCopy: document.getElementById("screen-copy"),
  statePanel: document.getElementById("state-panel"),
  controls: document.getElementById("controls"),
};

const states = {
  menu: {
    title: "Menu",
    copy: "Start from the garage, then enter a placeholder arena flow built for later game systems.",
    panel: `
      <p class="section-label">Available flow</p>
      <ol class="state-list">
        <li>Open the garage scaffold</li>
        <li>Enter the arena placeholder</li>
        <li>Resolve a match result</li>
      </ol>
    `,
    controls: [
      { label: "Open Garage", nextState: "garage" },
    ],
  },
  garage: {
    title: "Garage",
    copy: "Garage content is intentionally minimal in this PR. It exists only as a shell for future parts and vehicle data.",
    panel: `
      <p class="section-label">Placeholder build bay</p>
      <ul class="state-list">
        <li>Chassis slot: pending data model PR</li>
        <li>Weapon kit slot: pending data model PR</li>
        <li>Tuning kit slot: pending data model PR</li>
      </ul>
    `,
    controls: [
      { label: "Back", nextState: "menu", variant: "secondary" },
      { label: "Enter Arena", nextState: "arena" },
    ],
  },
  arena: {
    title: "Arena",
    copy: "The arena currently renders a placeholder combat scene and uses state buttons instead of gameplay systems.",
    panel: `
      <p class="section-label">Placeholder actions</p>
      <ul class="state-list">
        <li>Win Match advances to a success result</li>
        <li>Lose Match advances to a failure result</li>
        <li>Garage returns to setup</li>
      </ul>
    `,
    controls: [
      { label: "Garage", nextState: "garage", variant: "secondary" },
      { label: "Win Match", nextState: "results", variant: "success", outcome: "victory" },
      { label: "Lose Match", nextState: "results", variant: "danger", outcome: "defeat" },
    ],
  },
  results: {
    title: "Results",
    copy: "This screen reports the placeholder match result and loops back into the scaffold.",
    panel: `
      <p class="section-label">Next steps</p>
      <ul class="state-list">
        <li>Play Again returns to the garage scaffold</li>
        <li>Main Menu restarts the loop</li>
      </ul>
    `,
    controls: [
      { label: "Main Menu", nextState: "menu", variant: "secondary" },
      { label: "Play Again", nextState: "garage" },
    ],
  },
};

const app = {
  currentState: "menu",
  matchOutcome: "pending",
  lastFrameTime: 0,
};

function transitionTo(nextState, details = {}) {
  app.currentState = nextState;

  if (details.outcome) {
    app.matchOutcome = details.outcome;
  } else if (nextState !== "results") {
    app.matchOutcome = "pending";
  }

  syncUI();
}

function syncUI() {
  const config = states[app.currentState];

  ui.stateLabel.textContent = config.title;
  ui.screenTitle.textContent = config.title;
  ui.screenCopy.textContent =
    app.currentState === "results"
      ? buildResultsCopy()
      : config.copy;
  ui.statePanel.innerHTML =
    app.currentState === "results"
      ? buildResultsPanel()
      : config.panel;

  ui.controls.replaceChildren(
    ...config.controls.map((control) => createControlButton(control)),
  );
}

function buildResultsCopy() {
  return app.matchOutcome === "victory"
    ? "Victory placeholder: the scaffold advanced through the arena loop successfully."
    : "Defeat placeholder: the scaffold advanced through the arena loop successfully.";
}

function buildResultsPanel() {
  const outcomeLabel = app.matchOutcome === "victory" ? "Victory" : "Defeat";

  return `
    <p class="section-label">Match outcome</p>
    <p>${outcomeLabel}</p>
    <p class="copy">Future PRs will replace this with proper scoring, match reset logic, and rewards.</p>
  `;
}

function createControlButton(control) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `control-button${control.variant ? ` ${control.variant}` : ""}`;
  button.textContent = control.label;
  button.addEventListener("click", () => {
    transitionTo(control.nextState, control);
  });
  return button;
}

function update(frameTime) {
  app.lastFrameTime = frameTime;
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackdrop();

  switch (app.currentState) {
    case "menu":
      drawMenuScene();
      break;
    case "garage":
      drawGarageScene();
      break;
    case "arena":
      drawArenaScene();
      break;
    case "results":
      drawResultsScene();
      break;
    default:
      drawMenuScene();
  }
}

function loop(frameTime) {
  update(frameTime);
  render();
  requestAnimationFrame(loop);
}

function drawBackdrop() {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#13213c");
  gradient.addColorStop(1, "#09111f");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 1;

  for (let y = 32; y < canvas.height; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function drawMenuScene() {
  drawVehicle(112, 188, "#70e1ff");
  drawVehicle(258, 144, "#98f5a5");
  drawHeadline("Tap to enter the scaffold flow");
}

function drawGarageScene() {
  drawBay();
  drawVehicle(188, 188, "#70e1ff");
  drawHeadline("Garage placeholder");
}

function drawArenaScene() {
  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  ctx.fillRect(36, 64, 303, 206);
  drawVehicle(110, 182, "#70e1ff");
  drawVehicle(266, 130, "#ff7a7a");
  drawHeadline("Arena placeholder");
}

function drawResultsScene() {
  const tone = app.matchOutcome === "victory" ? "#98f5a5" : "#ff7a7a";
  ctx.fillStyle = tone;
  ctx.beginPath();
  ctx.arc(188, 156, 56, 0, Math.PI * 2);
  ctx.fill();
  drawHeadline(app.matchOutcome === "victory" ? "Victory" : "Defeat");
}

function drawVehicle(x, y, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.fillRect(-32, -18, 64, 36);
  ctx.fillStyle = "#09111f";
  ctx.fillRect(-16, -10, 32, 20);
  ctx.fillStyle = "#1b2437";
  ctx.fillRect(-26, -24, 12, 8);
  ctx.fillRect(14, -24, 12, 8);
  ctx.fillRect(-26, 16, 12, 8);
  ctx.fillRect(14, 16, 12, 8);
  ctx.restore();
}

function drawBay() {
  ctx.strokeStyle = "rgba(112, 225, 255, 0.35)";
  ctx.lineWidth = 2;
  ctx.strokeRect(66, 76, 244, 176);
  ctx.setLineDash([10, 8]);
  ctx.strokeRect(86, 96, 204, 136);
  ctx.setLineDash([]);
}

function drawHeadline(text) {
  ctx.fillStyle = "#eef2ff";
  ctx.font = "700 18px system-ui";
  ctx.textAlign = "center";
  ctx.fillText(text, canvas.width / 2, 36);
}

syncUI();
requestAnimationFrame(loop);
