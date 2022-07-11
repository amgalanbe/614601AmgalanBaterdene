const serverUrl = 'http://localhost:3000';
const clientURL = location.origin + location.pathname.split('/').slice(0, location.pathname.split('/').length - 1).join('/');

window.onload = function(){
    document.getElementById('loginBtn').onclick = login;
}

async function login(){
    let response = await fetch(serverUrl + '/auth/login', {
        method: 'POST',
        body:JSON.stringify({
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).catch(error => postErrorMsg);

    if(response.ok) {
        let json = await response.json();  
        if(json.error) {
            postErrorMsg(json.error);
        } else {
            sessionStorage.setItem('accessToken', json.accessToken);
            location.assign(clientURL + '/index.html');
        }
    } else {
        postErrorMsg('HTTP error ' + response.status);
    }
}

function postErrorMsg(msg) {
    document.getElementById('errorMsg').innerHTML = msg;
}