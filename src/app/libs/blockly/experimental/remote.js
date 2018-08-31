goog.require('Blockly');
goog.require('Blockly.Blocks');



Blockly.Blocks['remote-event'] = {
	init: function() {
		this.appendDummyInput('MAIN')
			.appendField("when")
			.appendField('Remote on')
			.appendField(new Blockly.FieldDropdown( PORT('remote') ) , 'PORT' )
			.appendField('receive command')
			.appendField(new Blockly.FieldTextInput('TurnOn') , 'CMD');
		this.appendValueInput('temp').setVisible(false);
		this.appendStatementInput('CODE');
		this.appendDummyInput();
		this.setColour(230);
		this.setTooltip("");
		this.setHelpUrl("");
		
		this.module = 'remote' ;
		
		this.setColour(230);
		this.category  = 'Output' ;
		this.role = 'Event';
		this.setColour(Colour[this.category]);
		
	}
};

Blockly.Python['remote-event'] = function(block) {
	var code = Blockly.Python.statementToCode(block, 'CODE');
	var object = block.getFieldValue('PORT');
	var command = block.getFieldValue('CMD');
	if (object=='None') return '';
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	
	if (!code.length) return '';
	//if (name == 'None'||!code.length) return ;
	var function_name = 'Event_' + object + '_' + command ;
	AddToSection('import' , 'from Blocky.Remote import *\n');
	AddToSection('declare' ,object + " = Remote(port='" + object +"')\n");
	AddToSection('event' , object  + ".event(command='" + command  + "',function="+function_name+")\n");

	AddToSection('function', async_cancellable+'async def '+function_name+'():\n' + code + '\n');
	return '';
};




Blockly.Blocks['remote-learn'] =
{
	init:function(){
		this.appendDummyInput('MAIN')
			.appendField('Remote on')
			.appendField(new Blockly.FieldDropdown( PORT('remote') ) , 'PORT' )
			.appendField('learn and save signal as ')
			.appendField(new Blockly.FieldTextInput('TurnOn'),'CMD');
			//.appendField(this.id);
		
		this.setPreviousStatement(true , null);
		this.setNextStatement(true , null);
		
		
		this.module = 'remote' ;
		
		this.setColour(230);
		this.category  = 'Output' ;
		this.role = 'Set';
		this.setColour(Colour[this.category]);

	},
};


Blockly.Python['remote-learn'] = function(block) {

	var object = block.getFieldValue('PORT');
	var command = block.getFieldValue('CMD');
	if (object=='None') return '';
	AddToSection('import' , 'from Blocky.Remote import *\n');
	AddToSection('declare' , object + " = Remote(port='" + object +"')\n");
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	var code = object + ".learn('" + command + "')\n"
	return code;
};

Blockly.Blocks['remote-send'] =
{
	init:function(){
		this.appendDummyInput('MAIN')
			.appendField('Remote on')
			.appendField(new Blockly.FieldDropdown( PORT('remote') ) , 'PORT' )
			.appendField('send command')
			.appendField(new Blockly.FieldTextInput('TurnOn'),'CMD');
			//.appendField(this.id);
		
		this.setPreviousStatement(true , null);
		this.setNextStatement(true , null);
		
		this.module = 'remote' ;
		
		this.setColour(230);
		this.category  = 'Output' ;
		this.role = 'Set';
		this.setColour(Colour[this.category]);

	},
};


Blockly.Python['remote-send'] = function(block) {
	var object = block.getFieldValue('PORT');
	var command = block.getFieldValue('CMD');
	if (object=='None') return '';
	AddToSection('import' , 'from Blocky.Remote import *\n');
	AddToSection('declare' , object + " = Remote(port='" + object +"')\n");
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	var code = object + ".send('" + command + "')\n"
	return code;
};