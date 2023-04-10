function getTeamsRequest() {
    return fetch("http://localhost:3000/teams-json", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((response) => {
        return response.json();
    });
}

function createTeamRequest(team) {
    return fetch("http://localhost:3000/teams-json/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(team)
    })
    .then((r) => r.json());
}

function getTeamsAsHTML(team) {
    return `
        <tr>
            <td>${team.promotion}</td>
            <td>${team.members}</td>
            <td>${team.name}</td>
            <td>${team.url}</td>
            <td></td>
        </tr>
    `;
}

function showTeams(teams) {
    const html = teams.map(getTeamsAsHTML);
    $("table tbody").innerHTML = html.join("");
}

function $(selector) {
    return document.querySelector(selector);
}

function formSubmit(e) {
    e.preventDefault();

    const team = {
        promotion: $("#promotion").value,
        members: $("#members").value,
        name: $("#project-name").value,
        url: $("#project-url").value
    };

    createTeamRequest(team).then((status) => {
        console.info("status", status);
        window.location.reload();
    });
}

function initEvents() {
    $("#edit-form").addEventListener("submit", formSubmit);
}

getTeamsRequest().then((teams) => {
    showTeams(teams);
});

initEvents();