const hexToRGB = (hex, alpha) => {
  if (hex) {
    const r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
      return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
    } else {
      return 'rgb(' + r + ', ' + g + ', ' + b + ')';
    }
  }
};

// Version 4.0
// Make color lighter or darker:
// https://github.com/PimpTrizkit/PJs/wiki/12.-Shade,-Blend-and-Convert-a-Web-Color-(pSBC.js)
// Version 4.0
const RGB_Linear_Shade=(p,c_param)=>{
  var i=parseInt;
  var r=Math.round;
  var [a,b,c,d]=c_param.split(",");
  var P=p<0;
  var t=P?0:255*p;
  var P1=P?1+p:1-p;
	return"rgb"+(d?"a(":"(")+r(i(a[3]==="a"?a.slice(5):a.slice(4))*P1+t)+","+r(i(b)*P1+t)+","+r(i(c)*P1+t)+(d?","+d:")");
}


export { hexToRGB, RGB_Linear_Shade }
