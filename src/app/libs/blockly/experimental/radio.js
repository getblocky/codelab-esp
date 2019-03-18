goog.require('Blockly');
goog.require('Blockly.Blocks');

Blockly.Blocks['rfreceiver-event'] = {
	init: function() {
		this.appendDummyInput('MAIN')
			.appendField("when")
			.appendField('Radio Receiver')
			.appendField(new Blockly.FieldDropdown( PORT('rfreceiver') ) , 'PORT' )
			.appendField('receive from address')
			.appendField(new Blockly.FieldTextInput('       ') , 'ID')
			;
			
		this.appendStatementInput('CODE');
		this.category  = 'Input' ;
		this.module = 'rfreceiver';
		this.role = 'Event';
        this.setColour(Colour[this.category]);
        this.setOnChange(function(change) {
            if (change.blockId == this.id && (change.element == "field"||change.element == "create"))
            {
                
                var currentAddress = change.newValue;
                var previousAddress = change.oldValue;
                var isValid = true;
                for(var i = 0 ; i < currentAddress.length ; i ++)
                {
                    if (currentAddress[i]=="A"||currentAddress[i]=="B"||currentAddress[i] == "C"||currentAddress[i] == "a"||currentAddress[i] == "b"||currentAddress[i] == "c" )
                    {
                       
                    }
                    else {
                        isValid = false;
                        break;
                    }
                }
                

                if (isValid == false)
                {
                    console.log("Invalid");

                    alert("Address is printed on the remote\nIt should only contains letters A,B,C and is 8 characters");
                    var currentValue = this.getFieldValue('ID');
                    if (currentValue.length > 8)
                    {
                        currentValue = currentAddress.substring(0,8);
                    }
                    var newValue = '';
                    for (var i = 0 ; i < currentValue.length;i++)
                    {
                        if (currentValue[i]=="A"||currentValue[i]=="B"||currentValue[i] == "C"||currentValue[i] == "a"||currentValue[i] == "b"||currentValue[i] == "c")
                        {
                            newValue += currentValue[i].toUpperCase();
                        }
                    }
                    this.setFieldValue(newValue,"ID");
                    console.log('currentValue' , newValue);
                }
                else
                {
                    console.log("Valid");
                }
                
                if (this.getFieldValue('ID').length != 8)
                {
                    this.setWarningText("The Address should be 8 letters , including only letter A,B or C");
                }
                else {
                    this.setWarningText(null);
                }
            }
        });
	}
};

Blockly.Python['rfreceiver-event'] = function(block) {
	var name = block.module ;
	var type = 'all';
	var code = Blockly.Python.statementToCode(block, 'CODE');
	var port = block.getFieldValue('PORT') ;
    var id = block.getFieldValue('ID').toUpperCase().trim() ; 
    id += "AAAAAAAA";
    id = id.substring(0,8);
	if (!code.length||port == 'None') return '';
	var object = port ; 
	//if (name == 'None'||!code.length) return ;
	var function_name = 'Event_' + port + '_' + id   ;
	AddToSection('import' , 'from Blocky.RadioReceiver import * ' + getLibraryVersion('RadioReceiver') + '\n');
	AddToSection('declare' ,object + " = RadioReceiver(port='" + port +"')\n");
	AddToSection('event' , object  + ".event(address='" + id + "',function="+function_name+")\n");
    AddToSection('function',async_cancellable + 'async def '+function_name+'(KeyPressed):\n'+GlobalVariable+  code + '\n');
	//AddToSection('function', async_cancellable+'async def '+function_name+'():\n' +Blockly.Python.INDENT+GlobalVariable+ code + '\n');
};

Blockly.Blocks['rfreceiver_message']=
{
	init : function()
	{
		this.appendDummyInput('MAIN')
			.appendField('Key Pressed')
			;
		this.category  = 'Input' ;
		this.module = 'rfreceiver';
		this.role = 'Value';
        this.setColour(Colour[this.category]);
		this.setOutput(true , null);
		this.setOnChange(
			function (event)
			{
				if (this.isInFlyout||!this.getRootBlock()) return ;
				if (event.type=='create'||event.type=='change'||event.type=='move')
				{
					if (this.getRootBlock().type.indexOf('rfreceiver-event')==-1)
					{
						this.setDisabled(true);
						this.setWarningText('This block should be inside a RadioReceiver block')
					}
					else 
					{
						this.setDisabled(false);
						this.setWarningText();
					}
				}
				
			}
		);
	}
} ;

Blockly.Python['rfreceiver_message'] = function(block) {
	var code = "KeyPressed";
	return [code, Blockly.Python.ORDER_ATOMIC ];
};

Blockly.Blocks['rfreceiver_message_dropdown']=
{
	init : function()
	{
		this.appendDummyInput('MAIN')
            .appendField(new Blockly.FieldDropdown( [ ["A","A"],["B","B"],["C","C"],["D","D"] ] ) , 'KEY' )
			;
		this.category  = 'Input' ;
		this.module = 'rfreceiver';
		this.role = 'Value';
        this.setColour(Colour[this.category]);
		this.setOutput(true , null);
		
	}
} ;

Blockly.Python['rfreceiver_message_dropdown'] = function(block) {
    var key = block.getFieldValue("KEY");
    var code = '"' + key + '"';
    return [code, Blockly.Python.ORDER_ATOMIC ];
};