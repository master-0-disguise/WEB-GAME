"use strict";

const STORAGE_KEY = "mindspark-progress-v1";
const GAME_INFO = {
	memory: { title: "Memory Matrix", category: "MEMORY TRAINING", radar: "memory", description: "Watch each tile light up, then repeat the sequence in the same order." },
	number: { title: "Number Detective", category: "LOGIC TRAINING", radar: "logic", description: "Work out the number rule and choose the next value." },
	color: { title: "Color Confusion", category: "FOCUS TRAINING", radar: "focus", description: "Read the ink color, not the word itself." },
	reflex: { title: "Reflex Challenge", category: "SPEED TRAINING", radar: "speed", description: "Wait for the green target to appear, then tap it as fast as you can." },
	pattern: { title: "Pattern Master", category: "LOGIC TRAINING", radar: "logic", description: "Find the pattern and choose which symbol comes next." }
};
const COLORS = [
	{ name: "RED", value: "#ff746f" },
	{ name: "BLUE", value: "#73aaff" },
	{ name: "GREEN", value: "#65dda8" },
	{ name: "YELLOW", value: "#f4d45c" },
	{ name: "PURPLE", value: "#c2a0ff" }
];
const NUMBER_QUESTIONS = {
	easy: [
		{ sequence: [2, 4, 6, 8], answer: "10", options: ["9", "10", "12", "16"], explanation: "The sequence adds 2 each time." },
		{ sequence: [3, 6, 9, 12], answer: "15", options: ["14", "15", "18", "24"], explanation: "The sequence adds 3 each time." },
		{ sequence: [1, 2, 4, 8], answer: "16", options: ["12", "14", "16", "18"], explanation: "Each number is doubled." },
		{ sequence: [5, 10, 15, 20], answer: "25", options: ["22", "25", "30", "35"], explanation: "The sequence adds 5 each time." }
	],
	medium: [
		{ sequence: [2, 4, 8, 16], answer: "32", options: ["24", "30", "32", "36"], explanation: "Each number is doubled." },
		{ sequence: [1, 4, 9, 16], answer: "25", options: ["20", "24", "25", "36"], explanation: "These are square numbers: 1², 2², 3², 4², then 5²." },
		{ sequence: [2, 3, 5, 8], answer: "13", options: ["11", "12", "13", "15"], explanation: "Each number is the sum of the previous two." },
		{ sequence: [3, 7, 11, 15], answer: "19", options: ["17", "18", "19", "21"], explanation: "The sequence adds 4 each time." },
		{ sequence: [81, 27, 9, 3], answer: "1", options: ["0", "1", "2", "6"], explanation: "Each number is divided by 3." }
	],
	hard: [
		{ sequence: [1, 2, 6, 24], answer: "120", options: ["96", "100", "120", "144"], explanation: "Multiply by 2, then 3, then 4, then 5." },
		{ sequence: [2, 5, 10, 17], answer: "26", options: ["24", "25", "26", "29"], explanation: "Add consecutive odd numbers: 3, 5, 7, then 9." },
		{ sequence: [4, 9, 19, 39], answer: "79", options: ["59", "69", "79", "89"], explanation: "Double each number and add 1." },
		{ sequence: [1, 1, 2, 3, 5], answer: "8", options: ["7", "8", "9", "10"], explanation: "Each number is the sum of the two before it." },
		{ sequence: [100, 50, 25, 12.5], answer: "6.25", options: ["5", "6.25", "7.5", "10"], explanation: "Each number is halved." }
	]
};
const PATTERNS = {
	easy: [
		{ sequence: ["●", "▲", "●", "▲", "●"], answer: "▲", options: ["●", "▲", "■", "◆"] },
		{ sequence: ["★", "★", "○", "★", "★"], answer: "○", options: ["★", "○", "□", "△"] },
		{ sequence: ["1", "2", "1", "2", "1"], answer: "2", options: ["1", "2", "3", "4"] },
		{ sequence: ["◆", "◇", "◆", "◇", "◆"], answer: "◇", options: ["◆", "◇", "○", "□"] }
	],
	medium: [
		{ sequence: ["●", "●", "▲", "●", "●", "▲"], answer: "●", options: ["●", "▲", "■", "◆"] },
		{ sequence: ["1", "3", "6", "10", "15"], answer: "21", options: ["18", "20", "21", "25"] },
		{ sequence: ["A", "C", "E", "G"], answer: "I", options: ["H", "I", "J", "K"] },
		{ sequence: ["○", "△", "□", "○", "△"], answer: "□", options: ["○", "△", "□", "◇"] },
		{ sequence: ["2", "4", "8", "16"], answer: "32", options: ["24", "30", "32", "36"] }
	],
	hard: [
		{ sequence: ["2", "6", "12", "20", "30"], answer: "42", options: ["36", "40", "42", "48"] },
		{ sequence: ["Z", "X", "U", "Q"], answer: "L", options: ["M", "L", "K", "J"] },
		{ sequence: ["1", "4", "2", "8", "3", "12"], answer: "4", options: ["4", "14", "16", "20"] },
		{ sequence: ["▲", "■", "●", "▲", "■"], answer: "●", options: ["▲", "■", "●", "◆"] },
		{ sequence: ["3", "6", "18", "72"], answer: "360", options: ["288", "300", "360", "432"] }
	]
};

