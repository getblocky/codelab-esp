goog.require('Blockly.Blocks');
goog.require('Blockly.Colours');
goog.require('Blockly.FieldTextInput');
goog.require('Blockly.FieldString');
goog.require('Blockly');


/*                      HELPER.BLOCKS                        */
Blockly.Blocks['pxt.dropdown.onoff'] = {
    init : function(){
        // this.setColour ( Toolbox_Control );
        this.appendDummyInput('M')
            .appendField(new Blockly.FieldDropdown([
                ['ON' , 'ON'],
                ['OFF' , 'OFF']
            ]),'STATE')
            ;
        this.setOutputShape(Blockly.OUTPUT_SHAPE_HEXAGONAL);
        this.setOutput(true,'Boolean');
        this.setOnChange(
            function (change){
                if (true){
                    Blockly.Events.disable();
                    if (this.getFieldValue('STATE') == 'ON'){
                        this.setColour('#22bd89')
                      
                    }
                    else {
                        this.setColour('#ddd6b3');
                    }
                    Blockly.Events.enable();
                }
            }
        );
    }
}
Blockly.Blocks['pxt.dropdown.timeselect'] = {
    init : function(){
        this.setColour ( '#ffffff'  );

        this.appendDummyInput('M')
            .appendField(new Blockly.FieldNumberDropdown(1000, [
                ['200 ms', '200'],
                ['500 ms', '500'],
                ['1 second', '1000'],
                ['5 seconds', '5000'],
                ['1 minutes', '60000']
            ]), 'TIME')
            ;
            
        this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
        this.setOutput(true,'Number');
    }
}
Blockly.Blocks['pxt.field.angle'] = {
    init : function(){
        // this.setColour ( Toolbox_Control );
        this.appendDummyInput('M')
            .appendField(new Blockly.FieldAngle( 90) ,'STATE')
            ;
        this.setOutputShape(Blockly.OUTPUT_SHAPE_HEXAGONAL);
        this.setOutput(true,'Number');
    }
}




/*                      INPUT.BUTTON                        */

Blockly.Blocks['pxt.button.onClick'] = {
    init:function(){
        this.blockType = 'event.unique';
        this.module = 'BUTTON';
        this.setColour(Toolbox_Input);
        this.appendDummyInput('MAIN')
            .appendField(png(this.module))

            .appendField(new Blockly.FieldDropdown(getListPort(this)),'PORT')
            .appendField('press')
            .appendField(new Blockly.FieldDropdown(CONST_LISTTIMES) , 'TIMES')
        ;
        this.appendStatementInput('CODE');
        this.setOnChange(function(change){changeHandle(this,change);});
    }
};
Blockly.Blocks['pxt.button.getState'] = {
    init : function (){
        this.blockType = 'set.normal';
        this.module = 'BUTTON';
        this.setColour(Toolbox_Input);
        this.setOutputShape(Blockly.OUTPUT_SHAPE_HEXAGONAL);
        this.setOutput(true,'Boolean');
        this.appendDummyInput('MAIN')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)) , 'PORT')
            .appendField('is')
            .appendField(new Blockly.FieldDropdown(
                [
                    ['pressed' , 'pressed'],
                    ['released' , 'released']
                ]
            ) , 'MODE')
        this.setOnChange(function(change){changeHandle(this,change);});
    }
}

/*                      INPUT.CLAP                        */
Blockly.Blocks['pxt.clap.onClap'] = {
    init:function(){
        this.blockType = 'event.unique';
        this.module = 'CLAP';
        this.setColour(Toolbox_Input);
        this.appendDummyInput('MAIN')
            .appendField(png(this.module))

            .appendField(new Blockly.FieldDropdown(getListPort(this)),'PORT')
            .appendField('clap')
            .appendField(new Blockly.FieldDropdown(CONST_LISTTIMES) , 'TIMES')
        ;
        this.appendStatementInput('CODE');
        this.setOnChange(function(change){changeHandle(this,change);});
    }
};


