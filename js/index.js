
$().ready(function () {
    /*echarts*/
    //获取行业
    var proCode='000000';
    //全国
    $.get('json/china.json', function (mapJson) {
        echarts.registerMap('china', mapJson);
        var chart = echarts.init(document.getElementById('china_map')); //在id为mainMap的dom元素中显示地图
        var option;
        //储存时间的json数组
        var timeData = []
        $('#areaCode').val('');
        $('#industry').val($('.industry option:selected').attr('id'));
        $('#indexName').val($('.indexName option:selected').val())
        showChina(mapJson,'china');
        //点击省份 显示排名 等
        var areaCode, targetTime, time, selectArea;
        chart.on('click', function (proData) {
            // console.log(1)
            // 取消上次延时未执行的方法
            clearTimeout(time);
            //执行延时
            time = setTimeout(function () {
                // console.log(proData);
                //判断如果单击的是地图
                if (proData.componentSubType == "map") {
                    //通过地区的名称来获取地区的行政代码
                    var proName = proData.name;
                    for (var i = 0; i < treeData.area.length; i++) {
                        if (treeData.area[i].text == proName) {
                            areaCode = treeData.area[i].id;
                            break;
                        }
                        //获取市的行政代码
                        if (i >= 31) {
                            // console.log(1);
                            for (var j = 1; j < treeData.area.length; j++) {
                                for (var m = 0; m < treeData.area[j]['children'].length; m++) {
                                    if (treeData.area[j]['children'][m]['text'] == proName) {
                                        areaCode = treeData.area[j]['children'][m]['id']
                                    }
                                }
                            }
                            //获取县的行政代码
                            if (j >= 32) {
                                var countyDom = document.getElementById('china_map');
                                var currentMap = echarts.getInstanceByDom(countyDom).getOption().series[0].map;//邯郸市
                                var currentMapObject = echarts.getMap(currentMap);//ben
                                // var areaCode = null;
                                currentMapObject.geoJson.features.forEach(function (data) {
                                    if (data.properties.name == proName) { areaCode = data.id }
                                });
                            }
                        }
                    }
                    //配置timeLine 显示最开始时期
                    if (!targetTime) {
                        if ($('.indexName option:selected').val() == 'vaabs') {
                            targetTime = '2007-01-31'
                        } else if ($('.indexName option:selected').val() == 'vayoy') {
                            targetTime = '2008-01-31'
                        }
                        orderByPro(targetTime, areaCode);
                        return
                    }else{
                        if($('.indexName option:selected').val() == 'vayoy'&&targetTime.substring(3,1)<8){
                            orderByPro('2008-01-31', areaCode);
                        }else{
                            orderByPro(targetTime,areaCode)
                        }
                    }
                    
                }
            }, 300);
        })
        //时间轴改变时
        chart.on('timelinechanged', function (timeChangeData) {
            // if(timeChangeData)
            targetTime = timeData[timeChangeData.currentIndex]
            if (areaCode) {
                orderByPro(targetTime, areaCode);
            }
        })
        //下钻到省/市
        chart.on('dblclick', function (result) { //回调函数，点击时触发，参数params格式参加官方API
            //取消上次延时未执行的方法  解决双击触发单击效果问题
            clearTimeout(time);
            console.log(result);
            if (result.componentSubType != "map") {
                return
            }
            selectArea = result.name;

            var path = cityGeoMapping[selectArea];
            //调取本地地图数据
            $.get(path, function (Citymap) {
                // console.log(Citymap);
                echarts.registerMap(selectArea, Citymap);
                var chart = echarts.init(document.getElementById('china_map'));
                //获取点击省份/市的Code
                // var proCode;
                for (var i = 0; i < treeData.area.length; i++) {
                    if (treeData.area[i].text == selectArea) {
                        proCode = treeData.area[i].id;
                        break;
                    }
                    //获取市的行政代码
                    if (i >= 31) {
                        // console.log(1);
                        for (var j = 1; j < treeData.area.length; j++) {
                            for (var m = 0; m < treeData.area[j]['children'].length; m++) {
                                if (treeData.area[j]['children'][m]['text'] == selectArea) {
                                    proCode = treeData.area[j]['children'][m]['id']
                                    break;
                                }
                            }
                        }
                        //获取县的行政代码  使用了本地地图数据
                        if (j >= 32) {
                            var countyDom = document.getElementById('china_map');
                            var currentMap = echarts.getInstanceByDom(countyDom).getOption().series[0].map;//邯郸市
                            var currentMapObject = echarts.getMap(currentMap);//ben
                            // var areaCode = null;
                            currentMapObject.geoJson.features.forEach(function (data) {
                                if (data.properties.name == selectArea) {
                                    proCode = data.id 
                                }
                            });
                        }
                    }
                }
                $('#areaCode').val(proCode);
                $('#industry').val($('.industry option:selected').attr('id'));
                $('#indexName').val($('.indexName option:selected').val())
                // $('#date').val(date);
                var secFromData = $('#form').serialize();
                // console.log(secFromData);
                var timeData = [];
                var proIndex = {
                    url: url + '/finddata',
                    data: secFromData,
                    success: function (result) {
                        //时间数据
                        for (var i = 0; i < result.length; i++) {
                            var timeFromAfter = result[i].series.date;
                            timeData.push(timeFromAfter);
                        }
                        console.log(result);
                        var proOption = {
                            baseOption: {
                                visualMap: {
                                    type: 'continuous',
                                    max: 30000000,
                                    min: 0,
                                    bottom: '10%',
                                    itemWidth: 20,
                                    itemHeight: 140,
                                    show: true,
                                    calculable: true,
                                    inRange: {
                                        // color: ['yellow','lightskyblue', 'orangered']
                                    }
                                },
                                timeline: {
                                    axisType: 'category',
                                    data: timeData,
                                    //默认选择第几项
                                    // currentIndex:,
                                    autoPlay: false,
                                    playInterval: 1000,
                                    //播放按钮的位置
                                    controlPosition: 'right',
                                    left: '3%',
                                    width: '95%',
                                    //标记的图形样式
                                    // symbol:'arrow',
                                    symbolSize: '8',
                                    // symbolOffset:'',
                                    lineStyle: {
                                        // color:'red'
                                    },
                                    label: {
                                        normal: {
                                            color: '#ddd'
                                        }
                                    },
                                    controlStyle: {
                                        normal: {
                                            color: '#ddd'
                                        }
                                    },
                                    tooltip: {
                                        formatter: function (result) { //回调函数，参数params具体格式参加官方API
                                            return result.name;
                                        }
                                    }
                                },
                                tooltip: {
                                    trigger: 'item',
                                    formatter: function loadData(result) { //回调函数，参数params具体格式参加官方API
                                        return result.name + '<br />数据:' + result.value;
                                    }
                                },
                                dataRange: {
                                    splitNumber: 0,
                                    text: ['高', '低'],
                                    realtime: false,
                                    calculable: false,
                                    selectedMode: false,
                                    realtime: false,
                                    show: true,
                                    itemWidth: 20,
                                    itemHeight: 100,
                                    color: ['#8a0c21', '#4a2f44', '#095272']
                                },
                                title: {
                                    text: selectArea + '数据总览',
                                    //subtext:'',
                                    x: '25%',
                                    y: '5%',
                                    textAlign: 'center',
                                    textStyle: {
                                        color: '#ccc'
                                    }
                                },
                                grid: {
                                    right: '10%',
                                    width: '35%',
                                    height: '35%'
                                },
                                //地图
                                series: {
                                    id: 'map',
                                    type: 'map',
                                    map: selectArea, //要和echarts.registerMap（）中第一个参数一致
                                    // bottom: '10%',
                                    left: '20%',
                                    width: '25%',
                                    itemSytle: {
                                        emphasis: {
                                            label: {
                                                show: true
                                            }
                                        }
                                    },
                                    label: {
                                        normal: {
                                            show: true,
                                            color: '#fff'
                                        },
                                        emphasis: {
                                            show: true
                                        }
                                    },
                                    markLine: {
                                        silent: true
                                    },
                                    data: []
                                }
                            },
                            options: []
                        }
                        //判断最大值与最小值
                        var values=[]
                        for(var i=0;i<result.length;i++){
                            for(var m=0;m<result[i].series.data.length;m++){
                                var value=result[i].series.data[m].value;
                                values.push(value);
                            }
                        }
                        var max=values[0];
                        var min=values[0]
                        for(var j=1;j<values.length;j++){
                            if(max<=values[j]){
                                max=values[j];
                            }
                        }
                        for(var k=1;k<values.length;k++){
                            if(min>=values[j]){
                                min=values[j];
                            }
                        }
                        proOption.baseOption.dataRange.max=max;
                        proOption.baseOption.dataRange.min=min
                        //给地图添加数据
                        for (var i = 0; i < result.length; i++) {
                            proOption.options.push({
                                series: [{
                                    id: 'map',
                                    data: result[i].series.data
                                }]
                            })

                        }
                        chart.setOption(proOption)
                    }
                }
                $.ajax(proIndex);
                //渲染本省地图
                $('.backProvice').click(function () {
                    //如果是在市区域点击返回本省时 进行渲染省地图
                    if(proCode.substring(2,2)!='00') {
                        //获取到省的编码
                        proCode=proCode.substring(0,2)+'0000';
                        //通过编码来找省的名字
                        for(var i=0;i<treeData.province.length;i++){
                            if(proCode==treeData.province[i]['id']){
                                var proName=treeData.province[i]['text'];
                                break;
                            }
                        }
                        var path = cityGeoMapping[proName];
                        $.get(path, function (Citymap) {
                            echarts.registerMap(selectArea, Citymap);
                            var chart = echarts.init(document.getElementById('china_map'));
                            $('#areaCode').val(proCode);
                            $('#industry').val($('.industry option:selected').attr('id'));
                            $('#indexName').val($('.indexName option:selected').val())
                            // $('#date').val(date);
                            var secFromData = $('#form').serialize();
                            // console.log(secFromData);
                            var timeData = [];
                            var proIndex = {
                                url: url + '/finddata',
                                data: secFromData,
                                success: function (result) {
                                    //时间数据
                                    for (var i = 0; i < result.length; i++) {
                                        var timeFromAfter = result[i].series.date;
                                        timeData.push(timeFromAfter);
                                    }
                                    console.log(result);
                                    var proOption = {
                                        baseOption: {
                                            visualMap: {
                                                type: 'continuous',
                                                max: 30000000,
                                                min: 0,
                                                bottom: '10%',
                                                itemWidth: 20,
                                                itemHeight: 140,
                                                show: true,
                                                calculable: true,
                                                inRange: {
                                                    // color: ['yellow','lightskyblue', 'orangered']
                                                }
                                            },
                                            timeline: {
                                                axisType: 'category',
                                                data: timeData,
                                                //默认选择第几项
                                                // currentIndex:,
                                                autoPlay: false,
                                                playInterval: 1000,
                                                //播放按钮的位置
                                                controlPosition: 'right',
                                                left: '3%',
                                                width: '95%',
                                                //标记的图形样式
                                                // symbol:'arrow',
                                                symbolSize: '8',
                                                // symbolOffset:'',
                                                lineStyle: {
                                                    // color:'red'
                                                },
                                                label: {
                                                    normal: {
                                                        color: '#ddd'
                                                    }
                                                },
                                                controlStyle: {
                                                    normal: {
                                                        color: '#ddd'
                                                    }
                                                },
                                                tooltip: {
                                                    formatter: function (result) { //回调函数，参数params具体格式参加官方API
                                                        return result.name;
                                                    }
                                                }
                                            },
                                            tooltip: {
                                                trigger: 'item',
                                                formatter: function loadData(result) { //回调函数，参数params具体格式参加官方API
                                                    return result.name + '<br />数据:' + result.value;
                                                }
                                            },
                                            dataRange: {
                                                min: 0,
                                                max: 2000000,
                                                splitNumber: 0,
                                                text: ['高', '低'],
                                                realtime: false,
                                                calculable: false,
                                                selectedMode: false,
                                                realtime: false,
                                                show: true,
                                                itemWidth: 20,
                                                itemHeight: 100,
                                                color: ['#8a0c21', '#4a2f44', '#095272']
                                            },
                                            title: {
                                                text: selectArea + '数据总览',
                                                //subtext:'',
                                                x: '25%',
                                                y: '5%',
                                                textAlign: 'center',
                                                textStyle: {
                                                    color: '#ccc'
                                                }
                                            },
                                            grid: {
                                                right: '10%',
                                                width: '35%',
                                                height: '35%'
                                            },
                                            //地图
                                            series: {
                                                id: 'map',
                                                type: 'map',
                                                map: selectArea, //要和echarts.registerMap（）中第一个参数一致
                                                // bottom: '10%',
                                                left: '20%',
                                                width: '35%',
                                                itemSytle: {
                                                    emphasis: {
                                                        label: {
                                                            show: true
                                                        }
                                                    }
                                                },
                                                label: {
                                                    normal: {
                                                        show: true,
                                                        color: '#fff'
                                                    },
                                                    emphasis: {
                                                        show: true
                                                    }
                                                },
                                                markLine: {
                                                    silent: true
                                                },
                                                data: []
                                            }
                                        },
                                        options: []
                                    }
                                    //给地图添加数据
                                    for (var i = 0; i < result.length; i++) {
                                        proOption.options.push({
                                            series: [{
                                                id: 'map',
                                                data: result[i].series.data
                                            }]
                                        })
            
                                    }
                                    chart.setOption(proOption)
                                }
                            }
                            $.ajax(proIndex);
                        })
                    }else{
                        return
                    }
                })
            });


        });
        window.addEventListener("resize", function () {
            chart.resize();
        });
        //返回全国
        $('.backChina').click(function () {
            
            if(proCode=='000000'){
                return;
            }
            $.get('json/china.json', function (mapJson) {
                $('#areaCode').val('')
                echarts.registerMap('全国', mapJson);
                var chart = echarts.init(document.getElementById('china_map')); //在id为mainMap的dom元素中显示地图
                // var timeData=[],option;
                showChina(mapJson,'全国');                 
            })
            proCode='000000'
        })
        //点击确定按钮
        $('#confirm').on('click',function(){
            proCode =$('#areaCode').val()||'';
            //通过编码来找地区的名字
            if(proCode==''){
                var selectArea='中国';
            } else if(proCode.substring(2,4)=='00'){//如果是在省级区域点击确定
                for (var i = 0; i < treeData.province.length; i++) {
                    if (proCode == treeData.province[i]['id']) {
                        var selectArea = treeData.province[i]['text'];
                        break;
                    }
                }
            }else{//如果是在市级区域
                for (var j = 1; j < treeData.area.length; j++) {
                    for (var m = 0; m < treeData.area[j]['children'].length; m++) {
                        if (treeData.area[j]['children'][m]['id'] == proCode) {
                            var selectArea = treeData.area[j]['children'][m]['text']
                        }
                    }
                }
            }
            var path = cityGeoMapping[selectArea];
            $('#areaCode').val(proCode);
            $('#industry').val($('.industry option:selected').attr('id'));
            $('#indexName').val($('.indexName option:selected').val())
            $.get(path, function (Citymap) {
                echarts.registerMap(selectArea, Citymap);
                showChina(Citymap,selectArea)
                //配置timeLine 显示最开始时期
                if (!targetTime) {
                    if ($('.indexName option:selected').val() == 'vaabs') {
                        targetTime = '2007-01-31'
                    } else if ($('.indexName option:selected').val() == 'vayoy') {
                        targetTime = '2008-01-31'
                    }
                    orderByPro(targetTime, proCode);
                    return
                }else{
                    if($('.indexName option:selected').val() == 'vayoy'&&targetTime.substring(3,1)<8){
                        orderByPro('2008-01-31', proCode);
                    }else{
                        orderByPro(targetTime,proCode)
                    }
                }
                // showChina(Citymap,selectArea);
            })
        })
        
    });
    
    //渲染全国方法 传递 mapJson地图，timeData存储时间的数组
    function showChina(mapJson,selectArea){
        var chart = echarts.init(document.getElementById('china_map')); //在id为mainMap的dom元素中显示地图
            var resData=$('#form').serialize();
            //请求'全行业/vaabs'数据
            var index = {
                url: url + '/finddata',
                data:resData,
                success: function (result) {
                    console.log(result);
                    // var options = result;
                    var timeData=[];
                    for (var i = 0; i < result.length; i++) {
                        var timeFromAfter = result[i].series.date;
                        timeData.push(timeFromAfter);
                    }
                    option = {
                        baseOption: {
                            visualMap: {
                                type: 'continuous',
                                max: 45000000,
                                min: 0,
                                bottom: '10%',
                                itemWidth: 20,
                                itemHeight: 140,
                                show: true,
                                calculable: true,
                                inRange: {
                                    // color: ['yellow','lightskyblue', 'orangered']
                                }
                            },
                            timeline: {
                                axisType: 'category',
                                data: timeData,
                                //默认选择第几项
                                // currentIndex:,
                                autoPlay: false,
                                playInterval: 1000,
                                //播放按钮的位置
                                controlPosition: 'right',
                                left: '3%',
                                width: '95%',
                                //标记的图形样式
                                // symbol:'arrow',
                                symbolSize: '8',
                                // symbolOffset:'',
                                lineStyle: {
                                    // color:'red'
                                },
                                label: {
                                    normal: {
                                        color: '#ddd'
                                    }
                                },
                                controlStyle: {
                                    showPrevBtn: false,
                                    showNextBtn: false
                                },
                                tooltip: {
                                    formatter: function (result) { //回调函数，参数params具体格式参加官方API
                                        return result.name;
                                    }
                                }
                            },
                            tooltip: {
                                trigger: 'item',
                                formatter: function (result) { //回调函数，参数params具体格式参加官方API
                                    return result.name + '<br />数据:' + result.value;
                                }
                            },
                            dataRange: {
                                splitNumber: 0,
                                text: ['高', '低'],
                                realtime: false,
                                calculable: false,
                                selectedMode: false,
                                realtime: false,
                                show: true,
                                itemWidth: 20,
                                itemHeight: 100,
                                color: ['#8a0c21', '#4a2f44', '#095272']
                            },
                            title: [
                                //地图数据
                                {
                                    text: '全国数据总览 单位:/亿元',
                                    //subtext:'',
                                    x: '50%',
                                    y: '5%',
                                    textAlign: 'center',
                                    textStyle: {
                                        color: '#ccc'
                                    }
                                }
                            ],
                            grid:
                            //上面的柱状图
                            {
                                right: '5%',
                                width: '35%',
                                height: '35%'
                            },
                            series: {
                                id: 'map',
                                type: 'map',
                                map: selectArea, //要和echarts.registerMap（）中第一个参数一致
                                left: '160',
                                width: '65%',
                                //
                                // roam: true,
                                //是否支持多个选中
                                // selectedMode: 'multiple',
                                // 自定义地区的名称映射
                                // nameMap:{
                                // },
                                selectedMode: 'single',
                                itemSytle: {
                                    normal: {
                                        show: true,
                                        borderColor: '#fff'
                                    },
                                    emphasis: {
                                        show: true
                                    }
                                },
                                //图形上的文本标签，可用于说明图形的一些数据信息
                                label: {
                                    normal: {
                                        show: true,
                                        color: '#fff'
                                    },
                                    emphasis: {
                                        show: true
                                    }
                                },
                                markLine: {
                                    silent: true
                                },
                                data: []
                            }
                        },
                        //timeline.data中的每一项，对应于options数组中的每个option
                        options: []
                    }
                    //判断最大值与最小值
                    var values=[]
                    for(var i=0;i<result.length;i++){
                        for(var m=0;m<result[i].series.data.length;m++){
                            var value=result[i].series.data[m].value;
                            values.push(value);
                        }
                    }
                    var max=values[0];
                    var min=values[0]
                    for(var j=1;j<values.length;j++){
                        if(max<=values[j]){
                            max=values[j];
                        }
                    }
                    for(var k=1;k<values.length;k++){
                        if(min>=values[j]){
                            min=values[j];
                        }
                    }
                    option.baseOption.dataRange.max=max;
                    option.baseOption.dataRange.min=min
                    //给地图和柱状图添加数据
                    for (var i = 0; i < result.length; i++) {
                        option.options.push({
                            series: [{
                                id: 'map',
                                data: result[i].series.data
                            }]
                        })
                    }
                    chart.setOption(option);
                }
            }
            $.ajax(index);   
        }   
    //省的排名渲染
    function orderByPro(date, areaCode) {
        $('#areaCode').val(areaCode)
        // console.log($('.industry option:selected').attr('id'))
        $('#industry').val($('.industry option:selected').attr('id'));
        $('#indexName').val($('.indexName option:selected').val())
        $('#date').val(date);
        var formData = $('#form').serialize();
        //请求本省在全国的排名数据
        var orderByALL = {
            url: url + '/findRankVaDatas',
            // type:'get',
            data: formData,
            success: function (result) {
                console.log(result);
                if (result) {
                    //渲染柱状图
                    var areaNameInCon = [], areaNameInPro = [],rankInCon=[],
                    valInCon = [], valInPro = [],rankInPro=[];
                    //渲染市在全国的数据
                    if (result.countryRank) {
                        for (var i = 0; i < result.countryRank.length; i++) {
                            areaNameInCon.push(result.countryRank[i].name+'第'+result.countryRank[i].rank+'名');
                            valInCon.push(result.countryRank[i].value);
                            rankInCon.push(result.countryRank[i].rank)
                        }
                    };
                    //渲染市在全省
                    if (result.provinceRank) {
                        for (var i = 0; i < result.provinceRank.length; i++) {
                            areaNameInPro.push(result.provinceRank[i].name+'第'+result.provinceRank[i].rank+'名');
                            valInPro.push(result.provinceRank[i].value);
                            rankInPro.push(result.provinceRank[i].rank)
                        }
                    }
                    var bar1 = echarts.init(document.getElementById('bar1'));
                    var bar2 = echarts.init(document.getElementById('bar2'));
                    var optionBar1 = {
                        xAxis: {
                            type: 'category',
                            axisTick: {
                                alignWithLabel: true
                            },
                            axisLabel: {
                                interval: 0,
                                rotate: -10,
                                fontFamily: 'serif',
                                verticalAlign: 'top',
                                textStyle: {
                                    color: '#ddd'
                                }
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#ddd'
                                }
                            },
                            data: areaNameInCon
                        },
                        yAxis: {
                            type: 'value',
                            boundaryGap: false,
                            axisLine: {
                                lineStyle: {
                                    color: '#ddd'
                                }
                            },
                            axisTick: {
                                show: false
                            },
                            splitLine: {
                                show: false
                            }
                        },
                        grid: {
                            left: '10%',
                            width: '65%'
                        },
                        series: [
                        {
                            type: 'bar',
                            name: 'bar',
                            stack:'数据',//同个类目轴上系列配置相同的stack值可以堆叠
                            label: {
                                emphasis: {
                                    show: true,
                                }
                            },
                            itemStyle: {
                                emphasis: {
                                    color: "rgb(254,153,78)"
                                }
                            },
                            // markPoint:{
                            //     data:markPointInCon
                            // },
                            data: valInCon
                        }]
                    }
                    var optionBar2 = {
                        xAxis: {
                            type: 'category',
                            axisTick: {
                                alignWithLabel: true
                            },
                            axisLabel: {
                                interval: 0,
                                rotate: -10,
                                fontFamily: 'serif',
                                verticalAlign: 'top',
                                textStyle: {
                                    color: '#ddd'
                                }
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#ddd'
                                }
                            },
                            data: areaNameInPro
                        },
                        yAxis: {
                            type: 'value',
                            boundaryGap: false,
                            axisLine: {
                                lineStyle: {
                                    color: '#ddd'
                                }
                            },
                            axisTick: {
                                show: false
                            },
                            splitLine: {
                                show: false
                            }
                        },
                        grid: {
                            left: '10%',
                            width: '65%'
                        },
                        series: [{
                            type: 'bar',
                            name: 'bar',
                            stack:'数据',
                            label: {
                                emphasis: {
                                    show: true,
                                }
                            },
                            itemStyle: {
                                emphasis: {
                                    color: "rgb(254,153,78)"
                                }
                            },
                            data: valInPro
                        }]
                    }
                    if (valInCon.length) { bar1.setOption(optionBar1) };
                    if (valInPro.length) { bar2.setOption(optionBar2) };
                }
            }
        }
        $.ajax(orderByALL)
    }





});

