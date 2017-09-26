$().ready(function () {
    /*echarts*/
    //获取行业
    var industry = {
        url: url + '/findallindustory',
        success: function (result) {
            // console.log(result);
            var indusData = template('indus-list', {
                indus_list: result
            });
            $('.industry').append(indusData);
            $('.industry option:last').attr({
                'selected': true
            })
        }
    }
    $.ajax(industry);
    //全国
    $.get('json/china.json', function (mapJson) {
        echarts.registerMap('china', mapJson);
        var chart = echarts.init(document.getElementById('china_map')); //在id为mainMap的dom元素中显示地图
        var option;
        // var options = [];
        //储存时间的json数组
        var timeData=[]

        //请求'全行业/vaabs'数据
        var index = {
            url: url + '/finddata',
            success: function (result) {
                // var options = result;
                for (var i = 0; i < result.length; i++) {
                    var time = result[i].series.date;
                    timeData.push(time);
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
                            left: '5%',
                            width: '48%',
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
                                showPrevBtn:false,
                                showNextBtn:false
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
                            },
                            series: [{
                                type: 'map',
                                name: '总量',
                                map: 'china',
                                roam: true,
                                // nameMap: nameMap
                            }]
                        },
                        dataRange: {
                            min: 0,
                            max: 45000000,
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
                                text: '全国数据总览',
                                //subtext:'',
                                x: '25%',
                                y: '5%',
                                textAlign: 'center',
                                textStyle: {
                                    color: '#ccc'
                                }
                            },
                            //top柱状图
                            // {
                            //     text: '888888888888',
                            //     //subtext:'',
                            //     x: '70%',
                            //     y: '5%',
                            //     textAlign: 'center',
                            //     textStyle:{
                            //         color:'#ccc'
                            //     }
                            // },
                            //bottom柱状图
                            // {
                            //     text: '888888888888',
                            //     //subtext:'',
                            //     x: '70%',
                            //     y: '55%',
                            //     textAlign: 'center',
                            //     textStyle:{
                            //         color:'#ccc'
                            //     }
                            // }
                        ],
                        grid:
                        //上面的柱状图
                        {
                            right: '5%',
                            width: '35%',
                            height: '35%'
                        },
                        //下面的柱状图
                        // {
                        //     bottom: '5%',
                        //     right: '10%',
                        //     width: '40%',
                        //     height: '35%'
                        // }
                        xAxis: {},
                        yAxis: {},
                        //地图和柱状图
                        series: [
                            {
                                id: 'map',
                                type: 'map',
                                map: 'china', //要和echarts.registerMap（）中第一个参数一致
                                left: '10%',
                                width: '35%',
                                //
                                roam: true,
                                // scaleLimit: {
                                //     min: 0.8,
                                //     max: 1.9
                                // }, //缩放
                                // mapLocation: {
                                //     y: 60
                                // },
                                //是否支持多个选中
                                // selectedMode: 'multiple',
                                // 自定义地区的名称映射
                                // nameMap:{
                                    
                                // },
                                selectedMode:'single',
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
                                markLine:{
                                    silent:true
                                },
                                data: []
                                //dataParam//人口数据：例如[{name:'济南',value:'100万'},{name:'菏泽'，value:'100万'}......]
                            }, {
                                id: 'bar',
                                name: '排名',
                                type: 'bar',
                                left: '50%',
                                xAxisIndex: 0,
                                yAxisIndex: 0,
                                //设置移入时才显示标签
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
                                // data: options
                            },
                            // {
                            //     name: '下面的柱状图',
                            //     type: 'bar',
                            //     left: '50%',
                            //     xAxisIndex: 1,
                            //     yAxisIndex: 1,
                            //     label: {
                            //         normal: {
                            //             show: true
                            //         },
                            //         emphasis: {
                            //             show: true,
                            //         }
                            //     },
                            //     itemStyle: {
                            //         emphasis: {
                            //             color: "rgb(254,153,78)"
                            //         }
                            //     },
                            //     data: [10, 60, 30, 80, 90, 55, 44, 10, 60, 30, 80, 90, 55, 44, 10, 60, 30, 80, 90, 55, 44, 10, 60, 30, 80, 90, 55, 44, 10, 60, 30, 80, 90, 55, 44]
                            // }
                        ],
        
                    },
                    //timeline.data中的每一项，对应于options数组中的每个option
                    options: []
                }
                //给地图和柱状图添加数据
                for (var i = 0; i < result.length; i++) {
                    option.options.push({
                        xAxis: {
                            type: 'category',
                            // boundaryGap: [0, 0.1],
                            axisTick: {
                                alignWithLabel: true
                            },
                            axisLabel: {
                                interval: 0,
                                rotate: -30,
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
                            data: result[i].series.data.map(function (ele) {
                                return ele.name
                            })
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
                        series: [{
                            id: 'map',
                            data: result[i].series.data
                        }, {
                            id: 'bar',
                            data: result[i].series.data.map(function (ele) {
                                return ele.value
                            })
                        }]
                    })

                }
                chart.setOption(option); 
            }
        }
        $.ajax(index);
        //点击省份 显示排名 等
        var areaCode,targetTime;
        chart.on('click', function (proData) {
            //判断如果单击的是地图
            
            if (proData.componentSubType == "map") {
                
                //通过省的名称来获取省的行政代码
                var proName=proData.name;
                for(var i=0;i<treeData.area.length;i++){
                    if(treeData.area[i].text==proName){
                        areaCode=treeData.area[i].id;
                        break;
                    }
                }
                //配置timeLine 显示最开始时期
                // option.baseOption.timeline.currentIndex=0;
                if(!targetTime){
                    targetTime='2007-01-31'
                    orderByPro(targetTime,areaCode);
                    return 
                }
                orderByPro(targetTime,areaCode);                
            }else{
                return 
            }
        })
        chart.on('timelinechanged',function(timeChangeData){
            // option.baseOption.timeline.currentIndex=null;
            // console.log(timeChangeData);
            // console.log(timeData[timeChangeData.currentIndex])
            //通过timeChangeData的索引和timeData来获取目标时间
            // if(timeChangeData)
            targetTime=timeData[timeChangeData.currentIndex]
            if(areaCode){
                orderByPro(targetTime,areaCode);  
            }
               
        })
        //下钻到省
        chart.on('dblclick', function (result) { //回调函数，点击时触发，参数params格式参加官方API
            // console.log(result);
            if (result.componentSubType != "map") {
                return
            }
            //选择省的单击事件
            var selectProe = result.name;
            // console.log(selectProe);

            //调取后台数据
            $.get('json/' + selectProe + '/' + selectProe + '.json', function (Citymap) {
                // console.log(Citymap);

                echarts.registerMap(selectProe, Citymap);
                var myChartProe = echarts.init(document.getElementById('china_map'));
                var option = {
                    baseOption:{
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
                            data: [2017-01-31,2017-02-28],
                            //默认选择第几项
                            // currentIndex:,
                            autoPlay: false,
                            playInterval: 1000,
                            //播放按钮的位置
                            controlPosition: 'right',
                            left: '5%',
                            width: '35%',
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
                        tooltip:{
                            trigger: 'item',
                            formatter: function loadData(result) { //回调函数，参数params具体格式参加官方API
                                return result.name + '<br />数据:' + result.value;
                            }
                        },
                        dataRange:{
                            min: 0,
                            max: 30000000,
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
                            text: selectProe + '数据总览',
                            //subtext:'',
                            x: '25%',
                            y: '5%',
                            textAlign: 'center',
                            textStyle:{
                                color:'#ccc'
                            }
                        },
                        grid:[
                            //上面的柱状图
                        {
                            right: '10%',
                            width: '40%',
                            height: '35%'
                        },
                        //下面的柱状图
                        // {
                        //     bottom: '5%',
                        //     right: '10%',
                        //     width: '40%',
                        //     height: '35%'
                        // }
                        ],
                        xAxis: {},
                        yAxis: {},
                        //地图和柱状图
                        series: [{
                            id:'map',
                            type: 'map',
                            map: selectProe, //要和echarts.registerMap（）中第一个参数一致
                            bottom: '10%',
                            left: '10%',
                            width: '10%',
                            //
                            roam: true,
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
                                    color:'#fff'
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            markLine:{
                                silent:true
                            },
                            data: [] 
                        },{
                            id: 'bar',
                            name: '排名',
                            type: 'bar',
                            left: '50%',
                            xAxisIndex: 0,
                            yAxisIndex: 0,
                            //设置移入时才显示标签
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
                        }]
                    },
                    options:[]
                }
                // {name:'邯郸市',value:'10000000'},{name:'石家庄市',value:'10000000'},{name:'廊坊市',value:'10000000'},{name:'张家口市',value:'10000000'},{name:'承德市',value:'10000000'},
                //给地图和柱状图添加数据
                var result=[
                    {series:{data:{name:'邯郸市',value:10000000}},date:'2007-01-31'},
                    {series:{data:{name:'邯郸市',value:10000000}},date:'2007-01-31'}
                ]
                for (var i = 0; i < result.length; i++) {
                    option.options.push({
                        xAxis: {
                            type: 'category',
                            // boundaryGap: [0, 0.1],
                            axisTick: {
                                alignWithLabel: true
                            },
                            axisLabel: {
                                interval: 0,
                                rotate: -30,
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
                            data: result[i].series.data.map(function (ele) {
                                return ele.name
                            })
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
                        series: [{
                            id: 'map',
                            data: result[i].series.data
                        }, {
                            id: 'bar',
                            data: result[i].series.data.map(function (ele) {
                                return ele.value
                            })
                        }]
                    })

                }
                myChartProe.setOption(option)
                //下钻到市
                myChartProe.on('dblclick', function (rel) {

                    console.log(rel);
                    // setTimeout(function () {
                    //     function contains(arr, obj) {
                    //         var i = arr.length;
                    //         while (i--) {
                    //             if (arr[i] === obj) {
                    //                 return true;
                    //             }
                    //         }
                    //         return false;
                    //     }
                    //     var arr = new Array('北京', '上海', '天津', '台湾', '重庆');
                    //     if (contains(arr, selectProe) == false) {
                    //         $('#china_map').css('display', 'none');
                    //         $('#proe_map').css('display', 'none');
                    //         $('#city_map').css('display', 'block');
                    //     } else {
                    //         $('#china_map').css('display', 'none');
                    //         $('#proe_map').css('display', 'block');
                    //         $('#city_map').css('display', 'none');
                    //     }

                    // }, 500);
                    //选择市的单击事件
                    var selectCity = rel.name;
                    ///////确认  哪些 区没有数据
                    if (selectProe == "北京" || selectProe == "天津" || selectProe == "上海" || selectProe == "台湾") {
                        return
                    }
                    //    调取后台数据
                    $.get('json/' + selectProe + '/' + selectCity + '.json', function (Citymap) {
                        // console.log(JSON.parse(Citymap))
                        echarts.registerMap(selectCity, Citymap);
                        var myChartCity = echarts.init(document.getElementById('china_map'));
                        myChartCity.setOption({
                            tooltip: {
                                trigger: 'item',
                                formatter: function loadData(result) { //回调函数，参数params具体格式参加官方API
                                    return result.name + '<br />数据:' + result.value;
                                }
                            },
                            dataRange: {
                                min: 0,
                                max: 50,
                                text: ['高', '低'],
                                realtime: false,
                                show: false,
                                calculable: false,
                                splitNumber: 0,
                                itemWidth: 10,
                                itemHeight: 60,
                                color: ['lightskyblue', '#f2f2f2']
                            },
                            title: {
                                text: selectCity + '数据总览',
                                //subtext:'',
                                x: 'center',
                                y: 'top',
                                textAlign: 'left'
                            },
                            series: [{
                                type: 'map',
                                map: selectCity, //要和echarts.registerMap（）中第一个参数一致
                                scaleLimit: {
                                    min: 0.8,
                                    max: 1.9
                                }, //缩放
                                mapLocation: {
                                    y: 60
                                },
                                itemSytle: {
                                    emphasis: {
                                        label: {
                                            show: false
                                        }
                                    }
                                },
                                label: {
                                    normal: {
                                        show: true
                                    },
                                    emphasis: {
                                        show: true
                                    }
                                },
                                data: [{
                                        name: '大方县',
                                        value: '5'
                                    },
                                    {
                                        name: '金沙县',
                                        value: '0'
                                    },
                                    {
                                        name: '织金县',
                                        value: '10'
                                    },
                                    {
                                        name: '七星关区',
                                        value: '30'
                                    },
                                    {
                                        name: '纳雍县',
                                        value: '50'
                                    },
                                    {
                                        name: '赫章县',
                                        value: '15'
                                    }
                                ] //dataParam//人口数据：例如[{name:'济南',value:'100万'},{name:'菏泽'，value:'100万'}......]
                            }]
                        })
                        myChartCity.on('click', function (rel) {
                            setTimeout(function () {
                                //$('#cont_pro_map').css('display','block');
                                //$('#cont_city_map').css('display','none');
                            }, 500);

                        })
                    });

                })
            });
        });
        window.addEventListener("resize", function () {
            chart.resize();
        });


        //省的排名渲染
        function orderByPro (date,areaCode){
            $('#areaCode').val(areaCode)
            // console.log($('.industry option:selected').attr('id'))
            $('#industry').val($('.industry option:selected').attr('id'));
            $('#indexName').val($('.indexName option:selected').val())
            $('#date').val(date);
            var formData=$('#form').serialize();
            //请求本省在全国的排名数据
            var orderByALL={
                url:url+'/findRankVaDatas',
                // type:'get',
                data:formData,
                success:function(result){
                    console.log(result);
                    // if(!result){
                    //     alert('该地区数据不存在');
                    //     return 
                    // }
                    if(result){
                        //渲染柱状图
                        var areaNameData=[],values=[];
                        for(var i=0;i<result.countryRank.length;i++){
                            areaNameData.push(result.countryRank[i].name);
                            values.push(result.countryRank[i].value);
                        }
                        
                        var orderOptions=option.options;
                        // console.log(orderOptions[0].series[1].data)
                        //将options中的xy轴数据删除，并添加上排名之后的数据
                        for(var i=0;i<timeData.length;i++){
                            //删除掉x(name)和y(value)的配置
                            orderOptions[i].xAxis.data=null;//从第0位开始，删除一个
                            orderOptions[i].series[1].data=null;//从第1位开始，删除一个
                            if(date==timeData[i]){
                                orderOptions[i].xAxis.data=areaNameData;
                                orderOptions[i].series[1].data=values;
                                // break;
                            }
                        }
                    }
                    chart.setOption(option); 
                }
            }
            $.ajax(orderByALL)
        }
    });
    
});

    
//模拟省份数据
// for (var i = 0; i < 7; i++) {
//     var preYearData = {}
//     preYearData.series = {}
//     preYearData.series.data = []
//     for (var j = 0; j < 32; j++) {
//         var proData = {};
//         var mapjson=JSON.parse(mapJson)
//         // proData.name = mapJson.features;
//         proData.name = mapjson.features[j].properties.name;
//         proData.value = Math.floor(Math.random() * 51);
//         preYearData.series.data.push(proData);
//     }
//     options.push(preYearData);
// }
// console.log(options);