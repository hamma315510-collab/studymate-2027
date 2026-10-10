
// ================================================
// StudyMate 2027
// JavaScript complet : toutes les fonctionnalites
// ================================================


// ================================================
// 1. COMPTE A REBOURS
// ================================================

const daysLeftElement = document.getElementById("daysLeft");

function updateCountdown() {
    if (!daysLeftElement) return;

    const today = new Date();
    const targetDate = new Date("2027-01-01T00:00:00");

    const difference = targetDate.getTime() - today.getTime();

    const daysLeft = Math.max(
        0,
        Math.ceil(difference / (1000 * 60 * 60 * 24))
    );

    daysLeftElement.textContent = daysLeft;
}

updateCountdown();


// ================================================
// 2. SUIVI DES TACHES + SAUVEGARDE AUTOMATIQUE
// ================================================

const taskCheckboxes = document.querySelectorAll(
    '.task input[type="checkbox"]'
);

const taskProgress = document.getElementById("taskProgress");
const taskMessage = document.getElementById("taskMessage");

const tasksStorageKey = "studyMateCompletedTasks";

// Restaurer les cases cochees
function loadTasks() {
    try {
        const savedTasks = JSON.parse(
            localStorage.getItem(tasksStorageKey) || "[]"
        );

        if (Array.isArray(savedTasks)) {
            taskCheckboxes.forEach(function (checkbox, index) {
                checkbox.checked = savedTasks[index] === true;
            });
        }
    } catch (error) {
        console.log("Impossible de charger les taches sauvegardees.");
    }
}

// Sauvegarder les cases cochees
function saveTasks() {
    const completedTasks = [];

    taskCheckboxes.forEach(function (checkbox) {
        completedTasks.push(checkbox.checked);
    });

    try {
        localStorage.setItem(
            tasksStorageKey,
            JSON.stringify(completedTasks)
        );
    } catch (error) {
        console.log("Impossible de sauvegarder les taches.");
    }
}

// Mettre a jour la barre de progression
function updateTaskProgress() {
    const totalTasks = taskCheckboxes.length;

    let completedTasks = 0;

    taskCheckboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
            completedTasks++;
        }
    });

    const percentage = totalTasks === 0
        ? 0
        : (completedTasks / totalTasks) * 100;

    if (taskProgress) {
        taskProgress.style.width = percentage + "%";
    }

    if (taskMessage) {
        taskMessage.textContent =
            completedTasks + " tache(s) terminee(s) sur " + totalTasks;

        if (totalTasks > 0 && completedTasks === totalTasks) {
            taskMessage.textContent =
                "Bravo ! Toutes les taches sont terminees. Tu peux etre fiere de toi ! ♡";
        }
    }

    saveTasks();
}

// Charger les donnees avant la mise a jour
loadTasks();

taskCheckboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", updateTaskProgress);
});

updateTaskProgress();


// ================================================
// 3. MESSAGES DE MOTIVATION
// ================================================

const motivationMessages = [
    "Crois en tes efforts. Les petits progres construisent les grandes reussites.",
    "Tu n'as pas besoin d'etre parfaite, tu as seulement besoin de continuer.",
    "Chaque exercice termine te rapproche un peu plus de ton objectif.",
    "Les journees difficiles passent, mais les efforts que tu fais comptent.",
    "Prends ton temps, organise-toi et avance a ton rythme.",
    "N'oublie pas de te reposer : ton bien-etre compte aussi.",
    "Un petit pas aujourd'hui, un grand progres demain.",
    "Tu es capable d'apprendre, de progresser et de reussir.",
    "La regularite est plus importante que la perfection.",
    "Fais de ton mieux aujourd'hui. C'est deja une belle victoire."
];

const motivationMessage = document.getElementById("motivationMessage");
const motivationBtn = document.getElementById("motivationBtn");

let currentMessageIndex = 0;

if (motivationBtn && motivationMessage) {
    motivationBtn.addEventListener("click", function () {
        currentMessageIndex++;

        if (currentMessageIndex >= motivationMessages.length) {
            currentMessageIndex = 0;
        }

        motivationMessage.textContent =
            motivationMessages[currentMessageIndex];
    });
}


// ================================================
// 4. PLANNING HEBDOMADAIRE
// ================================================

const planningForm = document.getElementById("planningForm");
const planningList = document.getElementById("planningList");

const planningStorageKey = "studyMateWeeklyPlanning";

const weekDays = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche"
];

let planningSessions = [];

// Charger le planning sauvegarde
function loadPlanning() {
    try {
        const savedPlanning = localStorage.getItem(planningStorageKey);

        if (savedPlanning) {
            const parsedPlanning = JSON.parse(savedPlanning);

            if (Array.isArray(parsedPlanning)) {
                planningSessions = parsedPlanning.filter(
                    function (session) {
                        return (
                            session &&
                            typeof session.id === "string" &&
                            weekDays.includes(session.day) &&
                            typeof session.subject === "string" &&
                            typeof session.time === "string" &&
                            typeof session.task === "string"
                        );
                    }
                );
            }
        }
    } catch (error) {
        planningSessions = [];
        console.log("Impossible de charger le planning.");
    }
}

