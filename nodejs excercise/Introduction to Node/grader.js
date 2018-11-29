function average(arr){
	let sum =0;
	for(let i=0;i<arr.length;i++){
		sum += arr[i];
	}
	let avg = sum/arr.length;
	return Math.round(avg,0);
}

var scores = [90,98,89,100,100,86,94];
var scores2 = [40,65,77,82,80,54,73,63,95,49];
console.log(average(scores));
console.log(average(scores2));
