const root = document.querySelector(':root');
const rootStyles = getComputedStyle(root);
const backgroundColor = rootStyles.getPropertyValue('--background-color');
const input = document.getElementById('board-size');
const button = document.getElementById('generate-board');
const boardContainer = document.getElementById('board-container');
const min_size = Number(input.min);
const max_size = Number(input.max);


const rgbToHex = (string) => { 
  const convert = (r, g, b) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')

  if(!string) return '';
  if(string[0] === "#" && string.length === 7) return string;
  if(string.substring(0,3) !== "rgb") return '';

  let str_aux = string.split("(")[1];
  str_aux = str_aux.split(")")[0];
  const rgb = str_aux.split(",");
  return convert(Number(rgb[0]), Number(rgb[1]), Number(rgb[2]));
}
function setBGColor(source, color) {
  const obj = source;
  obj.style.setProperty('background-color', color);
  return true;
}

function paint(source) {
  const obj = source;
  const selected = rgbToHex (rootStyles.getPropertyValue('--selected-color').trim());
  if (rgbToHex(obj.target.style.backgroundColor) !== selected) setBGColor(obj.target, selected);
  else setBGColor(obj.target, backgroundColor);
  return true;
}

function setListeners(target, fun, type) {
  const list = document.getElementsByClassName(target);
  for (let i = 0; i < list.length; i += 1) {
    list[i].addEventListener(type, fun);
  }
  return true;
}

function removeListeners(target, fun, type) {
  const list = document.getElementsByClassName(target);
  for (let i = 0; i < list.length; i += 1) {
    list[i].removeEventListener(type, fun);
  }
  return true;
}


function setSelected(source) {
  const element = source.target;
  const bgColor = element.value;
  root.style.setProperty('--selected-color', bgColor);
  return true;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateColors() {
  const prim = getRandomInt(172, 256);
  const sec = [getRandomInt(64, 172), getRandomInt(0, 128)];
  const tone = getRandomInt(0,202);
  root.style.setProperty('--first-color', `rgb(${tone},${tone},${tone})`);
  let flag = Math.round(Math.random());
  root.style.setProperty('--second-color', `rgb(${prim},${sec[flag]},${sec[1 - flag]})`);
  flag = Math.round(Math.random());
  root.style.setProperty('--third-color', `rgb(${sec[1 - flag]},${prim},${sec[flag]})`);
  flag = Math.round(Math.random());
  root.style.setProperty('--fourth-color', `rgb(${sec[1 - flag]},${sec[flag]},${prim})`);
  return true;
}

function initializeColors(){
  const colors = document.getElementsByClassName("color");
  colors[0].value = rgbToHex(rootStyles.getPropertyValue("--first-color"));
  colors[1].value = rgbToHex(rootStyles.getPropertyValue("--second-color"));
  colors[2].value = rgbToHex(rootStyles.getPropertyValue("--third-color"));
  colors[3].value = rgbToHex(rootStyles.getPropertyValue("--fourth-color"));

}

function clearBoard() {
  const pixelList = document.getElementsByClassName('pixel');
  for (let i = 0; i < pixelList.length; i += 1) setBGColor(pixelList[i], backgroundColor);
}

function generateBoard() {
  const size = input.value;
  //root.style.setProperty('--size', size);
  renderBoard(size);
  return true;
}

function setValue(src) {
  const source = src.target;
  const value = Number(source.value);
  if (value < min_size) source.value = min_size;
  if (value > max_size) source.value = max_size;
  renderBoard(source.value);
}

function deleteBoard() {
  removeListeners('pixel', paint, 'click');
  while(boardContainer.firstChild) {
    let node = boardContainer.firstChild; 
    while (node.firstChild) node.removeChild(node.firstChild);
    boardContainer.removeChild(node);
  }
}

function renderBoard(qtd) {
  deleteBoard();
  let container = document.createElement('div');
  container.setAttribute('id','pixel-board');
  for (let i = 0; i < qtd; i++) {
    let line = document.createElement('div');
    line.classList.add('line');
    for(let j = 0; j < qtd; j++) {
      let pixel = document.createElement('span');
      pixel.classList.add('pixel');
      line.appendChild(pixel);
    }
    container.appendChild(line);
  }
  boardContainer.appendChild(container);
  setListeners('pixel', paint, 'click');
}

window.onload = (() => {
  renderBoard(5);
  setListeners('color',setSelected,'input');
  setListeners('color',setSelected,'click');

  setListeners('clear', clearBoard, 'click');
  setListeners('generate-board', generateBoard, 'click');
  setListeners('board-size', setValue, 'input');

  
  generateColors();
  initializeColors();

})();
