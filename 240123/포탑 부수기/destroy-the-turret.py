from collections import deque


# 공격할 포탑을 선정 (가장 약한 포탑)

def select_attacker(_):
    global turrets,attack_points
    attackers = []

    min_score = 5001
    for i in range(N):
        for j in range(M):
            if turrets[i][j] != 0 and min_score > turrets[i][j]:
                min_score = turrets[i][j]

    for i in range(N):
        for j in range(M):
            if min_score == turrets[i][j]:
                attackers.append([i, j])

    max_num = -1
    for y, x in attackers:
        if max_num < attack_points[y][x]:
            max_num = attack_points[y][x]

    for y, x in attackers:
        if max_num != attack_points[y][x]:
            attackers.remove([y, x])

    attackers.sort(key=lambda x: (-sum(x), -x[1]))
    turrets[attackers[0][0]][attackers[0][1]] += N+M
    attack_points[attackers[0][0]][attackers[0][1]] = _ + 1

    return attackers[0]

dy = [0, 1, 0, -1]
dx = [1, 0, -1, 0]

can_attack = False
def attack_1(start, end):
    global turrets, back_y, back_x, can_attack
    que = deque()
    que.append(start)
    visited = [[False] * M for _ in range(N)]
    visited[start[0]][start[1]] = True

    can_attack = False

    attack_point = []
    while que:
        y, x = que.popleft()
        if [y,x] == end:
            can_attack = True
            break
        for i in range(4):
            ny = (y + dy[i]) % N
            nx = (x + dx[i]) % M
            if visited[ny][nx]:
                continue
            if turrets[ny][nx] == 0:
                continue
            que.append([ny, nx])
            back_y[ny][nx] = y
            back_x[ny][nx] = x
            visited[ny][nx] = True

    if can_attack:
        cy = back_y[end[0]][end[1]]
        cx = back_x[end[0]][end[1]]

        while [cy, cx] != start:
            attack_point.append([cy, cx])

            next_cy = back_y[cy][cx]
            next_cx = back_x[cy][cx]

            cy = next_cy
            cx = next_cx


    return attack_point

def attack_2(start, end):
    attack_point = []
    y, x = end
    attack_point.append([(y - 1) % N, (x) % M])
    attack_point.append([(y - 1) % N, (x - 1) % M])
    attack_point.append([(y - 1) % N, (x + 1) % M])
    attack_point.append([(y) % N, (x - 1) % M])
    attack_point.append([(y) % N, (x + 1) % M])
    attack_point.append([(y + 1) % N, (x) % M])
    attack_point.append([(y + 1) % N, (x - 1) % M])
    attack_point.append([(y + 1) % N, (x + 1) % M])

    if start in attack_point:
        attack_point.remove(start)

    return attack_point


def attacking():
    global turrets, attack_point
    attacked = []
    max_score = -1
    for i in range(N):
        for j in range(M):
            if turrets[i][j] != 0 and max_score < turrets[i][j] and [i,j] != attacker:
                max_score = turrets[i][j]

    for i in range(N):
        for j in range(M):
            if max_score == turrets[i][j]:
                attacked.append([i, j])

    min_num = 5001
    for y, x in attacked:
        if min_num > attack_points[y][x]:
            min_num = attack_points[y][x]

    for y, x in attacked:
        if min_num != attack_points[y][x]:
            attacked.remove([y, x])

    attacked.sort(key=lambda x: (sum(x), x[1]))
    end = attacked[0]

    attack_point = attack_1(attacker, end)
    if not can_attack:
        attack_point = attack_2(attacker, attacked[0])

    return end

# 공격할수 있는 포탑이 남아있는지 탐색
def is_active():
    cnt = 0
    for i in range(N):
        cnt += turrets[i].count(0)

    if cnt >= N*M-1:
        return False

    return True

def repairing():
    global turrets, attack_point

    for i in range(N):
        for j in range(M):
            if turrets[i][j] == 0:
                continue
            if [i, j] not in attack_point:
                if [i, j] == attacker:
                    continue
                if [i, j] == attacked:
                    continue
                turrets[i][j] += 1

def breaking():
    global turrets, attack_point

    while attack_point:
        y, x = attack_point.pop()
        turrets[y][x] -= turrets[attacker[0]][attacker[1]] // 2
        if turrets[y][x] < 0:
            turrets[y][x] = 0

    turrets[attacked[0]][attacked[1]] -= turrets[attacker[0]][attacker[1]]
    if turrets[attacked[0]][attacked[1]] < 0:
        turrets[attacked[0]][attacked[1]] = 0

N, M ,K = map(int, input().split())
turrets = [list(map(int, input().split())) for _ in range(N)]
attack_points = [[0] * M for _ in range(N)]

attack_point = []

back_y = [[0] * M for _ in range(N)]
back_x = [[0] * M for _ in range(N)]

for _ in range(K):
    if not is_active():
        break
    attacker = select_attacker(_)
    attacked = attacking()
    repairing()
    breaking()

result = -1
for x in range(N):
    for y in range(M):
        if result < turrets[x][y]:
            result = turrets[x][y]

print(result)