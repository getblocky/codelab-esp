goog.require('Blockly');




var song_list = {
		"HAPPY BIRTHDAY":
			"[392, 600, 392, 100, 440, 800, 392, 800, 523, 800, 493, 1600, 392, 600, 392, 100, 440, 800, 392, 800, 587, 800, 523, 1600, 392, 600, 392, 100, 783, 800, 659, 800, 523, 800, 493, 800, 440, 1600, 698, 600, 698, 100, 659, 800, 523, 800, 587, 800, 523, 1600]"
}

/*
	Create your song Button Callback
	Docs :
		yourWorkspace.registerButtonCallback(yourCallbackKey, yourFunction)
		button name :	buzzerKeyboardTrigger
		function name : buzzerKeyboardAction
		workspace is not defined ???
*/

function buzzerKeyboardAction()
{
	command.showBuzzerKeyboard()
}
//command.workspace.registerButtonCallback('buzzerKeyboardTrigger' , buzzerKeyboardAction);


Blockly.Blocks['number_output']=
{
	init : function()
	{
		this.appendDummyInput('MAIN')
			.appendField(new Blockly.FieldNumber(1) , 'NUM')
			;
		this.category  = 'Output' ;
		this.role = 'Get';
		this.setColour(Colour[this.category]);
		this.setOutput(true , null );
		this.setMovable(false);
	},
};

Blockly.Python['number_output']=function(block)
{
	var code = block.getFieldValue('NUM');
	return code;
};



Blockly.Blocks['buzzer-set'] =
{
	init:function(){
		this.appendValueInput('MAIN')
			.appendField('Buzzer')
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('buzzer') ) , 'PORT' )
			.appendField('turn')
			;

		this.category  = 'Output' ;
		this.role = 'Set';
		this.module = 'buzzer';
		this.setColour(Colour[this.category]);
		this.setPreviousStatement(true , null);
		this.setNextStatement(true , null);

	},
};


Blockly.Python['buzzer-set'] = function(block) {
	var value = Blockly.Python.valueToCode(block, 'MAIN', Blockly.Python.ORDER_NONE);
	var name = block.module;
	var port = block.getFieldValue('PORT');
	if (port == 'None') return '';
	var code = '';
	var object = port ;
	var time = block.getFieldValue('TIME');
	var mode = block.getFieldValue('MODE');
	AddToSection('declare' , object + " = Buzzer(port='" + port +"')\n");
	AddToSection('import' , 'from Blocky.Buzzer import * ' + getLibraryVersion('Buzzer') + '\n');
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	var code = object + ".turn(" + value + ")\n";
	return code;
};

var note_list =  { "c":1915, "d":1700, "e":1519, "f":1432, "g":1275, "a":1136, "b":1014, "C":956, "D":850, "E":759, "F":716, "G":637, "A":568 };
var NOTE = [ ["DO",  "523"],["RE",  "587"],["MI","659"],["FA","698"],["SON","783"],["LA","880"],["SI","987"] ];

Blockly.Blocks['note_frequency']=
{
	init : function()
	{
		this.appendDummyInput('MAIN')
			.appendField(new Blockly.FieldDropdown(NOTE) , 'NUM')
			;
		this.category  = 'Output' ;
		this.role = 'Get';
		this.setColour(Colour[this.category]);
		this.setOutput(true , null );
		this.setMovable(false);
	},
};

Blockly.Python['note_frequency']=function(block)
{
	var code = block.getFieldValue('NUM');
	return String(code);

};
function get_song_list(){
	var keys = [];
	for (var key in song_list) {
		if (song_list.hasOwnProperty(key)) {
			keys.push([key,key]);
		}
	}
	return keys;
}
Blockly.Blocks['buzzer-play'] =
{
	init:function(){
		this.appendDummyInput('MAIN')
			.appendField('Buzzer')
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('buzzer') ) , 'PORT' )
			.appendField('play')
			.appendField(new Blockly.FieldDropdown( get_song_list() ) , 'SONG' )
			;
			//.appendField(this.id);

		this.category  = 'Output' ;
		this.role = 'Set';
		this.module = 'buzzer';
		this.setColour(Colour[this.category]);
		this.setPreviousStatement(true , null);
		this.setNextStatement(true , null);
		/*
		this.setOnChange(
			function(event)
			{
				if (this.isInFlyout ||!this.getRootBlock()) return ;

				if (event.type == 'create' || event.type == 'move')
				{
					var type = this.getRootBlock().type;
					if (type.indexOf('event')==-1)
					{
						this.setDisabled(true);
					}
					else
					{
						this.setDisabled(false);
					}
				}
			}
		);
		*/
	},
};


