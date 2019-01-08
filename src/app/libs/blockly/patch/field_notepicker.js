/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2013 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
	Frequencey Generator Library.
	src = https://github.com/escottalexander/simpleTones.js/blob/master/simpleTones.js
*/
//Create Audio Context
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var o = null;
var g = null;

//Sound Storage 
//If you add your own sounds here, please consider 
//submitting a pull request with your additional sounds
var soundObj = {
	bump:["triangle",100,0.8,333,0.2,100,0.4,80,0.7],
	buzzer:["sawtooth",40,0.8, 100,0.3 ,110, 0.5],
	zip:["sawtooth",75,0.8,85,0.2,95,0.4,110,0.6,120,0.7,100,0.8],
	powerdown:["sine", 300, 1.2, 150, 0.5,1,0.9],
	powerup:["sine", 30, 1, 150, 0.4,350,0.9],
	bounce:["square", 75, 0.5, 150, 0.4],
	siren:["sawtooth",900,2.5, 400,0.5 ,900, 1, 400,1.4, 900, 2, 400, 2.5]
}

//Tone Storage
var tone = {
	'C0': 16.35,
	'C#0': 17.32,
	'Db0': 17.32,
	'D0': 18.35,
	'D#0': 19.45,
	'Eb0': 19.45,
	'E0': 20.60,
	'F0': 21.83,
	'F#0': 23.12,
	'Gb0': 23.12,
	'G0': 24.50,
	'G#0': 25.96,
	'Ab0': 25.96,
	'A0': 27.50,
	'A#0': 29.14,
	'Bb0': 29.14,
	'B0': 30.87,
	'C1': 32.70,
	'C#1': 34.65,
	'Db1': 34.65,
	'D1': 36.71,
	'D#1': 38.89,
	'Eb1': 38.89,
	'E1': 41.20,
	'F1': 43.65,
	'F#1': 46.25,
	'Gb1': 46.25,
	'G1': 49.00,
	'G#1': 51.91,
	'Ab1': 51.91,
	'A1': 55.00,
	'A#1': 58.27,
	'Bb1': 58.27,
	'B1': 61.74,
	'C2': 65.41,
	'C#2': 69.30,
	'Db2': 69.30,
	'D2': 73.42,
	'D#2': 77.78,
	'Eb2': 77.78,
	'E2': 82.41,
	'F2': 87.31,
	'F#2': 92.50,
	'Gb2': 92.50,
	'G2': 98.00,
	'G#2': 103.83,
	'Ab2': 103.83,
	'A2': 110.00,
	'A#2': 116.54,
	'Bb2': 116.54,
	'B2': 123.47,
	'C3': 130.81,
	'C#3': 138.59,
	'Db3': 138.59,
	'D3': 146.83,
	'D#3': 155.56,
	'Eb3': 155.56,
	'E3': 164.81,
	'F3': 174.61,
	'F#3': 185.00,
	'Gb3': 185.00,
	'G3': 196.00,
	'G#3': 207.65,
	'Ab3': 207.65,
	'A3': 220.00,
	'A#3': 233.08,
	'Bb3': 233.08,
	'B3': 246.94,
	'C4': 261.63,
	'C#4': 277.18,
	'Db4': 277.18,
	'D4': 293.66,
	'D#4': 311.13,
	'Eb4': 311.13,
	'E4': 329.63,
	'F4': 349.23,
	'F#4': 369.99,
	'Gb4': 369.99,
	'G4': 392.00,
	'G#4': 415.30,
	'Ab4': 415.30,
	'A4': 440.00,
	'A#4': 466.16,
	'Bb4': 466.16,
	'B4': 493.88,
	'C5': 523.25,
	'C#5': 554.37,
	'Db5': 554.37,
	'D5': 587.33,
	'D#5': 622.25,
	'Eb5': 622.25,
	'E5': 659.26,
	'F5': 698.46,
	'F#5': 739.99,
	'Gb5': 739.99,
	'G5': 783.99,
	'G#5': 830.61,
	'Ab5': 830.61,
	'A5': 880.00,
	'A#5': 932.33,
	'Bb5': 932.33,
	'B5': 987.77,
	'C6': 1046.50,
	'C#6': 1108.73,
	'Db6': 1108.73,
	'D6': 1174.66,
	'D#6': 1244.51,
	'Eb6': 1244.51,
	'E6': 1318.51,
	'F6': 1396.91,
	'F#6': 1479.98,
	'Gb6': 1479.98,
	'G6': 1567.98,
	'G#6': 1661.22,
	'Ab6': 1661.22,
	'A6': 1760.00,
	'A#6': 1864.66,
	'Bb6': 1864.66,
	'B6': 1975.53,
	'C7': 2093.00,
	'C#7': 2217.46,
	'Db7': 2217.46,
	'D7': 2349.32,
	'D#7': 2489.02,
	'Eb7': 2489.02,
	'E7': 2637.02,
	'F7': 2793.83,
	'F#7': 2959.96,
	'Gb7': 2959.96,
	'G7': 3135.96,
	'G#7': 3322.44,
	'Ab7': 3322.44,
	'A7': 3520.00,
	'A#7': 3729.31,
	'Bb7': 3729.31,
	'B7': 3951.07,
	'C8': 4186.01,
	'C#8': 4435,
	'D8': 4699,
	'Eb8': 4978,
	'E8': 5274,
	'F8': 5588,
	'F#8': 5920,
	'G8': 6272,
	'G#8': 6645,
	'A8': 7040,
	'Bb8': 7459,
	'B8': 7902
}