/*                      INPUT.POTENTIOMETER                        */
Blockly.Blocks['pxt.potentiometer.getValue'] = {
    init : function (){
        this.blockType = 'get.normal';
        this.module = 'POTENTIOMETER';
        this.setColour(Toolbox_Input);
        this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
        this.setOutput(true,'Number');
        this.appendDummyInput('MAIN')
            .appendField('read')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)) , 'PORT')
            // .appendField('get value')
            // .appendField(new Blockly.FieldDropdown(
            //     [
            //         ['percentage' , 'percentage'],
            //         ['analog' , 'analog']
            //     ]
            // ) , 'MODE')
        ;
        this.setOnChange(function(change){changeHandle(this,change);});
    }
}

/*                      INPUT.POTENTIOMETER                        */
Blockly.Blocks['pxt.weather.getValue'] = {
    init : function (){
        this.blockType = 'get.normal';
        this.module = 'WEATHER';
        this.setColour(Toolbox_Input);
        this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
        this.setOutput(true,'Number');
        this.appendDummyInput('MAIN')
            .appendField('read')
            // .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)) , 'PORT')
            // .appendField('get value')
            .appendField(new Blockly.FieldDropdown(
                [
                    ['temperature' , 'temperature'],
                    ['humidity' , 'humidity']
                ]
            ) , 'MODE')
        ;
        this.setOnChange(function(change){changeHandle(this,change);});
    }
}

/*                      INPUT.LIGHT                        */
Blockly.Blocks['pxt.light.getValue'] = {
    init : function (){
        this.blockType = 'get.normal';
        this.module = 'LIGHT';
        this.setColour(Toolbox_Input);
        this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
        this.setOutput(true,'Number');
        this.appendDummyInput('MAIN')
            .appendField('read')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)) , 'PORT')
            // .appendField('get value')
            // .appendField(new Blockly.FieldDropdown(
            //     [
            //         ['temperature' , 'temperature'],
            //         ['humidity' , 'humidity']
            //     ]
            // ) , 'MODE')
        ;
        this.setOnChange(function(change){changeHandle(this,change);});
    }
}

/*                      INPUT.MOTION                        */
Blockly.Blocks['pxt.motion.onDetect'] = {
    init:function(){
        this.blockType = 'event.unique';
        this.module = 'MOTION';
        this.setColour(Toolbox_Input);
        this.appendDummyInput('MAIN')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)),'PORT')
            .appendField('detect motion')
            // .appendField(new Blockly.FieldDropdown(CONST_LISTTIMES) , 'TIMES')
        ;
        this.appendStatementInput('CODE');
        this.setOnChange(function(change){changeHandle(this,change);});
    }
};

/*                      INPUT.DISTANCE                        */
Blockly.Blocks['pxt.distance.getValue'] = {
    init : function (){
        this.blockType = 'get.normal';
        this.module = 'DISTANCE';
        this.setColour(Toolbox_Input);
        this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
        this.setOutput(true,'Number');
        this.appendDummyInput('MAIN')
            .appendField('read')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)) , 'PORT')
            // .appendField('get value')
            // .appendField(new Blockly.FieldDropdown(
            //     [
            //         ['temperature' , 'temperature'],
            //         ['humidity' , 'humidity']
            //     ]
            // ) , 'MODE')
        ;
        this.setOnChange(function(change){changeHandle(this,change);});
    }
}

/*                      INPUT.MOISTURE                        */
Blockly.Blocks['pxt.moisture.getValue'] = {
    init : function (){
        this.blockType = 'get.normal';
        this.module = 'MOISTURE';
        this.setColour(Toolbox_Input);
        this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
        this.setOutput(true,'Number');
        this.appendDummyInput('MAIN')
            .appendField('read')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)) , 'PORT')
            // .appendField('get value')
            // .appendField(new Blockly.FieldDropdown(
            //     [
            //         ['temperature' , 'temperature'],
            //         ['humidity' , 'humidity']
            //     ]
            // ) , 'MODE')
        ;
        this.setOnChange(function(change){changeHandle(this,change);});
    }
}


