import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Ticket } from '../types/ticket.type';

@Component({
  selector: 'app-customer-page',
  templateUrl: './customer-page.component.html',
  styleUrls: ['./customer-page.component.css'],
})
export class CustomerPageComponent {
  ticketForm: FormGroup;
  today = new Date();
  showEditForm = false;
  foundID = 0;
  tickets: Ticket[] = [];

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
    this.ticketForm = this.formBuilder.group({
      t_id: [Number],
      name: ['', Validators.required],
      type: ['', Validators.required],
      desc: ['', Validators.required],
      date: [this.today],
      img: ['', Validators.required]
    });
    this.getAllTickets();
  }

  // Read
  getAllTickets() {
    this.http.get("http://localhost:3000/read")
    .subscribe((resultData: any)=>{
      console.log(this.tickets);
      this.tickets = resultData;
    })
  }

  private getLatestTId(): number {
    return Math.max(...this.tickets.map(ticket => ticket.t_id), 0);
  }

  onSubmit() {
    if (this.ticketForm.valid) {
      const newTicket: Ticket = {
        t_id: this.getLatestTId() + 1,
        name: this.ticketForm.value.name,
        type: this.ticketForm.value.type,
        desc: this.ticketForm.value.desc,
        status: "Open",
        priority: "N/a",
        date: this.ticketForm.value.date,
        img: this.ticketForm.value.img,
      };
      this.http.post("http://localhost:3000/create", newTicket).
      subscribe((resultData:any) => {
        console.log(resultData);
        alert("Ticket Added Successfully!");
        this.getAllTickets;
        this.ticketForm.reset();
      })
    } else {
      alert("Something ain't right, chief");
    }
  }
  
}
