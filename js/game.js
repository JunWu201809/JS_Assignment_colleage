let $$ = sel => document.querySelector(sel);

const SUIT_NAMES = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
const RANK_NAMES = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];

addEventListener('load', init);
$$('#bet').addEventListener('click', betGame);
$$('#playBtn').addEventListener('click', playCardAction);
$$('#drawBtn').addEventListener('click', drawCardAction);
$$('#quitBtn').addEventListener('click', quitAction);

let game;
let player;
let account;
let selCardInds = [];

function init() {
    obtainPlayerFromStorage();
    let lastVisit = new Date(localStorage.getItem('lastVisit'));
    $$("#amt").textContent = player.account.amt;
    $$("#userName").textContent = player.userName;
    $$("#fullName").textContent = player.firstName + ' ' + player.lastName;
    $$("#phoneNum").textContent = player.phone;
    $$("#city").textContent = player.city;
    $$("#email").textContent = player.email;
    $$("#lastVist").textContent = 'Your last visit was ' + lastVisit.toDateString() + ' at ' + lastVisit.toLocaleTimeString();
    let myDate = new Date();
    localStorage.lastVisit = myDate;
    $$('#notMe').innerHTML = `Not ${player.firstName} ${player.lastName}? <a href='javascript:chgCred();'>Change your credentials</a>`;
    game = new Game(player);
    betBtnDisable(false);
    actionBtnDisable(true);
}

function chgCred() {
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('userName');
    localStorage.removeItem('phoneNum');
    localStorage.removeItem('city');
    localStorage.removeItem('email');
    localStorage.removeItem('bankRoll');
    localStorage.removeItem('isCrazy8s');
    localStorage.removeItem('lastVisit');
    location.href = 'intro.html';
}

function obtainPlayerFromStorage() {
    let firstName = localStorage.getItem('firstName');
    let lastName = localStorage.getItem('lastName');
    let userName = localStorage.getItem('userName');
    let phoneNum = localStorage.getItem('phoneNum');
    let city = localStorage.getItem('city');
    let email = localStorage.getItem('email');
    let bankRoll = localStorage.getItem('bankRoll');


    account = new Account(bankRoll);
    player = new Player(account);
    player.firstName = firstName;
    player.lastName = lastName;
    player.userName = userName;
    player.phone = phoneNum;
    player.city = city;
    player.email = email;
}

function betGame() {
    let re7 = /^[0-9]*$/;
    if (!re7.test($$('#betInput').value)) {
        $$('#msg').textContent = "Invalid bet number!";
        return;
    }
    let bet = parseInt($$('#betInput').value);
    let amt = parseInt(account.amt);

    if (bet > amt) {
        $$('#msg').textContent = "You don't have so much money.";
        return;
    } else {
        $$('#msg').textContent = "You bet $" + bet + " on the table.";
        $$('#betAmt').textContent = "$" + bet;
        betBtnDisable(true);
        actionBtnDisable(false);
        game.start(bet, 0);
        putCards2Player();
        refComputerBoard(8);
    }
}

function selOneCard(_i) {
    let isSelBef = false;
    let cards = document.querySelectorAll("#playerCards img");
    console.log('selOneCard s.length ->' + selCardInds.length);
    for (let i = 0; i < selCardInds.length; i++) {
        const ind = selCardInds[i];
        if (ind == _i) {
            isSelBef = true;
            cards[_i].style = "border-style: none;";
            selCardInds.splice(i, 1);
            console.log('selOneCard splice ->' + _i);
        }
    }
    if (!isSelBef) {
        selCardInds.push(_i);
        $$("#card" + _i).style = 'border-style: double;border-color:yellow;';
        console.log('selOneCard push ->' + _i);
    }
}