/*                      INPUT.REMOTE                        */
Blockly.Blocks['pxt.remote.onPress'] = {
    init:function(){
        this.blockType = 'event.unique';
        this.module = 'REMOTE';
        this.setColour(Toolbox_Input);
        this.appendDummyInput('MAIN')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)),'PORT')
            .appendField('press button')
            // .appendField(new Blockly.FieldDropdown(CONST_LISTTIMES) , 'TIMES')
            .appendField(new Blockly.FieldDropdown([
                ['A','A'],
                ['B','B'],
                ['C','C'],
                ['D','D'],
            ]),'MODE')
        ;
        this.appendStatementInput('CODE');
        this.setOnChange(function(change){changeHandle(this,change);});
    }
};

/*                      OUTPUT.RELAY                        */
Blockly.Blocks['pxt.relay.setValue'] = {
    init : function(){
        this.blockType  = 'set.normal';
        this.module = 'RELAY';
        this.setColour(Toolbox_Output)
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendValueInput('MAIN')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)) , 'PORT')
            .appendField('turn')
            .setCheck('Boolean')
            ;
        this.setOnChange(function(change){changeHandle(this,change);});
    }
}

/*                      OUTPUT.BUZZER                        */
Blockly.Blocks['pxt.buzzer.setValue'] = {
    init : function(){
        this.blockType  = 'set.normal';
        this.module = 'BUZZER';
        this.setColour(Toolbox_Output)
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendValueInput('MAIN')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)) , 'PORT')
            .appendField('turn')
            .setCheck('Boolean')
            ;
        this.setOnChange(function(change){changeHandle(this,change);});
    }
}
Blockly.Blocks['pxt.buzzer.beep'] = {
    init : function(){
        this.blockType  = 'set.normal';
        this.module = 'BUZZER';
        this.setColour(Toolbox_Output)
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendValueInput('MAIN')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)) , 'PORT')
            .appendField('beep')
            .setCheck('Number')
            ;
        this.setOnChange(function(change){changeHandle(this,change);});
    }
}
Blockly.Blocks['pxt.buzzer.playMelody'] = {
    init : function(){
        this.blockType  = 'set.normal';
        this.module = 'BUZZER';
        this.setColour(Toolbox_Output)
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendDummyInput('MAIN')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)) , 'PORT')
            .appendField('play melody')
            // .setCheck('Boolean')
            .appendField(new Blockly.FieldDropdown([
                ['Happy birthday' , 'HAPPY_BIRTHDAY'],
                ['SONG1' , 'HAPPY_BIRTHDAY'],
                ['SONG2' , 'HAPPY_BIRTHDAY'],
                ['SONG3' , 'HAPPY_BIRTHDAY'],
            ]) , 'MELODY')
            ;
        this.setOnChange(function(change){changeHandle(this,change);});
    }
}
Blockly.Blocks['pxt.buzzer.playNote'] = {
    init : function(){
        this.blockType  = 'set.normal';
        this.module = 'BUZZER';
        this.setColour(Toolbox_Output)
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendDummyInput('MAIN')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)) , 'PORT')
            .appendField('play note')
            // .setCheck('Boolean')
            .appendField(new Blockly.FieldDropdown([
                ["Middle C" , "261"],
                ["Middle C#" , "277"],
                ["Middle D" , "293"],
                ["Middle D#" , "311"],
                ["Middle E" , "329"],
                ["Middle F" , "349"],
                ["Middle F#" , "369"],
                ["Middle G" , "392"],
                ["Middle G#" , "415"],
                ["Middle A" , "440"],
                ["Middle A#" , "466"],
                ["Middle B" , "493"],
                ["High C" , "523"],
                ["High C#" , "554"],
                ["High D" , "587"],
                ["High D#" , "622"],
                ["High E" , "659"],
                ["High F" , "698"],
                ["High F#" , "739"],
                ["High G" , "783"],
                ["High G#" , "830"],
                ["High A" , "880"],
                ["High A#" , "932"],
                ["High B" , "987"],
                ["Silent" , "0"]
            ]) , 'NOTE')
            .appendField('for')
            .appendField(new Blockly.FieldDropdown([
                ["4"	,	"3200"],
                ["2"	,	"1600"],
                ["1"	,	"800"],
                ["1/2"	,	"400"],
                ["1/4"	,	"200"],
                ["1/8"	,	"100"],
                ["1/16"	,	"50",]
            ]),'BEAT')
            .appendField('beats')
            ;
        this.setOnChange(function(change){changeHandle(this,change);});
    }
}
Blockly.Blocks['pxt.buzzer.playFrequency'] = {
    init : function(){
        this.blockType  = 'set.normal';
        this.module = 'BUZZER';
        this.setColour(Toolbox_Output)
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendValueInput('MAIN')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)) , 'PORT')
            .appendField('play frequency')
            .setCheck('Number')
            ;
        this.appendDummyInput('hz');
        this.setOnChange(function(change){changeHandle(this,change);});
    }
}

