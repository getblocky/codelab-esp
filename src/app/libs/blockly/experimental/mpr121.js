goog.require('Blockly');
goog.require('Blockly.Blocks');


////////////////////////////////////////////////////////////////////////////////////
/*
Blockly.Blocks['mpr121-set']=
{
	init : function()
	{
		this.appendDummyInput('MAIN')
			.appendField('Button')
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('mpr121') ) , 'PORT' ) 
			.appendField('fly')
			;
		
		this.category  = 'Input' ;
		this.role = 'Set';
		this.module = 'mpr121';
		this.setColour(Colour[this.category]);
		this.setPreviousStatement(true , null);
		this.setNextStatement(true , null);
		
	}
	
};

Blockly.Python['mpr121-set'] = function(block) {
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
Blockly.Blocks['mpr121-get'] = {
	init: function() {
		this.appendDummyInput('MAIN')
			.appendField('')
			.appendField('Button')
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('mpr121') ) , 'PORT' )
			.appendField("is being")
			.appendField(new Blockly.FieldDropdown( [['pressed','pressed'],['released','released'] ],'MODE'))
			;
		this.module = 'mpr121' ;
		this.setOutput(true , null );
		this.setColour(230);
		this.category  = 'Input' ;
		this.role = 'Get';
		this.setColour(Colour[this.category]);
		
	}
};

Blockly.Python['mpr121-get'] = function(block) {
	var port = block.getFieldValue('PORT');
	if (port == 'None') return '';
	var object = port ; 
	AddToSection('import' , 'from Blocky.Button import * ' + getLibraryVersion('Button') + '\n');
	AddToSection('declare' , object + " = Button(port='" + port +"')\n");
	
	var code = object + '.is_pressed()' ;
	return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Blocks['mpr121-event'] = {
	
	init: function() {
		var list = [];
		for (var i = 1 ; i < 13 ; i ++) list.push( [String(i),String(i)] );
		this.appendDummyInput('MAIN')
			.appendField("when")
			.appendField(new Blockly.FieldDropdown([['touch','touch'],['release','release']]),'MODE')
			.appendField('#')
			.appendField(new Blockly.FieldDropdown(list) , 'PIN')
			.appendField('of Touch Sensor on')
			.appendField(new Blockly.FieldDropdown( PORT('mpr121') ) , 'PORT' )
			;
			
		this.appendStatementInput('CODE');
		this.category  = 'Input' ;
		this.module = 'mpr121';
		this.role = 'Event';
		this.setColour(Colour[this.category]);
	}
};

Blockly.Python['mpr121-event'] = function(block) {
	var name = block.module ;
	var pin = block.getFieldValue('PIN');
	var mode = block.getFieldValue('MODE');
	var port = block.getFieldValue('PORT');
	var code = Blockly.Python.statementToCode(block, 'CODE');
	if (!code.length||port == 'None') return '';
	var object =  port ; 
	//if (name == 'None'||!code.length) return ;
	var function_name = 'Event_' +port+'_' + mode + '_' + pin   ;
	AddToSection('import' , 'from Blocky.MPR121 import * ' + getLibraryVersion('MPR121') + '\n');
	AddToSection('declare' , object + " = MPR121(port='" + port +"')\n");
	AddToSection('event' , object  + ".event(type='" + mode + "',pin=" + String(parseInt(pin,10)-1) + ",function="+function_name+")\n");

	AddToSection('function',async_cancellable + 'async def '+function_name+'():\n'+GlobalVariable+ code + '\n');
};