function playCardAction() {
    console.log('selCardInds.length ->' + selCardInds.length);
    if (selCardInds.length > 2 || selCardInds.length < 1) {
        $$('#msg').innerHTML = 'Please select one card or two cards in one suit.';
        return false;
    } else {
        let card0 = player.hand.cards[selCardInds[0]];
        if (selCardInds.length == 2) {
            let card1 = player.hand.cards[selCardInds[1]];
            if (card0.suit == card1.suit) {
                console.log('card0.suit ->' + card0.suit);
                //play two cards without anyone win or lost this game 
                if (!game.play2Cards(new Array(card0, card1))) putCards2Player();
            } else {
                $$('#msg').innerHTML = 'Please select one card or two cards in one suit.';
                return false;
            }
        } else if (selCardInds.length == 1) {
            //play a card without anyone win or lost this game 
            if (!game.play1Card(player.hand.cards[selCardInds])) putCards2Player();
        }
    }
    selCardInds = [];
}

function drawCardAction() {
    //draw a card without anyone win or lost this game
    if (!game.drawCard()) putCards2Player();
    selCardInds = [];
}

function quitAction() {
    player.account.calcAccount(player.hand.bet, false);
    $$("#amt").textContent = player.account.amt;
    $$('#betAmt').textContent = '';
    account = player.account;
    game.quit();
    actionBtnDisable(true);
    $$('#betAmt').textContent = "Please bet the your money:)";
    refComputerBoard(0);
    selCardInds = [];
}

function putCards2Player() {
    let imgStr = '';
    for (let i = 0; i < player.hand.cards.length; i++) {
        let card = player.hand.cards[i];
        imgStr += `<img id="card${i}" src="pic/${card.suit}_${card.rank}.png" alt="" onclick="selOneCard(${i})" >`;
    }
    $$('#playerCards').innerHTML = imgStr;
    $$('#upCard').src = `pic/${game.board.upCard.suit}_${game.board.upCard.rank}.png`;
}

function actionBtnDisable(flag) {
    $$('#playBtn').disabled = flag;
    $$('#drawBtn').disabled = flag;
    $$('#quitBtn').disabled = flag;
}

function betBtnDisable(flag) {
    $$('#betInput').disabled = flag;
    $$('#bet').disabled = flag;
}

function refComputerBoard(len) {
    let imgStr = '';
    imgStr += '<span>Computer</span>';
    for (let i = 1; i <= len; i++) {
        imgStr += `<img src="pic/b1fv.png" alt='downCard' >`;
    }
    $$('#computerBoard').innerHTML = imgStr;
}

/**
 *  the top class for play a crazy8 game
 */
