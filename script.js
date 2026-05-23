const DATA_URL = "./daily_wraps.json";

async function loadWraps() {
    const container = document.getElementById("wraps-container");

    try {
        const response = await fetch(DATA_URL);
        const wraps = await response.json();

        container.innerHTML = "";

        wraps.forEach(wrap => {
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

    } catch (err) {
        container.innerHTML = "<div class='loading'>No wraps yet.</div>";
        console.error(err);
    }
}

loadWraps();