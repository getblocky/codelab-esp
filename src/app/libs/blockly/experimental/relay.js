goog.require('Blockly');
goog.require('Blockly.Blocks');


////////////////////////////////////////////////////////////////////////////////////
Blockly.Blocks['relay-set'] = {
	init: function () {
		this.appendValueInput('MAIN')
			.appendField('Relay')
			.appendField('on')
			.appendField(new Blockly.FieldString('My String'), 'M')
			.appendField(new Blockly.FieldTextInput('My Strinawdawdg'), 'ME')
			
			;
		// this.setColour('#ff0000', '#00ff00', '#0000ff');


		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);

	}

};

Blockly.Python['relay-set'] = function (block) {
	var name = block.module;
	var port = block.getFieldValue('PORT');
	var state = Blockly.Python.valueToCode(block, 'MAIN', Blockly.Python.ORDER_NONE);
	if (port == 'None') return '';
	var code = '';
	var object = port;
	AddToSection('import', 'from Blocky.Relay import * ' + getLibraryVersion('Relay') + '\n');
	AddToSection('declare', object + " = Relay(port='" + port + "')\n");
	code = object + '.' + 'turn(' + state + ')' + '\n';
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	return code;
};



Blockly.Blocks['relay-get'] = {
	init: function () {
		this.appendDummyInput('MAIN')
			.appendField('get')
			.appendField('Relay')
			.appendField('on')
			.appendField(new Blockly.FieldDropdown(PORT('relay')), 'PORT')
			.appendField("'s state");
		this.module = 'relay';
		this.setOutput(true, null);
		this.setColour(230);
		this.category = 'Input';
		this.role = 'Get';
		this.setColour(Colour[this.category]);

	}
};

Blockly.Python['relay-get'] = function (block) {
	var port = block.getFieldValue('PORT');
	if (port == 'None') return '';
	var object = port;
	AddToSection('import', 'from Blocky.Relay import * ' + getLibraryVersion('Relay') + '\n');
	AddToSection('declare', object + " = Relay(port='" + port + "')\n");

	var code = object + '.value()';
	return [code, Blockly.Python.ORDER_ATOMIC];
};




Blockly.Blocks['state_output'] = {
	init: function () {
		this.appendDummyInput('MAIN')
			.appendField(new Blockly.FieldDropdown([
				['ON', "'on'"],
				['OFF', "'off'"],
				['FLIP', "'flip'"]
			]), 'STATE');
		this.setOutput(true, null);
		this.setColour(230);
		this.category = 'Output';
		this.role = 'Get';
		this.setColour(Colour[this.category]);
		this.setMovable(false);
	}
};

Blockly.Python['state_output'] = function (block) {
	var code = block.getFieldValue('STATE');
	return [code, Blockly.Python.ORDER_ATOMIC];
};