function Game(_player) {
    this.player = _player;
    this.computer;
    this.board;

    this.start = function(_bet, _comLevel) {
        this.player.renewHand(_bet);
        this.computer = new Computer(_comLevel);
        this.computer.renewHand(_bet);
        this.board = new Board();
        this.board.createBoard(this.player.hand, this.computer.hand);
        this.board.shuffle();
        this.board.deal();
    }

    this.play1Card = function(_card) {
        let exit = false;
        let isDbTurn = false;
        if (_card.rank == RANK_NAMES[10]) {
            this.board.playJack(_card, this.player.hand);
            isDbTurn = true;
        } else if (_card.rank == '8') {
            this.board.play1Card(_card, this.player.hand);
        } else if (_card.suit == this.board.upCard.suit) {
            this.board.play1Card(_card, this.player.hand);
        } else if (_card.rank == this.board.upCard.rank) {
            this.board.play1Card(_card, this.player.hand);
        } else {
            return exit;
        }

        $$('#msg').textContent = 'You play card ' + _card.suit + '_' + _card.rank;

        if (this.player.hand.checkWinning()) {
            this.winnerOper(true);
            exit = true;
        } else {
            if (!isDbTurn)
                exit = this.computerPlayCards();
        }
        return exit;
    }

    this.play2Cards = function(_cards) {
        let exit = false;
        this.board.play2CardsIn1Suit(_cards[0], _cards[1], this.player.hand);
        $$('#msg').textContent = `You play cards ${_cards[0].suit}_${_cards[0].rank} and ${_cards[1].suit}_${_cards[1].rank}`;
        if (this.player.hand.checkWinning()) {
            this.winnerOper(true);
            exit = true;
        } else
            this.computerPlayCards();
    }

    this.computerPlayCards = function() {
        console.log(this.computer.hand.cards);
        let exit = false;
        let flag = false;
        let comCards = this.computer.hand.cards;
        let comPlayCard;
        if (this.computer.level == 0) {
            for (let i = 0; i < comCards.length; i++) {
                if (comCards[i].rank == RANK_NAMES[10]) {
                    comPlayCard = comCards[i];
                    this.board.playJack(comCards[i], this.computer.hand);
                    $$('#msg').innerHTML += '<br>Computer play a card ' + comPlayCard.suit + '_' + comPlayCard.rank;
                    if (this.computer.hand.checkWinning()) {
                        this.winnerOper(false);
                        return true;
                    }
                    console.log('play Jack, computer play again.');
                    return this.computerPlayCards();
                } else if (comCards[i].suit == this.board.upCard.suit) {
                    comPlayCard = comCards[i];
                    this.board.play1Card(comCards[i], this.computer.hand);
                    flag = true;
                    console.table(comPlayCard);
                    break;
                } else if (comCards[i].rank == this.board.upCard.rank) {
                    comPlayCard = comCards[i];
                    this.board.play1Card(comCards[i], this.computer.hand);
                    flag = true;
                    console.table(comPlayCard);
                    break;
                } else if (comCards[i].rank == '8') {
                    comPlayCard = comCards[i];
                    this.board.play1Card(comCards[i], this.computer.hand);
                    flag = true;
                    console.table(comPlayCard);
                    break;
                }
            }
            if (!flag) {
                //to draw card
                if (!this.board.drawCard(this.computer.hand)) {
                    this.quit();
                    exit = true;
                    return exit;
                }
                $$('#msg').innerHTML += '<br>Computer draw a card.';
            } else {
                $$('#msg').innerHTML += '<br>Computer play a card ' + comPlayCard.suit + '_' + comPlayCard.rank;
            }
            refComputerBoard(this.computer.hand.cards.length);
            if (this.computer.hand.checkWinning()) {
                this.winnerOper(false);
                exit = true;
            }
        }
        return exit;
    }

    this.quit = function() {
        console.log("===Quit from game now, welcome to play again!===");
        $$('#msg').innerHTML += `<br>===Quit from game now, welcome to bet again!===`;
        game = new Game(player);
        $$('#playerCards').innerHTML = '';
        $$('#upCard').src = `pic/b1fv.png`;
        betBtnDisable(false);
        actionBtnDisable(true);
    }

    this.drawCard = function() {
        let exit = false;
        //out of cards
        if (!this.board.drawCard(this.player.hand)) {
            this.quit();
            exit = true;
            return exit;
        }
        exit = this.computerPlayCards();
        return exit;
    }

    this.winnerOper = function(isPlayer) {
        if (isPlayer) {
            this.player.account.calcAccount(this.player.hand.bet, true);
            $$('#msg').innerHTML = `=== You are winner, you win $${ this.player.hand.bet },congratulation!===`;
            console.log("===You are winner,congratulation!===");
        } else {
            this.player.account.calcAccount(this.player.hand.bet, false);
            console.log("===You are loser,lost $" + this.player.hand.bet + " try again!===");
            $$('#msg').innerHTML = "===You are lost,lost $" + this.player.hand.bet + " try again!===";
        }
        $$("#amt").textContent = this.player.account.amt;
        account = this.player.account;
        this.quit();
    }
}

/**
 * the class for a single card 
 */
function Card(rank, suit) {
    this.suit = suit;
    this.rank = rank;
    this.face = 'down';
    this.value = 0;
    this.isUsed = 0;
    this.img = '';

    // change the face of a card to up or down
    this.changeFace = function() {
        this.face == 'down' ? 'up' : 'down';
    }

}


