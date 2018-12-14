'use strict'


goog.provide('Blockly.Blocks.colour');
goog.require('Blockly.Blocks');
goog.require('Blockly.constants');
goog.require('Blockly.Python');
goog.require('Blockly.Variables');
goog.require('Blockly.Workspace');

Blockly.Python.addReservedWords('machine');
Blockly.Python.addReservedWords('blocky');


Blockly.Blocks['timer-event-alarm'] = {
  init: function() {
    this.appendDummyInput("MAIN")
		.appendField('Every')
        .appendField(new Blockly.FieldDropdown([ ['Monday','Monday'],['Tuesday','Tuesday'],['Wednesday','Wednesday'],['Thrusday','Thrusday']
			,['Friday','Friday'],['Saturday','Saturday'],['Sunday','Sunday']]),'DAY')
		.appendField('at')
        .appendField(new Blockly.FieldTextInput("07:00"), "TIME")
        .appendField("do");
    this.appendStatementInput("CODE")
        .setCheck(null);
    this.appendDummyInput();
    this.setColour(Colour.Timer);

  }
};


Blockly.Python['timer-event-alarm'] = function(block)
{
	
	var day = block.getFieldValue('DAY');
	var TIME = block.getFieldValue('TIME');
	var statement = Blockly.Python.statementToCode(block,'CODE');
	
	if (statement.length)
	{
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
		var function_name  = 'Alarm_' + String(TIME).replace(":","_")  + "_" + day;
		
		//var function_code = async_cancellable+'async def ' + function_name + '():\n' + GlobalVariable ;
		var function_code =  async_cancellable+'async def ' + function_name + '():\n' +GlobalVariable ; 
		function_code +=     statement + '\n';
		var event_code = 'core.Timer.alarm(day = "' + day + '",time= "' + TIME + '",function = ' + function_name + ')\n';
		AddToSection('async',event_code);
		AddToSection('function',function_code);
	}
	
	var code = '';
	return code ;
	
}

Blockly.Blocks['timer-runtime'] = {
	init: function() {
		this.appendDummyInput('MAIN')
			.appendField(new Blockly.FieldLabel("system runtime"));

		this.setOutput(true , null );
		this.setColour(230);
		this.setTooltip("");
		this.setHelpUrl("");
		this.Colour = Colour.Timer;
		this.setColour(Colour.Timer);
		this.self_disabled = true;
		this.self_enabled = true ;
	}
};

Blockly.Python['timer-runtime'] = function(block) {
	var name = block.getFieldValue('NAME');

	var code = 'core.Timer.runtime()' ;
	return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Blocks['timer-ntp'] = {
	init: function() {
		this.appendDummyInput('MAIN')
			.appendField(new Blockly.FieldLabel("current"))
			.appendField(new Blockly.FieldDropdown( [ ["clock" , "clock"] ,["dd/mm/yyyy" , "dd/mm/yyyy"] ,["hour" , "hour"] ,["minute" , "minute"] ,["second" , "second"] , ["date" , "date"] ,["month" , "month"] , ["year" , "year"] ,  ["day" , "day"] ] ), "MODE"  )  
			;
		this.setOutput(true , null );
		this.setColour(230);
		this.setTooltip("");
		this.setHelpUrl("");
		this.Colour = Colour.Timer;
		this.setColour(Colour.Timer);
		this.self_disabled = true;
		this.self_enabled = true ;
	}
};

Blockly.Python['timer-ntp'] = function(block) {
	var mode = block.getFieldValue('MODE');

	var code = "core.Timer.current('" + mode + "')" ;
	return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Blocks['timer-wait'] = {
	init: function() {
		this.appendDummyInput('MAIN')
			.appendField(new Blockly.FieldLabel("wait for"))
			.appendField(new Blockly.FieldNumber(0, 1), "TIME")
			.appendField(new Blockly.FieldDropdown([["seconds","seconds"], ["miliseconds","miliseconds"]]), "UNIT");
			
		this.setPreviousStatement(true , null );
		this.setNextStatement(true , null );
		this.setColour(230);
		this.setTooltip("");
		this.setHelpUrl("");
		this.Colour = Colour.Timer;
		this.setColour(Colour.Timer);
		this.self_disabled = true;
		this.self_enabled = true ;
		this.setOnChange(
			function(event)
			{
				if (this.isInFlyout ||!this.getRootBlock()) return ;
				
				if (event.type == 'create' || event.type == 'change' || event.type == 'move')
				{
					var type = this.getRootBlock().type;
					if (type.indexOf('event')==-1)
					{
						this.setDisabled(true);
					}
					else
					{
						this.setDisabled(false);
					}
				}
			}
		);
	}
};

Blockly.Python['timer-wait'] = function(block) {
	var time = block.getFieldValue('TIME');
	var unit = block.getFieldValue('UNIT');
	if ( unit == 'seconds' ) time += '000';
	var code = 'await core.asyncio.sleep_ms('+  time + ')\n' ;
	return code;
};



Blockly.Blocks['timer-event-repeat'] = {
  init: function() {
    this.appendDummyInput("MAIN")
        .appendField('Every')
        .appendField(new Blockly.FieldNumber(0, 1), "TIME")
        .appendField(new Blockly.FieldDropdown([["seconds","seconds"], ["miliseconds","miliseconds"]]), "UNIT")
        ;
    this.appendStatementInput("CODE")
        .setCheck(null);
    this.appendDummyInput();
    this.setColour(Colour.Timer);
	this.setTooltip("");
	this.setHelpUrl("");
	this.setOnChange(
		function(event)
		{
			if (event.blockId == this.id &&(event.type == 'create' || event.type ==  'change'))
			{
				if (this.getFieldValue('MODE') == 'every')
				{
					this.setPreviousStatement(false,null);
					this.setNextStatement(false,null);
				}
				if (this.getFieldValue('MODE') == 'after')
				{
					this.setPreviousStatement(true,null);
					this.setNextStatement(true ,null);
				}
			}
		}
	);
  }
};


Blockly.Python['timer-event-repeat'] = function(block)
{
	
	var time = block.getFieldValue('TIME');
	var unit = block.getFieldValue('UNIT');
	var statement = Blockly.Python.statementToCode(block,'CODE');
	
	if (statement.length)
	{
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
		//statement = Blockly.Python.prefixLines(statement, Blockly.Python.INDENT )
		statement = Blockly.Python.prefixLines(statement,Blockly.Python.INDENT)
		var function_name  = 'Timer_Every_' + time + unit;
		if (unit == 'seconds')  time += '000';

		
		var function_code =  async_cancellable+'async def ' + function_name + '():\n' +GlobalVariable+ Blockly.Python.INDENT+'while True:\n' ;
		function_code += Blockly.Python.INDENT+Blockly.Python.INDENT+'start_time=core.Timer.runtime()\n' +  statement  ;
		function_code += Blockly.Python.INDENT+Blockly.Python.INDENT+ 'await core.asyncio.sleep_ms(max(1,' +  time + '-(core.Timer.runtime()-start_time)))\n' ;
		var event_code = 'core.mainthread.create_task(core.asyn.Cancellable(' + function_name + ')())\n';
		AddToSection('async',event_code);
		AddToSection('function',function_code);
	}
	
	var code = '';
	return code ;
	
}