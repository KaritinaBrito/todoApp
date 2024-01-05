import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators} from '@angular/forms'

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})
export class LabsComponent {
  welcome = 'Hola desde el componente!';
  tasks = signal([
    'Instalar el Angular CLI',
    'Crear proyecto',
    'Crear componente',
    'Crear servicio'
  ]);

  name = signal('Karen');
  age =  35;
  disabled = true;
  img = "https://picsum.photos/id/237/200/300";

  person = signal({
    name: 'Karen',
    age: 35,
    avatar: "https://picsum.photos/id/237/200/300"
  });

  colorControl = new FormControl();
  widthControl = new FormControl(50, {
    nonNullable: true,
  });
  nameControl = new FormControl('nicolas', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3)
    ]
  });

  constructor(){
    this.colorControl.valueChanges.subscribe(value => {
      console.log(value)
    }
    );

  }

  clickHandler(){
    alert('HII');
  }

  changeHandler(event: Event){
    const input = event.target as HTMLInputElement;
    const newValue = input.value
    this.name.set(newValue);
  }

  keydown(event: KeyboardEvent){
    const input = event.target as HTMLInputElement;
    console.log(input.value);
  }

  changeAge(event: Event){
    const input = event.target as HTMLInputElement;
    const newValue = input.value
    this.person.update(prevState => {
      return {
        ...prevState,
        age: parseInt(newValue, 10)
      }
    });
  }

  changeName(event: Event){
    const input = event.target as HTMLInputElement;
    const newValue = input.value
    this.person.update(prevState => {
      return {
        ...prevState,
        name: newValue
      }
    });
  }
}
