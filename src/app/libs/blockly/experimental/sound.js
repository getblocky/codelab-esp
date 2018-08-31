goog.require('Blockly');
goog.require('Blockly.Blocks');


////////////////////////////////////////////////////////////////////////////////////
Blockly.Blocks['sound-set']=
{
	init : function()
	{
		this.appendDummyInput('MAIN')
			.appendField('Sound')
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('sound') ) , 'PORT' ) 
			.appendField('fly')
			;
		
		this.category  = 'Input' ;
		this.role = 'Set';
		this.module = 'sound';
		this.setColour(Colour[this.category]);
		this.setPreviousStatement(true , null);
		this.setNextStatement(true , null);
		
	}
	
};

Blockly.Python['sound-set'] = function(block) {
	var name = block.module;
	var port = block.getFieldValue('PORT');
	if (port == 'None') return '';
	var code = '';
	var object = name+'_'+port ; 
	AddToSection('import' , 'from Blocky.Sound import *\n');
	AddToSection('declare' , object + " = Sound(port='" + port +"')\n");
	var name = block.module + '_' + port ;
	code = name + '.' + 'set()' + '\n' ; 
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	return code ;
};

Blockly.Blocks['sound-get'] = {
	init: function() {
		this.appendDummyInput('MAIN')
			.appendField('get')
			.appendField('Sound')
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('sound') ) , 'PORT' )
			.appendField("'s state")
			;
		this.module = 'sound' ;
		this.setOutput(true , null );
		this.setColour(230);
		this.category  = 'Input' ;
		this.role = 'Get';
		this.setColour(Colour[this.category]);
		
	}
};

Blockly.Python['sound-get'] = function(block) {
	var port = block.getFieldValue('PORT');
	if (port == 'None') return '';
	var object = block.module +'_'+port ;
	AddToSection('import' , 'from Blocky.Sound import *\n');
	AddToSection('declare' , object + " = Sound(port='" + port +"')\n");
	
	var code = block.module + '.value()' ;
	return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Blocks['sound-event'] = {
	init: function() {
		this.appendDummyInput('MAIN')
			.appendField("when")
			.appendField('Sound')
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('sound') ) , 'PORT' )
			.appendField('heard')
			.appendField(new Blockly.FieldNumber(1) , 'TIME')
			.appendField('claps')
			;
			
		this.appendStatementInput('CODE');
		this.category  = 'Input' ;
		this.module = 'sound';
		this.role = 'Event';
		this.setColour(Colour[this.category]);
	}
};

Blockly.Python['sound-event'] = function(block) {
	var name = block.module ;
	var time = block.getFieldValue('TIME');
	var port = block.getFieldValue('PORT');
	var code = Blockly.Python.statementToCode(block, 'CODE');
	var type = 'clap' ; // Not implemented other method , is there any ???
	if (!code.length||port == 'None') return '';
	var object = name+'_'+port ; 
	//if (name == 'None'||!code.length) return ;
	var function_name = 'Event_' + name+'_'+port + '_' + type + '_' +  time   ;
	AddToSection('import' , 'from Blocky.Sound import *\n');
	AddToSection('declare' ,object + " = Sound(port='" + port +"')\n");
	AddToSection('event' , object  + ".event(type='" + type + "',time=" + time + ",function="+function_name+")\n");

	AddToSection('function', async_cancellable+'async def '+function_name+'():\n' + code + '\n');
};
