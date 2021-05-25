var sortChronological = async(returnedData, numOfPosts) => {
    let sortData = []

if (numOfPosts > 1) {
for (let i in returnedData) {
    if (sortData.length == 0) {
        sortData.push(returnedData[i])
    }
    else {
        for (let j in sortData){
            if (returnedData[i].timeStamp <= sortData[j].timeStamp) {
                sortData.unshift(returnedData[i])
                break;
            }
            else if (j == sortData.length-1) {
                sortData.push(returnedData[i])
            }
        }
    }

}
}
else {
    sortData.push(returnedData[0])
}
sortData.reverse()
return sortData
}
export var sortChronological