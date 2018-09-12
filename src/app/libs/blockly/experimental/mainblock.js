'use strict';

var SetupBlockId = null;
var WorkspaceId = null ;
var GlobalWorkspace = null ;
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

var async_cancellable_decorator = '@core.asyn.cancellable\n' ;
function async_cancellable_wrapper(task){
	return  'core.asyn.Cancellable(' + task + ')'
}

Blockly.Extensions.register('setup', function() {
  // Example validation upon block change:
  this.setOnChange(function(changeEvent) {
    if (this.getInput('NUM').connection.targetBlock()) {
      this.setWarningText(null);
    } else {
      this.setWarningText('Must have an input block.');
    }
  });
});
var json = {
	"extensions":["setup"],
};
function Extensions (type){
	var code = '{"extensions":' + type + '}' ;
	return code
	
}
Blockly.Blocks['MainRunOnce'] = {
	init: function() {
		this.appendDummyInput()
			.appendField("on start                              ")
		this.blocks = this.appendStatementInput("NAME")
			.setCheck(null);
		this.appendDummyInput();
		this.setColour(Colour.Loops);
		this.setTooltip("");
		this.setHelpUrl("");
		this.jsonInit(Extensions('setup'));
		this.setDeletable(false);

		SetupBlockId = this.id ;
		WorkspaceId = this.workspace.id;
		GlobalWorkspace = this.workspace;
		this.setOnChange(
			function(change)
			{
				return 
				//console.log(change.type , change.element , change.name);
				//this.workspace.addChangeListener(); 
				//Blockly['legit-declare'](change,this.workspace);
				if (true)//change.type != 'ui'&&change.type != 'move')
				{
					HandlerGlobal(change) ; 
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
				
				//if (change.type == 'move') Blockly.Events.disableOrphans(change);
			}
		);
	},
};


Blockly.Generator.prototype.unprefixLines = function(text, prefix) {
  return prefix + text.replace(/(?!\n$)\n/g, '\n' + prefix);
};

Blockly.Python['MainRunOnce'] = function(block) {
	GlobalFunctionName = [];
	Blockly.Python.definitions_['import'] = "";
	Blockly.Python.definitions_['variable'] = "";
	Blockly.Python.definitions_['declare'] = "";
	Blockly.Python.definitions_['function'] = "";
	Blockly.Python.definitions_['event'] = "";
	Blockly.Python.definitions_['once'] ='';
	Blockly.Python.definitions_['async'] ='';
	var statement = Blockly.Python.statementToCode(block, 'NAME');
	
	if (statement.length)Blockly.Python.definitions_['once'] += 'if True:\n' + statement;
	return '';
};

Blockly.Blocks['MainRunLoop'] = {
  init: function() {
	this.appendDummyInput()
		.appendField("run forever")
	this.appendStatementInput("NAME")
		.setCheck(null);
	this.setColour(Colour.Loops);
	
 this.setTooltip("This function will run forever ");
 this.setHelpUrl("");
 this.setDeletable(false);
	this.setOnChange(
		function(change){
			//:: WHy are there 2 phantom block ???
				if (change.type == 'create'&&change.blockId == this.id)
				{
					
					Global['name'].splice(0,Global['name'].length);
					var phantom = this.workspace.getAllBlocks();
					for (var i = 0 ; i < phantom.length ; i++)
					{
						var block = phantom[i];
						if (block.type == 'MainRunLoop' || block.type == 'MainRunOnce') continue ;
						
						//block.dispose();
						
					}
					for (var i = 0 ; i < Global['port'].length;i++)
					{
						Global['port'][i][1] = 'none';
						Global['port'][i][2] = 'none';
					}
					console.log(Global['port']);
				}
		}
	)
 
  }
};

var workspace = new Blockly.Workspace();


Blockly.Python['MainRunLoop'] = function(block) {
	
	
	var statements_name = Blockly.Python.statementToCode(block, 'NAME');
	if (!statements_name.length) return ;
	var code = '\nwhile True:\n';
	code += statements_name;
	
	Blockly.Python.definitions_['loop'] =code ;
	
	return '';
};


function list (blocks){
	var l = [];
	for (var i = 0 ; i < blocks.length ; i++) l.push(blocks[i].type);
	return l;
}

Blockly.Generator.prototype.workspaceToCode = function(workspace) {
  if (!workspace) {
    // Backwards compatibility from before there could be multiple workspaces.
    console.warn('No workspace specified in workspaceToCode call.  Guessing.');
    workspace = Blockly.getMainWorkspace();
  }
  var code = [];
  
  this.init(workspace);
  var blocks = workspace.getTopBlocks(true);
  //:: Swap the top block , the top block must always be the MainRunOnce 
 
  if (blocks[0].type != 'MainRunOnce')
  {
	  
	  var temp = null ;
	  for (var i = 0 ; i < blocks.length ; i++)
	  {
		  if (blocks[i].type == 'MainRunOnce')
		  {
			  temp = blocks[i];
			  blocks.splice(i,1);
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
  }
  code = code.join('\n');  // Blank line between each section.
  code = this.finish(code);
  // Final scrubbing of whitespace.
  code = code.replace(/^\s+\n/, '');
  code = code.replace(/\n\s+$/, '\n');
  code = code.replace(/[ \t]+\n/g, '\n');
  return code;
};