/*                      OUTPUT.PIXEL                        */
Blockly.Blocks['pxt.pixel.setColour'] = {
    init : function(){
        this.blockType  = 'set.normal';
        this.module = 'PIXEL';
        this.setColour(Toolbox_Output)
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendValueInput('MAIN')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)) , 'PORT')
            .appendField('turn')
            .setCheck(['Colour' , 'Number' , 'Boolean'])
            ;
        this.appendDummyInput('hz');
        this.setOnChange(function(change){changeHandle(this,change);});
    }
}

/*                      OUTPUT.INFRARED                        */
Blockly.Blocks['pxt.infrared.learn'] = {
    init : function(){
        this.blockType  = 'set.normal';
        this.module = 'INFRARED';
        this.parentBlock = ['pxt.button.onClick'];
        this.childBlock = ['text'];
        this.setColour(Toolbox_Output)
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendValueInput('MAIN')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)) , 'PORT')
            .appendField('learn command as')
            .setCheck(['String'])
            ;
        this.setOnChange(function(change){changeHandle(this,change);});
    }
}
Blockly.Blocks['pxt.infrared.send'] = {
    init : function(){
        this.blockType  = 'set.normal';
        this.module = 'INFRARED';
        // this.parentBlock = ['pxt.button.onClick'];
        this.childBlock = ['text'];
        this.setColour(Toolbox_Output)
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        
        this.appendValueInput('MAIN')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)) , 'PORT')
            .appendField('send command')
            .setCheck(['String'])
            ;
        this.setOnChange(function(change){changeHandle(this,change);});
    }
}


/*                      OUTPUT.SERVO                        */
Blockly.Blocks['pxt.servo.setAngle'] = {
    init : function(){
        this.blockType  = 'set.normal';
        this.module = 'SERVO';
        // this.parentBlock = ['pxt.button.onClick'];
        // this.childBlock = ['text'];
        this.setColour(Toolbox_Output)
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendValueInput('MAIN')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)) , 'PORT')
            .appendField('set angle to')
            .setCheck(['Number'])
            ;
        this.setOnChange(function(change){changeHandle(this,change);});
    }
}


