const fs = require("fs");
const input = fs.readFileSync(0).toString().trim().split('\n');
const N = Number(input[0]);
// Please write your code here.
let a = 0
const getN = () => {
    if(a == 9) {
        a = 1
        return 1 }
    
    return a += 1  
}



for(let i = 0; i < N; i++){
    let r = ''
    for(let j = 0; j < N; j++){
        const n = getN()
        if(j==0){
            r +=  n
        }else{
        r += ' ' + n

        }
    }
    console.log(r)
}