// Chord Storage
var chord = {
	'C': [261.6, 329.6, 392.0],
	'Cm': [261.6, 311.1, 392.0],
	'C#': [277.2, 349.2, 415.3],
	'D': [293.7, 370.0, 440.0],
	'Dm': [293.7, 349.2, 440.0],
	'D#': [311.1, 392.0, 466.2],
	'E': [329.6, 415.3, 493.9],
	'Em': [329.6, 392.0, 493.9],
	'F': [349.2, 440.0, 523.251],
	'Fm': [349.2, 415.3, 523.251],
	'F#': [370.0, 554.365, 466.2],
	'G': [392.0, 493.9, 587.330],
	'Gm': [392.0, 466.2, 587.330],
	'G#': [466.2, 523.251, 622.254],
	'A': [440.0, 554.365, 659.255],
	'Am': [440.0, 523.251, 659.255],
	'A#': [466.2, 587.330, 698.456],
	'B': [493.9, 622.254, 739.989],
	'Bm': [493.9, 587.330, 739.989]
}
//Primary function
playTone = (frequency, type, duration) => {
	if (type === undefined) {
		type = "sine";
	}
	if (duration === undefined) {
		duration = 1.3;
	}
	if (frequency === undefined) {
		frequency = 440;
	}
	o = context.createOscillator();
	g = context.createGain();
	o.connect(g);
	o.type = type;
	if (typeof frequency === "string") {
		if (tone[frequency] === undefined) {
			o.frequency.value = chord[frequency][0];
			completeChord(chord[frequency][1], type, duration);
			completeChord(chord[frequency][2], type, duration);
		} else if (chord[frequency] === undefined) {
			o.frequency.value = tone[frequency];
		}
	} else if (typeof frequency === "object") {
		o.frequency.value = frequency[0];
		completeChord(frequency[1], type, duration);
		completeChord(frequency[2], type, duration);
	} else {
		o.frequency.value = frequency;
	}
	g.connect(context.destination);
	o.start(0);
	g.gain.exponentialRampToValueAtTime(0.0001,context.currentTime + duration);
}

//This function helps complete chords and should not be used by itself
completeChord = (frequency, type, duration) => {
	osc = context.createOscillator();
	gn = context.createGain();
	osc.connect(gn);
	osc.type = type;
	osc.frequency.value = frequency;
	gn.connect(context.destination);
	osc.start(0);
	gn.gain.exponentialRampToValueAtTime(0.0001,context.currentTime + duration);
}


//This function plays sounds
  function playSound(waveType,startFreq,endTime) {
	if (soundObj[arguments[0]] && arguments.length === 1) {
		var soundName = arguments[0];
		playSound(...soundObj[soundName]);
	}  else {
	var oscillatorNode = context.createOscillator();
	var gainNode = context.createGain();
	
	oscillatorNode.type = waveType;
	oscillatorNode.frequency.setValueAtTime(startFreq, context.currentTime);
	
for (var i = 3; i < arguments.length; i += 2) {
	oscillatorNode.frequency.exponentialRampToValueAtTime(arguments[i], context.currentTime + arguments[i+1]);
}
	gainNode.gain.setValueAtTime(0.3, context.currentTime);
	gainNode.gain.exponentialRampToValueAtTime(0.1, context.currentTime +  0.5);
  
	oscillatorNode.connect(gainNode);
	gainNode.connect(context.destination);
  
	oscillatorNode.start();
	oscillatorNode.stop(context.currentTime + endTime);
  }
}



