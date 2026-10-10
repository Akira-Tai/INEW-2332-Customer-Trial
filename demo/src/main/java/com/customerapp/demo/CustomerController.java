package com.customerapp.demo;

import com.customerapp.demo.Customer;
import com.customerapp.demo.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private CustomerRepository repository;

    @GetMapping
    public List<Customer> getAllCustomers() {
        return repository.findAll();
    }

    @PostMapping
    public Customer createCustomer(@RequestBody Customer customer) {
        return repository.save(customer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @RequestBody Customer details) {
        Customer customer = repository.findById(id).orElseThrow();
        customer.setName(details.getName());
        customer.setAddressLine1(details.getAddressLine1());
        customer.setAddressLine2(details.getAddressLine2());
        customer.setCity(details.getCity());
        customer.setState(details.getState());
        customer.setZip(details.getZip());
        
        return ResponseEntity.ok(repository.save(customer));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        Customer customer = repository.findById(id).orElseThrow();
        repository.delete(customer);
        return ResponseEntity.noContent().build();
    }
}