import * as readline from 'readline';

class Card {
  readonly suit: string;
  readonly value: string;

  constructor(suit: string, value: string) {
    this.suit = suit;
    this.value = value;
  }
}

class Deck {
  cards: Card[];

  constructor() {
    this.cards = [];
    const suits: string[] = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values: string[] = [
      'A',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      'J',
      'Q',
      'K',
    ];

    for (const suit of suits) {
      for (const value of values) {
        this.cards.push(new Card(suit, value));
      }
    }
    this.shuffle();
  }

  shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  draw(): Card | undefined {
    return this.cards.pop();
  }
}

export function calculateScore(hand: Card[]): number {
  let score: number = 0;
  let aces: number = 0;

  for (const card of hand) {
    if (card.value === 'A') {
      aces++;
      score += 11;
    } else if (['K', 'Q', 'J'].includes(card.value)) {
      score += 10;
    } else {
      score += parseInt(card.value, 10);
    }

    while (score > 21 && aces > 0) {
      score -= 10;
      aces--;
    }
  }

  return score;
}

export interface Player {
  name: string;
  hand: Card[];
}

function prompt(message: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => {
    rl.question(message, (answer: string) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function getPlayerName(playerNumber: number): Promise<string> {
  return await prompt(`Enter Player ${playerNumber} name: `);
}

async function createPlayer(playerNumber: number, deck: Deck): Promise<Player> {
  const playerName = await getPlayerName(playerNumber);
  const player: Player = {
    name: playerName,
    hand: [deck.draw()!, deck.draw()!],
  };
  return player;
}

function drawCardsUntilScore(
  player: Player,
  deck: Deck,
  targetScore: number
): void {
  while (calculateScore(player.hand) < targetScore) {
    const card = deck.draw();
    if (card) {
      player.hand.push(card);
    }
  }
}

function playTurn(player1: Player, player2: Player, deck: Deck): Player | null {
  drawCardsUntilScore(player1, deck, 17);

  if (calculateScore(player1.hand) > 21) {
    console.log(
      `${player1.name} has lost! Busting! With a score of ${calculateScore(
        player1.hand
      )}`
    );
    return player2;
  }

  drawCardsUntilScore(player2, deck, calculateScore(player1.hand) + 1);

  if (calculateScore(player2.hand) > 21) {
    console.log(
      `${player2.name} has lost! Busting! With a score of ${calculateScore(
        player2.hand
      )}`
    );
    return player1;
  }

  return null;
}

export async function playGame(): Promise<Player> {
  const deck = new Deck();
  const player1 = await createPlayer(1, deck);
  const player2 = await createPlayer(2, deck);

  const winner = playTurn(player1, player2, deck);
  return winner || player2;
}
