const canvas3 = document.getElementById("canvas3");
const ctx3 = canvas3.getContext('2d');
canvas3.width = window.innerWidth;
canvas3.height = 900;


function drawTree(startX, startY, len, angle, branchWidth, color1, color2) {
	ctx3.beginPath();
	ctx3.save();
	ctx3.strokeStyle = color1;
	ctx3.fillStyle = color2;
	ctx3.lineWidth = branchWidth;
	ctx3.translate(startX,startY);
	ctx3.rotate(angle*Math.PI/180);
	ctx3.moveTo(0,0);
	ctx3.lineTo(0,-len);
	ctx3.stroke();
	
	if (len < 10) {
		ctx3.restore();
		return;
	}
	
	drawTree(0, -len, len * 0.75, angle + 12, branchWidth);
	drawTree(0, -len, len * 0.75, angle - 25, branchWidth);
	
	ctx3.restore();
	
}

drawTree(canvas3.width*0.05, canvas3.height -200, 190, 30, 4, 'rgba(249,249,12,0.2)', "red");