/**
 * @fileoverview Angle input field.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.FieldNotePicker');

goog.require('Blockly.FieldTextInput');
goog.require('goog.math');
goog.require('goog.userAgent');


/**
 * Class for an editable angle field.
 * @param {(string|number)=} opt_value The initial content of the field. The
 *     value should cast to a number, and if it does not, '0' will be used.
 * @param {Function=} opt_validator An optional function that is called
 *     to validate any constraints on what the user entered.  Takes the new
 *     text as an argument and returns the accepted text or null to abort
 *     the change.
 * @extends {Blockly.FieldTextInput}
 * @constructor
 */
Blockly.FieldNotePicker = function(opt_value, opt_validator) {
  // Add degree symbol: '360°' (LTR) or '°360' (RTL)
  this.symbol_ = Blockly.utils.createSvgElement('tspan', {}, null);
  this.symbol_.appendChild(document.createTextNode('\u00B0'));

  opt_value = (opt_value && !isNaN(opt_value)) ? String(opt_value) : '0';
  Blockly.FieldNotePicker.superClass_.constructor.call(
      this, opt_value, opt_validator);
};
goog.inherits(Blockly.FieldNotePicker, Blockly.FieldTextInput);

/**
 * Construct a FieldNotePicker from a JSON arg object.
 * @param {!Object} options A JSON object with options (angle).
 * @returns {!Blockly.FieldNotePicker} The new field instance.
 * @package
 */
Blockly.FieldNotePicker.fromJson = function(options) {
  return new Blockly.FieldNotePicker(options['angle']);
};

/**
 * Round angles to the nearest 15 degrees when using mouse.
 * Set to 0 to disable rounding.
 */
Blockly.FieldNotePicker.ROUND = 15;

/**
 * Half the width of protractor image.
 */
Blockly.FieldNotePicker.HALF = 100 / 2;

/* The following two settings work together to set the behaviour of the angle
 * picker.  While many combinations are possible, two modes are typical:
 * Math mode.
 *   0 deg is right, 90 is up.  This is the style used by protractors.
 *   Blockly.FieldNotePicker.CLOCKWISE = false;
 *   Blockly.FieldNotePicker.OFFSET = 0;
 * Compass mode.
 *   0 deg is up, 90 is right.  This is the style used by maps.
 *   Blockly.FieldNotePicker.CLOCKWISE = true;
 *   Blockly.FieldNotePicker.OFFSET = 90;
 */

/**
 * Angle increases clockwise (true) or counterclockwise (false).
 */
Blockly.FieldNotePicker.CLOCKWISE = false;

/**
 * Offset the location of 0 degrees (and all angles) by a constant.
 * Usually either 0 (0 = right) or 90 (0 = up).
 */
Blockly.FieldNotePicker.OFFSET = 0;

/**
 * Maximum allowed angle before wrapping.
 * Usually either 360 (for 0 to 359.9) or 180 (for -179.9 to 180).
 */
Blockly.FieldNotePicker.WRAP = 360;

/**
 * Radius of protractor circle.  Slightly smaller than protractor size since
 * otherwise SVG crops off half the border at the edges.
 */
Blockly.FieldNotePicker.RADIUS = Blockly.FieldNotePicker.HALF - 1;

/**
 * Adds degree symbol and recalculates width.
 * Saves the computed width in a property.
 * @private
 */
Blockly.FieldNotePicker.prototype.render_ = function() {
  if (!this.visible_) {
    this.size_.width = 0;
    return;
  }

  // Update textElement.
  this.textElement_.textContent = this.getDisplayText_();

  // Insert degree symbol.
  if (this.sourceBlock_.RTL) {
    this.textElement_.insertBefore(this.symbol_, this.textElement_.firstChild);
  } else {
    this.textElement_.appendChild(this.symbol_);
  }
  this.updateWidth();
};

/**
 * Clean up this FieldNotePicker, as well as the inherited FieldTextInput.
 * @return {!Function} Closure to call on destruction of the WidgetDiv.
 * @private
 */
