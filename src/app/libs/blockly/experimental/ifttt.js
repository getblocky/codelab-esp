goog.require('Blockly');
goog.require('Blockly.Blocks');

Blockly.Blocks['ifttt_declare'] =
{
	init:function(){
		this.appendDummyInput('MAIN')
			.appendField('Set IFTTT')
			.appendField('with key')
			.appendField(new Blockly.FieldTextInput('your IFTTT key'),'KEY');
			//.appendField(this.id);
		
		this.setColour(Colour.Network);
		
		this.setPreviousStatement(true , null);
		this.setNextStatement(true , null);
		this.user_enabled = false;
		
		this.self_disabled = true;
		this.self_enabled = true ;
		this.Colour = Colour.Network ;
		this.PortPosition = 2 ;
		

	},
};


Blockly.Python['ifttt_declare'] = function(block) {
	var key = block.getFieldValue('KEY');

	AddToSection('import' , 'from Blocky.IFTTT import *\n');
	AddToSection('declare' ,  "ifttt = IFTTT(key='" + key +"')\n");
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	return '';
};





Blockly.Blocks['ifttt_trigger'] =
{
	init:function(){
		this.appendDummyInput('MAIN')
			.appendField('Send to topic')
			.appendField(new Blockly.FieldTextInput('your topic'),'TOPIC');
			//.appendField(this.id);
		
		this.setColour(Colour.Network);
		this.Colour = Colour.Network ;
		this.setPreviousStatement(true , null);
		this.setNextStatement(true , null);
		this.user_enabled = false;
		this.self_disabled = true;
		this.self_enabled = true ;

	},
};


Blockly.Python['ifttt_trigger'] = function(block) {
	var name = 'ifttt'
	var topic = block.getFieldValue('TOPIC');

	AddToSection('import' , 'from Blocky.IFTTT import *\n');
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	var code = name + ".trigger(topic='" + topic + "')\n"
	return code;
};

