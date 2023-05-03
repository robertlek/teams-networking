export function getTeamsRequest() {
    return fetch("http://localhost:3000/teams-json", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => {
        return response.json();
    });
}

export function createTeamRequest(team) {
    return fetch("http://localhost:3000/teams-json/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(team)
    }).then(r => r.json());
}

export function deleteTeamRequest(id, successDelete) {
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

export function updateTeamRequest(team) {
    return fetch("http://localhost:3000/teams-json/update", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(team)
    }).then(r => r.json());
}