Blockly.Python['buzzer-play'] = function(block) {
	var note = block.getFieldValue('SONG');
	var name = block.module;
	var port = block.getFieldValue('PORT');
	if (port == 'None') return '';
	var code = '';

	var object = port ;
	var notename = block.getFieldValue('NOTE');
	AddToSection('declare' , object + " = Buzzer(port='" + port +"')\n");
	AddToSection('declare' , note.replace(' ','_') + " = " + song_list[note] + "\n");
	AddToSection('import' , 'from Blocky.Buzzer import * ' + getLibraryVersion('Buzzer') + '\n');
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	var code = "await " + object + ".play("+note.replace(' ','_')+")\n";
	return code;
};
var note_freq_map = {
	/*
	"Low C" : "131",
	"Low C#" : "139",
	"Low D" : "147",
	"Low D#" : "156",
	"Low E" : "165",
	"Low F" : "175",
	"Low F#" : "185",
	"Low G" : "196",
	"Low G#" : "208",
	"Low A" : "220",
	"Low A#" : "233",
	"Low B" : "247",
	*/
	"Middle C" : "261",
	"Middle C#" : "277",
	"Middle D" : "293",
	"Middle D#" : "311",
	"Middle E" : "329",
	"Middle F" : "349",
	"Middle F#" : "369",
	"Middle G" : "392",
	"Middle G#" : "415",
	"Middle A" : "440",
	"Middle A#" : "466",
	"Middle B" : "493",
	"High C" : "523",
	"High C#" : "554",
	"High D" : "587",
	"High D#" : "622",
	"High E" : "659",
	"High F" : "698",
	"High F#" : "739",
	"High G" : "783",
	"High G#" : "830",
	"High A" : "880",
	"High A#" : "932",
	"High B" : "987",
	"Silent" : "0"
};
var beat_time_map = {
	"4"	:	"3200",
	"2"	:	"1600",
	"1"	:	"800",
	"1/2"	:	"400",
	"1/4"	:	"200",
	"1/8"	:	"100",
	"1/16"	:	"50",
}
function generateListKeys(dict){
	var list = [];
	var keys = Object.keys(dict);
	for (var i = 0 ; i < keys.length ; i++)
	{
		list.push( [keys[i] , keys[i] ] );
	}
	return list;
}
Blockly.Blocks['buzzer-playnote'] =
{
	init:function(){
		this.appendDummyInput('MAIN')
			.appendField('Buzzer')
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('buzzer') ) , 'PORT' )
			.appendField('play tone')
			.appendField(new Blockly.FieldDropdown( generateListKeys(note_freq_map)) , 'TONE')
			.appendField('for')
			.appendField(new Blockly.FieldDropdown( generateListKeys(beat_time_map)) , 'TIME')
			.appendField('beat')
			;
			//.appendField(this.id);

		this.category  = 'Output' ;
		this.role = 'Set';
		this.module = 'buzzer';
		this.setColour(Colour[this.category]);
		this.setPreviousStatement(true , null);
		this.setNextStatement(true , null);

	},
};


Blockly.Python['buzzer-playnote'] = function(block) {
	var note =  note_freq_map[block.getFieldValue('TONE')];
	var time =  beat_time_map[block.getFieldValue('TIME')];

	var name = block.module;
	var port = block.getFieldValue('PORT');
	if (port == 'None') return '';
	var code = '';

	var object = port ;
	var notename = block.getFieldValue('NOTE');
	console.log(note);
	AddToSection('declare' , object + " = Buzzer(port='" + port +"')\n");
	AddToSection('import' , 'from Blocky.Buzzer import * ' + getLibraryVersion('Buzzer') + '\n');
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	var code = 'await ' + object + ".play(["+note + ',' + time +"])\n";
	return code;
};

Blockly.Blocks['buzzer-playfreq'] =
{
	init:function(){
		this.appendValueInput('MAIN')
			.appendField('Buzzer')
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('buzzer') ) , 'PORT' )
			.appendField('play frequency (Hz)')
			;
			//.appendField(this.id);

		this.category  = 'Output' ;
		this.role = 'Set';
		this.module = 'buzzer';
		this.setColour(Colour[this.category]);
		this.setPreviousStatement(true , null);
		this.setNextStatement(true , null);

	},
};


Blockly.Python['buzzer-playfreq'] = function(block) {
	var note = block.childBlocks_[0].inputList[0].fieldRow[0].text_ ;
	var name = block.module;
	var port = block.getFieldValue('PORT');
	if (port == 'None') return '';
	var code = '';

	var object = port ;
	var notename = block.getFieldValue('NOTE');
	console.log(note);
	AddToSection('declare' , object + " = Buzzer(port='" + port +"')\n");
	AddToSection('import' , 'from Blocky.Buzzer import * ' + getLibraryVersion('Buzzer') + '\n');
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	var code = object + ".play("+note+")\n";
	return code;
};

Blockly.Blocks['buzzer-beep'] =
{
	init:function(){
		this.appendValueInput('MAIN')
			.appendField('Buzzer')
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('buzzer') ) , 'PORT' )
			.appendField('beeps')
		this.appendDummyInput()
			.appendField('times')
			.appendField(new Blockly.FieldDropdown([['fast','50'],['medium','150'],['slow','350']]),'MODE');
			//.appendField(this.id);

		this.category  = 'Output' ;
		this.role = 'Set';
		this.module = 'buzzer';
		this.setColour(Colour[this.category]);
		this.setPreviousStatement(true , null);
		this.setNextStatement(true , null);
		/*
		this.setOnChange(
			function(event)
			{
				if (this.isInFlyout ||!this.getRootBlock()) return ;

				if (event.type == 'create' || event.type == 'change' || event.type == 'move')
				{
					var type = this.getRootBlock().type;
					if (type.indexOf('event')==-1)
					{
						this.setDisabled(true);
					}
					else
					{
						this.setDisabled(false);
					}
				}
			}
		);
		*/
	},
};

Blockly.Python['buzzer-beep'] = function(block) {
	var name = block.module;
	var port = block.getFieldValue('PORT');
	if (port == 'None') return '';
	var code = '';
	var object = port ;
	//TODO var time =  Blockly.Python.valueToCode(block, 'MAIN', Blockly.Python.ORDER_NONE);
	/*
		Unknown bug , it only receive the first character of a number ?? (for example  10 -> "1" )
		Dirty hacks appplied , please clean up later
	*/
	var time = block.childBlocks_[0].inputList[0].fieldRow[0].text_ ;
	var mode = block.getFieldValue('MODE');
	AddToSection('declare' , object + " = Buzzer(port='" + port +"')\n");
	AddToSection('import' , 'from Blocky.Buzzer import * ' + getLibraryVersion('Buzzer') + '\n');
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	var code = "await " + object + ".beep(time="+time+",speed="+mode+")\n";
	return code;
};
