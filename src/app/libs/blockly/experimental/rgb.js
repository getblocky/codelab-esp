goog.require('Blockly');
goog.require('Blockly.Blocks');

var colour_ratio = 1;

function scale (colour){
	if (colour.indexOf('#') > 0){
		var r =	('0'+String(Math.floor(parseInt(colour.substring(2,4),16) * colour_ratio).toString(16)));
		var g =	('0'+String(Math.floor(parseInt(colour.substring(4,6),16) * colour_ratio).toString(16)));
		var b =	('0'+String(Math.floor(parseInt(colour.substring(6,8),16) * colour_ratio).toString(16)));

		if (r.length == 3) r = r.slice(0,2);
		if (g.length == 3) g = g.slice(0,2);
		if (b.length == 3) b = b.slice(0,2);
		colour = "'#" + r + g + b + "'" ;
		// need a smarter way for this
	}
	if (colour.indexOf('[')&&colour.indexOf(']')){

	}
	return colour;
}

////////////////////////////////////////////////////////////////////////////////////
Blockly.Blocks['rgb_brightness']=
{
	init : function()
	{
		this.inputsInline = true ;
		this.appendDummyInput("MAIN")
			.appendField('set led brightness to')
			.appendField(new Blockly.FieldNumber(5,0,100),'BRIGHNESS')
			.appendField('%')
			;

		this.category  = 'Display' ;
		this.role = 'Set';
		this.module = 'rgb';
		this.setColour(Colour[this.category]);
		this.setPreviousStatement(true , null);
		this.setNextStatement(true , null);

	}

};

Blockly.Python['rgb_brightness'] = function(block) {
	colour_ratio = parseInt(block.getFieldValue('BRIGHNESS'),10) / 100;
	return '' ;
};


Blockly.Blocks['rgb-set-multiple']=
{
	init : function()
	{
		this.inputsInline = true ;
		this.appendValueInput("MAIN")
			.appendField(new Blockly.FieldDropdown( PORT('rgb') ) , 'PORT' )
			.appendField('set pixels from')
			;

		this.appendDummyInput();

		this.appendDummyInput();
		this.appendValueInput("TO")
			.appendField('to')
			;
		this.appendValueInput("COLOUR")
			.appendField("with")
			;
		this.category  = 'Display' ;
		this.role = 'Set';
		this.module = 'rgb';
		this.setColour(Colour[this.category]);
		this.setPreviousStatement(true , null);
		this.setNextStatement(true , null);

	}

};

Blockly.Python['rgb-set-multiple'] = function(block) {
	var name = block.module;
	var port = block.getFieldValue('PORT');
	var colour = Blockly.Python.valueToCode(block, 'COLOUR', Blockly.Python.ORDER_ATOMIC);
	var from = Blockly.Python.valueToCode(block, 'MAIN', Blockly.Python.ORDER_ATOMIC);
	var to = Blockly.Python.valueToCode(block, 'TO', Blockly.Python.ORDER_ATOMIC);
	if (port == 'None') return '';
	var code = '';
	var object = port ;
	colour = scale(colour);
	AddToSection('import' , 'from Blocky.RGB import * ' + getLibraryVersion('RGB') + '\n');
	AddToSection('declare' , object + " = RGB(port='" + port +"')\n");
	code = object + '.' + 'colour(' + String(from) + "," + String(to) + "," +  colour + ')' + '\n' ;
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	return code ;
};

Blockly.Blocks['indicator_set_multiple']=
{
	init : function()
	{
		this.inputsInline = true ;
		this.appendValueInput("MAIN")
			.appendField('Onboard RGB')
			.appendField('set pixels from')
			;

		this.appendDummyInput();

		this.appendDummyInput();
		this.appendValueInput("TO")
			.appendField('to')
			;
		this.appendValueInput("COLOUR")
			.appendField("with")
			;
		this.category  = 'Display' ;
		this.role = 'Set';
		this.module = 'rgb';
		this.setColour(Colour[this.category]);
		this.setPreviousStatement(true , null);
		this.setNextStatement(true , null);

	}

};

