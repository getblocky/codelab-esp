goog.require('Blockly');


/*
    pxt.portDeclare
    pxt.widgetDeclare
    
    pxt.button.onPush


    pxt_getListPort(MODULE_TYPE , obj ( optional ))
    pxt_getListWidget(WIDGET_TYPE , obj , optional))


    API :
        Please follow this api to make life easier for you.

    1. Block attribute.
    this.blockType = 
        'event' -> this block will be unique, it will be disabled if the same block exist elsewhere.
        

*/

// can't use font awesome, must use svg, too lazy, let's use github cdn :))
png = function(name){
    var field = new Blockly.FieldImage('https://raw.githubusercontent.com/curlyz/codelab-esp-pngelement/master/png/' + name + '.png' , 
    name.length * 16 , 40);
    return field;
}
 
function generateDropdown(content){
    var dropdown = [];
    for (var index = 0 ; index < content.length ; index ++){
        dropdown.push([content[index],content[index]]);
    }
    return dropdown;
}

getListPort = function(obj){
    var listPort = ['PORT1','PORT2','PORT3','PORT4'];
    return generateDropdown(listPort);
}

var routeCount = 0;
changeHandle = function(obj,change){
    routeCount += 1 ;
    console.info('route' , routeCount);
};