const elements = {
	dashboard: document.querySelector("#home"),
	gameScreen: document.querySelector("#game-screen"),
	totalPoints: document.querySelector("#total-points"),
	bestScore: document.querySelector("#best-score"),
	completedCount: document.querySelector("#completed-count"),
	dailyName: document.querySelector("#daily-game-name"),
	dailyDate: document.querySelector("#daily-date"),
	todayLabel: document.querySelector("#today-label"),
	dailyButton: document.querySelector("#daily-button"),
	dashboardButton: document.querySelector("#dashboard-button"),
	restartButton: document.querySelector("#restart-button"),
	difficulty: document.querySelector("#difficulty-select"),
	title: document.querySelector("#challenge-title"),
	category: document.querySelector("#challenge-category"),
	subtitle: document.querySelector("#challenge-subtitle"),
	score: document.querySelector("#session-score"),
	accuracy: document.querySelector("#session-accuracy"),
	time: document.querySelector("#time-left"),
	round: document.querySelector("#round-count"),
	progress: document.querySelector("#progress-bar"),
	progressFill: document.querySelector("#progress-fill"),
	progressLabel: document.querySelector("#progress-label"),
	stage: document.querySelector("#game-stage"),
	feedback: document.querySelector("#game-feedback")
};

function emptyStats() {
	return {
		totalPoints: 0,
		bestScore: 0,
		completed: 0,
		radar: { memory: 0, logic: 0, focus: 0, speed: 0 },
		radarRuns: { memory: 0, logic: 0, focus: 0, speed: 0 },
		dailyCompleted: ""
	};
}

function loadStats() {
	const fallback = emptyStats();
	try {
		const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
		if (!saved || typeof saved !== "object" || Array.isArray(saved)) return fallback;
		for (const key of ["totalPoints", "bestScore", "completed"]) {
			if (Number.isFinite(saved[key]) && saved[key] >= 0) fallback[key] = Math.floor(saved[key]);
		}
		for (const category of Object.keys(fallback.radar)) {
			if (saved.radar && Number.isFinite(saved.radar[category])) fallback.radar[category] = Math.max(0, Math.min(100, Math.round(saved.radar[category])));
			if (saved.radarRuns && Number.isFinite(saved.radarRuns[category]) && saved.radarRuns[category] >= 0) fallback.radarRuns[category] = Math.floor(saved.radarRuns[category]);
		}
		if (typeof saved.dailyCompleted === "string") fallback.dailyCompleted = saved.dailyCompleted;
	} catch (error) {
		console.warn("Saved progress could not be read; starting with a clean score.", error);
	}
	return fallback;
}

let stats = loadStats();
let activeGame = null;
let timeoutIds = new Set();
let intervalId = null;
let session = null;

function persistStats() {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
	} catch (error) {
		console.warn("Progress could not be saved in this browser session.", error);
	}
}

function todayKey(date = new Date()) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

function dailyGameKey(dateKey = todayKey()) {
	const gameKeys = Object.keys(GAME_INFO);
	let hash = 0;
	for (const character of dateKey) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
	return gameKeys[hash % gameKeys.length];
}

