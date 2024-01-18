import math

a, b = list(map(int,input().split(' ')))

a = a / 100

bmi = b / (a ** 2)



if bmi >= 25:
    print(f'{math.trunc(bmi)}') 
    print('Obesity')
else:
    print(f'{math.trunc(bmi)}')