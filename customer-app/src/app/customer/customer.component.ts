import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../customer.service';
import { Customer } from '../customer.model';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './customer.component.html'
})
export class CustomerComponent implements OnInit {
  private customerService = inject(CustomerService);

  // Using Signals for state management
  customers = signal<Customer[]>([]);
  currentCustomer = signal<Customer>(this.getEmptyCustomer());
  isEditing = signal<boolean>(false);

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe(data => this.customers.set(data));
  }

  saveCustomer(): void {
    const customer = this.currentCustomer();
    if (this.isEditing() && customer.id) {
      this.customerService.updateCustomer(customer.id, customer).subscribe(() => {
        this.loadCustomers();
        this.resetForm();
      });
    } else {
      this.customerService.createCustomer(customer).subscribe(() => {
        this.loadCustomers();
        this.resetForm();
      });
    }
  }

  editCustomer(customer: Customer): void {
    // Clone the object to avoid immediate two-way binding mutation
    this.currentCustomer.set({ ...customer });
    this.isEditing.set(true);
  }

  deleteCustomer(id: number): void {
    this.customerService.deleteCustomer(id).subscribe(() => this.loadCustomers());
  }

  resetForm(): void {
    this.currentCustomer.set(this.getEmptyCustomer());
    this.isEditing.set(false);
  }

  private getEmptyCustomer(): Customer {
    return { name: '', addressLine1: '', addressLine2: '', city: '', state: '', zip: '' };
  }
}