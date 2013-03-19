map="[0,0,0], "
for(i=1;i<20;i++){
	j = Math.floor((Math.random()*2)+1);
	k = Math.floor(Math.random()*100);
	map += "["+i*800+",";
	if( j==1)
		map += 0+",";
	else
		map += 100+",";
	map += k+"], ";
}
console.log(map);