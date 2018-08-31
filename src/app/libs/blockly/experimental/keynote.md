

KEY NOTE FOR MAINTAIN
Blockly_Core 	contains Global Variable 
Pallette 		contains Color of all Block 

:: Method 
	:: Rules
		1 . Every port only have 1 device
			Each device may have many unique value
			For example , A button is use on Port 1
			But button have 9 push value and 9 hold value 
			Therefore
				:: When Creating New Block 
					:: Port 
						A list generator will check for
						avaiable port for the button 
						Condition is "either not used or is button"
					:: Time 
						A list generator will check for available option 
						This function use data in Device Data 
						
				:: When Delete A Block 
					:: Reclaiming 
						:: Port 
							The condition for reclaiming a block is 
							All the block that used this block must none exist 
							If true , then the port is reclaiming
						:: Option 
							The option is reclaiming immediate because of its unique
					:: Difficulty 
						1 . When a Block is deleted , it return an XML structure of the block 
							:: For Option 
								For option , it is easy to reclaim because JS can understand the xml structure 
							:: For Port
								For Port , you must read the whole workspace data to reclaim 
						2 . Function this.setOnChange is an universal 
							Every time WORKSPACE HAVE A CHANGE , this block is called 
							Therefore , you must check if the change mentioned that block or not
				:: When a Block is move or Ui 
					
		2 . BUGS .
			:: Deleting Block
				Whenever you delete a block , it will call an event that return the structure of the old block
				But , if the block you want to delete is the only of its kind , the event wont be trigger
				Until a new block of its kind is created
				Therefore , the block that is deleted , its data is lost , but the event return the default block anyway 
				What a bummer
				
				:: Solution 
					To counter this , block data is store in BlockyWorkSpace
					Every a change is made , it update here 
					When a block is deleted , used only its Ids and reference here 
		3 . ANNOY 
			:: Toolbox Blocks vs Workspace Block 
				When we create a block , we first choose the Block in the toolbo and drag to the workspace 
				In fact , this is what really happen 
				
				Block A is created
				Block A is move from (0,0) to (sth , sth)
				
				Block B is created
				Block B move from (sth,sth) to destination
				Block B then move to fit the grid 
				
				When an update occur , Block A will be deleted 
				
				So , Block A is fuck and Block B is normal , how to seperate ?
				:: Method 
					1 . When create occur , add the block to GlobalBlock
					2 . When a move occur , check the oldCoordinate
						if it is (0,0) then it is fuck
						else then it is normal 
					3 . if it is normal then do nothing
						if it is fuck then 
							count -= 1
							Using GlobalBlock[id] to access GlobalPort path then set to not using 
							