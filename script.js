const DATA_URL = "./daily_wraps.json";
const DEFAULT_VISIBLE = 7;

let allWraps = [];

function renderWrapCard(wrap, container) {
    const card = document.createElement("div");
    card.className = "wrap-card";

    const title = document.createElement("div");
    title.className = "wrap-title";
    title.textContent = wrap.title;

    const body = document.createElement("div");
    body.className = "wrap-body";

    wrap.body.forEach(paragraph => {
        const p = document.createElement("p");
        p.innerHTML = paragraph;
        body.appendChild(p);
    });

    card.appendChild(title);
    card.appendChild(body);
    container.appendChild(card);
}

function renderLatestWraps() {
    const container = document.getElementById("wraps-container");
    container.innerHTML = "";

    allWraps.slice(0, DEFAULT_VISIBLE).forEach(wrap => {
        renderWrapCard(wrap, container);
    });
}

function buildArchiveControls() {
    const container = document.getElementById("wraps-container");

    const archive = document.createElement("div");
    archive.className = "archive-box";

    const label = document.createElement("div");
    label.className = "archive-title";
    label.textContent = "Archive";

    const yearSelect = document.createElement("select");
    const monthSelect = document.createElement("select");
    const dateSelect = document.createElement("select");

    archive.appendChild(label);
    archive.appendChild(yearSelect);
    archive.appendChild(monthSelect);
    archive.appendChild(dateSelect);

    container.before(archive);

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    function resetSelect(select, placeholder) {
        select.innerHTML = "";
        const option = document.createElement("option");
        option.value = "";
        option.textContent = placeholder;
        select.appendChild(option);
    }

    function getWrapDate(wrap) {
        const [year, month, day] = wrap.date.split("-").map(Number);
        return new Date(year, month - 1, day);
    }

    function populateYears() {
        resetSelect(yearSelect, "Year");
        resetSelect(monthSelect, "Month");
        resetSelect(dateSelect, "Date");

        const years = [...new Set(allWraps.map(w => w.date.slice(0, 4)))].sort((a, b) => b.localeCompare(a));

        years.forEach(year => {
            const option = document.createElement("option");
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        });
    }

    function populateMonths() {
        resetSelect(monthSelect, "Month");
        resetSelect(dateSelect, "Date");

        const year = yearSelect.value;
        if (!year) return;

        const months = [...new Set(
            allWraps
                .filter(w => w.date.startsWith(year))
                .map(w => w.date.slice(5, 7))
        )].sort((a, b) => b.localeCompare(a));

        months.forEach(month => {
            const option = document.createElement("option");
            option.value = month;
            option.textContent = monthNames[Number(month) - 1];
            monthSelect.appendChild(option);
        });
    }

    function populateDates() {
        resetSelect(dateSelect, "Date");

        const year = yearSelect.value;
        const month = monthSelect.value;
        if (!year || !month) return;

        const wraps = allWraps
            .filter(w => w.date.startsWith(`${year}-${month}`))
            .sort((a, b) => b.date.localeCompare(a.date));

        wraps.forEach(wrap => {
            const d = getWrapDate(wrap);
            const option = document.createElement("option");
            option.value = wrap.date;
            option.textContent = d.toLocaleDateString("en-AU", {
                weekday: "short",
                day: "numeric",
                month: "short"
            });
            dateSelect.appendChild(option);
        });
    }

    function renderSelectedDate() {
        const selectedDate = dateSelect.value;
        if (!selectedDate) return;

        const wrap = allWraps.find(w => w.date === selectedDate);
        if (!wrap) return;

        const container = document.getElementById("wraps-container");
        container.innerHTML = "";
        renderWrapCard(wrap, container);

        const button = document.createElement("button");
        button.className = "load-more-button";
        button.textContent = "Back to latest wraps";
        button.onclick = renderLatestWraps;
        container.appendChild(button);
    }

    yearSelect.onchange = populateMonths;
    monthSelect.onchange = populateDates;
    dateSelect.onchange = renderSelectedDate;

    populateYears();
}

async function loadWraps() {
    const container = document.getElementById("wraps-container");

    try {
        const response = await fetch(DATA_URL);
        allWraps = await response.json();

        renderLatestWraps();
        buildArchiveControls();

    } catch (err) {
        container.innerHTML = "<div class='loading'>No wraps yet.</div>";
        console.error(err);
    }
}

loadWraps();