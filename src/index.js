let allTeams = [];
var editId;

function getTeamsRequest() {
    return fetch("http://localhost:3000/teams-json", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => {
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
    }).then(r => r.json());
}

function deleteTeamRequest(id) {
    return fetch("http://localhost:3000/teams-json/delete", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
    }).then(r => r.json());
}

function updateTeamRequest(team) {
    return fetch("http://localhost:3000/teams-json/update", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(team)
    }).then(r => r.json());
}

function deleteTeam(id) {
    deleteTeamRequest(id).then(status => {
        console.warn("status", status);
        if (status.success) {
            window.location.reload();
        }
    });
}

function startEditTeam(id) {
    editId = id;
    const team = allTeams.find(team => team.id === id);

    $("#promotion").value = team.promotion;
    $("#members").value = team.members;
    $("#project-name").value = team.name;
    $("#project-url").value = team.url;
}

function getTeamsAsHTML(team) {
    return `
        <tr>
            <td>${team.promotion}</td>
            <td>${team.members}</td>
            <td>${team.name}</td>
            <td>${team.url}</td>
            <td>
                <a data-id="${team.id}" class="link-btn remove-btn">✖</a>
                <a data-id="${team.id}" class="link-btn edit-btn">&#9998;</a>
            </td>
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

    if (editId) {
        team.id = editId;
        updateTeamRequest(team).then(window.location.reload());
    } else {
        createTeamRequest(team).then(window.location.reload());
    }
}

function initEvents() {
    const form = $("#edit-form");
    form.addEventListener("submit", formSubmit);
    form.addEventListener("reset", () => {
        editId = undefined;
    });

    $("table tbody").addEventListener("click", e => {
        if (e.target.matches("a.remove-btn")) {
            const id = e.target.dataset.id;
            deleteTeam(id);
        } else if (e.target.matches("a.edit-btn")) {
            const id = e.target.dataset.id;
            startEditTeam(id);
        }
    });
}

getTeamsRequest().then(teams => {
    allTeams = teams;
    showTeams(teams);
});

initEvents();
