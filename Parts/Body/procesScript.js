function randomRGB(alpha = null){
  let r = (Math.ceil(Math.random() * 255)).toString() + ", ";
  let g = (Math.ceil(Math.random() * 255)).toString() + ", ";
  let b = (Math.ceil(Math.random() * 255)).toString() + "";
  let start, end;

  if(alpha == null){
    start = "rgb(";
    end = ")";
  }else{
    start = "rgba(";
    end = ", " + alpha.toString() + ")";
  }

  return start + r + g + b + end;
}

let previousBox;
let pData = {};
let activeCon = {};

//https://www.chartjs.org/docs/latest/getting-started/usage.html
function createBox(html, labels, data, name){
  pData[name] = {};

  let box = $(html);
  pData[name].box = box;

  let canvas = box.find("canvas.graphCanvas")[0].getContext('2d');
  pData[name].canvas = canvas;

  pData[name].chart = new Chart(canvas, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: randomRGB(0.7),
      }]
    },
    options: {
      legend: {
        display: false,
      },
      scales: {
          yAxes: [{
              ticks: {
                  beginAtZero: true
              }
          }]
      }
    }
  });

  $("#ProcessContainer").append(box);
}

function createCounter(name, number, total){
  activeCon[name] = {};

  let html = $(`<div class = 'activeCon' title = '`+name+`'>
    <span class = "circleNumber">` + number + "/" + total + `</span>
    <div class = 'halfCircle rightMoon'>
    </div>

    <div class = 'halfCircle leftMoon'>
    </div>

    <div class = "circleOverlay">

    </div>
  </div>`);

  html.attr('data-before', name);
  html.attr('data-after', "/" + total);

  $("#PM").append(html);
  html = $("#PM").find(".activeCon").last();

  //http://jsfiddle.net/d829nseo/15/
  function updateCircle(){
    let text = html.find("span.circleNumber").eq(0).text().replace(/\s/g, "").split("/");

    let total = text[1];
    let part = text[0];

    let frac = part / total;

    let left = html.find(".leftMoon").eq(0);
    let right = html.find(".rightMoon").eq(0);
    let overlay = html.find(".circleOverlay").eq(0);

    if(frac > 0.5){
      right.css("transform", "");
      right.addClass("switchMoon");

      left.removeClass("switchMoon");
      left.css("transform", "rotate(" + (frac - 0.5) * 360  + "deg)");
    }else{
      right.removeClass("switchMoon");
      right.css("transform", "rotate(" + frac * 360  + "deg)");

      left.css("transform", "");
    }

    overlay.text(part);
  }

  updateCircle();

  activeCon[name].html = html;
  activeCon[name].update = updateCircle;
}

$(document).ready(function() {
  $("#updateButton").click(updateCharts);

  ajax("Parts/Body/PHPScript/GetConnectionList.php", {range:30, step:3}, function(data){
    let parsedData = JSON.parse(data);

    let timeLabels = parsedData.timeHistory;
    let graphData = parsedData.graphData;
    let boxes = parsedData.boxes;
    for (let i = 0; i < parsedData.names.length; i++) {
      let name = parsedData.names[i].toLowerCase();

      let box = boxes[name];
      let labels = timeLabels[name];
      let numbers = graphData[name];

      createBox(box, labels, numbers, name);
    }

    setInterval(updateCharts, 30000);
  });

  ajax("Parts/Body/PHPScript/GetActiveConnections.php",{}, function (data){
    let parsedData = JSON.parse(data);

    let names = parsedData.names;
    let numbers = parsedData.numbers;
    let total = parsedData.totalCon;

    for(let i = 0; i < names.length && i < 8; i++)
    {
      let name = names[i];
      createCounter(name, numbers[name], total);
    }
  });

});

function getDate(timeString){
  let date = new Date();
  let dateArray = timeString.split(":");

  date.setHours(dateArray[0]);
  date.setMinutes(dateArray[1]);

  return date;
}

//https://www.chartjs.org/docs/latest/developers/updates.html
function updateCharts(){
  ajax("Parts/Body/PHPScript/GetConnectionList.php", {range:1, step:1}, function(data){
    let parsedData = JSON.parse(data);
    let currentDate = new Date();

    let timeLabels = parsedData.timeHistory;
    let graphData = parsedData.graphData;
    let boxes = parsedData.boxes;

    for (let i = 0; i < parsedData.names.length; i++) {
      let name = parsedData.names[i].toLowerCase();

      let box = boxes[name];
      let labels = timeLabels[name];
      let numbers = graphData[name];

      if(pData[name] != undefined){
        //pData[name].chart.data.labels.push(labels);
        for(let j = 0; j < numbers.length; j++){
          let inGraph = pData[name].chart.data.datasets[0].data[pData[name].chart.data.datasets[0].data.length - 1] == numbers[j];

          let stringDate = pData[name].chart.data.labels[pData[name].chart.data.labels.length - 1];
          let date = getDate(stringDate);

          let newDate = getDate(labels[j]);

          let timeDiff = (currentDate - date)/60000;

          if((!inGraph || (timeDiff >= 10 && numbers[j] != 0)) && date < newDate){
            pData[name].chart.data.datasets[0].data.push(numbers[j]);
            pData[name].chart.data.labels.push(labels[j]);
          }
        }

        pData[name].chart.update();
        pData[name].box.find("p.pAmount").eq(0).text("Verbindingen: " + pData[name].chart.data.datasets[0].data[pData[name].chart.data.datasets[0].data.length - 1]);
      }else{
        createBox(box, labels, numbers, name);
      }
    }
    let keys = Object.keys(pData);

    for(let i = keys.length - 1; i >= 0; i--)
    {
      let key = keys[i];

      for(let j = pData[key].chart.data.labels.length - 1; j >= 0; j--){
        let label = pData[key].chart.data.labels[j];
        let date = getDate(label);

        let timeDiff = (currentDate - date)/60000;

        if(timeDiff >= 45){
          pData[key].chart.data.labels.splice(j, 1);
          pData[key].chart.data.datasets[0].data.splice(j, 1);
          pData[key].chart.update();
        }
      }

      if(pData[key].chart.data.labels.length == 0){
        pData[key].box.remove();
        delete pData[key];
      }
    }

  });


  ajax("Parts/Body/PHPScript/GetActiveConnections.php",{}, function (data){
    let parsedData = JSON.parse(data);

    let names = parsedData.names;
    let numbers = parsedData.numbers;
    let total = parsedData.totalCon;

    for(let i = 0; i < names.length; i++)
    {
      let name = names[i];
      if(activeCon[name] == undefined){
        createCounter(name, numbers[name], total);
      }else{
        let html = activeCon[name].html;

        html.find(".circleNumber").eq(0).text(numbers[name] + "/" + total);
        html.attr('data-before', name);
        html.attr('data-after', "/" + total);

        activeCon[name].update();
      }
    }

     let keys = Object.keys(activeCon);
     for(let i = keys.length - 1; i >= 0; i--)
     {
       let key = keys[i];
       if(numbers[key] == undefined){
         activeCon[key].html.remove();
         if(pData[name] != undefined && pData[name].chart.data.datasets[0].data[pData[name].chart.data.datasets[0].data.length - 1] != 0){
           pData[key].chart.data.datasets[0].data.push(0);
           pData[key].box.find("p.pAmount").eq(0).text("Verbindingen: " + 0);

           let date = new Date();
           let dateS = date.getHours() + ":" + date.getMinutes();
           pData[key].chart.data.labels.push(dateS);
           pData[key].chart.update();
         }

         delete activeCon[key];
       }
     }
  });
}
