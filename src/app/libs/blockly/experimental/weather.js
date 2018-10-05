goog.require('Blockly');
goog.require('Blockly.Blocks');


////////////////////////////////////////////////////////////////////////////////////


Blockly.Blocks['weather-get'] = {
	init: function() {
		this.appendDummyInput('MAIN')
			.appendField('get')
			.appendField(new Blockly.FieldDropdown([['temperature','temperature'],['humidity','humidity']]),'MODE')
			.appendField("'s value on")
			.appendField(new Blockly.FieldDropdown( PORT('weather') ) , 'PORT' )
			;
		this.module = 'weather' ;
		this.setOutput(true , null );
		this.setColour(230);
		this.category  = 'Sensor' ;
		this.role = 'Get';
		this.setColour(Colour[this.category]);
		
	}
};

Blockly.Python['weather-get'] = function(block) {
	var port = block.getFieldValue('PORT');
	var mode = block.getFieldValue('MODE');
	if (port == 'None') return '';
	var object = port ; 
	AddToSection('import' , 'from Blocky.Weather import * ' + getLibraryVersion('Weather') + '\n');
	AddToSection('declare' , object + " = Weather(port='" + port +"')\n");
	
	var code = object + '.' + mode + '()' ;
	return [code, Blockly.Python.ORDER_NONE];
};


Blockly.Blocks['weather-event'] = {
	init: function() {
		this.appendDummyInput('MAIN')
			.appendField("when")
			.appendField(new Blockly.FieldDropdown([['temperature','temperature'],['humidity','humidity']]),'MODE')
			.appendField('on')
			.appendField(new Blockly.FieldDropdown( PORT('weather') ) , 'PORT' )
			.appendField('changes')
			;
			
		this.appendStatementInput('CODE');
		this.category  = 'Sensor' ;
		this.module = 'weather';
		this.role = 'Event';
		this.setColour(Colour[this.category]);
	}
};

Blockly.Python['weather-event'] = function(block) {
	var name = block.module ;
	var port = block.getFieldValue('PORT');
	var type = block.getFieldValue('MODE');
	var code = Blockly.Python.statementToCode(block, 'CODE');
	if (!code.length||port == 'None') return '';
	var object = port ; 
	//if (name == 'None'||!code.length) return ;
	var function_name = 'Event_' + object +'_' + type  ;
	AddToSection('import' , 'from Blocky.Weather import * ' + getLibraryVersion('Weather') + '\n');
	AddToSection('declare' , object + " = Weather(port='" + port +"')\n");
	AddToSection('event' ,object  + ".event(type='" + type +"',function="+function_name+")\n");

	AddToSection('function', async_cancellable+'async def '+function_name+'():\n' + code + '\n');
};