/*                      DISPLAY.LCD                        */
Blockly.Blocks['pxt.lcd.backlight'] = {
    init : function(){
        this.blockType  = 'set.normal';
        this.module = 'LCD';
        // this.parentBlock = ['pxt.button.onClick'];
        // this.childBlock = ['text'];
        this.setColour(Toolbox_Display)
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendValueInput('MAIN')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)) , 'PORT')
            .appendField('turn backlight')
            .setCheck(['Boolean'])
            ;
        this.setOnChange(function(change){changeHandle(this,change);});
    }
}
Blockly.Blocks['pxt.lcd.clear'] = {
    init : function(){
        this.blockType  = 'set.normal';
        this.module = 'LCD';
        // this.parentBlock = ['pxt.button.onClick'];
        // this.childBlock = ['text'];
        this.setColour(Toolbox_Display)
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendDummyInput('MAIN')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)) , 'PORT')
            .appendField('clear')
            // .setCheck(['Boolean'])
            .appendField(new Blockly.FieldDropdown([
                ['LINE1' , 'LINE1'],
                ['LINE2' , 'LINE2']
            ]))
            ;
        this.setOnChange(function(change){changeHandle(this,change);});
    }
}
Blockly.Blocks['pxt.lcd.display'] = {
    init : function(){
        this.blockType  = 'set.normal';
        this.module = 'LCD';
        // this.parentBlock = ['pxt.button.onClick'];
        // this.childBlock = ['text'];
        this.setColour(Toolbox_Display)
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendDummyInput('MAIN')
            .appendField(png(this.module))
            .appendField(new Blockly.FieldDropdown(getListPort(this)) , 'PORT')
            .appendField('display on')
            .appendField(new Blockly.FieldDropdown([
                ['LINE1' , 'LINE1'],
                ['LINE2' , 'LINE2']
            ]))
            ;
        this.appendValueInput('LEFT')
            // .setCheck(['Boolean'])
            .setCheck(['Number','Boolean','String'])
            ;
            
        this.appendValueInput('RIGHT')
            // .setCheck(['Boolean'])
            .setCheck(['Number','Boolean','String'])
            ;

        this.setOnChange(function(change){changeHandle(this,change);});
    }
}


/*                      NETWORK                        */
Blockly.Blocks['pxt.blynk.onReceive'] = {
    init : function (){
        this.blockType = 'event.unique'
        this.setColour(Toolbox_Blynk);
        this.appendDummyInput('MAIN')
            .appendField(png('BLYNK'))
            .appendField('when receive from ')
            .appendField(new Blockly.FieldDropdown(BLYNK_SUPPORTED_CHANNELS) , 'CHANNEL')
            ;
        this.appendStatementInput('CODE');
        this.setOnChange(function(change){changeHandle(this,change);});
    }
};
Blockly.Blocks['pxt.blynk.onRequest'] = {
    init : function (){
        this.blockType = 'event.unique'
        this.setColour(Toolbox_Blynk)
        this.appendDummyInput('MAIN')
        .appendField(png('BLYNK'))
            .appendField('when get request from ')
            .appendField(new Blockly.FieldDropdown(BLYNK_SUPPORTED_CHANNELS) , 'CHANNEL')
            ;
        this.appendStatementInput('CODE');
        this.appendValueInput('VALUE')
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField('send back')
            ;
        this.setOnChange(function(change){changeHandle(this,change);});
    }
};
Blockly.Blocks['pxt.blynk.virtualWrite'] = {
    init : function (){
        this.blockType = 'set.normal'
        this.setColour(Toolbox_Blynk);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendValueInput('MAIN')
            .appendField(png('BLYNK'))
            .appendField('send to')
            .appendField(new Blockly.FieldDropdown(BLYNK_SUPPORTED_CHANNELS) , 'CHANNEL')
            .appendField(new Blockly.FieldDropdown([['APP','APP']]) , 'DEST')
            ;
        this.setOnChange(function(change){changeHandle(this,change);});

    }
};
Blockly.Blocks['pxt.blynk.notify'] = {
    init : function (){
        this.blockType = 'set.normal';
        this.setColour(Toolbox_Blynk);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendValueInput('MAIN')
            .appendField(png('BLYNK'))
            .appendField('notify')
            // .appendField(new Blockly.FieldDropdown(BLYNK_SUPPORTED_CHANNELS) , 'CHANNEL')
            // .appendField(new Blockly.FieldDropdown(['APP','APP']) , 'DEST')
            ;
        this.setOnChange(function(change){changeHandle(this,change);});
    }
};
Blockly.Blocks['pxt.blynk.email'] = {
    init : function (){
        this.blockType = 'set.normal';
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(Toolbox_Blynk);
        this.appendValueInput('EMAIL')
            .appendField(png('BLYNK'))
            .appendField('email to') 
            // .appendField(new Blockly.FieldDropdown(BLYNK_SUPPORTED_CHANNELS) , 'CHANNEL')
            // .appendField(new Blockly.FieldDropdown(['APP','APP']) , 'DEST')
            ;
        this.appendValueInput('SUBJECT').appendField('with subject');
        this.appendValueInput('CONTENT');
            // .appendField('with content')
            // .appendField(new Blockly.FieldArgumentEditor('My Content') , 'CONTENT');
        this.inputsInline = false;
        this.setOnChange(function(change){changeHandle(this,change);});
    }
};
Blockly.Blocks['pxt.blynk.log'] = {
    init : function (){
        this.blockType = 'set.normal';
        this.setColour(Toolbox_Blynk);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendValueInput('MAIN')
            .appendField(png('BLYNK'))
            .appendField('log')
            // .appendField(new Blockly.FieldDropdown(BLYNK_SUPPORTED_CHANNELS) , 'CHANNEL')
            // .appendField(new Blockly.FieldDropdown(['APP','APP']) , 'DEST')
            ;
        this.setOnChange(function(change){changeHandle(this,change);});
    }
};
Blockly.Blocks['pxt.blynk.getMessage'] = {
    init : function (){
        this.blockType = 'get.normal';
        this.setColour(Toolbox_Blynk);
        this.setOutput(true,['Number','String'])
        this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
        this.parentBlock = ['pxt.blynk.onRequest','pxt.blynk.onReceive'];
        this.appendDummyInput('MAIN')
            .appendField(png('BLYNK'))
            .appendField('message')
            // .appendField(new Blockly.FieldDropdown(BLYNK_SUPPORTED_CHANNELS) , 'CHANNEL')
            // .appendField(new Blockly.FieldDropdown(['APP','APP']) , 'DEST')
            ;
        this.setOnChange(function(change){changeHandle(this,change);});
    }
};

