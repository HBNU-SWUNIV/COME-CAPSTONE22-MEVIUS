function onDragStart(event) {
  
  if(event.target.className == 'image')
  {
  	event
    .dataTransfer
    .setData('text/plain', event.target.parentElement.id);
  }
  else
  {
  	event
    .dataTransfer
    .setData('text/plain', event.target.id);	
  }
  

  event
  	.dataTransfer
  	.dropEffect = "move";

  event
    .currentTarget
    .style
    .backgroundColor = 'yellow';
}

function onDragOver(event) {
  event.preventDefault();
}

function onDrop(event) {
  event
  	.preventDefault();

  console.log(event)
  const id = event
    .dataTransfer
    .getData('text');

  const draggableElement = document.getElementById(id);

  const dropzone = event.target;

  dropzone.appendChild(draggableElement);
}