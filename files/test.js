const ejsexcel = require("ejsexcel");
const fs = require("fs");

const exlBuf = fs.readFileSync("./files/One week sports plan.xlsx");
const data = [
	{item:"Monday",		run: "1", bicycle:"1.5", aerobic:"0.5", swim:"-", aerobics:"0.5", tennis:"1", brisk_walk:"-", dance:"2"},
	{item:"Tuesday", 	run: "1", bicycle:"1.5", aerobic:"0.5", swim:"2", aerobics:"0.5", tennis:"1", brisk_walk:"-", dance:"-"},
	{item:"Wednesday", 	run: "1", bicycle:"1.5", aerobic:"0.5", swim:"-", aerobics:"0.5", tennis:"1", brisk_walk:"-", dance:"2"},
	{item:"Thursday", 	run: "2", bicycle:"1.5", aerobic:"0.5", swim:"-", aerobics:"0.6", tennis:"1", brisk_walk:"2", dance:"-"},
	{item:"Friday", 	run: "1", bicycle:"1.5", aerobic:"0.5", swim:"-", aerobics:"0.5", tennis:"1", brisk_walk:"-", dance:"2"},
	{item:"Saturday", 	run: "3", bicycle:"1.5", aerobic:"0.5", swim:"1", aerobics:"0.7", tennis:"2", brisk_walk:"4", dance:"-"},
	{item:"Sunday", 	run: "1", bicycle:"1.5", aerobic:"0.5", swim:"-", aerobics:"0.5", tennis:"1", brisk_walk:"-", dance:"2"}
];
ejsexcel.renderExcel(exlBuf, data).then(function(exlBuf2) {
	fs.writeFileSync("./One week sports plan2.xlsx",exlBuf2);
}).catch(function(err) {
	console.error(err);
});
