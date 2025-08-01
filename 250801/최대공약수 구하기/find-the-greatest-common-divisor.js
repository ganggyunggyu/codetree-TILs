const fs = require("fs");
const input = fs.readFileSync(0).toString().trim().split(" ");
let n = Number(input[0]);
let m = Number(input[1]);
// Please Write your code here.

const getN = (t) => {
    if(t === 'max') return n > m ? n : m
    if(t === 'min') return n > m ? m : n
}

const solution = () => {
    if(n === m) return n
    let result;
    // 두 수가 같은 경우

    const max = getN('max')
    const min =  getN('min')

    for(let i = 1; i <= min; i++){
        const isMax = max % i === 0
        const isMin = min % i === 0

        if(isMax & isMin){
            result = i
        }
    }
    
    return result
}


console.log(solution())