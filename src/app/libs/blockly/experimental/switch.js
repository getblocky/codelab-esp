goog.require('Blockly');
goog.require('Blockly.Blocks');


////////////////////////////////////////////////////////////////////////////////////
Blockly.Blocks['switch-set']=
{
	init : function()
	{
		this.appendValueInput('MAIN')
			.appendField('Switch')
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('switch') ) , 'PORT' ) 
			.appendField('turn')
			;
		
		this.category  = 'Output' ;
		this.role = 'Set';
		this.module = 'switch';
		this.setColour(Colour[this.category]);
		this.setPreviousStatement(true , null);
		this.setNextStatement(true , null);
		
	}
	
};

Blockly.Python['switch-set'] = function(block) {
	var name = block.module;
	var port = block.getFieldValue('PORT');
	var state = Blockly.Python.valueToCode(block, 'MAIN', Blockly.Python.ORDER_NONE);
	if (port == 'None') return '';
	var code = '';
	var object = port ; 
	AddToSection('import' , 'from Blocky.Switch import *\n');
	AddToSection('declare' , object + " = Switch(port='" + port +"')\n");
	code = object + '.' + 'turn(' + state + ')' + '\n' ; 
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	return code ;
};



Blockly.Blocks['switch-get'] = {
	init: function() {
		this.appendDummyInput('MAIN')
			.appendField('get')
			.appendField('Switch')
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('switch') ) , 'PORT' )
			.appendField("'s state")
			;
		this.module = 'switch' ;
		this.setOutput(true , null );
		this.setColour(230);
		this.category  = 'Input' ;
		this.role = 'Get';
		this.setColour(Colour[this.category]);
		
	}
};

Blockly.Python['switch-get'] = function(block) {
	var port = block.getFieldValue('PORT');
	if (port == 'None') return '';
	var object = port ;
	AddToSection('import' , 'from Blocky.Switch import *\n');
	AddToSection('declare' , object + " = Switch(port='" + port +"')\n");
	
	var code = object + '.value()' ;
	return [code, Blockly.Python.ORDER_ATOMIC ];
};




Blockly.Blocks['state_output'] = {
	init: function() {
		this.appendDummyInput('MAIN')
			.appendField(new Blockly.FieldDropdown( [['ON',"'on'"],['OFF',"'off'"],['FLIP',"'flip'"]] ) , 'STATE' )
			;
		this.setOutput(true , null );
		this.setColour(230);
		this.category  = 'Output' ;
		this.role = 'Get';
		this.setColour(Colour[this.category]);
		this.setMovable(false);
	}
};

Blockly.Python['state_output'] = function(block) {
	var code = block.getFieldValue('STATE') ; 
	return [code, Blockly.Python.ORDER_ATOMIC ];
};
