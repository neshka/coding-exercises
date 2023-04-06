import { calculateScore as calculateScoreOOP, playGame as playGameOOP } from "./answers/21_OOP";
import { calculateScore as calculateScoreFP, playGame as playGameFP } from "./answers/21_FP";

console.log('Let\'s start the Blackjack game!');
console.log('===============================');
//add time counter
console.log('This is the OOP paradigm');
(async () => {
    const winnerOOP = await playGameOOP();
    console.log(`The winner is ${winnerOOP.name}! With a score of ${calculateScoreOOP(winnerOOP.hand)}`);

console.log('Let\'s play again!');
console.log('===============================');
//add time counter
console.log('This is the FP paradigm');
    const winnerFP = await playGameFP();
    console.log(`The winner is ${winnerFP.name}! With a score of ${calculateScoreFP(winnerFP.hand)}`);
})();