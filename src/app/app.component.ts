import { Component } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ticketingsystem';

  constructor(private apiService: ApiService){}

  // ngOnInit():void{
  //   this.getAllUsers();
  // }

  // getAllUsers(){
  //   this.apiService.getAllData().subscribe((res)=>{
  //     this.tickets = res.data;
  //   });
  // }
  
}
