
$().ready(function () {
    /*echarts*/
    var proCode='000000';
    var num=0;//双击计数器
    //获取行业
    resIndustry('industry-scatter');
    // $.ajax(industry);    
    //全国
    $.get('json/china.json', function (mapJson) {
        echarts.registerMap('全国', mapJson);
        var chart = echarts.init(document.getElementById('china_map')); //在id为mainMap的dom元素中显示地图
        var option,areaCode,selectArea='全国';
        showChina(mapJson,selectArea);
        //点击省份 显示排名 等
        //下钻到省/市
        chart.on('dblclick', function (result) { //回调函数，点击时触发，参数params格式参加官方API
            console.log(result);
            if (result.componentType == "geo") {
                num++;
                if(num==3){
                    return;
                }
                var selectArea = result.name;
                //映射  通过地区名称找到地图路径
                var path = cityGeoMapping[selectArea];
                //调取本地地图数据
                $.get(path, function (Citymap) {
                    echarts.registerMap(selectArea, Citymap);
                    var chart = echarts.init(document.getElementById('china_map'));
                    //获取点击省份/市的Code
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
                            //获取县的行政代码  使用了本地地图数据 以及echarts内置api
                            if (j >= 32) {
                                var countyDom = document.getElementById('china_map');
                                var currentMap = echarts.getInstanceByDom(countyDom).getOption().geo[0].map;//邯郸市
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
                    console.log(proCode);
                    $('#areaCode').val(proCode);
                    $('#industry').val($('.industry option:selected').attr('id'));
                    showChina(Citymap,selectArea);
                    //返回本省
                    $('.backProvice').click(function () {
                        //如果是在市区域点击返回本省时 进行渲染省地图
                        if (proCode.substring(2, 2) != '00') {
                            //获取到省的编码
                            num=1;
                            proCode = proCode.substring(0, 2) + '0000';
                            //通过编码来找省的名字
                            for (var i = 0; i < treeData.province.length; i++) {
                                if (proCode == treeData.province[i]['id']) {
                                    var proName = treeData.province[i]['text'];
                                    break;
                                }
                            }
                            var path = cityGeoMapping[proName];
                            $('#areaCode').val(proCode);
                            $('#industry').val($('.industry option:selected').attr('id'));
                            $.get(path, function (Citymap) {
                                echarts.registerMap(proName, Citymap);
                                showChina(Citymap,proName);
                            })
                        }
                    })
                });
            }
        });
        window.addEventListener("resize", function () {
            chart.resize();
        });
    });
    //点击确定按钮
    $('#confirm').on('click',function(){
        proCode =$('#areaCode').val()||'000000';
        //通过编码来找地区的名字
        if(proCode=='000000'){
            var selectArea='中国';
        } else if(proCode.substring(2,2)!='00' && proCode.substring(4,2)=='00'){//如果是在省级区域点击确定
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
        $.get(path, function (Citymap) {
            echarts.registerMap(selectArea, Citymap);
            showChina(Citymap,selectArea);
        })
    })
    //返回全国
    $('.backChina').click(function () {
        num=0;
        //清空之前的区域code
        proCode=''
        $('#areaCode').val('000000')
        $.get('json/china.json', function (mapJson) {
            echarts.registerMap('全国', mapJson);
            // var chart = echarts.init(document.getElementById('china_map')); //在id为mainMap的dom元素中显示地图
            var selectArea='全国'
            showChina(mapJson,selectArea);
        })
    })

    //渲染地图方法 传递 mapJson全国地图，selectArea要渲染的地图名称
    function showChina(mapJson,selectArea){
        // if(selectArea=='china'){selectArea='中国'}
        var chart = echarts.init(document.getElementById('china_map')); //在id为mainMap的dom元素中显示地图
        var resData=$('#form').serialize();
        //请求'全行业/vaabs'数据
        var index = {
            url: url + '/findEnterpriseDatas',
            data:resData,
            success: function (result) {
                console.log(result);
                var option = {
                    // "backgroundColor": "#404a59",
                    "title": {
                        "text": selectArea + $('.industry option:selected').html() + '企业分布地图',
                        "left": "center",
                        "top": "top",
                        "textStyle": {
                            "color": "#fff"
                        }
                    },
                    //提示框 企业名称  营业额
                    "tooltip": {
                        trigger: 'item',
                        formatter: function loadData(result) { //回调函数，参数params具体格式参加官方API
                            var retStr = '企业名称:'+result.data[2]+"<br/>"+"营业收入:"+result.data[3];
                            return retStr;
                        },
                        hideDelay:500
                    },
                    "legend": {
                        "left": "left",
                        "data": [
                            "强",
                            "中",
                            "弱"
                        ],
                        "textStyle": {
                            "color": "#ccc"
                        }
                    },
                    "geo": {
                        "name": "强",
                        "type": "scatter",
                        "map": selectArea,
                        // "roam":true,
                        "label": {
                            "emphasis": {
                                "show": false
                            }
                        },
                        "itemStyle": {
                            "normal": {
                                "areaColor": "#323c48",
                                "borderColor": "#111"
                            },
                            "emphasis": {
                                "areaColor": "#2a333d"
                            }
                        }
                    },
                    "series": [{
                            "name": "弱",
                            "type": "scatter",
                            "coordinateSystem": "geo",
                            "symbolSize": 1,
                            "large": true,
                            "itemStyle": {
                                "normal": {
                                    "shadowBlur": 2,
                                    "shadowColor": "rgba(37, 140, 249, 0.8)",
                                    "color": "rgba(37, 140, 249, 0.8)"
                                }
                            },
                            "data": []
                        },
                        {
                            "name": "中",
                            "type": "scatter",
                            "coordinateSystem": "geo",
                            "symbolSize": 1,
                            "large": true,
                            "itemStyle": {
                                "normal": {
                                    "shadowBlur": 2,
                                    "shadowColor": "rgba(14, 241, 242, 0.8)",
                                    "color": "rgba(14, 241, 242, 0.8)"
                                }
                            },
                            "data": []
                        },
                        {
                            "name": "强",
                            "type": "scatter",
                            "coordinateSystem": "geo",
                            "symbolSize": 1,
                            "large": true,
                            "itemStyle": {
                                "normal": {
                                    "shadowBlur": 2,
                                    "shadowColor": "rgba(255, 255, 255, 0.8)",
                                    "color": "rgba(255, 255, 255, 0.8)"
                                }
                            },
                            "data": []
                        }
                    ]
                }
                result.forEach(function (list, index) {
                    list.forEach(function (datalist) {
                      var aArray=new Array();
                         aArray.push(datalist['coord'][0]);
                         aArray.push(datalist['coord'][1]);
                         aArray.push(datalist['enterName'])
                         aArray.push(datalist['incomeTotal']);
                       option['series'][index]['data'].push(aArray);
                    })
                })
                chart.setOption(option);
            }
        }
            $.ajax(index);   
    }
    //渲染折线图
    var lineChart = echarts.init(document.getElementById('line-top'));
    option1 = {
        title: {
            // text: '高频指数'
        },
        tooltip: {
            trigger: 'axis'
        },
        color: ["#FF0000", "#00BFFF", "#FF00FF", "#1ce322", "#000000", '#EE7942'],
        legend: {
            data: ['广州市越秀区华油特种润滑油厂', "福建古杉生物柴油有限公司", '厦门海光润滑油有限公司', '龙岩卓越新能源发展有限公司', '唐山佳华煤化工有限公司']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            color:'#fff',
            data: ['2017/1/24','2017/1/25','2017/1/26','2017/2/3','2017/2/6','2017/2/7','2017/2/8','2017/2/9','2017/2/10','2017/2/13','2017/2/14','2017/2/15','2017/2/16','2017/2/17','2017/2/20','2017/2/21','2017/2/22','2017/2/23','2017/2/24','2017/2/27','2017/2/28','2017/3/1','2017/3/2','2017/3/3','2017/3/6','2017/3/7','2017/3/8','2017/3/9','2017/3/10','2017/3/13','2017/3/14','2017/3/15','2017/3/16','2017/3/17','2017/3/20','2017/3/21','2017/3/22','2017/3/23','2017/3/24','2017/3/27','2017/3/28','2017/3/29','2017/3/30',]
        },
        yAxis: [{
            type: 'value',
            axisLabel: {
                formatter: '{value} '
            },
            min: 0.98,
            max: 1.1
        }],
        dataZoom: [{
            type: 'inside',
            start: 50,
            end: 100
        }, {
            show: true,
            type: 'slider',
            y: '90%',
            start: 50,
            end: 100
        }],
        series: [{
            name: '广州市越秀区华油特种润滑油厂',
            type: 'line',
            lineStyle: {
                normal: {
                    width: 2,
                }
            },
            data: [1,1.00344237,1.01153936,1.01203316,1.021617554,1.02022845,1.026765662,1.035330846,1.033605564,1.040114762,1.039702578,1.0336204,1.036993728,1.03024228,1.035840018,1.047523066,1.050882514,1.053564118,1.062139462,1.057222742,1.059269518,1.062838718,1.057032518,1.062427834,1.07368875,1.07976695,1.076146026,1.0727964,1.072426958,1.078833108,1.077325262,1.077117738,1.087439824,1.082047344,1.082332866,1.083443666,1.07747893,1.05643234,1.056891368,1.057457472,1.056107732,1.048221278,1.022602514,]
        }, {
            name: '福建古杉生物柴油有限公司',
            type: 'line',
            lineStyle: {
                normal: {
                    width: 2,
                }
            },
            data: [1,1.00222749,1.005288699,0.999242653,1.004591812,1.003353964,1.007773942,1.012928991,1.017231229,1.023640038,1.02398689,1.022414918,1.027706799,1.018943215,1.03099712,1.035251627,1.037762327,1.034631112,1.035283448,1.027401314,1.031560357,1.033215064,1.027837266,1.024107811,1.029059204,1.031776742,1.031219869,1.023611398,1.022341729,1.030061574,1.030796646,1.031569903,1.04021893,1.030198406,1.03444973,1.03788643,1.03267092,1.033730569,1.040381219,1.039588869,1.035130706,1.031426708,1.021539832,]
        }, {
            name: '厦门海光润滑油有限公司',
            type: 'line',
            lineStyle: {
                normal: {
                    width: 2,
                }
            },
            data: [1,1.003662407,1.011114967,1.006366211,1.013798653,1.011469037,1.018967867,1.024259799,1.024626944,1.033121596,1.032527121,1.023708577,1.031424677,1.025787729,1.038972796,1.04669292,1.050578632,1.04939773,1.05051325,1.04144223,1.045243448,1.047987487,1.04282632,1.04586307,1.058414432,1.061417988,1.05600334,1.048232921,1.05124553,1.062196539,1.059364988,1.06049962,1.068688484,1.057723393,1.059425341,1.06488626,1.061557805,1.064526155,1.070931595,1.064413497,1.062539544,1.058267574,1.040911126,]
        }, {
            name: '龙岩卓越新能源发展有限公司',
            type: 'line',
            lineStyle: {
                normal: {
                    width: 2,
                }
            },
            data: [1,1.003403231,1.006987769,1.000011889,1.002603695,1.000365587,1.005599727,1.009463657,1.014575934,1.021349701,1.021207032,1.017019126,1.022731799,1.016938876,1.031785284,1.035182571,1.037245315,1.032358929,1.032516459,1.024304121,1.026262836,1.027936215,1.020998975,1.018847063,1.0243814,1.026604646,1.025050157,1.018573615,1.018855979,1.027835159,1.027416071,1.029481788,1.034793205,1.024182259,1.025311715,1.030287268,1.025442494,1.028988393,1.037197759,1.033761833,1.031315668,1.029942487,1.021492369,]
        }, {
            name: '唐山佳华煤化工有限公司',
            type: 'line',
            lineStyle: {
                normal: {
                    width: 2,
                }
            },
            data: [1,1.005093433,1.013437423,1.008349362,1.021077573,1.014995541,1.02278613,1.028400726,1.023350276,1.028185814,1.025886247,1.016730961,1.019562438,1.011632155,1.018127895,1.0321617,1.031565317,1.034778264,1.041488916,1.035218835,1.035428375,1.038012701,1.031796349,1.036035504,1.054560987,1.062663199,1.055560331,1.049816787,1.047705269,1.058918344,1.052008897,1.051901441,1.056688624,1.04751722,1.049752313,1.053642235,1.046936955,1.046824126,1.055834345,1.046372809,1.044669625,1.03652443,1.017450919,]
        }]
    };
    lineChart.setOption(option1);
});