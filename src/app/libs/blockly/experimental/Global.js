//var PortList = ['A1','A2','A3','A4','D1','D2','D3','D4'];
var PortList = ['A1','A2','A3','A4','D1','D2','D3','D4'];
var LastDeleteBlockId = null ;
var Global = {};
// For workaround multiple delete event ;
//________________________GLOBAL DATA __________________
/*
	There is a bug on BLocks delete 
	In Blocky , we need to retrieve port that is not used 
	But the callback of the delete (event.oldXml) is not accurate
	Therefore , we use Global variable
	To handle every block  created or deleted
	Just to retrieve back data
	This will be update when 
		delete , change , create 
	Update : Now uses parser from xml to json 
*/



//------------------------------------------------------


//________________________GLOBAL PORT __________________
/*
	Blocky has 8 Port , each port can only be used by 1 object
*/
Global['port'] = [];

for (var i = 0 ; i < PortList.length ; i ++)
{
	//Global['port'][String(PortList[i])] = ['none' , 'none'];console.warn('rese');
	Global['port'].push( [PortList[i],'none','none'] );
}
Global['name'] = [];

function GeneratePortList (port=null)
{
	var list = [];
	/*
	for (var i = 0 ; i < PortList.length ; i ++)
	{
		if (Global['port'][PortList[i]][0] == 'none' || test==true)
		list.push ( [PortList[i] , PortList[i]] );
	}
	console.warn('here' ,list[0][0],NameExist(list[0][0]),list_name());
	if (PortUsed(list[0][0]))
	{
		console.warn('generate new list');
		for (var i = 0 ; i < list.length ; i ++)
		{
			if (!PortUsed(list[i][0]))
			{
				var temp = list[0];
				list[0] = list[i];
				list[i] = temp ;
				break ;
			}
		}
	}
	console.log(list);
	*/
	for (var i = 0 ; i <PortList.length ; i++)
	{
		if (Global['port'][i][1] == 'none')//Global['port'][i][1] == 'none')
		{
			list.push(  [Global['port'][i][0],Global['port'][i][0]] );
		}
	}
	
	if (port )
	{
		for (var i = 0 ; i < list.length ; i++)
		{
			if (list[i][0] == port)
			{
				var temp  = list[0];
				list[0] = list[i];
				list[i] = temp;
				break ;
				
			}
			
		}
		
	}
	

	//list = [['a','a']];
	return list ;
}
function AddPort(port,module,id)
{
	//if (PortUsed(port)) return ;
	for (var i=0 ; i < Global['port'].length ; i++)
	{
		
		if (Global['port'][i][1] == 'none'&&Global['port'][i][0] == port) 
		{
			for (var i = 0 ; i < Global['port'].length ; i++)
			{
				if (Global['port'][i][2] == id) return ;
			}
			Global['port'][i] = [port , module , id];
			console.log('add port' , port , module , id.substring(0,3),Global['port'][port]);
			break ;
		}
	}
	/*
	Global['port'][port] = [module , id];
	*/
	
	
}
function PortUsed(b){
	/*
	var result = null ;
	var portlist = Global['port'];console.log(portlist['A']);
	if (Global['port'][b][0] == 'none') result = false ;
	else result = true ;
	console.log('check port ',b ,Global['port'],Global['port'].b, Global['port'][String(b)] ,result)
	*/
	/*
	console.log(i++, Global['port'].toString());
	for (port in Global['port'])
	{
		console.log(i++, Global['port'][b][0].toString());
		//console.log(port,Global['port'][port]);console.log(Global['port']);
	}
	
	return false ;
	*/
	var result = false ;
	for (var i = 0 ; i < Global['port'].length ; i++)
	{
		//console.log('readl' , Global['port'][i][0].toString(),Global['port'][i][1].toString(),b);
		if (Global['port'][i][0] == b && Global['port'][i][1] != 'none')
		{
			//console.log('readl' , Global['port'][i][1].toString());
			result = true ;break ;
		}
	}
	console.log('check port used' , result ,b,Global['port']);
	return result;
}
function RemovePort(port , id,workspace){
	console.log('remove try',port,id.substring(0,3),Global['port']);
	/*
	if (Global['port'][port][1] == id )
	{
		Global['port'][port] = ['none' , 'none' ] ;
		
		
	}
	*/
	if (workspace == null ) return ;
	if (workspace.getBlockById(id) == null) return ;
	if (workspace.getBlockById(id).isInFlyout == false )
	{
		for (var i = 0 ; i < Global['port'].length ; i++)
		{
			if (Global['port'][i][0] == port && Global['port'][i][2] == id)
			{
				console.log('remove port',port,id.substring(0,3));
				Global['port'][i][2] = 'none' ;Global['port'][i][1] = 'none' ;
				break ;
			}
		}
	}
	
}
function AddName(type , name , id , workspace )
{
	
	if (workspace == null || (workspace.getBlockById(id)!=null &&workspace.getBlockById(id).isInFlyout == false ))
	{
		if (NameExist(name)) return ;
		Global['name'].push( [name,type,id] );
		console.log('add name',name,type,id.substring(0,3),list_name());
	}
}
function RemoveName(type , name , id,workspace)
{
	
	//console.log('remove_sate' , type , name , id , Global['name']);
	if (workspace.getBlockById(id).isInFlyout == false )
	{
		for (var i = 0 ; i < Global['name'].length;i++)
		{
			if (Global['name'][i][0] == name && Global['name'][i][1] == type && Global['name'][i][2] ==id){
				Global['name'].splice(i,1);
				console.log('remove ',name,type,id.substring(0,5),list_name());
				break ;
			}
		}
	}
}
function RemoveNameOfType(type)
{
	for (var i =  Global['name'].length -1 ; i >= 0 ; i--)
	{
		if (Global['name'][i][1] == type)
		{
			Global['name'].splice(i,1);
		}
	} 
}
function NameExist(name)
{
	for (var i = 0 ; i < Global['name'].length ;i++)
	{
		if (Global['name'][i][0] == name) return true ;
	}
	return false ;
	
}
function GenerateName(name,use = false,id=null,swap = false)
{
	if (!NameExist(name)){
		if (use){ AddName('function',name,id);}
		return name ;
	}
	var temp = '';
	for (var i = 1 ; i < 1000000000000000 ; i ++)
	{
		temp = name + String(i)  ;
		if (NameExist(temp)==true) continue;
		if (use){ AddName('function',temp,id);}
		return temp;
	}
}

