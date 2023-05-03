import { getTeamsRequest, createTeamRequest, deleteTeamRequest, updateTeamRequest } from "./requests";
import { $, debounce, sleep } from "./utils";

let allTeams = [];
var editId;

async function deleteTeam(id) {
    const { success } = await deleteTeamRequest(id);
    if (success) {
        allTeams = allTeams.filter(t => t.id !== id);
        showTeams(allTeams);
    }
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

async function formSubmit(e) {
    e.preventDefault();
    const team = getFormValues();

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

function getFormValues() {
    return {
        promotion: $("#promotion").value,
        members: $("#members").value,
        name: $("#project-name").value,
        url: $("#project-url").value
    };
}

function setFormValues({ promotion, members, name, url }) {
    $("#promotion").value = promotion;
    $("#members").value = members;
    $("#project-name").value = name;
    $("#project-url").value = url;
}

function startEditTeam(id) {
    editId = id;
    const team = allTeams.find(t => t.id === id);
    setFormValues(team);
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

    $("#search").addEventListener(
        "input",
        debounce(function () {
            const search = this.value;
            const teams = searchTeams(allTeams, search);
            showTeams(teams);
        }, 300)
    );

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

    // console.info("start");
    // sleep(6000).then(() => {
    //     console.info("Ready to do %o", "next job");
    // });
    // console.warn("after sleep");

    // await sleep(5000);
    // console.info("await sleep");
})();

initEvents();
