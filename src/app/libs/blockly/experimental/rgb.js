goog.require('Blockly');
goog.require('Blockly.Blocks');


////////////////////////////////////////////////////////////////////////////////////
Blockly.Blocks['rgb-set-multiple']=
{
	init : function()
	{
		this.inputsInline = true ;
		this.appendValueInput("MAIN")
			.appendField(new Blockly.FieldDropdown( PORT('rgb')) , 'PORT' ) 
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
	AddToSection('import' , 'from Blocky.RGB import * ' + getLibraryVersion('RGB') + '\n');
	AddToSection('declare' , object + " = RGB(port='" + port +"')\n");
	code = object + '.' + 'colour(' + String(from) + "," + String(to) + "," +  colour + ')' + '\n' ; 
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
