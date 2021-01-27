$.loadcsv = {

    decleareArrays: function(pm,data){
        var that = this;
        var res = [];
        for (var i=0; i<data.length; i++) {
            if (data[i] == '') break;
            res[i] = data[i].split(',');
            for (var j=0; j<res[i].length; j++) {
                res[i][j] = res[i][j].replace(/(^\s+)|(\s+$)/g,"");
                if (pm.parse_float) res[i][j] = that.parseNum(res[i][j]);
                if (pm.lower_bool) res[i][j] = that.toLowerBool(res[i][j]);
            }
        }
        return res;
    },

    toBoolean: function(val){
        return val === 'true' || val === true? true : false;
    },

    parseNum: function(val){
        return typeof val === 'string' && !!val && !Number.isNaN(+val) && val.indexOf('0x') < 0? parseFloat(val) : val;
    },

    toLowerBool: function(val){
        return typeof val === 'string'? val == 'TRUE'? true : val == 'FALSE'? false : val : val;
    },

    toObject: function(array,key_num){
        var obj = {};
        for (var i=1; i<array.length; i++) {
            obj[array[i][key_num]] = {};
            for (var j=0; j<array[i].length; j++) obj[array[i][key_num]][array[0][j]] = array[i][j];
        }
        return obj;
    },

    debugLog: function(pm){
        var that = this;
        var f = TYRANO.kag.stat.f,
            tf = TYRANO.kag.variable.tf,
            sf = TYRANO.kag.variable.sf,
            mp = TYRANO.kag.stat.mp;
        if (pm.log) {
            console.log('variable: ' + pm.var);
            console.log(eval(pm.var));
        }
    }
}



tyrano.plugin.kag.tag.loadcsv = {

    vital: ['src'],

    pm: {
        var: 'tf.loaded_csv',
        time: '10',
        log: 'false',
        parse_float: 'true',
        lower_bool: 'true',
        to_object: 'false',
        key_num: '0'
    },

    start: function(pm){

        var that = $.loadcsv;
        var f = TYRANO.kag.stat.f,
            tf = TYRANO.kag.variable.tf,
            sf = TYRANO.kag.variable.sf,
            mp = TYRANO.kag.stat.mp;

        if (!pm.src) {
            console.error('[ERROR] The CSV file is not specified correctly');
            return false;
        }
        if (parseInt(pm.time) == 0) {
            console.warn('[WARNING] time cannot be a number less than or equal to 0 (re-set the time to 10)');
            pm.time = 10;
        }

        pm.parse_float = that.toBoolean(pm.parse_float);
        pm.lower_bool = that.toBoolean(pm.lower_bool);
        pm.log = that.toBoolean(pm.log);
        pm.to_object = that.toBoolean(pm.to_object);
        pm.key_num = parseInt(pm.key_num);

        var url = './data/others/' + pm.src;
        $.get(url, function(data){
            data = data.split("\n");
            setTimeout(function(){
                var array = that.decleareArrays(pm,data);
                if (pm.to_object) {
                    var obj = that.toObject(array,pm.key_num);
                    eval(pm.var + '= obj');
                } else {
                    eval(pm.var + '= array');
                }
                that.debugLog(pm);
                TYRANO.kag.ftag.nextOrder();
            }, parseInt(pm.time));
        });
    }
};



tyrano.plugin.kag.tag.loadcsv_xmlhttp = {

    vital: ['src'],

    pm: {
        var: 'tf.loaded_csv',
        time: '10',
        log: 'false',
        parse_float: 'true',
        lower_bool: 'true',
        to_object: 'false',
        key_num: '0'
    },

    start: function(pm){

        var that = $.loadcsv;
        var f = TYRANO.kag.stat.f,
            tf = TYRANO.kag.variable.tf,
            sf = TYRANO.kag.variable.sf,
            mp = TYRANO.kag.stat.mp;

        if (!pm.src) {
            console.error('[ERROR] The CSV file is not specified correctly');
            return false;
        }

        pm.parse_float = that.toBoolean(pm.parse_float);
        pm.lower_bool = that.toBoolean(pm.lower_bool);
        pm.log = that.toBoolean(pm.log);
        pm.to_object = that.toBoolean(pm.to_object);
        pm.key_num = parseInt(pm.key_num);

        var array = (function(){
            var url = './data/others/' + pm.src;
            var a, arr = [];
            var txt = new XMLHttpRequest();
            txt.open('get', url, false);
            txt.send();
            arr = txt.responseText.split('\n');
            var res = [];
            for(var i=0; i<arr.length; i++){
                if(arr[i] == '') break;
                res[i] = arr[i].split(',');
                for(var j=0; j<res[i].length; j++){
                    res[i][j] = res[i][j].replace(/(^\s+)|(\s+$)/g,"");
                    if (pm.parse_float) res[i][j] = that.parseNum(res[i][j]);
                    if (pm.lower_bool) res[i][j] = that.toLowerBool(res[i][j]);
                }
            }
            return res;
        }());

        if (pm.to_object) {
            var obj = that.toObject(array,pm.key_num);
            eval(pm.var + '= obj');
        } else {
            eval(pm.var + '= array');
        }
        that.debugLog(pm);

        this.kag.ftag.nextOrder();

    }

};



(function(tag_names){
    tag_names.forEach(function(tag_name){
        tyrano.plugin.kag.ftag.master_tag[tag_name] = object(tyrano.plugin.kag.tag[tag_name]);
        tyrano.plugin.kag.ftag.master_tag[tag_name].kag = TYRANO.kag;
    });
}(['loadcsv','loadcsv_xmlhttp']));
