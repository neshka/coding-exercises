import * as readline from 'readline';

interface Card {
  suit: string;
  value: string;
}

type Deck = Card[];

function createCard(suit: string, value: string): Card {
  return { suit, value };
}

function createDeck(): Deck {
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

  const deck: Deck = [];
  for (const suit of suits) {
    for (const value of values) {
      deck.push(createCard(suit, value));
    }
  }

  return shuffleDeck(deck);
}

function shuffleDeck(deck: Deck): Deck {
  const shuffledDeck = [...deck];
  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
  }

  return shuffledDeck;
}

function drawCard(deck: Deck): [Card | undefined, Deck] {
  const card = deck.pop();
  return [card, deck];
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
  const name = await prompt(`Enter Player ${playerNumber} name: `);
  return name;
}

async function createPlayer(
  playerNumber: number,
  deck: Deck
): Promise<[Player, Deck]> {
  const playerName = await getPlayerName(playerNumber);
  const [card1, deckAfterCard1] = drawCard(deck);
  const [card2, deckAfterCard2] = drawCard(deckAfterCard1);

  const player: Player = {
    name: playerName,
    hand: [card1!, card2!],
  };

  return [player, deckAfterCard2];
}

function drawCardsUntilScore(
  player: Player,
  deck: Deck,
  targetScore: number
): [Player, Deck] {
  let updatedPlayer = { ...player };
  let updatedDeck = [...deck];

  while (calculateScore(updatedPlayer.hand) < targetScore) {
    const [card, newDeck] = drawCard(updatedDeck);
    if (card) {
      updatedPlayer.hand.push(card);
      updatedDeck = newDeck;
    }
  }

  return [updatedPlayer, updatedDeck];
}

export async function playGame(): Promise<Player> {
  let deck = createDeck();
  const [player1, deckAfterPlayer1] = await createPlayer(1, deck);
  const [player2, deckAfterPlayer2] = await createPlayer(2, deckAfterPlayer1);

  const [updatedPlayer1, deckAfterTurn1] = drawCardsUntilScore(
    player1,
    deckAfterPlayer2,
    17
  );
  const player1Hand = calculateScore(updatedPlayer1.hand);
  if (player1Hand > 21) {
    console.log(
      `${player1.name} has lost! Busting! With a score of ${player1Hand}`
    );
    return player2;
  }

  const [updatedPlayer2] = drawCardsUntilScore(
    player2,
    deckAfterTurn1,
    calculateScore(updatedPlayer1.hand) + 1
  );
  const player2Hand = calculateScore(updatedPlayer2.hand);
  if (player2Hand > 21) {
    console.log(
      `${player2.name} has lost! Busting! With a score of ${player2Hand}`
    );
    return updatedPlayer1;
  }

  return updatedPlayer2;
}