Blockly.FieldNotePicker.prototype.dispose_ = function() {
  var thisField = this;
  return function() {
    Blockly.FieldNotePicker.superClass_.dispose_.call(thisField)();
    thisField.gauge_ = null;
    if (thisField.clickWrapper_) {
      Blockly.unbindEvent_(thisField.clickWrapper_);
    }
    if (thisField.moveWrapper1_) {
      Blockly.unbindEvent_(thisField.moveWrapper1_);
    }
    if (thisField.moveWrapper2_) {
      Blockly.unbindEvent_(thisField.moveWrapper2_);
    }
  };
};

/**
 * Show the inline free-text editor on top of the text.
 * @private
 */
Blockly.FieldNotePicker.prototype.showEditor_ = function() {
  console.log('show');
  var noFocus =
      goog.userAgent.MOBILE || goog.userAgent.ANDROID || goog.userAgent.IPAD;
  // Mobile browsers have issues with in-line textareas (focus & keyboards).
  Blockly.FieldNotePicker.superClass_.showEditor_.call(this, noFocus);
  var div = Blockly.WidgetDiv.DIV;
  if (!div.firstChild) {
    // Mobile interface uses Blockly.prompt.
    return;
  }
  // Build the SVG DOM.
  var svg = Blockly.utils.createSvgElement('svg', {
    'xmlns': 'http://www.w3.org/2000/svg',
    'xmlns:html': 'http://www.w3.org/1999/xhtml',
    'xmlns:xlink': 'http://www.w3.org/1999/xlink',
    'version': '1.1',
    'height': (Blockly.FieldNotePicker.HALF * 2) + 'px',
    'width': (Blockly.FieldNotePicker.HALF * 2) + 'px'
  }, div);
  var circle = Blockly.utils.createSvgElement('circle', {
    'cx': Blockly.FieldNotePicker.HALF, 'cy': Blockly.FieldNotePicker.HALF,
    'r': Blockly.FieldNotePicker.RADIUS,
    'class': 'blocklyAngleCircle'
  }, svg);
  console.log(svg , circle);
  this.gauge_ = Blockly.utils.createSvgElement('path',
      {'class': 'blocklyAngleGauge'}, svg);
  this.line_ = Blockly.utils.createSvgElement('line', {
    'x1': Blockly.FieldNotePicker.HALF,
    'y1': Blockly.FieldNotePicker.HALF,
    'class': 'blocklyAngleLine'
  }, svg);
  // Draw markers around the edge.
  for (var angle = 0; angle < 360; angle += 15) {
    Blockly.utils.createSvgElement('line', {
      'x1': Blockly.FieldNotePicker.HALF + Blockly.FieldNotePicker.RADIUS,
      'y1': Blockly.FieldNotePicker.HALF,
      'x2': Blockly.FieldNotePicker.HALF + Blockly.FieldNotePicker.RADIUS -
          (angle % 45 == 0 ? 10 : 5),
      'y2': Blockly.FieldNotePicker.HALF,
      'class': 'blocklyAngleMarks',
      'transform': 'rotate(' + angle + ',' +
          Blockly.FieldNotePicker.HALF + ',' + Blockly.FieldNotePicker.HALF + ')'
    }, svg);
  }
  svg.style.marginLeft = (15 - Blockly.FieldNotePicker.RADIUS) + 'px';

  // The angle picker is different from other fields in that it updates on
  // mousemove even if it's not in the middle of a drag.  In future we may
  // change this behavior.  For now, using bindEvent_ instead of
  // bindEventWithChecks_ allows it to work without a mousedown/touchstart.
  this.clickWrapper_ =
      Blockly.bindEvent_(svg, 'click', this, Blockly.WidgetDiv.hide);
  this.moveWrapper1_ =
      Blockly.bindEvent_(circle, 'mousemove', this, this.onMouseMove);
  this.moveWrapper2_ =
      Blockly.bindEvent_(this.gauge_, 'mousemove', this, this.onMouseMove);
  this.updateGraph_();
};

/**
 * Set the angle to match the mouse's position.
 * @param {!Event} e Mouse move event.
 */
