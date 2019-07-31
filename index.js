const { ipcRenderer } = require('electron')

let classes = [];
ipcRenderer.send('synchronous-message', 'ping') // prints "pong"

ipcRenderer.on('readStudentsDone', (event, classList) => {
    renderClass(classList)
})
// ipcRenderer.send('asynchronous-message', 'ping')

// const fakeClassList = ["1班", "2班", "3班", "4班", "5班", "6班"];

let selectedClassIndex = -1;

function renderClass(classList) {
    classes = classList;
    const selectClassEle = document.querySelector('.select-class');
    classList.forEach((c, index) => {
        const ele = document.createElement('span');
        ele.innerText = c.className;
        ele.className = `class-item button button-small`;
        ele.addEventListener('click', selectClass.bind(this, index));
        selectClassEle.appendChild(ele);
        if (index === 0) {
            ele.click();
        }
    })

}

function selectClass(index, event) {
    if (index === selectedClassIndex) {
        return;
    }
    const selectClassEle = document.querySelector('.select-class');
    [...selectClassEle.children].forEach(item => {
        item.classList.remove('button-primary');
    })
    event.target.classList.add('button-primary');
    selectedClassIndex = index;
    const students = classes[index].students;
    renderStudents(students);
}

function renderStudents(students) {
    const mainEle = document.querySelector('.students');
    mainEle.innerHTML = '';
    students.forEach(s => {
        const item = document.createElement('span');
        item.innerText = s.name;
        item.className = "student-item";
        mainEle.appendChild(item);
    });
}


let currentSelectIndex = -1;
let intervalID = null;
// let status = '';

function startLottery() {
    document.querySelector('.start-button').style.display = 'none';
    document.querySelector('.stop-button').style.display = 'inline-block';

    const children = document.querySelector('.students').children;

    intervalID = window.setInterval(()=> {
        if (currentSelectIndex >= 0) {
            children[currentSelectIndex].style.backgroundColor = 'white';
        }
        currentSelectIndex = getRandomInt(children.length)
        children[currentSelectIndex].style.backgroundColor = 'red';
    }, 80);
}

function stopLottery() {
    document.querySelector('.start-button').style.display = 'inline-block';
    document.querySelector('.stop-button').style.display = 'none';
    window.clearInterval(intervalID);
}


document.querySelector('.start-button').addEventListener('click', startLottery)
document.querySelector('.stop-button').addEventListener('click', stopLottery)


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}