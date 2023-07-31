import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Ticket } from '../types/ticket.type';

// Materials
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
@Component({
  selector: 'app-employee-page',
  templateUrl: './employee-page.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  styleUrls: ['./employee-page.component.css']
})
export class EmployeePageComponent {

  constructor(private formBuilder: FormBuilder, private http: HttpClient, public dialog: MatDialog) {
    this.editForm = this.formBuilder.group({
      type: [''],
      status: ['', Validators.required],
      priority: ['', Validators.required]
    });
    this.getAllTickets();
  }

  expandedElement: any | null = null;
  editForm: FormGroup;
  foundID = 0;

  @Output() dataToSend = new EventEmitter();
  tickets: Ticket[] = [];
  data = { message: 'Hello from sender!' };
  
  numOfTickets = 0;

  // Read
  getAllTickets() {
    this.http.get<Ticket[]>("http://localhost:3000/read")
      .subscribe(
        (resultData: Ticket[]) => {
          this.tickets = resultData;
          this.numOfTickets = this.tickets.length;

          this.ticketOpen = this.tickets.filter(ticket => ticket.status === "Open").length;
          this.ticketClosed = this.tickets.filter(ticket => ticket.status === "Closed").length;
          this.ticketPending = this.tickets.filter(ticket => ticket.status === "Pending").length;
          this.ticketOnHold = this.tickets.filter(ticket => ticket.status === "On Hold").length;

          this.ticketNo = this.tickets.filter(ticket => ticket.priority === "N/a").length;
          this.ticketLow = this.tickets.filter(ticket => ticket.priority === "Low").length;
          this.ticketMed = this.tickets.filter(ticket => ticket.priority === "Medium").length;
          this.ticketHigh = this.tickets.filter(ticket => ticket.priority === "High").length;
          this.ticketCrit = this.tickets.filter(ticket => ticket.priority === "Critical").length;
        },
        error => {
          console.error("Error fetching tickets:", error);
          alert("Sum Ting Wong");
          // Handle error (e.g., show error message to the user)
        }
      );
  }

  ticketOpen = this.countStatus(this.tickets, "Open");
  ticketClosed = this.countStatus(this.tickets, "Closed");
  ticketPending = this.countStatus(this.tickets, "Pending");
  ticketOnHold = this.countStatus(this.tickets, "On Hold");

  ticketNo = this.countPriority(this.tickets, "N/a");
  ticketLow = this.countPriority(this.tickets, "Low");
  ticketMed = this.countPriority(this.tickets, "Medium");
  ticketHigh = this.countPriority(this.tickets, "High");
  ticketCrit = this.countPriority(this.tickets, "Critical");

  onEdit() {
    if (this.editForm.valid) {
      const ticketToEdit = this.tickets.find(ticket => ticket.t_id === this.foundID);
      const myType = this.editForm.value.type;
      const myStatus = this.editForm.value.status;
      const myPriority = this.editForm.value.priority;
      if (ticketToEdit) {
        // Check if any of the fields are empty, if it is not empty, use the new one
        const updatingType = myType !== '' ? myType : ticketToEdit.type;
        const updatingStatus = myStatus !== '' ? myStatus : ticketToEdit.status;
        const updatingPriority = myPriority !== '' ? myPriority : ticketToEdit.priority;

        let bodyData = {
          "type": updatingType,
          "status": updatingStatus,
          "priority": updatingPriority
        }

        this.http.put("http://localhost:3000/update/" +this.foundID,bodyData)
        .subscribe((resultData:any)=>{
          this.getAllTickets();
          alert("Updated!");
        });

      }
    } else {
      alert("Your editing skills ain't right, chief");
    }
    this.expandedElement = this.expandedElement!
  }

  findID(event: any) {
    const buttonId = event.target.id;
    this.foundID = this.tickets.find(ticket => "btn_" + ticket.t_id === buttonId)?.t_id || 0;
  }

  delete() {
    const ticketToDelete = this.tickets.find(ticket => ticket.t_id === this.foundID);
    if (ticketToDelete && confirm(`[${ticketToDelete.t_id}] Are you sure to delete ${ticketToDelete.name}'s ${ticketToDelete.type} ticket with description\n'${ticketToDelete.desc}'?\nIt is currently ${ticketToDelete.status} and has ${ticketToDelete.priority} priority.\n\nCreated on ${ticketToDelete.date}`)) {
        this.http.delete("http://localhost:3000/delete/" + this.foundID)
            .subscribe((resultData: any) => {
                this.getAllTickets();
                alert("Successfully deleted record!");
            });
    }
  }

  countStatus(tickets: Ticket[], status: string) {
    let statusCount = 0
    for (let t of tickets) {
      if (t.status == status) {
        statusCount += 1;
      }
    }
    return statusCount;
  }

  countPriority(tickets: Ticket[], priority: string) {
    let priorityCount = 0
    for (let t of tickets) {
      if (t.priority == priority) {
        priorityCount += 1;
      }
    }
    return priorityCount;
  }

  toggleExpandedRow(t: any): void { // Replace 'any' with the type of your 'tickets' array elements
    this.expandedElement = this.expandedElement === t ? null : t;
  }

  hideEditForm() {
    this.expandedElement = !this.expandedElement
  }
  
  openDialog() {
    this.dataToSend.emit(this.data);
    this.dialog.open(DialogElementsExampleDialog);
  }

}

@Component({
  selector: 'dialog-elements-example-dialog',
  templateUrl: 'imageDialog.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogElementsExampleDialog {
    @Input() data: any;
}
