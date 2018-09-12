goog.require('Blockly');
goog.require('Blockly.Blocks');





Blockly.Blocks['music-set-play'] =
{
	init:function(){
		this.appendDummyInput('MAIN')
			.appendField('Music on')
			.appendField(new Blockly.FieldDropdown( PORT('music') ) , 'PORT' )
			.appendField('play song number')
			.appendField(new Blockly.FieldNumber(1,1,255), 'SONG');
			//.appendField(this.id);
		
		this.setPreviousStatement(true , null);
		this.setNextStatement(true , null);
		
		this.module = 'music' ;
		
		this.setColour(230);
		this.category  = 'Output' ;
		this.role = 'Get';
		this.setColour(Colour[this.category]);

	},
};


Blockly.Python['music-set-play'] = function(block) {
	var object = block.getFieldValue('PORT');
	var song = block.getFieldValue('SONG');
	if (object=='None') return '';
	AddToSection('import' , 'from Blocky.Music import MP3Player' + version('MP3PLAYER') + '\n');
	AddToSection('declare' , object + " = MP3Player(port='" + object +"')\n");
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	var code = object + '.play(song=' + song + ')\n'
	return code;
};

Blockly.Blocks['music-set-volume'] =
{
	init:function(){
		var list = [];
		for (var i = 30 ; i > 0 ; i--) list.push([String(i),String(i)]);
		this.appendDummyInput('MAIN')
			
			.appendField('Music on')
			.appendField(new Blockly.FieldDropdown( PORT('music') ) , 'PORT' )
			.appendField('set volume to')
			.appendField(new Blockly.FieldDropdown(list), 'VOL');
			//.appendField(this.id);
		
		this.setPreviousStatement(true , null);
		this.setNextStatement(true , null);
		
		this.module = 'music' ;
		
		this.setColour(230);
		this.category  = 'Output' ;
		this.role = 'Get';
		this.setColour(Colour[this.category]);
	},
};


Blockly.Python['music-set-volume'] = function(block) {
	var object = block.getFieldValue('PORT');
	var song = block.getFieldValue('VOL');
	if (object=='None') return '';
	AddToSection('import' , 'from Blocky.Music import MP3Player' + version('MP3PLAYER') + '\n');
	AddToSection('declare' , object + " = MP3Player(port='" + object +"')\n");
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	var code = object + '.volume(' + song + ')\n'
	return code;
};

Blockly.Blocks['music-set-stop'] =
{
	init:function(){
		this.appendDummyInput('MAIN')
			
			.appendField('Music on')
			.appendField(new Blockly.FieldDropdown( PORT('music') ) , 'PORT' )
			.appendField('stop playing');
			//.appendField(this.id);
		
		this.setPreviousStatement(true , null);
		this.setNextStatement(true , null);
		
		
		this.module = 'music' ;
		
		this.setColour(230);
		this.category  = 'Output' ;
		this.role = 'Get';
		this.setColour(Colour[this.category]);

	},
};


Blockly.Python['music-set-stop'] = function(block) {
	var object = block.getFieldValue('PORT');
	if (object=='None') return '';
	AddToSection('import' , 'from Blocky.Music import MP3Player' + version('MP3PLAYER') + '\n');
	AddToSection('declare' , object + " = MP3Player(port='" + object +"')\n");
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	var code = object + '.stop()\n'
	return code;
};

Blockly.Blocks['music-set-pause'] =
{
	init:function(){
		this.appendDummyInput('MAIN')
			
			.appendField('Music on')
			.appendField(new Blockly.FieldDropdown( PORT('music') ) , 'PORT' )
			.appendField('pause song');
			//.appendField(this.id);
		
		this.setPreviousStatement(true , null);
		this.setNextStatement(true , null);
		
		
		this.module = 'music' ;
		
		this.setColour(230);
		this.category  = 'Output' ;
		this.role = 'Get';
		this.setColour(Colour[this.category]);

	},
};


Blockly.Python['music-set-pause'] = function(block) {
	var object = block.getFieldValue('PORT');
	if (object=='None') return '';
	AddToSection('import' , 'from Blocky.Music import MP3Player' + version('MP3PLAYER') + '\n');
	AddToSection('declare' , object + " = MP3Player(port='" + object +"')\n");
	// TODO: Assemble Python into code variable.
	// Do not let user put this anyywhere except from setup block;
	var code = object + '.pause()\n'
	return code;
};