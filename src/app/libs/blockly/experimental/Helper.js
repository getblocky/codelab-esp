
/*
Blockly['button'] = function(change,this.workspace)
{
	//:: Get the block 
	var block = null ;
	if (change.type == 'delete') block = xmlToJson(change.oldXml)
	else block = workspace.getBlockById(change.blockId);
	if (!block) return ;
	
	if (block.type == 'button-declare') HandleDeclareBlock('button',this.workspace);
	else  HandleObjectBlock('button',this.workspace);
	/*
		HandleDeclareBlock will do the object namespace , add and remove name , port 
		HandleObjectBlock will set warning text , colour , notify when not declared object 
		We need to handle specific rule too ;
	
	
	//:: Button Event Handler , there cant be a block with same name , port and time value !
	//:: Check if the newly created/changed block valid !
	if (block.type == 'button-event') HandleDuplicateBlock(block,this.workspace);
	
	
}
*/

function Hightlight(block, workspace)
{
	block.addSelect();
	return ;
	workspace.highlightBlock(block.id, true);
	return ;
	var value = 50;
	var temp = block.Colour;
	var color = [
	Math.max(0,Math.min(parseInt('0x'+temp.substring(1,3))+value,255)),
	Math.max(0,Math.min(parseInt('0x'+temp.substring(3,5))+value,255)),
	Math.max(0,Math.min(parseInt('0x'+temp.substring(5,7))+value,255))];
	
	block.setColour('#' + ('00' + color[0].toString(16).toUpperCase()).slice(-2)
	+('00' + color[1].toString(16).toUpperCase()).slice(-2)
	+('00' + color[2].toString(16).toUpperCase()).slice(-2));
}

function UnHightlight(block,workspace)
{
	
	block.removeSelect()
	
}




/*
	Critical Handler Function 
	This function will do the following ::
		1 :: Ensure that no declare block share the same port
		2 :: No declare block share the same object name 
		3 :: Update <object_name> field of every block when that blocks's declare block change 
		4 :: Highlight relevant block that use the same <object_name>
		5 :: Darken any blocks that has no following declare block 
		6 :: 

*/

function HandlePublicBlock(  change , workspace , blocks )
{
	
	/*
		Get the current block that change 
		Note that when a block is deleted , only return its xml format
		
	*/
	var block = null ;
	if (change.type == 'delete') block = xmlToJson(change.oldXml);
	else block = workspace.getBlockById(change.blockId);
	
	if (!block) return ;
	
	/*
		For block that is in flyout , usually if there were no declare block existed 
		Object will be None 
		This affect UX a lot ! 
		Therefore , generate a fake name for it first 
	*/
	if (block.isInFlyout)
	{
		Blockly.Events.disable()
		block.getInput('MAIN').getField('NAME').setValue(block.type.split('-')[0]);
		Blockly.Events.enable()
		/*
			'-' syntax is for OOP block 
			'_' syntax is for non-OOP block
			Example : timer_repeat , network_send 
			Example : button-event , rfid-get
		*/
		
		
	}
	
	/*
		If a declare block is declared or deleted , its port is no longer belong 
	*/
	if ( (change.type == 'change'&&change.element=='disabled'&&change.newValue)||(change.type == 'delete'))
	{
		
		//if (change.newValue && block.self_disabled) block.self_enabled = false ;
		//if (change.oldValue && block.self_enabled) block.self_disabled = false ;
		if (block.type.includes('-declare'))
		{
			RemovePort(block.getFieldValue('PORT')  , block.id , this.workspace);
		}
	}
	if(change.type=='change'&&change.element=='disabled'&&((block.self_disabled == true&&block.self_enabled == true&&change.newValue)||(block.self_disabled==true&&block.self_enabled==true &&change.oldValue))) return  ; // avoid loop trap 
	
	/*
		Update available PORT list of every -declare block 
	*/
	var list_port_used = [];
	var list_declare_block = GetAllBlocksByKeywords(blocks,'-declare');
	for (var i = 0 ; i < list_declare_block.length ; i++)
	{
		if (!list_declare_block[i].disabled)
		{
			list_port_used.push( list_declare_block[i].getFieldValue('PORT'));
		}
		
	}
	var available_port_list = []
	for (var i = 0 ; i < PortList.length ; i++)
	{
		if (list_port_used.indexOf(PortList[i]) < 0 ) available_port_list.push( [PortList[i] , PortList[i] ] );
	}
	
	//Blockly.Events.disable();
	
	for (var i = 0 ; i < list_declare_block.length ; i++)
	{
		// Position of the PORT in the structure 
		var input = list_declare_block[i].getInput('MAIN');
		var pos = input.fieldRow.indexOf( list_declare_block[i].getField('PORT') );
		var curr = list_declare_block[i].getFieldValue('PORT');
		
		if (pos > 0)
		{
			Blockly.Events.disable();
			input.removeField('PORT');
			var dropdowm = new Blockly.FieldDropdown(available_port_list);
			input.insertFieldAt(pos , dropdowm , 'PORT');
			list_declare_block[i].getField('PORT').setValue(curr);
			list_declare_block[i].render();
			Blockly.Events.enable();
		}
		
	}
	//Blockly.Events.enable();
	
	/*
		Disable block that have duplicated port or name 
	*/
	Blockly.Events.disable();
	var list_name = [];
	var list_port = [];
	list_declare_block = GetAllBlocksByKeywords(blocks , '-declare') ; 
	for (var i = 0 ; i < list_declare_block.length ; i++)
	{
		
		var block = list_declare_block[i];
		
		if (block.disabled)
		{
			
			if (!list_name.contains(block.getFieldValue('NAME'))&&!list_port.contains(block.getFieldValue('PORT')))
			{
				block.setDisabled(false);
				list_name.push(block.getFieldValue('NAME'));
				list_port.push(block.getFieldValue('PORT'));
			}
			
		}
		else 
		{
			
			if (list_name.contains(block.getFieldValue('NAME'))||list_port.contains(block.getFieldValue('PORT')))
			{
				if (list_name.contains(block.getFieldValue('NAME'))&&!list_port.contains(block.getFieldValue('PORT')))
				{
					block.getField('NAME'),setValue(GenerateName(block.type.split('-')[0]) );
				}
				else 
				{
					block.setDisabled(true);
				}
			}
			else 
			{
			list_name.push(block.getFieldValue('NAME'));
			list_port.push(block.getFieldValue('PORT'));
			}
		}
		
		
	}
	
	Blockly.Events.enable();
	
}

/*


	NOT USED 


*/
var supported_module = ['Button','Buzzer','Digits','LCD','LED','Light','Moisture','Motion','Motor','Music','Potentiometer','Relay','Remote','RFID','RGB','Servo','Smoke','Sound','Stepper','Switch','WaterSensor','Weather','MPR121'];
var module_version = {};
for (var i = 0 ; i < supported_module.length ; i++)
{
	update_module_version(supported_module[i]);
}

function update_module_version( module )
{
	const Http = new XMLHttpRequest();
	const url='https://raw.githubusercontent.com/getblocky/blocky_firmware/master/ESP32/Firmware/lib/' + module + '.py';
	module_version[module] = '';
	Http.open("GET", url);
	Http.send();
	Http.onreadystatechange=(e)=>{
		var version = Http.responseText.split('\n')[0] ; 
		if (version.startsWith('#version'))
		{
			module_version[module] = version ; 
		}
		else 
		{
			module_version[module] = '';
		}
	}
}

function getLibraryVersion(module)
{
	return module_version[module];
}
