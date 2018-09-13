goog.require('Blockly');
goog.require('Blockly.Blocks');


////////////////////////////////////////////////////////////////////////////////////
Blockly.Blocks['stepper-set']=
{
	init : function()
	{
		this.appendValueInput('MAIN')
			.appendField('Stepper')
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('stepper') ) , 'PORT' ) 
			.appendField('step')
		this.appendDummyInput()
			.appendField('steps')
			.appendField(new Blockly.FieldDropdown( [ ['CLOCKWISE','CW'],['COUNTER-CLOCKWISE','CCW'] ] ) ,'DIR')
			;
		
		this.category  = 'Output' ;
		this.role = 'Set';
		this.module = 'stepper';
		this.setColour(Colour[this.category]);
		this.setPreviousStatement(true , null);
		this.setNextStatement(true , null);
		
	}
	
};

Blockly.Python['stepper-set'] = function(block) {
	var name = block.module;
	var port = block.getFieldValue('PORT');
	var dir = block.getFieldValue('DIR') ; 
	var count = Blockly.Python.valueToCode(block, 'MAIN', Blockly.Python.ORDER_NONE);
	if (port == 'None') return '';
	var code = '';
	var object = port ; 
	AddToSection('import' , 'from Blocky.Stepper import *\n');
	AddToSection('declare' , object + " = Stepper(port='" + port +"')\n");
	code = object + '.' + 'step("' + dir + '",' + count + ')' + '\n' ; 
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	return code ;
};

Blockly.Blocks['stepper-get'] = {
	init: function() {
		this.appendDummyInput('MAIN')
			.appendField('get')
			.appendField('Stepper')
			.appendField("'s position")
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('stepper') ) , 'PORT' )
			;
		this.module = 'stepper' ;
		this.setOutput(true , null );
		this.setColour(230);
		this.category  = 'Output' ;
		this.role = 'Get';
		this.setColour(Colour[this.category]);
		
	}
};

Blockly.Python['stepper-get'] = function(block) {
	var port = block.getFieldValue('PORT');
	if (port == 'None') return '';
	var object = port ;
	AddToSection('import' , 'from Blocky.Stepper import *\n');
	AddToSection('declare' , object + " = Stepper(port='" + port +"')\n");
	
	var code = object + '.step()' ;
	return [code, Blockly.Python.ORDER_NONE];
};