function Board() {
    this.cards = [];
    //The program just support only one human player
    this.handPlayer;
    //The program just support only one human player
    this.handComputer;
    //The last and face up card on the board
    this.upCard = '';


    // create a new board 
    this.createBoard = function(_handPlayer, _handComputer) {
        this.handPlayer = _handPlayer;
        this.handComputer = _handComputer;
        //if the crazy8s just need 13 *4 = 52 of cards, no jokers
        for (let i = 0; i < 13; i++) {
            this.cards[i] = new Card(RANK_NAMES[i], SUIT_NAMES[0]);
        }
        for (let i = 0; i < 13; i++) {
            this.cards[i + 13] = new Card(RANK_NAMES[i], SUIT_NAMES[1]);
        }
        for (let i = 0; i < 13; i++) {
            this.cards[i + 26] = new Card(RANK_NAMES[i], SUIT_NAMES[2]);
        }
        for (let i = 0; i < 13; i++) {
            this.cards[i + 39] = new Card(RANK_NAMES[i], SUIT_NAMES[3]);
        }
    }

    this.shuffle = function() {
        for (let i = 0; i < this.cards.length; i++) {
            let rIndex = Math.floor(Math.random() * this.cards.length);
            let temp = this.cards[i];
            this.cards[i] = this.cards[rIndex];
            this.cards[rIndex] = temp;
        }
    }


    this.deal = function() {
        for (let i = 0; i < 8; i++) {
            this.handPlayer.cards[i] = this.cards[0];
            this.removeTheTopCard();
            this.handComputer.cards[i] = this.cards[0];
            this.removeTheTopCard();
        }
        this.cards[0].changeFace();
        this.upCard = this.cards[0];
        this.removeTheTopCard();
    }

    this.drawCard = function(_hand) {
        if (this.cards.length < 1) {
            $$('#msg').innerHTML = `===out of cards of Deck, quit from game===`;
            return false;
        } else {
            _hand.cards[_hand.cards.length] = this.cards[0];
            this.removeTheTopCard();
        }
        return true;
    }

    this.play1Card = function(_card, _hand) {
        this.upCard = _card;
        _hand.pickOut1Card(_card);
    }

    this.play2CardsIn1Suit = function(_card1, _card2, _hand) {
        if (_hand.owner == 0) {
            this.drawCard(this.handComputer);
            this.drawCard(this.handComputer);
            _hand.pickOut1Card(_card1);
            _hand.pickOut1Card(_card2);
        } else if (_hand.owner == 1) {
            this.drawCard(this.handPlayer);
            this.drawCard(this.handPlayer);
            _hand.pickOut1Card(_card1);
            _hand.pickOut1Card(_card2);
        }
    }

    this.playJack = function(_card, _hand) {
        if (_hand.owner == 0) {
            _hand.pickOut1Card(_card);
        } else if (_hand.owner == 1) {
            _hand.pickOut1Card(_card);
        }
        this.upCard = _card;
    }

    this.removeTheTopCard = function() {
        for (let j = 0; j < this.cards.length; j++) {
            this.cards[j] = this.cards[j + 1];
        }
        this.cards.length = this.cards.length - 1;
    }
}

/**
 * the class for a Human Player
 */
function Player(_account) {
    this.firstName;
    this.lastName;
    this.userName;
    this.phone;
    this.postcode;
    this.city;
    this.email;
    this.account = _account;
    this.hand = '';

    this.renewHand = function(_bet) {
        this.hand = new Hand(0, _bet);
    }

}

/**
 * the class for a Computer Player
 * paramers: level is how smart the computer is (from 0 to 9)
 */
function Computer(level) {
    this.level = level;
    this.hand = '';
    this.renewHand = function(_bet) {
        this.hand = new Hand(1, _bet);
    }

}

/**
 * the class for the hand of a player
 */
function Hand(_owner, _bet) {
    this.cards = [];
    //0:player, 1: computer
    this.owner = _owner;
    this.bet = _bet;

    this.pickOut1Card = function(_card) {
        let pickInd = 0;
        for (let i = 0; i < this.cards.length; i++) {
            if (this.cards[i] === _card)
                pickInd = i;
        }
        for (let j = pickInd; j < this.cards.length; j++) {
            this.cards[j] = this.cards[j + 1];
        }
        this.cards.length = this.cards.length - 1;
    }

    this.checkWinning = function() {
        if (this.cards.length < 1)
            return true;
        else
            return false;
    }

    this.setCards = function(_cards) {
        cards = _cards;
    }

    this.getCards = function() {
        return this.cards;
    }

}

/**
 * the information class of the account of a player.
 */
function Account(_amt) {
    this.amt = _amt;

    this.calcAccount = function(_bet, _isWinner) {
        if (_isWinner == true)
            this.amt = parseInt(this.amt) + parseInt(_bet);
        else {
            this.amt = parseInt(this.amt) - parseInt(_bet);
        }
    }
}