// Sauvegarder le planning
function savePlanning() {
    try {
        localStorage.setItem(
            planningStorageKey,
            JSON.stringify(planningSessions)
        );
    } catch (error) {
        alert("Impossible de sauvegarder le planning dans ce navigateur.");
    }
}

// Afficher les seances
function displayPlanning() {
    if (!planningList) return;

    planningList.replaceChildren();

    if (planningSessions.length === 0) {
        const emptyMessage = document.createElement("p");

        emptyMessage.className = "empty-planning";
        emptyMessage.textContent =
            "Ton planning t'attend. Ajoute ta premiere seance ! ✿";

        planningList.appendChild(emptyMessage);

        return;
    }

    weekDays.forEach(function (day) {
        const sessionsForDay = planningSessions
            .filter(function (session) {
                return session.day === day;
            })
            .sort(function (a, b) {
                return a.time.localeCompare(b.time);
            });

        if (sessionsForDay.length === 0) {
            return;
        }

        const dayTitle = document.createElement("h4");

        dayTitle.className = "planning-day";
        dayTitle.textContent = day;

        planningList.appendChild(dayTitle);

        sessionsForDay.forEach(function (session) {
            const entry = document.createElement("article");

            entry.className = "planning-entry";

            const time = document.createElement("span");

            time.className = "planning-entry-time";
            time.textContent = session.time;

            const details = document.createElement("div");

            details.className = "planning-entry-details";

            const subject = document.createElement("h4");

            subject.textContent = session.subject;

            const task = document.createElement("p");

            task.textContent = session.task;

            details.append(subject, task);

            const deleteButton = document.createElement("button");

            deleteButton.type = "button";
            deleteButton.className = "delete-planning-btn";
            deleteButton.textContent = "Supprimer";
            deleteButton.setAttribute(
                "aria-label",
                "Supprimer la seance " + session.subject
            );

            deleteButton.addEventListener("click", function () {
                planningSessions = planningSessions.filter(
                    function (item) {
                        return item.id !== session.id;
                    }
                );

                savePlanning();
                displayPlanning();
            });

            entry.append(time, details, deleteButton);

            planningList.appendChild(entry);
        });
    });
}

// Ajouter une nouvelle seance
if (planningForm) {
    planningForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const day = document.getElementById("studyDay").value;
        const subject = document
            .getElementById("studySubject")
            .value.trim();

        const time = document.getElementById("studyTime").value;

        const task = document
            .getElementById("studyTask")
            .value.trim();

        if (!subject || !time || !task) {
            alert("Remplis tous les champs avant d'ajouter la seance.");
            return;
        }

        const newSession = {
            id: Date.now().toString() +
                Math.random().toString(36).slice(2),
            day: day,
            subject: subject,
            time: time,
            task: task
        };

        planningSessions.push(newSession);

        savePlanning();
        displayPlanning();

        planningForm.reset();
    });
}

loadPlanning();
displayPlanning();


// ================================================
// 5. POMODORO TIMER
// ================================================

// IMPORTANT : cette partie s'active lorsque les elements
// correspondants existent dans index.html.

const pomodoroDisplay = document.getElementById("pomodoroDisplay");
const pomodoroMode = document.getElementById("pomodoroMode");
const pomodoroStart = document.getElementById("pomodoroStart");
const pomodoroPause = document.getElementById("pomodoroPause");
const pomodoroReset = document.getElementById("pomodoroReset");

const focusDuration = 25 * 60;
const breakDuration = 5 * 60;

let isBreakTime = false;
let remainingSeconds = focusDuration;
let timerInterval = null;
let endTime = null;

function updatePomodoroDisplay() {
    if (pomodoroDisplay) {
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;

        pomodoroDisplay.textContent =
            String(minutes).padStart(2, "0") +
            ":" +
            String(seconds).padStart(2, "0");
    }

    if (pomodoroMode) {
        pomodoroMode.textContent = isBreakTime
            ? "Temps de pause 🌸"
            : "Temps de concentration";
    }

    if (pomodoroStart) {
        pomodoroStart.disabled = timerInterval !== null;
    }

    if (pomodoroPause) {
        pomodoroPause.disabled = timerInterval === null;
    }
}

