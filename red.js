var people =[
    {name:'ram',age:21},
    {name:'visu',age:44},
    {name:'nirmal',age:09}
]

const groupBy =(objArr)=>{
    var rama ={}
    for(i=0;i<objArr.length;i++){
        if(!rama[objArr[i]['age']]){
            rama[objArr[i]['age']]=[];
            rama[objArr[i]['age']].push(objArr[i])
        }
        else
        rama[objArr[i]['age']].push(objArr[i])
    }
    return rama;

}

console.log(groupBy(people))