Blockly.Python['indicator_set_multiple'] = function(block) {
	var name = block.module;
	var port = 'LED_RING';
	var colour = Blockly.Python.valueToCode(block, 'COLOUR', Blockly.Python.ORDER_ATOMIC);
	var from = Blockly.Python.valueToCode(block, 'MAIN', Blockly.Python.ORDER_ATOMIC);
	var to = Blockly.Python.valueToCode(block, 'TO', Blockly.Python.ORDER_ATOMIC);
	if (port == 'None') return '';
	var code = '';
	var object = port ;
	colour = scale(colour);
	AddToSection('declare' , object + " = core.indicator\n");
	code = object + '.' + 'colour(' + String(from) + "," + String(to) + "," +  colour + ')' + '\n' ;
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	return code ;
};

Blockly.Blocks['indicator_set_single']=
{
	init : function()
	{
		this.inputsInline = true ;
		this.appendValueInput("MAIN")
			.appendField('Onboard RGB')
			.appendField('set pixel')
			;

		this.appendDummyInput();

		this.appendValueInput("COLOUR")
			.appendField("with")
			;
		this.category  = 'Display' ;
		this.role = 'Set';
		this.module = 'rgb';
		this.setColour(Colour[this.category]);
		this.setPreviousStatement(true , null);
		this.setNextStatement(true , null);

	}

};

Blockly.Python['indicator_set_single'] = function(block) {
	var name = block.module;
	var port = 'LED_RING';
	var colour = Blockly.Python.valueToCode(block, 'COLOUR', Blockly.Python.ORDER_ATOMIC);
	var from = Blockly.Python.valueToCode(block, 'MAIN', Blockly.Python.ORDER_ATOMIC);
	if (port == 'None') return '';
	var code = '';
	var object = port ;
	colour = scale(colour);
	AddToSection('declare' , object + " = core.indicator\n");
	code = object + '.' + 'colour(' + String(from) + "," + String(from) + "," +  colour + ')' + '\n' ;
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	return code ;
};

Blockly.Blocks['rgb_colour'] = {
	init: function() {
		this.appendDummyInput()
			.appendField(new Blockly.FieldColour("#ff0000"), "COLOUR")
			.appendField(new Blockly.FieldDropdown([["RGB", "RGB"], ["GRB", "GRB"],]), "MODE")
			;
		this.setOutput(true , null );
		this.setColour(230);
		this.category  = 'Display' ;
		this.role = 'Get';
		this.setColour(Colour[this.category]);
		this.setOnChange(
			function (change)
			{
				this.setColour(this.getFieldValue('COLOUR')) ;
			}
		);
	},
};

Blockly.Python['rgb_colour'] = function(block) {
	var color = block.getFieldValue('COLOUR');
	var mode = block.getFieldValue('MODE');

	var code = '' ;
	if (mode == 'RGB')
	{
		code  = color ;
	}
	else if (mode == 'GRB')
	{
		code = '#' + color.substring(3,5) + color.substring(1,3) + color.substring(5,7) ;

	}

	code = "'" + code + "'" ;
	return [code, Blockly.Python.ORDER_ATOMIC ];
};

Blockly.Blocks['display_number'] = {
	init: function() {
		this.appendDummyInput()
			.appendField(new Blockly.FieldNumber(1 , 0 , 100,1), "NUM")
			;
		this.setOutput(true , null );
		this.setColour(230);
		this.category  = 'Display' ;
		this.role = 'Get';
		this.setColour(Colour[this.category]);

	}
};

Blockly.Python['display_number'] = function(block) {
	var color = block.getFieldValue('NUM');

	return [color, Blockly.Python.ORDER_ATOMIC ];
};


/*
	Reference from https://makecode.com/playground#field-editors-color
	Red = [255,0,0]
	Orange = [255,128,0]
	Yellow = [255,255,0]
	Pink = [255,157,160]
	Green = [0,255,0]
	Light Blue = [0,255,255]
	Darker Blue = [0.127.255]
	Brown = [101,71,31]
	Blue = [0,0,255]
	Purple = [127,0,255]
	Pinker = [255,0,128]
	Pinkest = [255,0,255]
	White = [255,255,255]
	Gray = [153,153,153]
	Black = [0,0,0]
*/
