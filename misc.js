Array.prototype.count = function(x) {
	var output = 0;
	for (var i = 0; i < this.length; i++) {
		if (this[i] == x) {
			output++;
		}
	}
	return output;
}

String.prototype.count = function(c) {
	var output = 0;
	for (var i = 0; i < this.length; i++) {
		if (this.charAt(i) == c) {
			output++;
		}
	}
	return output;
}

ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";