function GenerateListName(type,name = null){
	var list = [] ;
	for (var i = 0 ; i < Global['name'].length;i++)
	{
		if (Global['name'][i][1] == type)
		{
			list.push( [Global['name'][i][0],Global['name'][i][0]] );
		}
		
	}
	
	if (!list.length) return [[type,type]];
	if (name)
	{
		for (var i =  0 ; i < list.length ;i++)
		{
			if (list[i][0] == name)
			{
				var temp = list [0] ;
				list[0] = list[i];
				list[i] = temp ;
				break;
			}
		}
		
	}
	return list ;
}

function GetField(name , obj){
	if (!obj) return ;
	for (var i = 0 ; i < obj.FIELD.length;i++)
	{
		if (obj.FIELD[i]['name'] == name) return obj['FIELD'][i]['#text'] ;
	}
}
function list_name()
{
	var list = [];
	for (var i = 0 ; i < Global['name'].length ; i++)
	{
		list.push ( Global['name'][i][0] );
	}
	return list;
}
//------------------------------------------------------

//________________________GLOBAL NAME __________________
/*
	There is a bug on BLocks delete 
	In Blocky , we need to retrieve port that is not used 
	But the callback of the delete (event.oldXml) is not accurate
	Therefore , we use Global variable
	To handle every block  created or deleted
	To handle every block  created or deleted
	Just to retrieve back data
	This will be update when 
		delete , change , create 
	
*/
//-----------------

function removeItem(array, item){
    for(var i in array){
        if(array[i]==item){
            array.splice(i,1);
            break;
        }
    }
}

//________________________ DISABLED BLOCK __________________
var GlobalDisabledBlocks = [];

function AddDisabledBlock(id){
	GlobalDisabledBlocks.push(id);	
}
function RemoveDisabledBlock(id){
	removeItem(GlobalDisabledBlocks , id)
}
function ListDisabledBlock(){
	return GlobalDisabledBlocks;
}


//---------------------------------------------------------------------


////Changes XML to JSON
function xmlToJson(xml) {
	
	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj[attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
};

Array.prototype.swap = function (x,y) {
  var b = this[x];
  this[x] = this[y];
  this[y] = b;
  return this;
}

function GetAllBlocksByType(ListBlock,type)
{
	var list = [];
	for (var i = 0 ; i < ListBlock.length ; i++)
	{
		if (ListBlock[i].type == type)list.push(ListBlock[i]);
	}
	return list ;
	
}
function GetAllBlocksByKeywords(ListBlock,typeblock)
{
	var list = [];
	for (var i = 0 ; i < ListBlock.length ; i++)
	{
		if (ListBlock[i].type.includes(typeblock))list.push(ListBlock[i]);
	}
	return list ;
	
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}