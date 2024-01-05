import { Component, Injector, OnInit, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { Task } from '../../models/task.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {



  tasks = signal<Task[]>([]);

  filter = signal<'all' | 'pending' | 'completed'>('all');
  tasksByfilter = computed(() => {
    const filter = this.filter();
    const tasks = this.tasks();
    if(filter === 'pending'){
      return tasks.filter(task => !task.completed);
    }
    if(filter === 'completed'){
      return tasks.filter(task => task.completed);
    }
    return tasks;
  });

  newTaskControl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3),
    ]
  });

  injector = inject(Injector);

  ngOnInit(): void {
    const storage = localStorage.getItem('tasks');
    if(storage){
      const tasks = JSON.parse(storage);
      this.tasks.set(tasks);
    }
    this.trackTasks();
  }

  trackTasks(){
    effect(() => {
      const tasks = this.tasks();
      console.log(tasks);
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }, { injector: this.injector});
  }


  changeHandler(){
    if(this.newTaskControl.valid){
      const value = this.newTaskControl.value.trim();
      if(value !== ''){
        this.addTask(value);
        this.newTaskControl.setValue('');
      }
    }
  }

  addTask(title: string){
    const newTask = {
      id: Date.now(),
      title: title,
      completed: false
    };
    this.tasks.update((tasks) => [...tasks, newTask]);
  }

  deleteTask(index: number){
    this.tasks.update((tasks) =>
      tasks.filter((tast, position) => position !== index));
  }

  updateTasks(index: number){
    this.tasks.update((task) => {
      return task.map((task, position) => {
        if(position === index){
          return {
            ...task,
            completed: !task.completed
          }
        }
        return task;
      })
    })
  }

  updateTaskEditingMode(index: number){
    this.tasks.update((task) => {
      return task.map((task, position) => {
        if(position === index){
          return {
            ...task,
            editing: true
          }
        }
        return {
          ...task,
          editing: false
        };
      })
    });
  }

  updateTaskText(index: number, event: Event){
    const input = event.target as HTMLInputElement;
    this.tasks.update((task) => {
      return task.map((task, position) => {
        if(position === index){
          return {
            ...task,
            title: input.value,
            editing: false
          }
        }
        return task;
      })
    });
  }

  changeFilter(filter: 'all' | 'pending' | 'completed'){
    this.filter.set(filter);
  }

}
