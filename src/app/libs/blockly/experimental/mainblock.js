'use strict';
var IMPORT_CORE = "";
var SetupBlockId = null;
var WorkspaceId = null;
var GlobalWorkspace = null;
var sep = '==================================';
goog.require('Blockly.Blocks');
goog.require('Blockly.constants');
goog.require('Blockly.Python');
goog.require('Blockly.Variables');
goog.require('Blockly.Workspace');
goog.require('Blockly.Generator');
goog.require('Blockly.BlockSvg');
Blockly.BlockSvg.START_HAT = false;

Blockly.Python.addReservedWords('machine');
Blockly.Python.addReservedWords('blocky');

Blockly.BlockSvg.NOTCH_PATH_LEFT = 'l 6,4 8,0 6,-4';
Blockly.BlockSvg.NOTCH_PATH_RIGHT = 'l -6,4 -8,0 -6,-4';
var async_cancellable = '\n@core.asyn.cancellable\n';

Blockly.Extensions.register('setup', function () {
	// Example validation upon block change:
	this.setOnChange(function (changeEvent) {
		if (this.getInput('NUM').connection.targetBlock()) {
			this.setWarningText(null);
		} else {
			this.setWarningText('Must have an input block.');
		}
	});
});
var json = {
	"extensions": ["setup"],
};

function Extensions(type) {
	var code = '{"extensions":' + type + '}';
	return code

}
Blockly.Blocks['MainRunOnce'] = {
	init: function () {
		this.appendDummyInput()
			.appendField("on start                              ")
		this.blocks = this.appendStatementInput("MAIN")
			.setCheck(null);
		this.appendDummyInput();
		this.setColour(Colour.Loops);
		this.setTooltip("");
		this.setHelpUrl("");
		this.jsonInit(Extensions('setup'));
		this.setDeletable(false);

		SetupBlockId = this.id;
		WorkspaceId = this.workspace.id;
		GlobalWorkspace = this.workspace;
		this.setOnChange(
			function (change) {
				return;
				//this.workspace.addChangeListener();
				//Blockly['legit-declare'](change,this.workspace);
				if (false) //change.type != 'ui'&&change.type != 'move')
				{
					HandlerGlobal(change);
					var blocks = this.workspace.getAllBlocks();


					//HandlePublicBlock(change,this.workspace,blocks);
					/*
					if (false){
					HandleBlocksOfType('button',change,this.workspace,blocks) ; // magic function =))
					HandleBlocksOfType('weather',change,this.workspace,blocks) ; // magic function =))
					HandleBlocksOfType('light',change,this.workspace,blocks) ; // magic function =))
					HandleBlocksOfType('smoke',change,this.workspace,blocks) ; // magic function =))
					HandleBlocksOfType('potentiometer',change,this.workspace,blocks) ; // magic function =))
					HandleBlocksOfType('rfid',change,this.workspace,blocks) ; // magic function =))
					HandleBlocksOfType('led',change,this.workspace,blocks) ; // magic function =))
					HandleBlocksOfType('stepper',change,this.workspace,blocks) ; // magic function =))
					HandleBlocksOfType('rgb',change,this.workspace,blocks) ; // magic function =))
					HandleBlocksOfType('switch',change,this.workspace,blocks) ; // magic function =))
					HandleBlocksOfType('buzzer',change,this.workspace,blocks) ; // magic function =))
					HandleBlocksOfType('servo',change,this.workspace,blocks) ; // magic function =))
					HandleBlocksOfType('music',change,this.workspace,blocks) ; // magic function =))
					HandleBlocksOfType('remote',change,this.workspace,blocks) ; // magic function =))
					}
					*/
					/*
					Blockly['declare-block'](change,this.workspace);
					Blockly['button'](change,this.workspace);
					Blockly['weather'](change,this.workspace);
					Blockly['light'](change,this.workspace);
					Blockly['smoke'](change,this.workspace);
					Blockly['potentiometer'](change,this.workspace);
					Blockly['rfid'](change,this.workspace);
					*/
					//Blockly['button-event'](change,this.workspace);


				}
				// Hightlight block that share the same object !

				if (change.type == 'move') Blockly.Events.disableOrphans(change);
				if (change.type == "ui") {
					//console.log(this.workspace.getBlockById(change.blockId));
				}


			}
		);
	},
};


Blockly.Generator.prototype.unprefixLines = function (text, prefix) {
	return prefix + text.replace(/(?!\n$)\n/g, '\n' + prefix);
};

