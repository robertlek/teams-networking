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

function deleteTeamRequest(id, successDelete) {
    return fetch("http://localhost:3000/teams-json/delete", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
    })
        .then(r => r.json())
        .then(status => {
            console.info("This team is being removed.", status);
            if (typeof successDelete === "function") {
                successDelete(status);
            }
            return status;
        });
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
    deleteTeamRequest(id, () => {
        console.info("Callback successfully!");
    }).then(status => {
        if (status.success) {
            loadTeams();
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
        updateTeamRequest(team).then(() => {
            loadTeams();
            $("#edit-form").reset();
        });
    } else {
        createTeamRequest(team).then(() => {
            loadTeams();
            $("#edit-form").reset();
        });
    }
}

function searchTeams(teams, search) {
    search = search.toLowerCase();
    return teams.filter(team => {
        return (
            team.members.toLowerCase().includes(search) ||
            team.name.toLowerCase().includes(search) ||
            team.promotion.toLowerCase().includes(search) ||
            team.url.toLowerCase().includes(search)
        );
    });
}

function initEvents() {
    const form = $("#edit-form");
    form.addEventListener("submit", formSubmit);
    form.addEventListener("reset", () => {
        editId = undefined;
    });

    $("#search").addEventListener("input", e => {
        const search = e.target.value;
        const teams = searchTeams(allTeams, search);
        showTeams(teams);
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

function loadTeams() {
    getTeamsRequest().then(teams => {
        allTeams = teams;
        showTeams(teams);
    });
}

loadTeams();
initEvents();
