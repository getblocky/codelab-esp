goog.require('Blockly');
goog.require('Blockly.Blocks');


////////////////////////////////////////////////////////////////////////////////////
Blockly.Blocks['rgb-set-multiple']=
{
	init : function()
	{
		this.appendValueInput('MAIN')
			.appendField('RGB')
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('rgb') ) , 'PORT' ) 
			.appendField('set from')
			.appendField(new Blockly.FieldNumber(1,1,1000),'FROM')
			.appendField('to')
			.appendField(new Blockly.FieldNumber(1,1,1000),'TO')
			.appendField('with')
			;
		
		this.category  = 'Output' ;
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
	var colour = Blockly.Python.valueToCode(block, 'MAIN', Blockly.Python.ORDER_ATOMIC);
	if (port == 'None') return '';
	var code = '';
	var object = port ; 
	AddToSection('import' , 'from Blocky.RGB import * ' + getLibraryVersion('RGB') + '\n');
	AddToSection('declare' , object + " = RGB(port='" + port +"')\n");
	code = object + '.' + 'colour(' +  colour + ')' + '\n' ; 
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
		this.category  = 'Output' ;
		this.role = 'Get';
		this.setColour(Colour[this.category]);
		
	}
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