function renderDashboard() {
	elements.totalPoints.textContent = stats.totalPoints.toLocaleString();
	elements.bestScore.textContent = stats.bestScore.toLocaleString();
	elements.completedCount.textContent = stats.completed.toLocaleString();
	const key = dailyGameKey();
	elements.dailyName.textContent = GAME_INFO[key].title;
	elements.dailyDate.textContent = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric" }).format(new Date());
	elements.todayLabel.textContent = new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" }).format(new Date());
	elements.dailyButton.querySelector("span:nth-child(2)").textContent = stats.dailyCompleted === todayKey() ? "Replay today’s challenge" : "Play today’s challenge";
	let hasResults = false;
	for (const category of Object.keys(stats.radar)) {
		const score = stats.radar[category];
		document.querySelector(`#radar-${category}-value`).textContent = score;
		document.querySelector(`#radar-${category}-bar`).style.width = `${score}%`;
		if (stats.radarRuns[category] > 0) hasResults = true;
	}
	document.querySelector("#radar-empty").hidden = hasResults;
}

function schedule(callback, delay) {
	const timeout = window.setTimeout(() => {
		timeoutIds.delete(timeout);
		callback();
	}, delay);
	timeoutIds.add(timeout);
	return timeout;
}

function clearGameTimers() {
	if (intervalId !== null) window.clearInterval(intervalId);
	intervalId = null;
	for (const timeout of timeoutIds) window.clearTimeout(timeout);
	timeoutIds.clear();
}

function openGame(gameKey, isDaily = false) {
	if (!GAME_INFO[gameKey]) return;
	clearGameTimers();
	activeGame = gameKey;
	session = null;
	elements.dashboard.hidden = true;
	elements.gameScreen.hidden = false;
	elements.title.textContent = GAME_INFO[gameKey].title;
	elements.category.textContent = isDaily ? "TODAY'S DAILY CHALLENGE" : GAME_INFO[gameKey].category;
	elements.subtitle.textContent = GAME_INFO[gameKey].description;
	elements.difficulty.value = "medium";
	elements.score.textContent = "0";
	elements.accuracy.textContent = "—";
	elements.time.textContent = "—";
	elements.round.textContent = "—";
	setProgress(0);
	setFeedback("");
	showIntro(isDaily);
	window.scrollTo({ top: 0, behavior: "smooth" });
}

function showIntro(isDaily = false) {
	const dailyNote = isDaily ? " This is today’s repeatable daily pick." : "";
	elements.stage.innerHTML = `
		<p class="stage-kicker">READY WHEN YOU ARE</p>
		<h2 class="stage-title">${escapeHtml(GAME_INFO[activeGame].title)}</h2>
		<p class="stage-copy">${escapeHtml(GAME_INFO[activeGame].description)}${dailyNote}</p>
		<button class="button button-primary" id="start-button" type="button">Start challenge <span aria-hidden="true">→</span></button>`;
	document.querySelector("#start-button").addEventListener("click", startSession);
}

