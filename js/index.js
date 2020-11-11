let context;
let img;
let img2;
let img3;
let curImg = 0;
let imageArray = [];
let x = 0;
let y = 40;
let coinY = 80;
let img2xIncr = 1;
let iWidth = window.innerWidth - 10;
let iHeight = window.innerHeight - 10;
let coinImg = document.querySelector('#coinImg');
let skipImg = document.querySelector('#skipImg');

let setUp = function() {
    let canvas = document.querySelector('#myCanvas');
    canvas.width = iWidth;
    canvas.height = iHeight;
    context = canvas.getContext('2d');
    img = new Image();
    img2 = new Image();
    img3 = new Image();
    img.addEventListener('load', function() {
        setInterval(function() {
            draw();
        }, 50);
    }, false);
    img.src = 'pic/feiji.png';
    img3.src = 'pic/coin/sq.png';

    for (let i = 1; i < 7; i++) {
        let imgObj = new Image();
        imgObj.src = `pic/coin/${i}.png`;
        imageArray[i] = imgObj;
    }
};


let draw = function() {
    drawBackground();
    context.drawImage(img, x, y);
    x += 2;
    if (x > iWidth) {
        x = -50;
        y = Math.floor((Math.random() * 200) + 1);
    }
    drawDropCoin();
    chgCoin();
};

let drawDropCoin = function() {
    img2xIncr += 10;
    if ((y + 150 + img2xIncr) > iHeight) {
        img2xIncr = 0;
    }
    context.drawImage(img3, x + 300, y + 150 + img2xIncr, 150 + img2xIncr, 200 + img2xIncr);
}


/**
 * non-canvas image create
 */
let chgCoin = function() {
    if (curImg == 6)
        curImg = 1;
    else
        curImg++;
    coinImg.src = imageArray[curImg].src;
}

let drawBackground = function() {
    //black sky
    let lineGrad = context.createLinearGradient(150, 0, 150, 600);
    lineGrad.addColorStop(0, 'black');
    lineGrad.addColorStop(1, '#009');
    context.fillStyle = lineGrad;
    context.fillRect(0, 0, iWidth, iHeight);
    context.fillStyle = 'white';

};

function skip() {
    location.href = 'intro.html';
}

addEventListener('load', setUp, false);
skipImg.addEventListener('click', skip, false);