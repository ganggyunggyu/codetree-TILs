const fs = require('fs');
const input = fs.readFileSync(0).toString().split('\n');
/**
16 7 500
7 0 2 3 0 8 7 7 6 1 4 6 10 3 9 9
10 10 9 3 6 3 7 2 10 1 0 6 9 7 2 7
10 7 3 4 6 6 1 3 4 5 9 7 5 0 4 3
7 2 5 3 7 0 0 2 1 8 6 1 2 0 7 6
9 3 0 2 10 1 2 5 6 2 7 7 0 0 1 6
1 5 2 10 1 4 8 8 3 5 3 4 2 6 7 0
3 2 2 9 9 7 8 5 4 3 6 8 0 8 0 5
7 9 3 10 2 2 2 0 0 7 5 1 7 10 10 10
0 0 2 5 2 0 3 1 1 8 8 4 1 3 1 0
8 1 2 0 0 0 1 9 10 9 4 3 5 4 0 9
6 7 3 6 6 3 5 8 6 3 0 2 4 5 3 0
5 0 3 6 3 1 0 0 7 4 5 0 4 6 9 0
10 9 5 4 6 4 7 2 10 5 10 2 1 6 3 9
1 0 3 8 2 1 0 3 2 1 6 9 8 6 2 8
1 7 4 3 1 3 7 0 6 6 5 0 8 5 3 9
5 5 10 10 0 7 7 0 2 2 0 6 7 6 7 3
10 4 2 2
12 16 0 13
8 8 1 3
15 8 1 5
4 14 0 19
12 7 3 9
11 16 2 17
 */
//0 181 13 8 14 142 682

const [n, m, k] = input.shift().split(' ').map(Number);

//상 우 하 좌
const DX = [-1, 0, 1, 0];
const DY = [0, 1, 0, -1];

const guns = [];
for (let i = 0; i < n; i++) {
  guns.push(input[i].split(' ').map((el) => el.replace('0', '').split('').map(Number)));
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
    this.gun = 0;
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
    } else {
      this.x = nextX;
      this.y = nextY;
      this.dir = this.dir;
    }
  }
  getGun() {
    if (guns[this.x][this.y].length !== 0) {
      if (this.gun === 0) {
        this.gun = guns[this.x][this.y].sort().pop();
      } else {
        const maxGun = guns[this.x][this.y].sort().pop();
        if (this.gun < maxGun) {
          const temp = this.gun;
          this.gun = maxGun;
          guns[this.x][this.y].push(temp);
          
        } else {
          guns[this.x][this.y].push(maxGun);
        }
      }
    }
  }
  totalAtt() {
    if (this.gun === 0) return this.att;
    return this.att + this.gun;
  }
  battle(otherPlayer) {
    
    if (this.totalAtt() === otherPlayer.totalAtt()) {
      if (this.att > otherPlayer.att) {
        this.win(0);
        otherPlayer.lose();
        this.getGun();
      } else {
        otherPlayer.win(0);
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
    if (this.gun !== 0) guns[this.x][this.y].push(this.gun);
    this.gun = 0;
    this.loseMove();
    this.getGun();
  }
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
    } else {
      player.getGun();
    }
  }
}


const point = [];

for (const player of players) {
  point.push(player.point);
}

console.log(point.join(' '))