interface getNameRequest {
    id: string;
    requestType: 'get_name';
}

interface getPollsRequest {
    id: string;
    requestType: 'get_polls';
    timeFrame: string;
}

interface getMilestonesRequest {
    id: string;
    requestType: 'get_milestones';
}

interface getJournalsRequest {
    id: string;
    requestType: 'get_journals';
}

interface checkLatestPollRequest {
    id: string;
    requestType: 'check_latest_poll';
    date: string;
}

interface addUserRequest {
    id: string;
    name: string;
    requestType: 'add_user';
}

interface setNameCookieRequest {
    name: string;
    requestType: 'set_name_cookie';
}

interface question {
    question: string;
    response: number;
}



interface poll {
    date: string;  // YYYY-MM-DD
    questions: question[];
}

interface addPollRequest {
    id: string;
    requestType: 'add_poll';
    poll: poll;
}

interface modifyPollRequest {
    id: string;
    requestType: 'modify_poll';
    poll: poll;
}

interface milestone {
    title: string;
    date: string;  // YYYY-MM-DD
}

interface addMilestoneRequest {
    id: string;
    requestType: 'add_milestone';
    milestone: milestone;
}

interface deleteMilestoneRequest {
    id: string;
    requestType: 'delete_milestone';
    title: string;
}

interface journal {
    content: string;
    date: string;  // YYYY-MM-DD
}

interface addJournalRequest {
    id: string;
    requestType: 'add_journal';
    journal: journal;
}

interface deleteUserRequest {
    id: string;
    requestType: 'delete_user';
}


export async function getName(request: getNameRequest) {
    const params = new URLSearchParams({
        requestType: request.requestType,
        id: request.id
    });
    const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/users/${request.id}?${params}`);
    return response;
}

export async function getPolls(request: getPollsRequest) {
    const params = new URLSearchParams({
        requestType: request.requestType,
        id: request.id,
        timeFrame: request.timeFrame
    });
    const response = await fetch(`/api/users/${request.id}?${params}`);
    return response;
}

export async function checkLatestPoll(request: checkLatestPollRequest) {
    const params = new URLSearchParams({
        requestType: request.requestType,
        id: request.id,
        date: request.date
    });
    const response = await fetch(`/api/users/${request.id}?${params}`);
    return response;
}

export async function getMilestones(request: getMilestonesRequest) {
    const params = new URLSearchParams({
        requestType: request.requestType,
        id: request.id
    });
    const response = await fetch(`/api/users/${request.id}?${params}`);
    return response;
}

export async function getJournals(request: getJournalsRequest) {
    const params = new URLSearchParams({
        requestType: request.requestType,
        id: request.id
    });
    const response = await fetch(`/api/users/${request.id}?${params}`);
    return response;
}


export async function addUser(request: addUserRequest) {
    const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/users/${request.id}`, {
        method: 'POST',
        body: JSON.stringify(request)
    });
    return response;
}

export async function addPoll(request: addPollRequest) {
    const response = await fetch(`/api/users/${request.id}`, {
        method: 'PATCH',
        body: JSON.stringify(request)
    });

    return response;
}

export async function modifyPoll(request: modifyPollRequest) {
    const response = await fetch(`/api/users/${request.id}`, {
        method: 'PATCH',
        body: JSON.stringify(request)
    });

    return response;
}

export async function addMilestone(request: addMilestoneRequest) {
    const response = await fetch(`/api/users/${request.id}`, {
        method: 'PATCH',
        body: JSON.stringify(request)
    });

    return response;
}

export async function deleteMilestone(request: deleteMilestoneRequest) {
    const response = await fetch(`/api/users/${request.id}`, {
        method: 'PATCH',
        body: JSON.stringify(request)
    });

    return response;
}

export async function addJournal(request: addJournalRequest) {
    const response = await fetch(`/api/users/${request.id}`, {
        method: 'PATCH',
        body: JSON.stringify(request)
    });

    return response;
}

export async function setNameCookie(request: setNameCookieRequest) {
    const response = await fetch(`/api/setget-name`, {
        method: 'POST',
        body: JSON.stringify(request)
    });
    return response;
}



export async function deleteUser(request: deleteUserRequest) {
    const response = await fetch(`/api/users/${request.id}`, {

        method: 'DELETE',
        body: JSON.stringify(request)
    });

    return response;
}

