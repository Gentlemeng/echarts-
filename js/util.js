var url="http://192.168.1.127:8805/newArea";

//请求行业数据
function resIndustry(type){
    var industry = {
        url: url + '/findallindustory',
        success: function (result) {
            // console.log(result);
            var indusData = template('indus-list', {
                indus_list: result
            });
            $('.industry').append(indusData);
            if(type=="industry-area"){
                $('.industry option:last').attr({
                    'selected': true
                })
            }else if(type="industry-scatter"){
                $('.industry option:first').attr({
                    'selected': true
                })
            }
            
        }
    }
    $.ajax(industry); 
}