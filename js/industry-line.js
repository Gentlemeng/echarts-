$().ready(function () {
    // 第一个折线图
    // 第二个柱状堆叠图
    var detailBar2 = echarts.init(document.getElementById('lineDetail2'));    
    option = {
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data: ['检修一班', '检修二班','检修三班','检修四班','检修五班']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        yAxis:  {
            type: 'value'
        },
        xAxis: {
            type: 'category',
            data: ['2017/06','2017/07','2017/08','2017/09','2017/10','2017/11','2017/12']
        },
        series: [
            {
                name: '检修一班',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'insideRight'
                    }
                },
                data: [320, 302, 301, 334, 390, 330, 320]
            },
            {
                name: '检修二班',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'insideRight'
                    }
                },
                data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
                name: '检修三班',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'insideRight'
                    }
                },
                data: [220, 182, 191, 234, 290, 330, 310]
            },
            {
                name: '检修四班',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'insideRight'
                    }
                },
                data: [150, 212, 201, 154, 190, 330, 410]
            },
            {
                name: '检修五班',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'insideRight'
                    }
                },
                data: [820, 832, 901, 934, 1290, 1330, 1320]
            }
        ]
    };
    detailBar2.setOption(option);

    var lineChart2 = echarts.init(document.getElementById('lineDetail2'));    
    option = {
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data: ['检修一班', '检修二班','检修三班','检修四班','检修五班']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        yAxis:  {
            type: 'value'
        },
        xAxis: {
            type: 'category',
            data: ['2017/06','2017/07','2017/08','2017/09','2017/10','2017/11','2017/12']
        },
        series: [
            {
                name: '检修一班',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'insideRight'
                    }
                },
                data: [320, 302, 301, 334, 390, 330, 320]
            },
            {
                name: '检修二班',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'insideRight'
                    }
                },
                data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
                name: '检修三班',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'insideRight'
                    }
                },
                data: [220, 182, 191, 234, 290, 330, 310]
            },
            {
                name: '检修四班',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'insideRight'
                    }
                },
                data: [150, 212, 201, 154, 190, 330, 410]
            },
            {
                name: '检修五班',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'insideRight'
                    }
                },
                data: [820, 832, 901, 934, 1290, 1330, 1320]
            }
        ]
    };
    detailBar2.setOption(option);
    // 第三个折线图
    var mainLineChart = echarts.init(document.getElementById('lineDetail3'));
    var indusData={
        url:url+'/findAreaVaIncreAndTopIndusty',
        data:{areaCode:'130000'},
        success:function(result){
            var timeData=[];
                for(var i=0;i<result[1]['datas'].length;i++){
                    var date=result[1]['datas'][i]['date'];
                    timeData.push(date);
                }
                function valueData(datas){
                    var value=[]
                    for(var k=0;k<datas.length;k++){
                        var data=datas[k]['value'];
                        value.push(data);
                    }
                    return value;    
                }
                var value1=valueData(result[0]['datas']);
                var value2=valueData(result[1]['datas']);
                var value3=valueData(result[2]['datas'])
                var value4=valueData(result[3]['datas']);
                var value5=valueData(result[4]['datas']);
                var value6=valueData(result[5]['datas']);

            var value=value1.concat(value2).concat(value3).concat(value4).concat(value5).concat(value6);
            var max=value[0],min=value[0];
            for(var i=1;i<value.length;i++){
                if(max<value[i]){
                    max=Math.ceil(value[i]);
                }
                if(min>value[i]){
                    min=Math.floor(value[i]);
                }
            };
            var option3= {
                title: {
                    // text: '高频指数'
                },
                tooltip: {
                    trigger: 'axis'
                },
                color: ["#FF0000", "#00BFFF", "#FF00FF", "#1ce322", "#000000", '#EE7942'],
                legend: {
                    data: ['GDP增长','1','2', '3', '4','5'],
                    color:'#ddd'
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
                    axisLine: {
                        lineStyle: {
                            color: '#ddd'
                        }
                    },
                    data: timeData
                },
                yAxis: [{
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#ddd'
                        }
                    },
                    min: min,
                    max: max
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
                    name: 'VA增长',
                    type: 'line',
                    lineStyle: {
                        normal: {
                            width: 4,
                        }
                    },
                    data:value1
                }, {
                    name: '1',
                    type: 'line',
                    lineStyle: {
                        normal: {
                            width: 2,
                        }
                    },
                    data:value2
                }, {
                    name: '2',
                    type: 'line',
                    lineStyle: {
                        normal: {
                            width: 2,
                        }
                    },
                    data:value3
                }, {
                    name: '3',
                    type: 'line',
                    lineStyle: {
                        normal: {
                            width: 2,
                        }
                    },
                    data:value4
                }, {
                    name: '4',
                    type: 'line',
                    lineStyle: {
                        normal: {
                            width: 2,
                        }
                    },
                    data:value5
                },
                {
                    name: '5',
                    type: 'line',
                    lineStyle: {
                        normal: {
                            width: 2,
                        }
                    },
                    data:value6
                }]
            };
            mainLineChart.setOption(option3);
        }
    }
    $.ajax(indusData);
    
    
})