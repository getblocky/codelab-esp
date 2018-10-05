goog.require('Blockly');

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

	},
};


Blockly.Python['buzzer-beep'] = function(block) {
	var name = block.module;
	var port = block.getFieldValue('PORT');
	if (port == 'None') return '';
	var code = '';
	var object = port ; 
	var time =  Blockly.Python.valueToCode(block, 'MAIN', Blockly.Python.ORDER_NONE);
	var mode = block.getFieldValue('MODE');
	AddToSection('declare' , object + " = Buzzer(port='" + port +"')\n");
	AddToSection('import' , 'from Blocky.Buzzer import * ' + getLibraryVersion('Buzzer') + '\n');
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	var code = object + ".beep(time="+time+",speed="+mode+")\n";
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
Blockly.Blocks['buzzer-playnote'] =
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

	},
};


Blockly.Python['buzzer-playnote'] = function(block) {
	var name = block.module;
	var port = block.getFieldValue('PORT');
	if (port == 'None') return '';
	var code = '';
	var object = port ; 
	var notename = block.getFieldValue('NOTE');
	var note = noteToFreq (notename);
	AddToSection('declare' , object + " = Buzzer(port='" + port +"')\n");
	AddToSection('import' , 'from Blocky.Buzzer import *\n');
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	var code = object + ".playnote(note = "+String(note)+",)\t#" + notename + "\n";
	return code;
};