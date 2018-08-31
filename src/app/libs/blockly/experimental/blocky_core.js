



/*
	This is the metadata of the whole code . 
	This is the rules . 
		1 . For every port , there is only one device . 
		2 . For each port , which is each device , there are a limited option , these option must be store in here 
			For example 
				Button at D1 can have 10 push , 10 hold
				Same for D2 
		3 . 
	
	
*/
var DefaultPort = [ ['B1','B1'],['B2','B2'],['B3','B3'],['B4','B4'],['A1','A1'],['A2','A2'],['A3','A3'],['A4','A4'] ]
// Only support 8 pieces here 
var GlobalFunctionName = [];
function isFunctionNameExist(name){
	for (var i = 0 ; i < GlobalFunctionName.length ; i++){if (GlobalFunctionName[i]===name) return true;}
	return false ;
}
var random_number = 0;
function getRandomNumber(){random_number +=1 ; return random_number;}






var TempBlock = [] ;
var LastBlockSelected = [];
// This is use as bug counter 

function AddToSection(section , code)
{
	if (Blockly.Python.definitions_[section].indexOf(code)==-1)
	{
		Blockly.Python.definitions_[section]+=code;
	}
		
}


// ------------------------------------------------------------------------
var GlobalModuleName = {};

function RemoveModulename(module , name){
	for (var i=0;i<GlobalModuleName[module].length;i++)
	{
		if (GlobalModuleName[module][i] == name) { GlobalModuleName[module].pop(i) ; break;}
	}
}
function AddModuleName(module , name){
	for (var i = 0 ; i < GlobalModuleName[module].length ; i++)
	{
		if (GlobalModuleName[module][i] === name) return ;
	}
	GlobalModuleName[module].push(name);
	console.log(GlobalModuleName);
}
function GetListModule(module){
	var list = [];
	for (var i = 0 ; i < GlobalModuleName[module] ; i ++)
	{
		list.push( [GlobalModuleName[module][i],GlobalModuleName[module][i]] );		
	}
	if (list.length==0) list.push(['None','None']);
	console.log(list);
	return list ;
	
}

function GetUniqueName(module){
	var object = '';
	if (GlobalModuleName[module] == null) GlobalModuleName[module] = [];


	for (var i = 1 ; i < 100 ; i ++)
	{
		duplicate = false ;
		var name = module + String(i);
		for (var u = 0; u < GlobalModuleName[module].length;u++)
		{
			if (GlobalModuleName[module][u] == name ) {duplicate = true ; break;}
		}
		if (duplicate == false)
		{
			object = name ; break ;
		}
		
	}

	
	AddModuleName(module , object);
	return object;
	
}


