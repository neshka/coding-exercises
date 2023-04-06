class Card {
    constructor(suit, value) {
      this.suit = suit;
      this.value = value;
    }
  }
  
  class Deck {
    constructor() {
      this.cards = [];
      const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
      const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  
      for (const suit of suits) {
        for (const value of values) {
          this.cards.push(new Card(suit, value));
        }
      }
      this.shuffle();
    }
  
    shuffle() {
      for (let i = this.cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
      }
    }
  
    draw() {
      return this.cards.pop();
    }
  }
  
  function calculateScore(hand) {
    let score = 0;
    let aces = 0;
    for (const card of hand) {
      if (card.value === 'A') {
        aces++;
        score += 11;
      } else if (['K', 'Q', 'J'].includes(card.value)) {
        score += 10;
      } else {
        score += parseInt(card.value);
      }
  
      while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
      }
    }
    return score;
  }
  
  function playGame() {
    const deck = new Deck();
    const sam = { name: 'Sam', hand: [deck.draw(), deck.draw()] };
    const dealer = { name: 'Dealer', hand: [deck.draw(), deck.draw()] };
  
    while (calculateScore(sam.hand) < 17) {
      sam.hand.push(deck.draw());
    }
  
    if (calculateScore(sam.hand) > 21) {
      return dealer;
    }
  
    while (calculateScore(dealer.hand) <= calculateScore(sam.hand)) {
      dealer.hand.push(deck.draw());
    }
  
    if (calculateScore(dealer.hand) > 21) {
      return sam;
    }
  
    return dealer;
  }
  
  const winner = playGame();
  console.log(`The winner is: ${winner.name}`);
  