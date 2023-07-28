import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Ticket } from './types/ticket.type';

@Component({
  selector: 'app-customer-page',
  templateUrl: './customer-page.component.html',
  styleUrls: ['./customer-page.component.css'],
})
export class CustomerPageComponent {
  ticketForm: FormGroup;
  editForm: FormGroup;
  today = new Date();
  showEditForm = false;
  foundID = 0;
  tickets: Ticket[] = [];

  constructor(private formBuilder: FormBuilder, private http: HttpClient, public dialog: MatDialog, private cdr: ChangeDetectorRef) {
    this.ticketForm = this.formBuilder.group({
      t_id: [Number],
      name: ['', Validators.required],
      type: ['', Validators.required],
      desc: ['', Validators.required],
      date: [this.today]
    });
    this.editForm = this.formBuilder.group({
      type: [''],
      status: ['', Validators.required],
      priority: ['', Validators.required]
    });
    this.getAllTickets();
  }

  // Read
  getAllTickets() {
    this.http.get("http://localhost:3000/read")
    .subscribe((resultData: any)=>{
      console.log(this.tickets);
      this.tickets = resultData;
      this.cdr.detectChanges();
    })
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
        date: this.ticketForm.value.date
      };
      this.http.post("http://localhost:3000/create", newTicket).
      subscribe((resultData:any) => {
        console.log(resultData);
        alert("Ticket Added Successfully!");
        this.getAllTickets;
      })
    } else {
      alert("Something ain't right, chief");
    }
  }

  private getLatestTId(): number {
    return Math.max(...this.tickets.map(ticket => ticket.t_id), 0);
  }

  findID(event: any) {
    const buttonId = event.target.id;
    this.foundID = this.tickets.find(ticket => "btn_" + ticket.t_id === buttonId)?.t_id || 0;
  }

  onEdit() {
    if (this.editForm.valid) {
      const ticketToEdit = this.tickets.find(ticket => ticket.t_id === this.foundID);
      if (ticketToEdit) {
        // Check if any of the fields are empty, if it is not empty, use the new one
        const updatingType = this.editForm.value.type !== '' ? this.editForm.value.type : ticketToEdit.type;
        const updatingStatus = this.editForm.value.status !== '' ? this.editForm.value.status : ticketToEdit.status;
        const updatingPriority = this.editForm.value.priority !== '' ? this.editForm.value.priority : ticketToEdit.priority;

        let bodyData = {
          "type": updatingType,
          "status": updatingStatus,
          "priority": updatingPriority
        }

        this.http.put("http://localhost:3000/update/" +this.foundID,bodyData)
        .subscribe((resultData:any)=>{
          console.log(resultData);
          alert("Updated!");
          this.getAllTickets();
        })

        alert("Success!");
        this.showEditForm = false;
      }
    } else {
      alert("Your editing skills ain't right, chief");
    }
  }

  edit() {
    this.showEditForm = !this.showEditForm;
  }

  delete() {
    const ticketToDelete = this.tickets.find(ticket => ticket.t_id === this.foundID);
    if (ticketToDelete && confirm(`[${ticketToDelete.t_id}] Are you sure to delete ${ticketToDelete.name}'s ${ticketToDelete.type} ticket with description\n'${ticketToDelete.desc}'?\nIt is currently ${ticketToDelete.status} and has ${ticketToDelete.priority} priority.\n\nCreated on ${ticketToDelete.date}`)) {
        this.http.delete("http://localhost:3000/delete/" + this.foundID)
            .subscribe((resultData: any) => {
                console.log(resultData);
                alert("Deleted!");
                console.log("fdsfsd0" + this.tickets);
                this.getAllTickets(); // Move this inside the subscribe block
            });
    }
}


  priorityColor = 'pLow';

  priorityCheck(priority: string) {
    switch (priority) {
      case "Medium":
        this.priorityColor = 'pMed';
        break;
      case "High":
        this.priorityColor = 'pHigh';
        break;
      case "Critical":
        this.priorityColor = 'pCrit';
        break;
      default:
        this.priorityColor = 'pLow';
    }
    return true;
  }
}
