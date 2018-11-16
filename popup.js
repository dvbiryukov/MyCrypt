chrome.tabs.executeScript( {
    code: "window.getSelection().toString();"
}, function(selection) {	
    document.getElementById("src").value = selection[0];
	go();
});

const enc=(k,p)=>{
  var r='', h=[], hs=0, kl=k.length, k = Sha1.hash(k);
  k.split("").map(a=>{var _=a.charCodeAt(0);hs=(hs%65536)+_;h.push(_)});
  var hl = h.length;  

  p.split("").map((a,i)=>{
    var _ = a.charCodeAt(0) ^ h[(hs+i) % hl]; 
    r+=String.fromCharCode(_);
  })  

  r = btoa(encodeURIComponent(r));
  return r;
}

const dec=(k,p)=>{  
  var r='', h=[], hs=0, kl=k.length, k = Sha1.hash(k);
  k.split("").map(a=>{var _=a.charCodeAt(0);hs=(hs%65536)+_;h.push(_)});  
  var hl = h.length;  
  p = decodeURIComponent(atob(p));

  p.split("").map((a,i)=>{
	var _ = a.charCodeAt(0) ^ h[(hs+i) % hl]; 
	r+=String.fromCharCode(_);
  })

  return r
}

const isBase64=(str)=>{try {return btoa(atob(str)) == str;} catch (err) {return false;}}


const go=(t)=>{
	var p = document.getElementById("src").value,
		k = localStorage["salt"];

	if(!isBase64(p) || t=="ENC"){
		document.getElementById("dst").value = enc(k,p);
		document.getElementById("mode").innerText = "ENC"
	} else {
		document.getElementById("dst").value = dec(k,p);
		document.getElementById("mode").innerText = "DEC"
	}
}

document.addEventListener('DOMContentLoaded', function(){ 
    localStorage["salt"] = localStorage["salt"] || '';
    document.getElementById('salt').value = localStorage["salt"];

	document.getElementById('mode').onclick = function() {
		if(document.getElementById("mode").innerText == "ENC")
			go("DEC")
		else
			go("ENC")		
	};

	document.getElementById('dst').onclick = function() {		
		const el = document.getElementById('dst');
		el.select();
		document.execCommand('copy');
		const dst = el.value
		el.value = "\n\n... was copied to clipboard ... "
		setTimeout(()=>{el.value = dst}, 2000);
	};

	document.getElementById('salt').oninput = function() {
 		localStorage["salt"] = document.getElementById('salt').value;
		go();
	};

	document.getElementById('src').oninput = go;

});


