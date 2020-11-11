(function myTest() {
    let account = new Account(1000);
    let player = new Player(account);
    let game = new Game(player);

    game.start(10, 0);

    console.log("=== Notice:There is a bug in console.table, it can't show the table on the first time.But after reload of develop mode,everything can be fine.===");
    console.log("=== show the init 52 -8 -8 -1 = 35 cards in the table:===");
    console.table(game.board.cards);
    console.log("the length of game.board.cards is:" + game.board.cards.length);
    console.log("=== show the init 8 cards in the player hand:===");
    console.table(player.hand.cards);
    console.log("=== show the init 8 cards in the computer hand:===");
    console.table(game.computer.hand.cards);

    console.log("=== show the up card in the table:===");
    console.table(game.board.upCard);

    console.log("=== test play card 8:===");
    test8Card(player.hand, game);

    console.log("=== test play Same Suit:===");
    testSameSuit(game.board.upCard.suit, player.hand, game);

    console.log("=== test play Same Rank:===");
    testSameRank(game.board.upCard.rank, player.hand, game);

    console.log("=== testDrawCard:===");
    testDrawCard(player.hand, game);

    console.log("=== test2Cards ===");
    test2Cards(player.hand, game);
    console.log("=== before testWinner the player have money $" + player.account.amt);
    testWinner(player.hand, game);
    console.log("=== after testWinner the player have money $" + player.account.amt);
    game.start(50, 0);
    console.log("=== before testLoser the player have money $" + player.account.amt);
    testLoser(game);
    console.log("=== after testLoser the player have money $" + player.account.amt);

    console.log("=== show rest cards in the table:===");
    console.table(game.board.cards);
})();

function testWinner(_hand, _game) {
    let i = _hand.cards.length;
    while (i > 1) {
        _hand.pickOut1Card(_hand.cards[i]);
        i--;
    }
    _hand.cards[_hand.cards.length - 1] = new Card(RANK_NAMES[7], SUIT_NAMES[0]);
    _game.play1Card(_hand.cards[_hand.cards.length - 1]);
}

function testLoser(_game) {
    let comHand = _game.computer.hand;
    let i = comHand.cards.length;
    while (i > 1) {
        comHand.pickOut1Card(comHand.cards[i]);
        i--;
    }
    comHand.cards[comHand.cards.length - 1] = new Card(RANK_NAMES[7], SUIT_NAMES[0]);
    _game.drawCard(_game.player.hand);

}

function testSameSuit(_suit, _hand, _game) {
    _hand.cards[0] = new Card(RANK_NAMES[3], _suit);
    console.log("Before testSameRank play the first card in player hand is" + _hand.cards[0].rank);
    _game.play1Card(_hand.cards[0]);
    console.log("After test8Card play the first card in player hand is" + _hand.cards[0].rank);
}

function testSameRank(_rank, _hand, _game) {
    _hand.cards[0] = new Card(_rank, SUIT_NAMES[0]);
    console.log("Before testSameRank play the first card in player hand is" + _hand.cards[0].rank);
    _game.play1Card(_hand.cards[0]);
    console.log("After test8Card play the first card in player hand is" + _hand.cards[0].rank);
}

function test8Card(_hand, _game) {
    _hand.cards[0] = new Card(RANK_NAMES[7], SUIT_NAMES[0]);
    console.log("Before test8Card play the first card in player hand is" + _hand.cards[0].rank);
    _game.play1Card(_hand.cards[0]);
    console.log("After test8Card play the first card in player hand is" + _hand.cards[0].rank);
}

function testDrawCard(_hand, _game) {
    console.log("before draw, the player have " + _hand.cards.length + " cards");
    _game.drawCard();
    console.log("after draw, the player have " + _hand.cards.length + " cards");
    console.log("=== the last card is  ===");
}

function test2Cards(_hand, _game) {
    let card1 = new Card(RANK_NAMES[7], SUIT_NAMES[0]);
    let card2 = new Card(RANK_NAMES[7], SUIT_NAMES[0]);
    let testCards = [card1, card2];
    console.log("before play2Cards, the player have " + _hand.cards.length + " cards");
    _game.play2Cards(testCards);
    console.log("after play2Cards, the player have " + _hand.cards.length + " cards");
}

function showCardList(_cards) {
    for (let i = 0; i < array.length; i++) {
        cons

    }
}