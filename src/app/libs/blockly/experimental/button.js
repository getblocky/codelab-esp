goog.require('Blockly');
goog.require('Blockly.Blocks');


////////////////////////////////////////////////////////////////////////////////////
/*
Blockly.Blocks['button-set']=
{
	init : function()
	{
		this.appendDummyInput('MAIN')
			.appendField('Button')
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('button') ) , 'PORT' ) 
			.appendField('fly')
			;
		
		this.category  = 'Input' ;
		this.role = 'Set';
		this.module = 'button';
		this.setColour(Colour[this.category]);
		this.setPreviousStatement(true , null);
		this.setNextStatement(true , null);
		
	}
	
};

Blockly.Python['button-set'] = function(block) {
	var name = block.module;
	var port = block.getFieldValue('PORT');
	if (port == 'None') return '';
	var code = '';
	AddToSection('import' , 'from Blocky.Button import *\n');
	AddToSection('declare' , name+'_'+port + " = Button(port='" + port +"')\n");
	var name = block.module + '_' + port ;
	code = name + '.' + 'set()' + '\n' ; 
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	return code ;
};
*/
Blockly.Blocks['button-get'] = {
	init: function() {
		this.appendDummyInput('MAIN')
			.appendField('')
			.appendField('Button')
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('button') ) , 'PORT' )
			.appendField("is being")
			.appendField(new Blockly.FieldDropdown( [['pressed','pressed'],['released','released'] ],'MODE'))
			;
		this.module = 'button' ;
		this.setOutput(true , null );
		this.setColour(230);
		this.category  = 'Input' ;
		this.role = 'Get';
		this.setColour(Colour[this.category]);
		
	}
};

Blockly.Python['button-get'] = function(block) {
	var port = block.getFieldValue('PORT');
	if (port == 'None') return '';
	var object = port ; 
	AddToSection('import' , 'from Blocky.Button import * ' + getLibraryVersion('Button') + '\n');
	AddToSection('declare' , object + " = Button(port='" + port +"')\n");
	
	var code = object + '.is_pressed()' ;
	return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Blocks['button-event'] = {
	init: function() {
		this.appendDummyInput('MAIN')
			.appendField("when")
			.appendField('Button')
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('button') ) , 'PORT' )
			.appendField('is')
			.appendField(new Blockly.FieldDropdown([['pressed','pressed'],['held','held']]),'MODE')
			.appendField(new Blockly.FieldNumber(1) , 'TIME')
			.appendField(new Blockly.FieldLabel('time'),'UNIT')
			;
			
		this.appendStatementInput('CODE');
		this.category  = 'Input' ;
		this.module = 'button';
		this.role = 'Event';
		this.setColour(Colour[this.category]);
	}
};

Blockly.Python['button-event'] = function(block) {
	var name = block.module ;
	var type = block.getFieldValue('MODE');
	var time = block.getFieldValue('TIME');
	var port = block.getFieldValue('PORT');
	var code = Blockly.Python.statementToCode(block, 'CODE');
	if (!code.length||port == 'None') return '';
	var object =  port ; 
	//if (name == 'None'||!code.length) return ;
	var function_name = 'Event_' +port+'_' + type + '_' + time   ;
	AddToSection('import' , 'from Blocky.Button import * ' + getLibraryVersion('Button') + '\n');
	AddToSection('declare' , object + " = Button(port='" + port +"')\n");
	AddToSection('event' , object  + ".event(type='" + type + "',time=" + time + ",function="+function_name+")\n");

	AddToSection('function',async_cancellable + 'async def '+function_name+'():\n'+Blockly.Python.INDENT+GlobalVariable+ code + '\n');
};
