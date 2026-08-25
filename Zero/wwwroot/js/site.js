
const apiUrl = "/api/scores";
let editingScoreId = null;

const cantId = (id) => id !== null && id !== undefined ? `ID ${id}` : "Sin ID";

const form = document.getElementById("scoreForm");
const scoreIdInput = document.getElementById("scoreId");
const playerNameInput = document.getElementById("playerName");
const pointsInput = document.getElementById("points");
const levelInput = document.getElementById("level");
const tableBody = document.getElementById("scoresTableBody");
const messageBox = document.getElementById("messageBox");
const formTitle = document.getElementById("formTitle");
const cancelEditButton = document.getElementById("cancelEdit");
const refreshButton = document.getElementById("refreshBtn");
const totalScores = document.getElementById("totalScores");
const topPlayer = document.getElementById("topPlayer");
const topPoints = document.getElementById("topPoints");

function showMessage(text, type = "success") {
	messageBox.textContent = text;
	messageBox.className = `message-box ${type}`;
	messageBox.hidden = false;
}

function hideMessage() {
	messageBox.hidden = true;
	messageBox.textContent = "";
}

function formatDate(value) {
	if (!value) {
		return "-";
	}

	return new Date(value).toLocaleString("es-AR", {
		dateStyle: "short",
		timeStyle: "short"
	});
}

function resetForm() {
	editingScoreId = null;

	scoreIdInput.value = "";
	playerNameInput.value = "";
	pointsInput.value = "";
	levelInput.value = "";
	formTitle.textContent = "Nuevo puntaje";
	cancelEditButton.hidden = true;
}

function startEdit(score) {
	editingScoreId = score.scoreId;
	scoreIdInput.value = score.scoreId;
	playerNameInput.value = score.playerName;
	pointsInput.value = score.points;
	levelInput.value = score.level;
	formTitle.textContent = `Editando #${score.scoreId}`;
	cancelEditButton.hidden = false;
	playerNameInput.focus();
}

function updateStats(scores) {
	totalScores.textContent = scores.length;

	if (scores.length === 0) {
		topPlayer.textContent = "-";
		topPoints.textContent = "0";
		return;
	}

	const bestScore = scores[0];
	topPlayer.textContent = bestScore.playerName;
	topPoints.textContent = bestScore.points;
}

function renderEmptyState(message) {
	tableBody.innerHTML = `
		<tr>
			<td colspan="6" class="empty-state">${message}</td>
		</tr>
	`;
}

function renderScores(scores) {
	updateStats(scores);

	if (scores.length === 0) {
		renderEmptyState("Todavía no hay puntajes cargados.");
		return;
	}

	tableBody.innerHTML = scores.map((score, index) => `
		<tr>
			<td>${index + 1}</td>
			<td>
				<div class="player-cell">
					<strong>${score.playerName}</strong>
					<span>ID ${score.scoreId}</span>
				</div>
			</td>
			<td>${score.points}</td>
			<td>${score.level}</td>
			<td>${formatDate(score.date)}</td>
			<td>
				<div class="row-actions">
					<button type="button" class="action-btn edit" data-edit-id="${score.scoreId}">Editar</button>
					<button type="button" class="action-btn delete" data-delete-id="${score.scoreId}">Eliminar</button>
				</div>
			</td>
		</tr>
	`).join("");
}

async function loadScores() {
	try {
		const response = await fetch(apiUrl);

		if (!response.ok) {
			throw new Error("No se pudieron cargar los puntajes.");
		}

		const scores = await response.json();
		renderScores(scores);
		hideMessage();
	} catch (error) {
		renderEmptyState("No se pudo conectar con la API.");
		showMessage(error.message, "error");
	}
}

async function saveScore(event) {
	event.preventDefault();

	const payload = {
		scoreId: editingScoreId ?? 0,
		playerName: playerNameInput.value.trim(),
		points: Number(pointsInput.value),
		level: Number(levelInput.value)
	};

	if (!payload.playerName || Number.isNaN(payload.points) || Number.isNaN(payload.level)) {
		showMessage("Completá todos los campos.", "error");
		return;
	}

	const isEditing = editingScoreId !== null;
	const url = isEditing ? `${apiUrl}/${editingScoreId}` : apiUrl;
	const method = isEditing ? "PUT" : "POST";

	try {
		const response = await fetch(url, {
			method,
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(payload)
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(errorText || "No se pudo guardar el puntaje.");
		}

		showMessage(isEditing ? "Puntaje actualizado." : "Puntaje creado.");
		resetForm();
		await loadScores();
	} catch (error) {
		showMessage(error.message, "error");
	}
}

async function deleteScore(id) {
	const confirmed = confirm("Seguro que queres eliminar este puntaje");
	if (!confirmed) {
		return;
	}

	try {
		const response = await fetch(`${apiUrl}/${id}`, {
			method: "DELETE"
		});
		console.log("eliminando")
		// muevo los otros ids para tener una escalera no que vayan saltenado
		if (!response.ok) {
			throw new Error("No se pudo eliminar el puntaje.");
		}

		showMessage("Puntaje eliminado.");
		if (editingScoreId === id) {
			resetForm();
		}
		await loadScores();
	} catch (error) {
		showMessage(error.message, "error");
	}
}

tableBody.addEventListener("click", (event) => {
	const editId = event.target.getAttribute("data-edit-id");
	const deleteId = event.target.getAttribute("data-delete-id");

	if (editId) {
		const row = event.target.closest("tr");
		const cells = row.querySelectorAll("td");

		startEdit({
			scoreId: Number(editId),
			playerName: cells[1].querySelector("strong").textContent,
			points: Number(cells[2].textContent),
			level: Number(cells[3].textContent)
		});
	}

	if (deleteId) {
		deleteScore(Number(deleteId));
	}
});

form.addEventListener("submit", saveScore);
cancelEditButton.addEventListener("click", () => {
	resetForm();
	hideMessage();
});
refreshButton.addEventListener("click", loadScores);

loadScores();
