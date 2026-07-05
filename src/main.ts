import { createTelemetry } from "./telemetry";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const scoreEl = document.getElementById("score")!;
const highscoreEl = document.getElementById("highscore")!;
const statusEl = document.getElementById("status")!;
const onboardingStepsEl = document.getElementById("onboarding-steps")!;
const milestonesEl = document.getElementById("milestones")!;

const GRID = 20;
const SIZE = canvas.width / GRID;
const BASE_TICK = 130;
const MIN_TICK = 60;
const TICK_DECAY = 5; // ms schneller pro Punkt

type Dir = "up" | "down" | "left" | "right";

interface Point {
  x: number;
  y: number;
}

interface Milestone {
  id: string;
  label: string;
  threshold: number;
  rewardText: string;
  unlocked: boolean;
}

let snake: Point[] = [];
let food: Point = { x: 0, y: 0 };
let dir: Dir = "right";
let nextDir: Dir = "right";
let score = 0;
let highscore = parseInt(localStorage.getItem("snake_hs") ?? "0", 10);
let alive = true;
let intervalId: ReturnType<typeof setInterval> | null = null;
let firstDirectionSet = false;
let firstFoodCollected = false;
let finishedRun = false;
let rewardTickBonus = 0;
let rewardSizeBonus = 0;
let rewardFoodBonus = 0;

const telemetry = createTelemetry();

const ONBOARDING_STEPS = [
  { id: "move", label: "Bewege die Schlange", done: false },
  { id: "eat", label: "Sammle 1 Futter", done: false },
  { id: "finish", label: "Schliesse 1 Run ab", done: false },
];

const MILESTONES: Milestone[] = [
  {
    id: "starter",
    label: "Starter-Flow",
    threshold: 1,
    rewardText: "Unlock: +1 Bonus-Punkt pro Futter",
    unlocked: false,
  },
  {
    id: "sprinter",
    label: "Sprinter",
    threshold: 3,
    rewardText: "Unlock: schnelleres Tempo",
    unlocked: false,
  },
  {
    id: "veteran",
    label: "Veteran",
    threshold: 6,
    rewardText: "Unlock: +2 Startlaenge",
    unlocked: false,
  },
];

highscoreEl.textContent = `Highscore: ${highscore}`;

function currentTick(): number {
  return Math.max(MIN_TICK, BASE_TICK - score * TICK_DECAY - rewardTickBonus);
}

function randomFood(): Point {
  const occupied = new Set(snake.map((p) => `${p.x},${p.y}`));
  const head = snake[0];
  let p: Point;
  do {
    p = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
  } while (
    occupied.has(`${p.x},${p.y}`) ||
    (Math.abs(p.x - head.x) < 3 && Math.abs(p.y - head.y) < 3)
  );
  return p;
}

function init() {
  const initialLength = 3 + rewardSizeBonus;
  snake = [
    ...Array.from({ length: initialLength }, (_, i) => ({ x: 5 - i, y: 10 })),
  ];
  dir = "right";
  nextDir = "right";
  score = 0;
  alive = true;
  food = randomFood();
  scoreEl.textContent = "0";
  statusEl.textContent = "Pfeiltasten / WASD zum Steuern";
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const p of snake) {
    ctx.fillStyle = alive ? "#e94560" : "#555";
    ctx.fillRect(p.x * SIZE + 1, p.y * SIZE + 1, SIZE - 2, SIZE - 2);
  }

  ctx.fillStyle = "#4ecca3";
  ctx.beginPath();
  ctx.arc(food.x * SIZE + SIZE / 2, food.y * SIZE + SIZE / 2, SIZE / 2 - 2, 0, Math.PI * 2);
  ctx.fill();

  if (!alive) {
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = "24px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
  }
}

function updateOnboarding() {
  ONBOARDING_STEPS[0].done = firstDirectionSet;
  ONBOARDING_STEPS[1].done = firstFoodCollected;
  ONBOARDING_STEPS[2].done = finishedRun;
  onboardingStepsEl.innerHTML = ONBOARDING_STEPS
    .map((step) => `<li>${step.done ? "[x]" : "[ ]"} ${step.label}</li>`)
    .join("");
}