Blockly.FieldNotePicker.prototype.onMouseMove = function(e) {
	console.log('event-mouse' , e);
  var bBox = this.gauge_.ownerSVGElement.getBoundingClientRect();
  var dx = e.clientX - bBox.left - Blockly.FieldNotePicker.HALF;
  var dy = e.clientY - bBox.top - Blockly.FieldNotePicker.HALF;
  var angle = Math.atan(-dy / dx);
  if (isNaN(angle)) {
    // This shouldn't happen, but let's not let this error propagate further.
    return;
  }
  angle = goog.math.toDegrees(angle);
  // 0: East, 90: North, 180: West, 270: South.
  if (dx < 0) {
    angle += 180;
  } else if (dy > 0) {
    angle += 360;
  }
  if (Blockly.FieldNotePicker.CLOCKWISE) {
    angle = Blockly.FieldNotePicker.OFFSET + 360 - angle;
  } else {
    angle -= Blockly.FieldNotePicker.OFFSET;
  }
  if (Blockly.FieldNotePicker.ROUND) {
    angle = Math.round(angle / Blockly.FieldNotePicker.ROUND) *
        Blockly.FieldNotePicker.ROUND;
  }
  angle = this.callValidator(angle);
  Blockly.FieldTextInput.htmlInput_.value = angle;
  console.log('angle' , angle);
  playTone(angle*5);
  this.setValue(angle);
  this.validate_();
  this.resizeEditor_();
};

/**
 * Insert a degree symbol.
 * @param {?string} text New text.
 */
Blockly.FieldNotePicker.prototype.setText = function(text) {
  Blockly.FieldNotePicker.superClass_.setText.call(this, text);
  if (!this.textElement_) {
    // Not rendered yet.
    return;
  }
  this.updateGraph_();
  // Cached width is obsolete.  Clear it.
  this.size_.width = 0;
};

/**
 * Redraw the graph with the current angle.
 * @private
 */
Blockly.FieldNotePicker.prototype.updateGraph_ = function() {
  if (!this.gauge_) {
    return;
  }
  var angleDegrees = Number(this.getText()) + Blockly.FieldNotePicker.OFFSET;
  var angleRadians = goog.math.toRadians(angleDegrees);
  var path = ['M ', Blockly.FieldNotePicker.HALF, ',', Blockly.FieldNotePicker.HALF];
  var x2 = Blockly.FieldNotePicker.HALF;
  var y2 = Blockly.FieldNotePicker.HALF;
  if (!isNaN(angleRadians)) {
    var angle1 = goog.math.toRadians(Blockly.FieldNotePicker.OFFSET);
    var x1 = Math.cos(angle1) * Blockly.FieldNotePicker.RADIUS;
    var y1 = Math.sin(angle1) * -Blockly.FieldNotePicker.RADIUS;
    if (Blockly.FieldNotePicker.CLOCKWISE) {
      angleRadians = 2 * angle1 - angleRadians;
    }
    x2 += Math.cos(angleRadians) * Blockly.FieldNotePicker.RADIUS;
    y2 -= Math.sin(angleRadians) * Blockly.FieldNotePicker.RADIUS;
    // Don't ask how the flag calculations work.  They just do.
    var largeFlag = Math.abs(Math.floor((angleRadians - angle1) / Math.PI) % 2);
    if (Blockly.FieldNotePicker.CLOCKWISE) {
      largeFlag = 1 - largeFlag;
    }
    var sweepFlag = Number(Blockly.FieldNotePicker.CLOCKWISE);
    path.push(' l ', x1, ',', y1,
        ' A ', Blockly.FieldNotePicker.RADIUS, ',', Blockly.FieldNotePicker.RADIUS,
        ' 0 ', largeFlag, ' ', sweepFlag, ' ', x2, ',', y2, ' z');
  }
  this.gauge_.setAttribute('d', path.join(''));
  this.line_.setAttribute('x2', x2);
  this.line_.setAttribute('y2', y2);
};

/**
 * Ensure that only an angle may be entered.
 * @param {string} text The user's text.
 * @return {?string} A string representing a valid angle, or null if invalid.
 */
Blockly.FieldNotePicker.prototype.classValidator = function(text) {
  if (text === null) {
    return null;
  }
  var n = parseFloat(text || 0);
  if (isNaN(n)) {
    return null;
  }
  n = n % 360;
  if (n < 0) {
    n += 360;
  }
  if (n > Blockly.FieldNotePicker.WRAP) {
    n -= 360;
  }
  return String(n);
};