Blockly.Python['MainRunOnce'] = function (block) {
	GlobalFunctionName = [];
	Blockly.Python.definitions_['import'] = "";
	Blockly.Python.definitions_['variable'] = "";
	Blockly.Python.definitions_['declare'] = "";
	Blockly.Python.definitions_['function'] = "";
	Blockly.Python.definitions_['event'] = "";
	Blockly.Python.definitions_['once'] = '';
	Blockly.Python.definitions_['async'] = '';
	// Generate Global Variable string here
	var temp = block.workspace.getAllVariables();
	if (temp.length) {
		GlobalVariable = "global ";
		for (var i = 0; i < temp.length; i++) {
			GlobalVariable += temp[i].name;
			GlobalVariable += ",";
			Blockly.Python.definitions_['variable'] += temp[i].name + "= 0\n";
		}
		GlobalVariable = GlobalVariable.slice(0, -1);
		GlobalVariable = Blockly.Python.INDENT + GlobalVariable + '\n';
		//console.log(GlobalVariable) ;
	} else {
		GlobalVariable = '';
	}

	var statement = Blockly.Python.statementToCode(block, 'MAIN');

	Blockly.Python.definitions_['once'] = async_cancellable + "async def main():\r\n" + GlobalVariable + statement;

	return '';
};

Blockly.Blocks['MainRunLoop'] = {
	init: function () {
		this.appendDummyInput()
			.appendField("run forever")
		this.appendStatementInput("NAME")
			.setCheck(null);
		this.setColour(Colour.Loops);

		this.setTooltip("This function will run forever ");
		this.setHelpUrl("");
		this.setDeletable(false);
		this.setOnChange(
			function (change) {
				//:: WHy are there 2 phantom block ???
				if (change.type == 'create' && change.blockId == this.id) {

					Global['name'].splice(0, Global['name'].length);
					var phantom = this.workspace.getAllBlocks();
					for (var i = 0; i < phantom.length; i++) {
						var block = phantom[i];
						if (block.type == 'MainRunLoop' || block.type == 'MainRunOnce') continue;

						//block.dispose();

					}
					for (var i = 0; i < Global['port'].length; i++) {
						Global['port'][i][1] = 'none';
						Global['port'][i][2] = 'none';
					}

				}
			}
		)

	}
};

var workspace = new Blockly.Workspace();


Blockly.Python['MainRunLoop'] = function (block) {


	var statements_name = Blockly.Python.statementToCode(block, 'NAME');
	if (!statements_name.length) return;
	var code = '\nwhile True:\n';
	code += statements_name;

	Blockly.Python.definitions_['loop'] = code;

	return '';
};


function list(blocks) {
	var l = [];
	for (var i = 0; i < blocks.length; i++) l.push(blocks[i].type);
	return l;
}

