goog.require('Blockly');
goog.require('Blockly.Blocks');


////////////////////////////////////////////////////////////////////////////////////
/*
Blockly.Blocks['motion-set']=
{
	init : function()
	{
		this.appendDummyInput('MAIN')
			.appendField('Motion')
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('motion') ) , 'PORT' ) 
			.appendField('fly')
			;
		
		this.category  = 'Input' ;
		this.role = 'Set';
		this.module = 'motion';
		this.setColour(Colour[this.category]);
		this.setPreviousStatement(true , null);
		this.setNextStatement(true , null);
		
	}
	
};

Blockly.Python['motion-set'] = function(block) {
	var name = block.module;
	var port = block.getFieldValue('PORT');
	if (port == 'None') return '';
	var code = '';
	AddToSection('import' , 'from Blocky.Motion import *\n');
	AddToSection('declare' , name+'_'+port + " = Motion(port='" + port +"')\n");
	var name = block.module + '_' + port ;
	code = name + '.' + 'set()' + '\n' ; 
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	return code ;
};
*/
Blockly.Blocks['motion-get'] = {
	init: function() {
		this.appendDummyInput('MAIN')
			.appendField('')
			.appendField('Motion')
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('motion') ) , 'PORT' )
			.appendField("is being")
			.appendField(new Blockly.FieldDropdown( [['pressed','pressed'],['released','released'] ],'MODE'))
			;
		this.module = 'motion' ;
		this.setOutput(true , null );
		this.setColour(230);
		this.category  = 'Input' ;
		this.role = 'Get';
		this.setColour(Colour[this.category]);
		
	}
};

Blockly.Python['motion-get'] = function(block) {
	var port = block.getFieldValue('PORT');
	if (port == 'None') return '';
	var object = port ; 
	AddToSection('import' , 'from Blocky.Motion import Motion' + version('MOTION') + '\n');
	AddToSection('declare' , object + " = Motion(port='" + port +"')\n");
	
	var code = object + '.value()' ;
	return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Blocks['motion-event'] = {
	init: function() {
		this.appendDummyInput('MAIN')
			.appendField("when")
			.appendField('motion detected')
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('motion') ) , 'PORT' )
			;
			
		this.appendStatementInput('CODE');
		this.category  = 'Input' ;
		this.module = 'motion';
		this.role = 'Event';
		this.setColour(Colour[this.category]);
	}
};

Blockly.Python['motion-event'] = function(block) {
	var name = block.module ;
	var port = block.getFieldValue('PORT');
	var code = Blockly.Python.statementToCode(block, 'CODE');
	if (!code.length||port == 'None') return '';
	var object =  port ; 
	//if (name == 'None'||!code.length) return ;
	var function_name = 'Event_' +port   ;
	AddToSection('import' , 'from Blocky.Motion import Motion' + version('MOTION') + '\n');
	AddToSection('declare' , object + " = Motion(port='" + port +"')\n");
	AddToSection('event' , object  + ".event(function="+function_name+")\n");

	AddToSection('function',async_cancellable_decorator+'async def '+function_name+'():\n' + code + '\n');
};
