goog.require('Blockly');
goog.require('Blockly.Blocks');


////////////////////////////////////////////////////////////////////////////////////
Blockly.Blocks['mosfet-set']=
{
	init : function()
	{
		this.appendValueInput('MAIN')
			.appendField('Mosfet')
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('mosfet') ) , 'PORT' ) 
			.appendField('turn')
			;
		
		this.category  = 'Output' ;
		this.role = 'Set';
		this.module = 'mosfet';
		this.setColour(Colour[this.category]);
		this.setPreviousStatement(true , null);
		this.setNextStatement(true , null);
		
	}
	
};

Blockly.Python['mosfet-set'] = function(block) {
	var name = block.module;
	var port = block.getFieldValue('PORT');
	var state = Blockly.Python.valueToCode(block, 'MAIN', Blockly.Python.ORDER_NONE);
	if (port == 'None') return '';
	var code = '';
	var object = port ; 
	AddToSection('import' , 'from Blocky.Mosfet import Mosfet' + version('MOSFET') + '\n');
	AddToSection('declare' , object + " = Mosfet(port='" + port +"')\n");
	code = object + '.' + 'turn(' + state + ')' + '\n' ; 
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	return code ;
};

Blockly.Blocks['mosfet-fade']=
{
	init : function()
	{
		this.appendValueInput('MAIN')
			.appendField('Mosfet')
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('mosfet') ) , 'PORT' ) 
			.appendField('fade')
			;
		
		this.category  = 'Output' ;
		this.role = 'Set';
		this.module = 'mosfet';
		this.setColour(Colour[this.category]);
		this.setPreviousStatement(true , null);
		this.setNextStatement(true , null);
		
	}
	
};

Blockly.Python['mosfet-fade'] = function(block) {
	var name = block.module;
	var port = block.getFieldValue('PORT');
	var state = Blockly.Python.valueToCode(block, 'MAIN', Blockly.Python.ORDER_NONE);
	if (port == 'None') return '';
	var code = '';
	var object = port ; 
	AddToSection('import' , 'from Blocky.Mosfet import Mosfet' + version('MOSFET') + '\n');
	AddToSection('declare' , object + " = Mosfet(port='" + port +"')\n");
	code = object + '.' + 'turn(' + state + ')' + '\n' ; 
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	return code ;
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
