import { LightningElement, api } from 'lwc';
import deleteTodo from '@salesforce/apex/ToDoController.deleteTodo';
import updateTodo from '@salesforce/apex/ToDoController.updateTodo';

export default class ToDoItem extends LightningElement {
    @api todoId;
    @api todoName;
    @api done = false;

    get Class(){
        return this.done ? 'container completed' : 'container upcoming'
    }

    deleteHandler(){
        deleteTodo({ todoId: this.todoId })
        .then(result => {
        this.dispatchEvent(new CustomEvent("delete", { detail: this.todoId }));
        })
        .catch(error => {
        console.error("Error in updatig records ", error);
        });
    }

    update(){
        const todo = {
            todoId: this.todoId,
            done: !this.done,
            todoName: this.todoName
        };

        updateTodo({ payload: JSON.stringify(todo) })
        .then(result => {
        const updateEvent = new CustomEvent("update", { detail: todo });
        this.dispatchEvent(updateEvent);
        })
        .catch(error => {
        console.error("Error in updatig records ", error);
        });
    }
}