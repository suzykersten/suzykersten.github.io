//TODO: Turn this into a proper JS class.

//sets up the typing: Pass in the div element to type out, how many characters to type at a time, and how long
// to wait between each typing section.
function doTyping(divToType, charactersToType, msBetweenType) {

	//convert string innerHTML to a nodeTree we can work with
	var toType = toTree(divToType.innerHTML);
	divToType.innerHTML = "";

	//empty anonymous function because this is sloppy code
	typeChildren(divToType, toType.childNodes, charactersToType, msBetweenType, function() {
		divToType.innerHTML += "<span class='cursor'>|</span>";
	});


}


//This works like a for loop that's always controlled by callbacks: if it finds a text node, the next 'iteration' is 
// done when that text node is done typing. If it's a tag, the next 'iteration' is called when that whole NODE is finished.
function typeChildren(actualNode, knownChildNodes, charas, ms, callback) {
	//if we're done, do whatver callback we need to do.
	if (knownChildNodes === undefined || knownChildNodes.length === 0) {
		callback();
	}


	var nextIterationFunc = function() {
		var arraySlice = [];
		if (knownChildNodes.length >= 1) {
			arraySlice = Array.prototype.slice.call(knownChildNodes).slice(1, knownChildNodes.length)
		}

		//move to next 'iteration', with the same callback as before.
		typeChildren(actualNode, arraySlice, charas, ms, callback);
	}

	//if text node
	if (knownChildNodes[0].nodeType == Node.TEXT_NODE) {	
		//type the text, when we're done with that, do the next iteration on this array.
		// Keep the same callback function so if we're three deep, callback will send us back to 2 deep 'for loop'
		type(actualNode, knownChildNodes[0].nodeValue, charas, ms, nextIterationFunc);

	} else {
		//clone current node for adding to actual DOM, clear it, then set it to be used as parent in typing it's children
		var node = knownChildNodes[0].cloneNode(false);
		node.innerHTML = "";
		actualNode.appendChild(node);

		//type children of current node
		//when done typing children of current node, go back to next node of THIS set of childNodes
		typeChildren(node, knownChildNodes[0].childNodes, charas, ms, nextIterationFunc);
	}
}



//Actually type out the parts of the string, x characters at a time
function type(whereToType, toType, charactersToType, msToWait, callback) {
	//if we don't have enough charas to type, just type what's left
	charactersToType = toType.length > charactersToType ? charactersToType : toType.length;
	whereToType.innerHTML += toType.substring(0, charactersToType);


	//cut out what we just typed of string, wait x seconds, type more
	if (toType.length > charactersToType) {

		toType = toType.substring(charactersToType, toType.length);

		setTimeout(function() {
			type(whereToType, toType, charactersToType, msToWait, callback);
		}, msToWait);

	} else {
		//we're done typing this section, do the callback function
		callback();
	}
}


function toTree(html) {
	var doc = new DOMParser().parseFromString(html, 'text/html');
	return doc.body;
}




//actually call the typing on testDiv
var startDiv = document.getElementById("bodyTerminal");

doTyping(startDiv, 3, 1);

