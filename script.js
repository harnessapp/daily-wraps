const DATA_URL = "./daily_wraps.json";
const DEFAULT_VISIBLE = 7;

function renderWraps(wraps, showAll = false) {
    const container = document.getElementById("wraps-container");
    container.innerHTML = "";

    const visibleWraps = showAll ? wraps : wraps.slice(0, DEFAULT_VISIBLE);

    visibleWraps.forEach(wrap => {
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
    });

    if (!showAll && wraps.length > DEFAULT_VISIBLE) {
        const button = document.createElement("button");
        button.className = "load-more-button";
        button.textContent = `Show older wraps (${wraps.length - DEFAULT_VISIBLE})`;
        button.onclick = () => renderWraps(wraps, true);
        container.appendChild(button);
    }
}

async function loadWraps() {
    const container = document.getElementById("wraps-container");

    try {
        const response = await fetch(DATA_URL);
        const wraps = await response.json();

        renderWraps(wraps, false);

    } catch (err) {
        container.innerHTML = "<div class='loading'>No wraps yet.</div>";
        console.error(err);
    }
}

loadWraps();