function applyMilestoneRewards() {
  rewardFoodBonus = MILESTONES.some((m) => m.id === "starter" && m.unlocked) ? 1 : 0;
  rewardTickBonus = MILESTONES.some((m) => m.id === "sprinter" && m.unlocked) ? 12 : 0;
  rewardSizeBonus = MILESTONES.some((m) => m.id === "veteran" && m.unlocked) ? 2 : 0;
}

function updateMilestones() {
  let unlockedNow = false;
  for (const milestone of MILESTONES) {
    if (!milestone.unlocked && highscore >= milestone.threshold) {
      milestone.unlocked = true;
      unlockedNow = true;
      statusEl.textContent = `${milestone.label} freigeschaltet: ${milestone.rewardText}`;
    }
  }
  if (unlockedNow) {
    applyMilestoneRewards();
  }
  milestonesEl.innerHTML = MILESTONES
    .map((m) => `<li>${m.unlocked ? "[UNLOCKED]" : "[LOCKED]"} ${m.label} (${m.threshold}) - ${m.rewardText}</li>`)
    .join("");
}

function tick() {
  if (!alive) return;

  dir = nextDir;

  const head = snake[0];
  const next: Point = { x: head.x, y: head.y };
  switch (dir) {
    case "up": next.y -= 1; break;
    case "down": next.y += 1; break;
    case "left": next.x -= 1; break;
    case "right": next.x += 1; break;
  }

  if (next.x < 0 || next.x >= GRID || next.y < 0 || next.y >= GRID) {
    die();
    return;
  }

  if (snake.some((p) => p.x === next.x && p.y === next.y)) {
    die();
    return;
  }

  snake.unshift(next);

  if (next.x === food.x && next.y === food.y) {
    firstFoodCollected = true;
    telemetry.trackTutorialComplete();
    score += 1 + rewardFoodBonus;
    scoreEl.textContent = String(score);

    if (snake.length === GRID * GRID) {
      win();
      return;
    }

    food = randomFood();
    updateOnboarding();
    startLoop();
  } else {
    snake.pop();
  }

  draw();
}

function die() {
  alive = false;
  finishedRun = true;
  telemetry.trackFirstLose(score);
  draw();
  statusEl.textContent = "Game Over – Neustart drücken";
  if (score > highscore) {
    highscore = score;
    localStorage.setItem("snake_hs", String(highscore));
    highscoreEl.textContent = `Highscore: ${highscore}`;
    statusEl.textContent = "Neuer Highscore!";
  }
  updateMilestones();
  updateOnboarding();
}

function win() {
  alive = false;
  finishedRun = true;
  telemetry.trackFirstWin(score);
  draw();
  statusEl.textContent = "Du hast gewonnen! Neustart drücken";
  if (score > highscore) {
    highscore = score;
    localStorage.setItem("snake_hs", String(highscore));
    highscoreEl.textContent = `Highscore: ${highscore}`;
  }
  updateMilestones();
  updateOnboarding();
}

function setDir(d: Dir) {
  const opposites: Record<Dir, Dir> = { up: "down", down: "up", left: "right", right: "left" };
  if (d !== opposites[dir]) {
    firstDirectionSet = true;
    nextDir = d;
    updateOnboarding();
  }
}

document.addEventListener("keydown", (e) => {
  const keyMap: Record<string, Dir> = {
    ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
    w: "up", W: "up", s: "down", S: "down", a: "left", A: "left", d: "right", D: "right",
  };
  const d = keyMap[e.key];
  if (d) {
    e.preventDefault();
    setDir(d);
  }
});

function startLoop() {
  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(tick, currentTick());
}

document.getElementById("restart-btn")!.addEventListener("click", () => {
  init();
  draw();
  startLoop();
});

init();
telemetry.trackSessionStart();
draw();
updateOnboarding();
updateMilestones();
startLoop();
