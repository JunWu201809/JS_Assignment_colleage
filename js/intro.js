let $$ = sel => document.querySelector(sel);

addEventListener('load', checkLocalStorage);
$$("#playBtn").addEventListener('click', validRegForm);
//$$("#regForm").onsubmit = function() { return validRegForm(); };

function checkLocalStorage() {
    let gameFlag = localStorage.getItem('isCrazy8s');
    if (gameFlag == 'Y') {
        location.href = 'game.html';
    }
    return true;
}

function updateLocalStorage() {
    localStorage.firstName = $$('#firstName').value;
    localStorage.lastName = $$('#lastName').value;
    localStorage.userName = $$('#userName').value;
    localStorage.phoneNum = $$('#phone').value;
    localStorage.city = $$('#city').value;
    localStorage.email = $$('#email').value;
    localStorage.bankRoll = $$('#amt').value;
    let myDate = new Date();
    localStorage.lastVisit = myDate.toUTCString();
    localStorage.isCrazy8s = 'Y';
}

function validRegForm() {
    let flag = true;
    let re1 = /^[A-Za-z][\w '-]{0,19}$/;
    let re2 = /^[A-Za-z][\w '-]{0,29}$/;
    let re3 = /^[A-Z][a-z]*[0-5]?$/;
    let re4 = /^(\([0-9]{3}\)[0-9]{3}-[0-9]{4})|([0-9]{3}.[0-9]{3}.[0-9]{4})$/;
    let re5 = /^[A-Za-z]+$/;
    let re6 = /^[\w_\-.]+@\w*.((com)|(ca)|(org))$/;
    let re7 = /^(([1-5][0-9][0-9][0-9])|([1-9][0-9][0-9])|([1-9][0-9])|([5-9])){1}$/;
    for (let i = 1; i < 7; i++) {
        $$("#msg" + i).textContent = "";
    }
    if (!re1.test($$('#firstName').value)) {
        flag = false;
        $$("#msg1").textContent = '*invalid';
    } else if (!re2.test($$('#lastName').value)) {
        flag = false;
        $$("#msg2").textContent = '*invalid';
    } else if (!re3.test($$('#userName').value)) {
        flag = false;
        $$("#msg3").textContent = '*invalid(Da4)';
    } else if (!re4.test($$('#phone').value)) {
        flag = false;
        $$("#msg4").textContent = '*invalid(877.299.5888)';
    } else if (!re5.test($$('#city').value)) {
        flag = false;
        $$("#msg5").textContent = '*invalid';
    } else if (!re6.test($$('#email').value)) {
        flag = false;
        $$("#msg6").textContent = '*invalid';
    } else if (!re7.test($$('#amt').value)) {
        flag = false;
        $$("#msg7").textContent = '*invalid(5-5000)';
    } else
        updateLocalStorage();
    if (!flag)
        event.preventDefault();
    else
        location.href = 'game.html';
}