function escapeHtml(text) {
	return String(text).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function startSession() {
	clearGameTimers();
	const difficulty = elements.difficulty.value;
	const duration = { easy: 75, medium: 60, hard: 45 }[difficulty];
	const rounds = activeGame === "memory" ? 6 : activeGame === "reflex" ? 5 : 8;
	session = {
		difficulty,
		score: 0,
		correct: 0,
		answered: 0,
		round: 0,
		rounds,
		timeLeft: duration,
		locked: false,
		isDaily: elements.category.textContent === "TODAY'S DAILY CHALLENGE",
		sequence: [],
		memoryIndex: 0,
		roundStarted: 0,
		waitingForTarget: false,
		targetVisible: false
	};
	elements.difficulty.disabled = true;
	updateMetrics();
	intervalId = window.setInterval(() => {
		if (!session) return;
		session.timeLeft -= 1;
		updateMetrics();
		if (session.timeLeft <= 0) finishSession(true);
	}, 1000);
	nextRound();
}

function updateMetrics() {
	if (!session) return;
	elements.score.textContent = session.score.toLocaleString();
	elements.accuracy.textContent = session.answered ? `${Math.round(session.correct / session.answered * 100)}%` : "—";
	elements.time.textContent = `${session.timeLeft}s`;
	elements.round.textContent = `${Math.min(session.round, session.rounds)} / ${session.rounds}`;
}

function setProgress(percent) {
	const bounded = Math.max(0, Math.min(100, percent));
	elements.progressFill.style.width = `${bounded}%`;
	elements.progressLabel.textContent = `${Math.round(bounded)}%`;
	elements.progress.setAttribute("aria-valuenow", String(Math.round(bounded)));
}

function setFeedback(message, kind = "") {
	elements.feedback.textContent = message;
	elements.feedback.className = `game-feedback${kind ? ` feedback-${kind}` : ""}`;
}

function nextRound() {
	if (!session) return;
	if (session.round >= session.rounds) {
		finishSession(false);
		return;
	}
	session.round += 1;
	session.locked = false;
	session.roundStarted = performance.now();
	setProgress((session.round - 1) / session.rounds * 100);
	updateMetrics();
	setFeedback("");
	if (activeGame === "memory") showMemoryRound();
	else if (activeGame === "number") showNumberRound();
	else if (activeGame === "color") showColorRound();
	else if (activeGame === "pattern") showPatternRound();
	else showReflexRound();
}

function awardAnswer(isCorrect, explanation = "", responseTime = performance.now() - session.roundStarted) {
	if (!session || session.locked) return false;
	session.locked = true;
	session.answered += 1;
	if (isCorrect) {
		session.correct += 1;
		const speedBonus = Math.max(0, Math.min(40, Math.round(40 - responseTime / 100)));
		session.score += 100 + speedBonus;
		setFeedback(`Correct! +${100 + speedBonus} points.${explanation ? ` ${explanation}` : ""}`, "good");
	} else {
		setFeedback(`Not quite. ${explanation}`, "bad");
	}
	updateMetrics();
	if (session) setProgress(session.round / session.rounds * 100);
	schedule(nextRound, 850);
	return true;
}

function showMemoryRound() {
	const sequenceLength = Math.min(2 + session.round - 1, 7);
	session.sequence = Array.from({ length: sequenceLength }, () => Math.floor(Math.random() * 9));
	session.memoryIndex = 0;
	session.locked = true;
	elements.stage.innerHTML = `<p class="stage-kicker">ROUND ${session.round} · MEMORIZE THE ORDER</p><h2 class="stage-title" id="memory-instruction">Watch the tiles light up</h2><p class="stage-copy">Sequence length: ${sequenceLength}. Repeat each tile in the same order.</p><div class="memory-grid" id="memory-grid" aria-label="Memory tile grid"></div>`;
	const grid = document.querySelector("#memory-grid");
	for (let index = 0; index < 9; index += 1) {
		const tile = document.createElement("button");
		tile.type = "button";
		tile.className = "memory-tile";
		tile.setAttribute("aria-label", `Tile ${index + 1}`);
		tile.disabled = true;
		tile.dataset.tile = String(index);
		tile.addEventListener("click", () => selectMemoryTile(index, tile));
		grid.append(tile);
	}
	let flashIndex = 0;
	const lightNext = () => {
		if (!session || activeGame !== "memory") return;
		if (flashIndex >= session.sequence.length) {
			document.querySelectorAll(".memory-tile").forEach((tile) => { tile.disabled = false; });
			document.querySelector("#memory-instruction").textContent = "Your turn: repeat the sequence";
			session.locked = false;
			session.roundStarted = performance.now();
			return;
		}
		const tile = grid.querySelector(`[data-tile="${session.sequence[flashIndex]}"]`);
		tile.classList.add("is-lit");
		schedule(() => {
			tile.classList.remove("is-lit");
			flashIndex += 1;
			schedule(lightNext, 180);
		}, 420);
	};
	schedule(lightNext, 550);
}

function selectMemoryTile(index, tile) {
	if (!session || session.locked || tile.disabled) return;
	tile.classList.add("is-selected");
	schedule(() => tile.classList.remove("is-selected"), 180);
	if (session.sequence[session.memoryIndex] !== index) {
		document.querySelectorAll(".memory-tile").forEach((item) => { item.disabled = true; });
		awardAnswer(false, "The sequence was different.");
		return;
	}
	session.memoryIndex += 1;
	if (session.memoryIndex === session.sequence.length) {
		document.querySelectorAll(".memory-tile").forEach((item) => { item.disabled = true; });
		awardAnswer(true, "You followed the full sequence.");
	}
}

function pickQuestion(questionList) {
	const question = questionList[Math.floor(Math.random() * questionList.length)];
	return { ...question, options: [...question.options].sort(() => Math.random() - 0.5) };
}

function showNumberRound() {
	const question = pickQuestion(NUMBER_QUESTIONS[session.difficulty]);
	const sequenceMarkup = question.sequence.map((number) => `<span class="sequence-item">${escapeHtml(number)}</span>`).join("");
	elements.stage.innerHTML = `<p class="stage-kicker">ROUND ${session.round} · FIND THE RULE</p><h2 class="stage-title">What number comes next?</h2><div class="sequence-line">${sequenceMarkup}<span class="sequence-item question">?</span></div><div class="answer-grid" role="group" aria-label="Answer choices">${question.options.map((option) => `<button class="answer-button" type="button" data-answer="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join("")}</div>`;
	attachAnswers(question.answer, question.explanation);
}

function showColorRound() {
	const word = COLORS[Math.floor(Math.random() * COLORS.length)];
	let ink = COLORS[Math.floor(Math.random() * COLORS.length)];
	while (ink.name === word.name) ink = COLORS[Math.floor(Math.random() * COLORS.length)];
	const options = [...COLORS].sort(() => Math.random() - 0.5);
	elements.stage.innerHTML = `<p class="stage-kicker">ROUND ${session.round} · IGNORE THE WORD</p><h2 class="stage-title">Which color is the text?</h2><p class="stage-copy">Choose the color of the letters, not the word you read.</p><p class="color-word" style="color:${ink.value}">${word.name}</p><div class="answer-grid" role="group" aria-label="Choose the text color">${options.map((color) => `<button class="answer-button" type="button" data-answer="${color.name}">${color.name[0]}${color.name.slice(1).toLowerCase()}</button>`).join("")}</div>`;
	attachAnswers(ink.name, `The letters were ${ink.name.toLowerCase()}.`);
}

function showPatternRound() {
	const question = pickQuestion(PATTERNS[session.difficulty]);
	const symbols = question.sequence.map((symbol) => `<span class="pattern-token">${escapeHtml(symbol)}</span>`).join("");
	const options = [...question.options].sort(() => Math.random() - 0.5);
	elements.stage.innerHTML = `<p class="stage-kicker">ROUND ${session.round} · SPOT THE PATTERN</p><h2 class="stage-title">What comes next?</h2><div class="pattern-display">${symbols}<span class="pattern-token">?</span></div><div class="answer-grid" role="group" aria-label="Pattern choices">${options.map((option) => `<button class="answer-button" type="button" data-answer="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join("")}</div>`;
	attachAnswers(question.answer, `The next item is ${question.answer}.`);
}

function attachAnswers(correctAnswer, explanation) {
	const buttons = [...elements.stage.querySelectorAll("[data-answer]")];
	buttons.forEach((button) => {
		button.addEventListener("click", () => {
			if (!session || session.locked) return;
			const correct = button.dataset.answer === String(correctAnswer);
			session.locked = true;
			buttons.forEach((answerButton) => {
				answerButton.disabled = true;
				if (answerButton.dataset.answer === String(correctAnswer)) answerButton.classList.add("answer-correct");
			});
			if (!correct) button.classList.add("answer-wrong");
			session.locked = false;
			awardAnswer(correct, explanation);
		});
	});
}

function showReflexRound() {
	session.waitingForTarget = true;
	session.targetVisible = false;
	session.locked = true;
	elements.stage.innerHTML = `<p class="stage-kicker">ROUND ${session.round} · WAIT FOR IT</p><h2 class="stage-title">Stay ready...</h2><p class="stage-copy">Tap the target only after it turns green.</p><div class="reflex-zone"><button class="reflex-target" id="reflex-target" type="button" disabled aria-label="Target has not appeared">Wait</button></div>`;
	const target = document.querySelector("#reflex-target");
	target.addEventListener("click", () => {
		if (!session || !session.targetVisible || session.locked) return;
		const reactionTime = performance.now() - session.targetAt;
		session.locked = true;
		session.waitingForTarget = false;
		session.targetVisible = false;
		session.answered += 1;
		session.correct += 1;
		const points = Math.max(40, Math.round(180 - reactionTime / 5));
		session.score += points;
		target.disabled = true;
		target.textContent = `${Math.round(reactionTime)} ms`;
		setFeedback(`Quick response: ${Math.round(reactionTime)} ms. +${points} points.`, "good");
		updateMetrics();
		setProgress(session.round / session.rounds * 100);
		schedule(nextRound, 850);
	});
	const wait = 900 + Math.random() * 2100;
	schedule(() => {
		if (!session || activeGame !== "reflex" || !session.waitingForTarget) return;
		session.waitingForTarget = false;
		session.targetVisible = true;
		session.locked = false;
		session.targetAt = performance.now();
		target.disabled = false;
		target.textContent = "TAP!";
		target.setAttribute("aria-label", "Target appeared. Tap now.");
		document.querySelector(".stage-title").textContent = "Now! Tap the target";
		session.roundStarted = session.targetAt;
	}, wait);
}

function finishSession(timeExpired) {
	if (!session) return;
	clearGameTimers();
	const finishedSession = session;
	const accuracy = finishedSession.answered ? Math.round(finishedSession.correct / finishedSession.answered * 100) : 0;
	stats.totalPoints += finishedSession.score;
	stats.bestScore = Math.max(stats.bestScore, finishedSession.score);
	stats.completed += 1;
	const radarCategory = GAME_INFO[activeGame].radar;
	const previousRuns = stats.radarRuns[radarCategory];
	stats.radar[radarCategory] = Math.round((stats.radar[radarCategory] * previousRuns + accuracy) / (previousRuns + 1));
	stats.radarRuns[radarCategory] += 1;
	if (finishedSession.isDaily) stats.dailyCompleted = todayKey();
	persistStats();
	renderDashboard();
	elements.difficulty.disabled = false;
	setProgress(100);
	session = null;
	const title = timeExpired ? "Time is up" : "Challenge complete";
	const detail = timeExpired ? "Your challenge ended when the timer reached zero." : "You made it through every round. Nice work.";
	elements.stage.innerHTML = `<p class="stage-kicker">${timeExpired ? "SESSION ENDED" : "SESSION COMPLETE"}</p><h2 class="stage-title">${title}</h2><p class="summary-score">${finishedSession.score}</p><p class="summary-detail">points · ${accuracy}% accuracy · ${finishedSession.correct} correct of ${finishedSession.answered}</p><p class="stage-copy">${detail}</p>${finishedSession.isDaily ? `<p class="summary-badge">TODAY'S CHALLENGE RECORDED</p>` : ""}<div class="summary-actions"><button class="button button-primary" id="play-again-button" type="button">Play again <span aria-hidden="true">↻</span></button></div>`;
	document.querySelector("#play-again-button").addEventListener("click", () => {
		elements.difficulty.disabled = false;
		showIntro(finishedSession.isDaily);
		setProgress(0);
		elements.score.textContent = "0";
		elements.accuracy.textContent = "—";
		elements.time.textContent = "—";
		elements.round.textContent = "—";
		setFeedback("");
	});
	setFeedback("");
}

function returnToDashboard() {
	clearGameTimers();
	session = null;
	activeGame = null;
	elements.difficulty.disabled = false;
	elements.gameScreen.hidden = true;
	elements.dashboard.hidden = false;
	renderDashboard();
	window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("[data-game]").forEach((button) => {
	button.addEventListener("click", () => openGame(button.dataset.game));
});
elements.dailyButton.addEventListener("click", () => openGame(dailyGameKey(), true));
elements.dashboardButton.addEventListener("click", returnToDashboard);
elements.restartButton.addEventListener("click", () => {
	if (!activeGame) return;
	const key = activeGame;
	const isDaily = elements.category.textContent === "TODAY'S DAILY CHALLENGE";
	elements.difficulty.disabled = false;
	openGame(key, isDaily);
});
elements.difficulty.addEventListener("change", () => {
	if (activeGame && !session) showIntro(elements.category.textContent === "TODAY'S DAILY CHALLENGE");
});

renderDashboard();
