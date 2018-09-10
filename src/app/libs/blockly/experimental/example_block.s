goog.require('Blockly');
goog.require('Blockly.Blocks');

Blockly.Blocks['legit-declare'] =
{
	init:function(){
		this.appendDummyInput('MAIN')
			.appendField('Set a Legit')
			.appendField('on port')
			.appendField(new Blockly.FieldDropdown(GeneratePortList(true)),'PORT')
			.appendField('as')
			.appendField(new Blockly.FieldTextInput(GenerateName('legit')),'NAME')
			.appendField(this.id);
			
		this.setColour(Colour.Input);
		this.setPreviousStatement(true , null);
		this.setNextStatement(true , null);
		this.user_enabled = false;
		this.self_disabled = false ;
		this.self_enabled = false ;
		
		this.setOnChange(
			function(event) //:: Where the fun begin 
			{
				// delete event is handle by 'MainBlock'
				// every event will be handle by mainblock to avoid duplicate
				//
				/* 
					Keynote , every function define this block will be run in MainRunOnce
					To avoid duplicate event , 
				*/
			}
		);

	},
};

Blockly['legit-declare'] = function (change,workspace)
{
	var block = null ;
	if (change.type == 'delete')
	{
		block = xmlToJson(change.oldXml);
	}
	else {
		block = workspace.getBlockById(change.blockId);
	}
	if (block.type == 'legit-declare')
	{
		
		if (change.type == 'delete')
		{
			RemoveName('legit',GetField('NAME',block),block.id );
			RemovePort(GetField('PORT',block),block.id);
		}
		else 
		{
			if (!block) return ;

			if (change.type == 'create')
			{
				if (NameExist(block.getFieldValue('NAME'))||PortUsed(block.getFieldValue('PORT'))) 
				{
					block.self_disabled = true ;
					block.setDisabled(true);
				}
				else {
					
					AddName('legit',block.getFieldValue('NAME') , block.id)
					AddPort(block.getFieldValue('PORT') ,'legit', block.id)
				}
			}
			if (change.type == 'change')
			{
				if (change.element == 'field')
				{
					if (!block.disabled)
					{
						if (change.name=='NAME'){
							
							if (NameExist(change.newValue))
							{
								RemoveName('legit' , change.oldValue , block.id);
								block.self_disabled = true ;
								block.setDisabled(true);
							}
							else 
							{
								RemoveName('legit' , change.oldValue , block.id);
								AddName('legit' , change.newValue , block.id);
							}
						}
						if (change.name == 'PORT')
						{
							RemovePort(change.oldValue,block.id);
							if (PortUsed(change.newValue))
							{
								block.self_disabled = true; 
								block.setDisabled(true);
							}
							else
							{
								AddPort(block.getFieldValue('PORT'),'legit' , block.id);
							}
						}
					}
					if (block.disabled)
					{
						if (!NameExist(block.getFieldValue('NAME'))&&!PortUsed(block.getFieldValue('PORT'))) 
						{
							block.self_enabled  = true ;
							block.setDisabled(false);
						}
					}
				}
				if (change.element == 'disabled')
				{
					if (change.newValue)
					{
						if (block.self_disabled==true) block.self_disabled = false ;
						RemoveName('legit',block.getFieldValue('NAME') , block.id);
						RemovePort(block.getFieldValue('PORT') , block.id);
					}
					if (change.oldValue)
					{
						if (block.self_disabled ==false )
						{
							if (NameExist(block.getFieldValue('NAME'))||PortUsed(block.getFieldValue('PORT'))) 
							{
								block.setDisabled(true);
								block.self_disabled = true ;
							}
						}
						AddPort(block.getFieldValue('PORT') ,'legit', block.id );
						AddName('legit',block.getFieldValue('NAME') , block.id);
					}
				}
			}
		}
		
	}
}
Blockly.Python['legit-declare'] = function(block) {
  var name = block.getFieldValue('NAME');
  var port = block.getFieldValue('PORT');
  // TODO: Assemble Python into code variable.
  var code = name + port;
  return code;
};


Blockly.Blocks['legit-action'] = {
	init: function() {
		this.appendDummyInput('MAIN')
			.appendField(new Blockly.FieldDropdown(GenerateListName('legit')), "NAME")
			.appendField("say helo");
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(230);
		this.setTooltip("");
		this.setHelpUrl("");
		this.setOnChange(
			function(event)
			{
				if (event.type == 'create' || event.type == 'change' || event.type == 'delete')
				{
					
					var name = this.getFieldValue('NAME') ;
					if (!NameExist(name)&&GenerateListName('legit')[0]=='None') 
					{
						
						this.setDisabled(true);
					}
					else
					{
						this.setDisabled(false);
						var input = this.getInput('MAIN');
						input.removeField('NAME');
						var dropdown = new Blockly.FieldDropdown(GenerateListName('legit',name));
						input.insertFieldAt(0 , dropdown,'NAME');
						
					}
				}
				
				
			}
		);
	}
};