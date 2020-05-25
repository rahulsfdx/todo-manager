import { LightningElement, track } from 'lwc';
import addTodo from '@salesforce/apex/ToDoController.addTodo';
import getCurrentTodos from '@salesforce/apex/ToDoController.getCurrentTodos';

export default class ToDoManager extends LightningElement {
    @track time;
    @track greeting;
    @track todos = [];

    connectedCallback(){
        this.getTime();
        //this.sampleTodos();
        this.fetchTodos();

        setInterval(() =>{
            this.getTime();
        }, 20000);
    }

    getTime(){
        const today = new Date();
        const hour = today.getHours();
        const min = today.getMinutes();
        this.time = `${this.getHour(hour)}:${this.getMin(min)} ${this.getAmPm(hour)}`;
        this.greeting = 'Good ' + this.getGreeting(hour) + '!';
    }

    getHour(hour){
        return hour === 0 ? 12 : hour > 12 ? (hour - 12) : hour;
    }

    getMin(min){
        return min < 10 ? '0' + min : min;
    }

    getAmPm(hour){
        return hour >= 12 ? 'PM' : 'AM'; 
    }

    getGreeting(hour){
        return hour < 12 ? 'Morning' : hour > 17 ? 'Evening' : 'Afternoon'
    }

    addTodo(){
        const input = this.template.querySelector("lightning-input");
        const todo = {
            todoName : input.value,
            done : false
        }
        addTodo({payload : JSON.stringify(todo)})
        .then(result => {
            console.log("Inserted");
            this.fetchTodos();
        }).catch(error => {
            console.log("Error : " +  error);
            
        })
        //this.todos.push(todo);
        input.value = "";
    }

    fetchTodos(){
        getCurrentTodos().then(result => {
            console.log("Retrieved todos : ", result.length);
            this.todos = result;
        }).catch(error =>{
            console.log("Error fetching: " + error)
        });
    }

    updateTodoHandler(){
        this.fetchTodos();
    }

    deleteTodoHandler(){
        this.fetchTodos();
    }

    get upcomingTasks(){
        return this.todos && this.todos.length ? this.todos.filter(todo => !todo.done) : [];
    }

    get completedTasks(){
        return this.todos && this.todos.length ? this.todos.filter(todo => todo.done) : [];
    }

}