goog.require('Blockly');
goog.require('Blockly.Blocks');


////////////////////////////////////////////////////////////////////////////////////
Blockly.Blocks['template-set']=
{
	init : function()
	{
		this.appendDummyInput('MAIN')
			.appendField('Template')
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('template') ) , 'PORT' ) 
			.appendField('fly')
			;
		
		this.category  = 'Input' ;
		this.role = 'Set';
		this.module = 'template';
		this.setColour(Colour[this.category]);
		this.setPreviousStatement(true , null);
		this.setNextStatement(true , null);
		
	}
	
};

Blockly.Python['template-set'] = function(block) {
	var name = block.module;
	var port = block.getFieldValue('PORT');
	if (port == 'None') return '';
	var code = '';
	var object = port ; 
	AddToSection('import' , 'from Blocky.Template import *\n');
	AddToSection('declare' , object + " = Template(port='" + port +"')\n");
	code = object + '.' + 'set()' + '\n' ; 
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	return code ;
};

Blockly.Blocks['template-get'] = {
	init: function() {
		this.appendDummyInput('MAIN')
			.appendField('get')
			.appendField('Template')
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('template') ) , 'PORT' )
			.appendField("'s state")
			;
		this.module = 'template' ;
		this.setOutput(true , null );
		this.setColour(230);
		this.category  = 'Input' ;
		this.role = 'Get';
		this.setColour(Colour[this.category]);
		
	}
};

Blockly.Python['template-get'] = function(block) {
	var port = block.getFieldValue('PORT');
	if (port == 'None') return '';
	var object = port ;
	AddToSection('import' , 'from Blocky.Template import *\n');
	AddToSection('declare' , object + " = Template(port='" + port +"')\n");
	
	var code = object + '.value()' ;
	return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Blocks['template-event'] = {
	init: function() {
		this.appendDummyInput('MAIN')
			.appendField("when")
			.appendField('Template')
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('template') ) , 'PORT' )
			.appendField('is')
			.appendField(new Blockly.FieldDropdown([['pressed','pressed'],['held','held']]),'MODE')
			.appendField(new Blockly.FieldNumber(1) , 'TIME')
			.appendField(new Blockly.FieldLabel('time'),'UNIT')
			;
			
		this.appendStatementInput('CODE');
		this.category  = 'Input' ;
		this.module = 'template';
		this.role = 'Event';
		this.setColour(Colour[this.category]);
	}
};

Blockly.Python['template-event'] = function(block) {
	var name = block.module ;
	var type = block.getFieldValue('MODE');
	var time = block.getFieldValue('TIME');
	var port = block.getFieldValue('PORT');
	var code = Blockly.Python.statementToCode(block, 'CODE');
	if (!code.length||port == 'None') return '';
	var object = port ; 
	//if (name == 'None'||!code.length) return ;
	var function_name = 'Event_' + port  ;
	AddToSection('import' , 'from Blocky.Template import *\n');
	AddToSection('declare' ,object + " = Template(port='" + port +"')\n");
	AddToSection('event' , object  + ".event(type='" + type + "',time=" + time + ",function="+function_name+")\n");

	AddToSection('function','async def '+function_name+'():\n' + code + '\n');
};
