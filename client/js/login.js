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
    }).then(response => response.json());
    if(response.error) {
        document.getElementById('errorMsg').innerHTML = response.error;
    } else {
        sessionStorage.setItem('accessToken', response.accessToken);
        location.assign(clientURL + '/index.html');
    }
}