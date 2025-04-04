document.addEventListener('DOMContentLoaded', () => {
    // --- Pomodoro Timer ---
    const pomodoroTimerDisplay = document.getElementById('pomodoro-time');
    const pomodoroStartButton = document.getElementById('pomodoro-start');
    const pomodoroPauseButton = document.getElementById('pomodoro-pause');
    const pomodoroResetButton = document.getElementById('pomodoro-reset');
    const pomodoroStatus = document.getElementById('pomodoro-status');

    let pomodoroInterval;
    let pomodoroTimeLeft = 25 * 60; // 25 Minuten in Sekunden
    let isPomodoroRunning = false;
    let isPomodoroWorkTime = true; // Start mit Arbeitszeit

    function updatePomodoroDisplay() {
        const minutes = Math.floor(pomodoroTimeLeft / 60);
        const seconds = pomodoroTimeLeft % 60;
        if (pomodoroTimerDisplay) {
            pomodoroTimerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    function startPomodoro() {
        if (isPomodoroRunning) return;
        isPomodoroRunning = true;
        if (pomodoroStatus) pomodoroStatus.textContent = isPomodoroWorkTime ? 'Arbeitszeit läuft...' : 'Pause läuft...';
        pomodoroInterval = setInterval(() => {
            pomodoroTimeLeft--;
            updatePomodoroDisplay();
            if (pomodoroTimeLeft <= 0) {
                clearInterval(pomodoroInterval);
                isPomodoroRunning = false;
                // Zeit abgelaufen, wechsle Modus
                isPomodoroWorkTime = !isPomodoroWorkTime;
                pomodoroTimeLeft = isPomodoroWorkTime ? 25 * 60 : 5 * 60; // 25 Min Arbeit, 5 Min Pause
                if (pomodoroStatus) pomodoroStatus.textContent = isPomodoroWorkTime ? 'Zeit für Arbeit!' : 'Zeit für eine Pause!';
                updatePomodoroDisplay();
                // Optional: Sound abspielen
                // alert(isPomodoroWorkTime ? 'Pause vorbei, zurück an die Arbeit!' : 'Arbeitszeit vorbei, Zeit für eine Pause!');
            }
        }, 1000);
    }

    function pausePomodoro() {
        if (!isPomodoroRunning) return;
        isPomodoroRunning = false;
        clearInterval(pomodoroInterval);
         if (pomodoroStatus) pomodoroStatus.textContent = 'Pausiert';
    }

    function resetPomodoro() {
        isPomodoroRunning = false;
        clearInterval(pomodoroInterval);
        isPomodoroWorkTime = true;
        pomodoroTimeLeft = 25 * 60;
        updatePomodoroDisplay();
        if (pomodoroStatus) pomodoroStatus.textContent = 'Bereit zum Starten';
    }

    if (pomodoroStartButton) pomodoroStartButton.addEventListener('click', startPomodoro);
    if (pomodoroPauseButton) pomodoroPauseButton.addEventListener('click', pausePomodoro);
    if (pomodoroResetButton) pomodoroResetButton.addEventListener('click', resetPomodoro);

    // Initialanzeige
    updatePomodoroDisplay();
    if (pomodoroStatus) pomodoroStatus.textContent = 'Bereit zum Starten';


    // --- Schlafenszeit-Rechner ---
    const wakeUpTimeInput = document.getElementById('wake-up-time');
    const calculateSleepButton = document.getElementById('calculate-sleep');
    const sleepTimesResult = document.getElementById('sleep-times-result');

    function calculateBedtimes(wakeUpTimeStr) {
        if (!wakeUpTimeStr) return [];

        const [hours, minutes] = wakeUpTimeStr.split(':').map(Number);
        const wakeUpDate = new Date();
        wakeUpDate.setHours(hours, minutes, 0, 0);

        const sleepCycles = [6, 5, 4]; // 9h, 7.5h, 6h Schlaf (ca. 90min pro Zyklus)
        const timeToFallAsleep = 15; // Minuten zum Einschlafen (Annahme)
        const bedtimes = [];

        sleepCycles.forEach(cycles => {
            const totalSleepMinutes = cycles * 90;
            const bedtimeDate = new Date(wakeUpDate.getTime());
            bedtimeDate.setMinutes(bedtimeDate.getMinutes() - totalSleepMinutes - timeToFallAsleep);

            const bedtimeHours = bedtimeDate.getHours().toString().padStart(2, '0');
            const bedtimeMinutes = bedtimeDate.getMinutes().toString().padStart(2, '0');
            bedtimes.push(`${bedtimeHours}:${bedtimeMinutes}`);
        });

        return bedtimes;
    }

    function displayBedtimes() {
        if (!wakeUpTimeInput || !sleepTimesResult) return;
        const wakeUpTime = wakeUpTimeInput.value;
        const bedtimes = calculateBedtimes(wakeUpTime);

        if (bedtimes.length > 0) {
            sleepTimesResult.innerHTML = `Um erfrischt aufzuwachen, solltest du versuchen, um eine dieser Zeiten ins Bett zu gehen: <strong>${bedtimes.join(' oder ')}</strong>. (Basierend auf 90-Minuten-Schlafzyklen und ca. 15 Min. Einschlafzeit).`;
        } else {
            sleepTimesResult.innerHTML = 'Bitte gib eine gültige Aufstehzeit ein (HH:MM).';
        }
    }

    if (calculateSleepButton) calculateSleepButton.addEventListener('click', displayBedtimes);
    // Optional: Berechnung bei Änderung der Zeit auslösen
    // if (wakeUpTimeInput) wakeUpTimeInput.addEventListener('change', displayBedtimes);
});
