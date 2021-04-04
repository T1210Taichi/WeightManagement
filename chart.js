// firebase モジュール
import firebase from 'firebase';

//日付
var today = new Date();
//データベース
var database = firebase.database();

var config = {
  type: 'line',
  data: {
     labels:[],
	 datasets: [{
	    label: '体重',
		backgroundColor: window.chartColors.white,
		borderColor: window.chartColors.blue,
		//data: [80,78,79,77],
        data: [],
		fill: false,
	  }]
  },
  options: {
	 responsive: true,
	 title: {
	  display: true,
	  text: '体重管理'
	 },
	 tooltips: {
	  mode: 'index',
	  intersect: false,
	 },
      hover: {
		mode: 'nearest',
		intersect: true
	  },
	  scales: {
		xAxes: [{
		  display: true,
		  scaleLabel: {
            display: true,
			labelString: '２０２１'
		  }
		 }],
		yAxes: [{
          ticks:{
            suggestedMin: 60,
            suggestedMax: 85,
            stepSize: 5
          },
		  display: true,
		  scaleLabel: {
			display: true,
			labelString: 'Weight [kg]'
		  }
		}]
	  }
    }
  };
  
  
  //初期設定
  window.onload = function() {

    //初期データ読み込み

	var ref_data = firebase.database().ref('dataAndTime');
	ref_data.on('value', (snapshot) => {
	  const data = snapshot.val();
	  config.data.labels = data;
	});

	var weight = firebase.database().ref('weight');
	weight.on('value', (snapshot) => {
	  const data = snapshot.val();
      config.data.datasets.forEach(function(dataset) {
        for(let i=0;i<DATA.bodyWeight.length;i++){
		  dataset.data.push(Number(DATA.bodyWeight[i]));
        }
	  });
	});


	var ctx = document.getElementById('canvas').getContext('2d');	
	window.myLine = new Chart(ctx, config);

  };
  //add Dataボタン
  document.getElementById('addData').addEventListener('click', function() {
	if (config.data.datasets.length > 0) {
        var day = today.getFullYear() + "-" + (today.getMonth()+1)+"-" + today.getDate() + "T" + today.getHours() + ":" + today.getMinutes()+ ":" + today.getSeconds();
		var val = document.getElementById("bodyWeightData").value;
		config.data.labels.push(day);
		
		firebase.database().ref().set({
			dataAndTime:day,
			weight:val
		});

		config.data.datasets.forEach(function(dataset) {
			dataset.data.push(val);
		});

		window.myLine.update();
	}
  });