function stopPomodoroInterval() {
    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function tickPomodoro() {
    if (endTime === null) return;

    remainingSeconds = Math.max(
        0,
        Math.ceil((endTime - Date.now()) / 1000)
    );

    updatePomodoroDisplay();

    if (remainingSeconds <= 0) {
        stopPomodoroInterval();

        isBreakTime = !isBreakTime;

        remainingSeconds = isBreakTime
            ? breakDuration
            : focusDuration;

        endTime = null;

        updatePomodoroDisplay();

        alert(
            isBreakTime
                ? "Bravo ! Ta seance est terminee. Prends 5 minutes de pause. 🌸"
                : "La pause est terminee. Tu peux reprendre tes revisions ! 📚"
        );
    }
}

function startPomodoro() {
    if (timerInterval !== null) return;

    endTime = Date.now() + remainingSeconds * 1000;

    timerInterval = setInterval(tickPomodoro, 250);

    updatePomodoroDisplay();
}

function pausePomodoro() {
    if (timerInterval === null) return;

    tickPomodoro();

    if (timerInterval !== null) {
        stopPomodoroInterval();

        endTime = null;

        updatePomodoroDisplay();
    }
}

function resetPomodoro() {
    stopPomodoroInterval();

    isBreakTime = false;
    remainingSeconds = focusDuration;
    endTime = null;

    updatePomodoroDisplay();
}

if (
    pomodoroDisplay &&
    pomodoroMode &&
    pomodoroStart &&
    pomodoroPause &&
    pomodoroReset
) {
    pomodoroStart.addEventListener("click", startPomodoro);
    pomodoroPause.addEventListener("click", pausePomodoro);
    pomodoroReset.addEventListener("click", resetPomodoro);

    updatePomodoroDisplay();
}


// ================================================
// 6. FIN DU SCRIPT
// ================================================

console.log("StudyMate 2027 est pret ! 🌸");
// ================================================
// 6. DASHBOARD INTELLIGENT
// ================================================

const dashboardTasksDone = document.getElementById(
    "dashboardTasksDone"
);

const dashboardSessions = document.getElementById(
    "dashboardSessions"
);

const dashboardProgress = document.getElementById(
    "dashboardProgress"
);

const dashboardProgressBar = document.getElementById(
    "dashboardProgressBar"
);

const dashboardProgressText = document.getElementById(
    "dashboardProgressText"
);

const dashboardMessage = document.getElementById(
    "dashboardMessage"
);

function updateDashboard() {
    // Calcul des tâches
    const totalTasks = taskCheckboxes.length;

    let completedTasks = 0;

    taskCheckboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
            completedTasks++;
        }
    });

    // Calcul du pourcentage
    const percentage = totalTasks === 0
        ? 0
        : Math.round((completedTasks / totalTasks) * 100);

    // Nombre de séances programmées
    const totalSessions = planningSessions.length;

    // Mise à jour des chiffres
    if (dashboardTasksDone) {
        dashboardTasksDone.textContent =
            completedTasks + "/" + totalTasks;
    }

    if (dashboardSessions) {
        dashboardSessions.textContent = totalSessions;
    }

    if (dashboardProgress) {
        dashboardProgress.textContent = percentage;
    }

    if (dashboardProgressBar) {
        dashboardProgressBar.style.width = percentage + "%";
    }

    if (dashboardProgressText) {
        dashboardProgressText.textContent =
            percentage + "% de tes tâches accomplies";
    }

    // Message adapté à la progression
    if (dashboardMessage) {
        if (totalTasks > 0 && completedTasks === totalTasks) {
            dashboardMessage.textContent =
                "Bravo ! Toutes tes tâches sont terminées. Tu peux être fière de tes efforts ! ♡";
        } else if (completedTasks > 0) {
            dashboardMessage.textContent =
                "Bravo pour tes progrès ! Continue à avancer, une tâche à la fois.";
        } else if (totalSessions > 0) {
            dashboardMessage.textContent =
                "Ton planning est prêt. Il ne te reste plus qu'à commencer ta première tâche !";
        } else {
            dashboardMessage.textContent =
                "Chaque petit effort compte. Organise tes séances et commence à ton rythme !";
        }
    }
}

// Actualiser le dashboard quand une tâche change
taskCheckboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", updateDashboard);
});

// Actualiser le dashboard quand le planning change
if (planningList) {
    const dashboardObserver = new MutationObserver(function () {
        updateDashboard();
    });

    dashboardObserver.observe(planningList, {
        childList: true,
        subtree: true
    });
}

// Afficher les données dès le chargement
updateDashboard();

console.log("Dashboard StudyMate 2027 activé !");

/* ================================================
   7. DARK MODE
================================================ */

const themeToggle = document.getElementById("themeToggle");

function applyTheme(isDark) {
    document.body.classList.toggle("dark-mode", isDark);

    if (themeToggle) {
        themeToggle.textContent = isDark ? "☀️" : "🌙";

        themeToggle.setAttribute(
            "aria-label",
            isDark
                ? "Activer le mode clair"
                : "Activer le mode sombre"
        );

        themeToggle.title = isDark
            ? "Passer au mode clair"
            : "Passer au mode sombre";
    }
}

// Charger le thème sauvegardé
const savedTheme = localStorage.getItem("studyMateTheme");

applyTheme(savedTheme === "dark");

// Changer le thème au clic
if (themeToggle) {
    themeToggle.addEventListener("click", function () {
        const isDark = !document.body.classList.contains("dark-mode");

        applyTheme(isDark);

        localStorage.setItem(
            "studyMateTheme",
            isDark ? "dark" : "light"
        );
    });
}

console.log("Dark Mode StudyMate 2027 activé !");
