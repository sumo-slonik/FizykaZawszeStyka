const canvas2 = document.getElementById("canvas2");
const ctx2 = canvas2.getContext('2d');
canvas2.width = window.innerWidth;
canvas2.height = 900;


function drawTree(startX, startY, len, angle, branchWidth, color1, color2) {
	ctx2.beginPath();
	ctx2.save();
	ctx2.strokeStyle = color1;
	ctx2.fillStyle = color2;
	ctx2.lineWidth = branchWidth;
	ctx2.translate(startX,startY);
	ctx2.rotate(angle*Math.PI/180);
	ctx2.moveTo(0,0);
	ctx2.lineTo(0,-len);
	ctx2.stroke();
	
	if (len < 10) {
		ctx2.restore();
		return;
	}
	
	drawTree(0, -len, len * 0.75, angle + 37, branchWidth);
	drawTree(0, -len, len * 0.75, angle - 25, branchWidth);
	
	ctx2.restore();
	
}

drawTree(canvas2.width * 0.9, canvas2.height -250, 200, -65, 4, 'rgba(255,12,255,0.2)', 'green');