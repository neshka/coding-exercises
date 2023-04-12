function canSplitTreasure(
  gems: number[],
  numHunters: number
): [boolean, number[][]] {
  const sum = gems.reduce((a, b) => a + b, 0);
  if (sum % numHunters !== 0) {
    return [false, []];
  }

  const target = sum / numHunters;
  const hunters: number[][] = new Array(numHunters).fill(null).map(() => []);
  const usedGems: boolean[] = new Array(gems.length).fill(false);

  function trySplit(index: number, currentHunter: number): boolean {
    if (currentHunter === numHunters) {
      return true;
    }

    let currentSum = hunters[currentHunter].reduce((a, b) => a + b, 0);
    for (let i = index; i < gems.length; i++) {
      if (!usedGems[i] && currentSum + gems[i] <= target) {
        usedGems[i] = true;
        hunters[currentHunter].push(gems[i]);
        currentSum += gems[i];

        if (currentSum === target) {
          if (trySplit(0, currentHunter + 1)) {
            return true;
          }
        } else {
          if (trySplit(i + 1, currentHunter)) {
            return true;
          }
        }

        usedGems[i] = false;
        hunters[currentHunter].pop();
        currentSum -= gems[i];
      }
    }

    return false;
  }

  if (trySplit(0, 0)) {
    return [true, hunters];
  } else {
    return [false, []];
  }
}

console.log(canSplitTreasure([4, 4, 4], 3));
console.log(canSplitTreasure([27, 7, 20], 2));
console.log(canSplitTreasure([6, 3, 2, 4, 1], 2));
console.log(canSplitTreasure([3, 2, 7, 7, 14, 5, 3, 4, 9, 2], 4));

//bonus
console.log(canSplitTreasure([3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2], 4));
