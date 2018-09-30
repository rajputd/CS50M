const classNames = {
  TODO_ITEM: 'todo-container',
  TODO_CHECKBOX: 'todo-checkbox',
  TODO_TEXT: 'todo-text',
  TODO_DELETE: 'todo-delete',
}

const list = document.getElementById('todo-list')
const itemCountSpan = document.getElementById('item-count')
const uncheckedCountSpan = document.getElementById('unchecked-count')

let itemCount = 0
let uncheckedCount = 0
let id = 0

function newTodo() {
	//update item and unchecked counts
	itemCountSpan.innerHTML = ++itemCount
	uncheckedCountSpan.innerHTML = ++uncheckedCount

	//add new todo item to list
	//list.innerHTML += generateToDoItem(id)
	list.appendChild(generateToDoItem(id))

	//update id variable to ensure unique ids
	id++
}

function generateToDoItem(id) {

	//create todo container
	let todo = document.createElement('li')
	todo.id = id
	todo.className = 'todo-container'

	let checkbox = document.createElement('input')
	checkbox.type = 'checkbox'
	checkbox.className = 'todo-checkbox'
	checkbox.addEventListener('change', updateUncheckedCount)

	let deleteButton = document.createElement('button')
	deleteButton.className = 'todo-delete'
	deleteButton.addEventListener('click', deleteTodo)

	let content = document.createTextNode('todo ' + id)

	todo.appendChild(checkbox)
	todo.appendChild(content)
	todo.appendChild(deleteButton)

	return todo
}

function updateUncheckedCount() {
	if (this.checked) {
		uncheckedCountSpan.innerHTML = --uncheckedCount
	} else {
		uncheckedCountSpan.innerHTML = ++uncheckedCount
	}
}

function deleteTodo() {
	let todo  = this.parentElement
	let checkbox = todo.firstChild

	//update uncheckedCount
	if(!checkbox.checked) {
		uncheckedCountSpan.innerHTML = --uncheckedCount
	}

	//update itemCount
	itemCountSpan.innerHTML = --itemCount

	//delete todo
	todo.remove()
}