/*                      TIMER                        */
// Blockly.Blocks['pxt.timer.createTask'] = {
//     init : function(){
//         this.blockType = 'event.unique';
//         this.setColour(Toolbox_Timer);
//         this.appendValueInput('MAIN')
//             .appendField('Every')
//             ;
//         this.appendStatementInput('CODE');
//         this.setOnChange(function(change){changeHandle(this,change);});
//     }
// };

Blockly.Blocks['pxt.timer.createTask'] = {
    init: function() {
        this.blockType = 'event.unique';
        this.setColour(Toolbox_Timer);
        //this.setOutput(true,'Number')
        // this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);

        this.appendDummyInput('MAIN')
            .appendField('Every')
            .appendField(new Blockly.FieldNumberDropdown(1000, [
                ['200 ms', '200'],
                ['500 ms', '500'],
                ['1 second', '1000'],
                ['5 seconds', '5000'],
                ['1 minutes', '60000']
            ]), 'TIME')
            .appendField('ms');
        this.appendStatementInput('CODE');
        this.setOnChange(function(change){changeHandle(this,change);});

    }
};
Blockly.Blocks['pxt.timer.wait'] = {
    init : function(){
        this.setColour(Toolbox_Timer);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendValueInput('MAIN')
            .appendField('wait')
            .setCheck('Number')
        ;
        this.appendDummyInput('DUMMY').appendField('ms');
        this.setOnChange(function(change){changeHandle(this,change);});
    }
}
Blockly.Blocks['pxt.timer.runtime'] = {
    init : function (){
        this.setColour(Toolbox_Timer);
        this.setOutput(true,'Number');
        this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
        this.appendDummyInput('MAIN')
            .appendField('runtime in')
            .appendField(new Blockly.FieldDropdown([
                ["miliseconds" , "ms"],
                ["seconds" ,"s"],
                ['minutes' , 'm'],
                ['hours' , 'h']
            ]))
            ;
    }
}
