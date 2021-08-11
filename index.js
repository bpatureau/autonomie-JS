import {fabric} from 'fabric';
import { saveAs } from 'file-saver';
let activeColor = "black"
let activeTool = "crayon"
let stroke = "enable"
let gridCellSize = 24
let toolkit = document.querySelector(".toolkit")
let buttons = document.querySelector(".buttons")
let color = document.querySelector(".color")
const pixelCanvas = new fabric.Canvas('pixelCanvas', {
  backgroundColor: 'white',
  selection: false,
});

pixelCanvas.setHeight(480)
pixelCanvas.setWidth(480)
let rect=[]
let i = 0

for (let y = 0; y < 24; y++) {
  // y => 0 à 24
  for (let x = 0; x < 24; x++) {
    // x => 0 à 24
    console.log('X:',x,'Y:',y);

    const gridRect = new fabric.Rect({
      width: gridCellSize,
      height: gridCellSize,
      fill: "transparent",
      stroke: "black",
      strokeWidth: 1,

      left: x * gridCellSize,
      top: y * gridCellSize,

      selectable:false
    });

    console.log(gridRect);


    pixelCanvas.add(gridRect);

  }
}
console.log(rect)

color.addEventListener("change", e => {
  e.preventDefault;
  console.log(e.target.value)
  activeColor = e.target.value
})

  pixelCanvas.on('mouse:up', function(options) {
    if(activeTool === "crayon"){
    console.log(options.currentTarget.top);
    console.log(options.currentTarget.fill);
    options.target.set({fill: activeColor});
    pixelCanvas.renderAll()
  }else if(activeTool === "gomme"){
    console.log(options.currentTarget.top);
    console.log(options.currentTarget.fill);
    options.target.set({fill: 'transparent'});
    pixelCanvas.renderAll()
  }

});

toolkit.addEventListener("change", e => {
  e.preventDefault;
  console.log(e.target.value)
  activeTool = e.target.value
})

buttons.addEventListener("click", e => {
  e.preventDefault;
  if(e.target.innerHTML === "reset"){
    pixelCanvas._objects.forEach(element => {
      element.set({fill: 'transparent'})
    });
    pixelCanvas.renderAll()
  }
  if(e.target.classList.contains("disable")){
    if(stroke === "enable"){
    pixelCanvas._objects.forEach(element => {
      element.set({stroke: "transparent"})
      e.target.innerHTML = "enable grid"
    });
    stroke = "disable"
    pixelCanvas.renderAll()
  }else{
    pixelCanvas._objects.forEach(element => {
      element.set({stroke: "black"})
      e.target.innerHTML = "disable grid"
    });
    stroke = "enable"
    pixelCanvas.renderAll()
  }
  }
  if(e.target.classList.contains("save")){
      const json = pixelCanvas.toJSON();
      localStorage.setItem('design', JSON.stringify(json));
  }
  if(e.target.classList.contains("load")){
    if (localStorage.getItem("design") !== null) {
      let json = localStorage.getItem("design");
      pixelCanvas.loadFromJSON(JSON.parse(json)), pixelCanvas.renderAll.bind(pixelCanvas)
      pixelCanvas._objects.forEach(element => {
        element.set({selectable: false})
      });
  }
}
if(e.target.classList.contains("download")){
  console.log("oui")
  const smallPixelCanvas = new fabric.Canvas('smallPixelCanvas', {
    backgroundColor: 'white',
    selection: false,
    height: 24,
    width: 24
  });

  pixelCanvas._objects.forEach(element => {
    console.log(element)
    const smallRect = new fabric.Rect({
      width: 1,
      height: 1,
      fill: element.fill,

      left: element.left/gridCellSize,
      top: element.top/gridCellSize,

      selectable:false
    });
    smallPixelCanvas.add(smallRect)
  });
  
  var canvas = document.getElementById("pixelCanvas");
  canvas.toBlob(function(blob) {
      saveAs(blob, "image.png");
});
}
})
