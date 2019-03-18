goog.require('Blockly');
goog.require('Blockly.Blocks');

var command = null;


Blockly.Blocks['irremote-event'] = {
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

Blockly.Python['irremote-event'] = function(block) {
	var code = Blockly.Python.statementToCode(block, 'CODE');
	var object = block.getFieldValue('PORT');
	var command = block.getFieldValue('CMD');
	if (object=='None') return '';
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;

	if (!code.length) return '';
	//if (name == 'None'||!code.length) return ;
	var function_name = 'Event_' + object + '_' + command ;
	AddToSection('import' , 'from Blocky.Remote import * ' + getLibraryVersion('Remote') + '\n');
	AddToSection('declare' ,object + " = Remote(port='" + object +"')\n");
	AddToSection('event' , object  + ".event(command='" + command  + "',function="+function_name+")\n");

	AddToSection('function', async_cancellable+'async def '+function_name+'():\n' +Blockly.Python.INDENT+GlobalVariable+ code + '\n');
	return '';
};




Blockly.Blocks['irremote-learn'] =
{
	init:function(){
		this.appendDummyInput('MAIN')
			.appendField(new Blockly.FieldDropdown( PORT('remote') ) , 'PORT' )
			.appendField('Double click to learn')
			.appendField('as ')
			.appendField(new Blockly.FieldTextInput('TurnOn'),'CMD');
			//.appendField(this.id);

		this.module = 'remote' ;

		this.setColour(230);
		this.category  = 'Output' ;
		this.role = 'Set';
		this.setColour(Colour[this.category]);
		this.setOnChange(
			function(change)
			{
				if (change.type == 'ui' && change.blockId == this.id && change.element == 'click')
				{
					console.log('Remote will start learning' , this.getFieldValue('CMD'))
					var message = [];
					message[0] = 'from Blocky.Remote import *\n' + String(this.getFieldValue('PORT')) + "= Remote('" + String(this.getFieldValue('PORT')) + "')\r\n";
					message[0] += String(this.getFieldValue('PORT')) + ".learn('" + String(this.getFieldValue('CMD')) + "')\r\n";
					console.log("SEND" , command);
					command.scriptService.sendCommand(command.currentDevice.token,message);
				}
			}
		);
	},
};


Blockly.Python['irremote-learn'] = function(block) {

	var object = block.getFieldValue('PORT');
	var command = block.getFieldValue('CMD');
	if (object=='None') return '';
	AddToSection('import' , 'from Blocky.Remote import * ' + getLibraryVersion('Remote') + '\n');
	AddToSection('declare' , object + " = Remote(port='" + object +"')\n");
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	var code = object + ".learn('" + command + "')\n"
	return code;
};

Blockly.Blocks['irremote-send'] =
{
	init:function(){
		this.appendDummyInput('MAIN')
			.appendField('IR Remote on')
			.appendField(new Blockly.FieldDropdown( PORT('remote') ) , 'PORT' )
			.appendField('send command')
			.appendField(new Blockly.FieldDropdown([["Syncing...","Syncing..."]]),'CMD');
			//.appendField(this.id);

		this.setPreviousStatement(true , null);
		this.setNextStatement(true , null);

		this.module = 'remote' ;

		this.setColour(230);
		this.category  = 'Output' ;
		this.role = 'Set';
		this.setColour(Colour[this.category]);
		
		this.setOnChange(
			function(change)
			{
                if (change.type == "create" && change.blockId == this.id)
                {
                    sendCommand("temp = '[REMOTE] '+str(core.os.listdir('IR'));core.mainthread.call_soon(core.blynk.log(temp))");
                }
			}
		);
        
        
	},
};


Blockly.Python['irremote-send'] = function(block) {
	var object = block.getFieldValue('PORT');
	var command = block.getFieldValue('CMD');
	if (object=='None') return '';
	AddToSection('import' , 'from Blocky.Remote import * ' + getLibraryVersion('Remote') + '\n');
	AddToSection('declare' , object + " = Remote(port='" + object +"')\n");
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	var code = object + ".send('" + command + "')\n"
	return code;
};
