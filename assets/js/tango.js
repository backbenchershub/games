const SIZE = 6;
const symbols = [' ', '◯', '☽'];
let board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
let solution = [];
let constraints = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
const table = document.getElementById('board');
const messageDiv = document.getElementById('message');

const DifficultyLevels = {
  easy: { constraints: 8, prefill: 8 },
  medium: { constraints: 6, prefill: 6 },
  hard: { constraints: 5, prefill: 5 }
};
let currentDifficulty = 'medium';

document.getElementById('difficulty').onchange = e => {
  currentDifficulty = e.target.value;
  generateGame();
};

document.getElementById('resetButton').onclick = () => {
  resetUserEntries();
};

window.onload = () => {
  generateGame();
};

function generateGame() {
  generateValidBoard();
  applyPrefillAndConstraints();
}

function generateValidBoard() {
  solution = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

  function isValid(r, c, val) {
    solution[r][c] = val;

    const row = solution[r];
    const col = solution.map(row => row[c]);

    if (row.filter(v => v === val).length > SIZE / 2) return false;
    if (col.filter(v => v === val).length > SIZE / 2) return false;

    for (let i = 0; i < SIZE - 2; i++) {
      if (row[i] && row[i] === row[i + 1] && row[i + 1] === row[i + 2]) return false;
      if (col[i] && col[i] === col[i + 1] && col[i + 1] === col[i + 2]) return false;
    }

    return true;
  }

  function backtrack(r = 0, c = 0) {
    if (r === SIZE) return true;

    const [nr, nc] = c === SIZE - 1 ? [r + 1, 0] : [r, c + 1];
    const vals = [1, 2];
    shuffle(vals);

    for (let v of vals) {
      if (isValid(r, c, v)) {
        solution[r][c] = v;
        if (backtrack(nr, nc)) return true;
      }
    }

    solution[r][c] = 0;
    return false;
  }

  backtrack();
}

function applyPrefillAndConstraints() {
  board = solution.map(row => row.slice());
  table.innerHTML = '';
  document.querySelectorAll('.constraint-sign').forEach(e => e.remove());
  constraints = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
  messageDiv.textContent = '';

  for (let r = 0; r < SIZE; r++) {
    const rowEl = document.createElement('tr');
    for (let c = 0; c < SIZE; c++) {
      const cell = document.createElement('td');
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.onclick = () => {
        if (!cell.classList.contains('locked')) {
          board[r][c] = (board[r][c] + 1) % 3;
          cell.textContent = symbols[board[r][c]];
          checkBoard();
        }
      };
      rowEl.appendChild(cell);
    }
    table.appendChild(rowEl);
  }

  const allCells = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      allCells.push([r, c]);
    }
  }
  shuffle(allCells);
  const prefill = DifficultyLevels[currentDifficulty].prefill;
  const keepSet = new Set(allCells.slice(0, prefill).map(([r, c]) => `${r},${c}`));

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const cell = table.rows[r].cells[c];
      if (keepSet.has(`${r},${c}`)) {
        cell.textContent = symbols[board[r][c]];
        cell.classList.add('locked');
      } else {
        board[r][c] = 0;
        cell.textContent = '';
        cell.classList.remove('locked');
      }
    }
  }

  addRandomConstraints(DifficultyLevels[currentDifficulty].constraints);
}

function addRandomConstraints(count) {
  let added = 0;
  while (added < count) {
    const r = Math.floor(Math.random() * SIZE);
    const c = Math.floor(Math.random() * SIZE);
    const dir = Math.random() < 0.5 ? 'right' : 'down';
    let r2 = r, c2 = c;

    if (dir === 'right' && c < SIZE - 1) c2++;
    else if (dir === 'down' && r < SIZE - 1) r2++;
    else continue;

    if (constraints[r][c]) continue;

    const a = solution[r][c];
    const b = solution[r2][c2];
    const type = a === b ? '=' : '≠';

    constraints[r][c] = { type, r2, c2 };
    drawConstraint(r, c, r2, c2, type);
    added++;
  }
}

function drawConstraint(r1, c1, r2, c2, type) {
  const cell1 = table.rows[r1].cells[c1];
  const cell2 = table.rows[r2].cells[c2];
  const sign = document.createElement('div');
  sign.textContent = type;
  sign.className = 'constraint-sign';

  const midX = (cell1.offsetLeft + cell2.offsetLeft + cell1.offsetWidth) / 2;
  const midY = (cell1.offsetTop + cell2.offsetTop + cell1.offsetHeight) / 2;

  sign.style.left = `${midX}px`;
  sign.style.top = `${midY}px`;
  sign.style.transform = 'translate(-50%, -50%)';
  table.parentElement.appendChild(sign);
}

function checkBoard() {
  messageDiv.textContent = '';

  for (let i = 0; i < SIZE; i++) {
    const row = board[i];
    const col = board.map(r => r[i]);

    if (!isBalanced(row) || hasTriple(row)) {
      messageDiv.textContent = `Invalid row ${i + 1}`;
      return;
    }

    if (!isBalanced(col) || hasTriple(col)) {
      messageDiv.textContent = `Invalid column ${i + 1}`;
      return;
    }
  }

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const con = constraints[r][c];
      if (con) {
        const a = board[r][c];
        const b = board[con.r2][con.c2];
        if (a && b) {
          if ((con.type === '=' && a !== b) || (con.type === '≠' && a === b)) {
            messageDiv.textContent = `Constraint between (${r + 1},${c + 1}) and (${con.r2 + 1},${con.c2 + 1}) is invalid`;
            return;
          }
        }
      }
    }
  }
}

function isBalanced(arr) {
  const ones = arr.filter(v => v === 1).length;
  const twos = arr.filter(v => v === 2).length;
  return ones <= SIZE / 2 && twos <= SIZE / 2;
}

function hasTriple(arr) {
  for (let i = 0; i < arr.length - 2; i++) {
    if (arr[i] && arr[i] === arr[i + 1] && arr[i] === arr[i + 2]) return true;
  }
  return false;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function resetUserEntries() {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const cell = table.rows[r].cells[c];
      if (!cell.classList.contains('locked')) {
        board[r][c] = 0;
        cell.textContent = '';
      }
    }
  }
  messageDiv.textContent = '';
}

function showRules() {
  const rulesText = `
GAME RULES:

1. Equal Number of Symbols
- Each row and column must contain exactly 3 ◯ (Circle) and 3 ☽ (Crescent).
- No more than 3 of either symbol in any row or column.

2. No Three in a Row or Column
- You cannot place three of the same symbols consecutively.
- ✅ Example: ◯ ☽ ◯ ☽ is valid
- ❌ Example: ☽ ☽ ☽ is invalid

3. Constraints Between Cells
- '=' means both cells must have the same symbol.
- '≠' means the cells must have different symbols.
- Constraints appear only between adjacent cells, not on the outer edges.

4. Prefilled Cells
- A few cells are filled at the start and cannot be changed.
- These cells are visually locked with gray background.
      `;
  alert(rulesText);
}
