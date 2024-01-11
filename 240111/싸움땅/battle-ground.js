const fs = require('fs');
const input = fs.readFileSync(0).toString().split('\n');

const [n, m, k] = input.shift().split(' ').map(Number);

//상 우 하 좌
const DX = [-1, 0, 1, 0];
const DY = [0, 1, 0, -1];

const guns = [];
for (let i = 0; i < n; i++) {
  guns.push(input[i].split(' ').map(Number));
}

// 바라보는 방향으로 움직이는 함수  move
// 움직일때마다 해당 좌표에 다른 플레이어가 있는지 확인하는 함수 check
// 있다면 ?
// 배틀 battle
// 나의 총 공격력과 상대의 공격력을 비교
// 승리자가 공격력의 차이만큼 포인트를 획득한다
// 승리자 win
// 패배자의 총과 승리자의 총을 비교한다 더 높은 총은 갖고 낮은 총은 놓는다 비교하고 줍기 때문에 compareGetGun
// 패배자 lose
// 총을 놔둔다
// 바라보는 방향으로 움직인다 move
// 총을 줍는다 총이 없기 때문에 getGun

// 없다면 ?
// 내가 가지고 있는 총이 없다면 무조건 총을 줍는다 getGun
// 내가 가지고 있는 총이 있다면 나의 총과 비교하고 더 높은 공격력의 총을 줍는다 compareGetGun

//x, y, dir, att, gun, totalAtt, point
const players = [];

const inGraph = (x, y) => {
  return 0 <= x && x < n && 0 <= y && y < n;
};
const check = (x, y, num) => {
  for (let i = 0; i < players.length; i++) {
    if (i === num) continue;
    if (x === players[i].x && y === players[i].y) {
      return players[i];
    }
  }
  return false;
};

class Player {
  constructor(num, x, y, dir, att) {
    this.num = num;
    this.x = x - 1;
    this.y = y - 1;
    this.dir = dir;
    this.att = att;
    this.gun = null;
    this.point = 0;
  }
  move() {
    const [nextX, nextY] = [this.x + DX[this.dir], this.y + DY[this.dir]];

    if (!inGraph(nextX, nextY)) {
      const turnDir = (this.dir + 2) % 4;
      const [nextX, nextY] = [this.x + DX[turnDir], this.y + DY[turnDir]];
      this.x = nextX;
      this.y = nextY;
      this.dir = turnDir;
      this.getGun();
      return;
    } else {
      this.x = nextX;
      this.y = nextY;
      this.dir = this.dir;
      this.getGun();
    }
  }
  getGun() {
    if (this.gun === null) {
      this.gun = guns[this.x][this.y];
      guns[this.x][this.y] = 0;
    } else {
      if (this.gun < guns[this.x][this.y]) {
        this.gun = guns[this.x][this.y];
        guns[this.x][this.y] = 0;
      }
    }
  }
  totalAtt() {
    if (this.gun === null || this.gun === 0) return this.att;
    return this.att + this.gun;
  }
  battle(otherPlayer) {
    if (this.totalAtt() === otherPlayer.totalAtt()) {
      if (this.att > otherPlayer.att) {
        this.win(this.totalAtt() - otherPlayer.totalAtt());
        otherPlayer.lose();
        this.getGun();
      } else {
        otherPlayer.win(otherPlayer.totalAtt() - this.totalAtt());
        this.lose();
        otherPlayer.getGun();
      }
      return;
    }
    if (this.totalAtt() > otherPlayer.totalAtt()) {
      this.win(this.totalAtt() - otherPlayer.totalAtt());
      otherPlayer.lose();
      this.getGun();
      return;
    }
    if (this.totalAtt() < otherPlayer.totalAtt()) {
      otherPlayer.win(otherPlayer.totalAtt() - this.totalAtt());
      this.lose();
      otherPlayer.getGun();
      return;
    }
  }
  loseMove() {
    const [nextX, nextY] = [this.x + DX[this.dir], this.y + DY[this.dir]];

    if (!inGraph(nextX, nextY)) {
      const turnDir = this.dir + 1 > 4 ? (this.dir = 1) : (this.dir = this.dir + 1);
      const [nextX, nextY] = [this.x + DX[turnDir], this.y + DY[turnDir]];
      this.x = nextX;
      this.y = nextY;
      this.dir = turnDir;
      this.getGun();
      return;
    } else {
      this.x = nextX;
      this.y = nextY;
      this.dir = this.dir;
      this.getGun();
    }
  }
  win(point) {
    this.point = point;
  }
  lose() {
    guns[this.x][this.y] = this.gun;
    this.gun = null;
    this.loseMove();
    this.getGun();
  }
  compare() {}
}

for (let [i, j] = [n, 0]; i < n + m; i++, j++) {
  const player = input[i].split(' ').map(Number);
  players.push(new Player(j, player[0], player[1], player[2], player[3]));
}

for (let i = 0; i < k; i++) {
  for (const player of players) {
    player.move();
    const otherPlayer = check(player.x, player.y, player.num);
    if (otherPlayer) {
      player.battle(otherPlayer);
    }
  }
}

const point = [];

for (const player of players) {
  point.push(player.point);
}
console.log(point.join(' '));