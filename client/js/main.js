var clientURL = location.origin + location.pathname.split('/').slice(0, location.pathname.split('/').length - 1).join('/');
const serverUrl = 'http://localhost:3000';

window.onload = function(){
    const token = sessionStorage.getItem('accessToken')
    if(token) {
        document.getElementById('loginMsg').innerHTML = 'Welcome, ' + token.split('-')[1] + '!';
    } else {
        redirectToLogin()
    }
    
    document.getElementById('logoutBtn').onclick = logout;
}

function logout() {
    sessionStorage.removeItem('accessToken');
    redirectToLogin();
}

function redirectToLogin(){
    location.assign(clientURL + '/login.html');
}


function fetchProduct(){
    // console.log(`${sessionStorage.getItem('accessToken')}`);
    fetch('http://localhost:3000/products', {
                        headers: {
                            Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`
                        }
                    }).then(response => response.json())
                        .then(data => {
                            if(data.error){
                                document.getElementById('products').innerHTML = data.error;
                            } else {
                                document.getElementById('products').innerHTML = data.title;
                            }
                        });
}