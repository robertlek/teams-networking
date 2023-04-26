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

async function deleteTeam(id) {
    const { success } = await deleteTeamRequest(id);
    if (success) {
        allTeams = allTeams.filter(t => t.id !== id);
        showTeams(allTeams);
    }
}

function startEditTeam(edit) {
    editId = edit;
    const { promotion, members, name, url } = allTeams.find(({ id }) => id === edit);

    $("#promotion").value = promotion;
    $("#members").value = members;
    $("#project-name").value = name;
    $("#project-url").value = url;
}

function getTeamsAsHTML({ id, url, promotion, members, name }) {
    let displayURL = url;
    if (url.startsWith("https://")) {
        displayURL = url.substring(8);
    }
    return `
        <tr>
            <td>${promotion}</td>
            <td>${members}</td>
            <td>${name}</td>
            <td><a href="${url}" target="_blank">${displayURL}</a></td>
            <td>
                <a data-id="${id}" class="link-btn remove-btn">✖</a>
                <a data-id="${id}" class="link-btn edit-btn">&#9998;</a>
            </td>
        </tr>
    `;
}

let previewDisplayedTeams = [];

function showTeams(teams) {
    if (teams === previewDisplayedTeams) {
        return false;
    }

    if (teams.length === previewDisplayedTeams.length) {
        var eqContent = teams.every((t, i) => t === previewDisplayedTeams[i]);
        if (eqContent) {
            return false;
        }
    }
    previewDisplayedTeams = teams;
    const html = teams.map(getTeamsAsHTML);
    $("table tbody").innerHTML = html.join("");
    return true;
}

function $(selector) {
    return document.querySelector(selector);
}

async function formSubmit(e) {
    e.preventDefault();

    const team = {
        promotion: $("#promotion").value,
        members: $("#members").value,
        name: $("#project-name").value,
        url: $("#project-url").value
    };

    if (editId) {
        team.id = editId;
        const { success } = await updateTeamRequest(team);

        if (success) {
            allTeams = allTeams.map(t => {
                if (t.id === team.id) {
                    return {
                        ...t, // old props
                        ...team
                    };
                }
                return t;
            });
        }
    } else {
        const { success, id } = await createTeamRequest(team);
        if (success) {
            team.id = id;
            allTeams = [...allTeams, team];
        }
    }

    showTeams(allTeams) && $("#edit-form").reset();
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

async function loadTeams(callback) {
    const teams = await getTeamsRequest();
    allTeams = teams;
    showTeams(teams);

    if (typeof callback === "function") {
        callback();
    }
    return teams;
}

(async () => {
    $("#edit-form").classList.add("loading-mask");
    await loadTeams();
    $("#edit-form").classList.remove("loading-mask");

    console.info("start");
    sleep(6000).then(() => {
        console.info("Ready to do %o", "next job");
    });
    console.warn("after sleep");

    await sleep(5000);
    console.info("await sleep");
})();

(function () {
    console.info("START");
})();

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

initEvents();
