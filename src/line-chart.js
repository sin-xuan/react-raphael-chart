const React = require('react');
const { Raphael, Paper, Set, Text, Rect,Path, Circle } = require('react-raphael');
const Axis = require('./base/Axis');
const Utils = require('./utils');

class LineSerise extends React.Component{
	getDefaultPath(){
		var { width,height,xAxis,yAxis} = this.props;
		return ["M",yAxis.width,height-xAxis.height+15,"L",width, height-xAxis.height+15 ];
	}
	getLinePath(){
        var data = Utils.getLineData({width,height,xAxis,yAxis},serise);
		var path = [];
		var _data = data.Values;
		if(_data.length>=1){
			path.push([ "M", _data[0]._x, _data[0].y ]);
			for(var i=1;i<_data.length;i++){
				path.push(["L", _data[i]._x, _data[i]._y ]);
			}
		}else{
			path.push([ "M", _data[0]._x || 0, _data[0].y || 0 ]);
		}
		return path;
	}
	getCurvePath(first){
		 var { width,height,serise,xAxis,yAxis} = this.props;
        var _data = Utils.getLineData({width,height,xAxis,yAxis},serise);
		var path = [];
		var data = _data.Values;
		var controls = Utils.getControlPoint(data);
		var pathData = ["M"+first.x+","+first.y+"C"+first.x+","+first.y+" "+controls[0].x+","+controls[0].y+" "+data[1]._x+","+data[1]._y];
		for(var i=1;i<data.length-1;i++){
			if(i==data.length-2) {
				pathData.push("C"+controls[controls.length-1].x+","+controls[controls.length-1].y+" "+data[i+1]._x+","+data[i+1]._y+" "+data[i+1]._x+","+data[i+1]._y);
			}
			else {
				var control1 = controls[i*2-1], control2 = controls[i*2];
				pathData.push("C"+control1.x+","+control1.y+" "+control2.x+","+control2.y+" "+data[i+1]._x+","+data[i+1]._y);
			}
		}
		return pathData;
	}
    render(){
	   var { width,height,serise,xAxis,yAxis} = this.props;
       var data = Utils.getLineData({width,height,xAxis,yAxis},serise);
		
		var _data = data.Values;
		var first = {
			x:_data[0]?_data[0]._x:0,
			y:_data[0]?_data[0]._y:0
		}
		if(_data.length==1){
			return (<Circle r="4" x={first.x} y={first.y} attr={{"fill": serise.color,"stroke":serise.color,"stroke-width":serise.thickness}} />)
		}
					
		var defaultPath = this.getDefaultPath();
		var path = !!serise.curve ? this.getLinePath() : this.getCurvePath(first);

        return (<Set>
            <Path d={defaultPath} attr={{"stroke":serise.color,"stroke-width":serise.thickness}} animate={Raphael.animation({"path":path},500,"<>")}/>
        </Set>)
    }
}

class LineChart extends React.Component{
    render(){
        var {width,height,serises,xAxis,yAxis,grid} = this.props;
        return (<Paper width={width} height={height}>
            <Axis width={width} height={height} xAxis={xAxis} yAxis={yAxis} grid={grid} />
            {
                serises.map(function(ele,pos){
                    return (<LineSerise width={width} height={height} serise={ele} xAxis={xAxis} yAxis={yAxis} />)
                })
            }
        </Paper>)
    }
}

LineChart.propTypes = { 
	width: React.PropTypes.number, 
	height: React.PropTypes.number,
	serises: React.PropTypes.array, 
	xAxis: React.PropTypes.object, 
	yAxis: React.PropTypes.object, 
	grid:  React.PropTypes.object
};
LineChart.defaultProps = { 
	width: 600, 
	height: 400, 
	serises: [], 
	xAxis: {
		min: 0,
		max: 10,
		interval: 1,
		formatter: null,
		height: 60
	}, 
	yAxis: {
		min: 0,
		max: 100,
		interval: 10,
		formatter: null,
		width: 60
	}, 
	grid:{
		color: "#ccc",
		thickness: 1,
		showYGrid: false,
		showXGrid: true
	} 
};
                
module.exports = LineChart;