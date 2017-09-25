var url="http://192.168.1.127:8805/newArea";

//通过地区名称得到地区代码
function areaToAreaCode(areaName){
    for(var i=0;i<treeData.area.length;i++){
        if(treeData.area[i].text==areaName){
            areaCode=treeData.area[i].id;
        }
        return areaCode;
    }
}