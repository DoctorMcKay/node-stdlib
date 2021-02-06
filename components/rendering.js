const Rendering = module.exports;

/**
 * Render an ASCII progress bar.
 * @param {number} value - The current value of this progress bar
 * @param {number} maxValue - The value at which the task is considered complete
 * @param {int} barWidth - How wide should the bar be, in characters
 * @param {boolean} [showPercentage=false]
 */
Rendering.progressBar = function(value, maxValue, barWidth, showPercentage = false) {
	barWidth -= 2; // subtract 2 from the width because the enclosing square brackets count toward the total width
	
	let filledChars = Math.round((value / maxValue) * barWidth);
	let pct = showPercentage ? ' ' + Math.round((value / maxValue) * 100) + '% ' : '';
	let pctPosition = Math.round((barWidth / 2) - (pct.length / 2)) + 1;
	
	let bar = '';
	for (let i = 1; i <= barWidth; i++) {
		if (pct && i == pctPosition) {
			bar += pct;
			i += pct.length - 1;
			continue;
		}
		
		if (i == filledChars && value < maxValue) {
			bar += '>';
		} else {
			bar += i <= filledChars ? '=' : ' ';
		}
	}
	
	return `[${bar}]`;
};