/*
	This is where the real generator lie.
	Note that the mainblock onstart must always be generated first to create code section , AKA _definition
	Statement inside this block is save as _definition['once']
	After that , we need to put _definition['async'] inside _definition['once'] so that the on start block can have
	the following behaviour , which is typical sense.

	On start :
		Do these things
		After That
			Start other task

*/
String.prototype.replaceAll = function (search, replacement) {
	var target = this;
	return target.replace(new RegExp(search, 'g'), replacement);
};
Blockly.Generator.prototype.workspaceToCode = function (workspace) {
	globalWidgetDemand = [];
	globalChannelCounter = 255;
	console.error("WORKSPACE TO CODE");
	if (!workspace) {
		// Backwards compatibility from before there could be multiple workspaces.
		console.warn('No workspace specified in workspaceToCode call.  Guessing.');
		workspace = Blockly.getMainWorkspace();
	}
	var code = [];

	// Adding GMT time
	var currentTime = new Date();
	var timezone = Math.abs(currentTime.getTimezoneOffset() / 60);
	var timezoneStr = "eeprom.set('GMT' , " + String(timezone) + ")\n"



	this.init(workspace);
	var blocks = workspace.getTopBlocks(true);
	//:: Swap the top block , the top block must always be the MainRunOnce

	if (blocks[0].type != 'MainRunOnce') {

		var temp = null;
		for (var i = 0; i < blocks.length; i++) {
			if (blocks[i].type == 'MainRunOnce') {
				temp = blocks[i];
				blocks.splice(i, 1);
				blocks.unshift(temp);
				break;
			}
		}
	}
	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::;;
	for (var x = 0, block; block = blocks[x]; x++) {
		var line = this.blockToCode(block);
		if (goog.isArray(line)) {
			// Value blocks return tuples of code and operator order.
			// Top-level blocks don't care about operator order.
			line = line[0];
		}
		if (line) {
			if (block.outputConnection) {
				// This block is a naked value.  Ask the language's code generator if
				// it wants to append a semicolon, or something.
				line = this.scrubNakedValue(line);
			}
			code.push(line);
		}

		// Modified here
		if (x == blocks.length - 1) {
			var a = Blockly.Python.definitions_['event'].replaceAll('\n', '#').replace('  ', '$');
			var b = Blockly.Python.definitions_['async'].replaceAll('\n', '#').replace('  ', '$');
		}
		if (x == blocks.length - 1) {
			Blockly.Python.definitions_['import'] = "from Blocky.Core import * " + getLibraryVersion('Core') + "\n" + Blockly.Python.definitions_['import'];
			Blockly.Python.definitions_['import'] += timezoneStr;
			var event = false;
			if (Blockly.Python.definitions_['event'].length) {
				event = true;
				Blockly.Python.definitions_['event'] = Blockly.Python.INDENT + Blockly.Python.definitions_['event'];
				Blockly.Python.definitions_['event'] = Blockly.Python.definitions_['event'].replaceAll('\n', '\n' + Blockly.Python.INDENT);
				Blockly.Python.definitions_['event'] = Blockly.Python.definitions_['event'].slice(0, -2);
				Blockly.Python.definitions_['once'] += Blockly.Python.definitions_['event'];
			}
			if (Blockly.Python.definitions_['async'].length) {
				Blockly.Python.definitions_['async'] = Blockly.Python.INDENT + Blockly.Python.definitions_['async'];
				Blockly.Python.definitions_['async'] = Blockly.Python.definitions_['async'].replaceAll('\n', '\n' + Blockly.Python.INDENT);
				Blockly.Python.definitions_['async'] = Blockly.Python.definitions_['async'].slice(0, -1);
				Blockly.Python.definitions_['once'] += Blockly.Python.definitions_['async'];
			}
			console.log('once', Blockly.Python.definitions_['once']);
			Blockly.Python.definitions_['once'] += '\ncore.mainthread.create_task(core.asyn.Cancellable(main)())\n';
			Blockly.Python.definitions_['async'] = '';
			Blockly.Python.definitions_['event'] = '';

		}


	}
	code = code.join('\n'); // Blank line between each section.
	code = this.finish(code);

	// Final scrubbing of whitespace.
	code = code.replace(/^\s+\n/, '');
	code = code.replace(/\n\s+$/, '\n');
	code = code.replace(/[ \t]+\n/g, '\n');
	console.log('Usercode', code);


	/*
		Attempt Implementation of advance API
	*/
	


	return code;
};


Blockly.Blocks['doubleclick_to_run'] = {
	init: function () {
		this.appendDummyInput("MAIN")
			.appendField('Double clink this block to run')
			.appendField("these code");
		this.appendStatementInput("CODE")
			.setCheck(null);
		this.appendDummyInput();
		this.setColour(Colour.Timer);

	}
};


Blockly.Python['doubleclick_to_run'] = function (block) {

	var day = block.getFieldValue('DAY');
	var TIME = block.getFieldValue('TIME');
	var statement = Blockly.Python.statementToCode(block, 'CODE');

	if (statement.length) {
		/*
		AddToSection('import','from Blocky.Timer import *\n');
		//----------------------------------------------------------
		var function_name  = 'Timer_Every_' + time + unit;

		if (isFunctionNameExist(function_name)) { function_name += '_' ; function_name += String(getRandomNumber()) ;}
		GlobalFunctionName.push(function_name);
		var function_code = 'def '+ function_name + '():\n' + statement;
		AddToSection('function' , function_code);
		if (unit === 'seconds') time *= 1000 ;
		var event_code = "AddTask(mode='repeat',time=" + time + ",function="+function_name +")\n";
		AddToSection('once' , event_code);
		*/
		var function_name = 'Alarm_' + String(TIME).replace(":", "_") + "_" + day;

		//var function_code = async_cancellable+'async def ' + function_name + '():\n' + GlobalVariable ;
		var function_code = async_cancellable + 'async def ' + function_name + '():\n' + GlobalVariable;
		function_code += statement + '\n';
		var event_code = 'core.Timer.alarm(day = "' + day + '",time= "' + TIME + '",function = ' + function_name + ')\n';
		AddToSection('async', event_code);
		AddToSection('function', function_code);
	}

	var code = '';
	return code;

}