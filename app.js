const dotenv = require("dotenv")
dotenv.config()
const mongoose = require("mongoose")
const prompt = require("prompt-sync")()
const Customer = require("./models/Customer")

const connect = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log("Connected to MongoDB")
}

const menu = async () => {
  let exit = false
  while (!exit) {
    console.log("\nWelcome to the CRM")
    console.log("What would you like to do?")
    console.log("  1. Create a customer")
    console.log("  2. View all customers")
    console.log("  3. Update a customer")
    console.log("  4. Delete a customer")
    console.log("  5. Quit")

    const choice = prompt("Number of action to run: ")

    if (choice === "1") {
      await createCustomer()
    } else if (choice === "2") {
      await viewCustomers()
    } else if (choice === "3") {
      await updateCustomer()
    } else if (choice === "4") {
      await deleteCustomer()
    } else if (choice === "5") {
      exit = true
      console.log("Exiting...")
    } else {
      console.log("Invalid, please enter a number from 1 to 5.")
    }
  }

  mongoose.connection.close(() => {
    process.exit()
  })
}

// Update a customer
const updateCustomer = async () => {
  await viewCustomers()
  const id = prompt(
    "Copy and paste the id of the customer you would like to update here: "
  )
  const name = prompt("What is the customers new name? ")
  const age = parseInt(prompt("What is the customers new age?"))

  const updatedCustomer = await Customer.findByIdAndUpdate(
    id,
    { name, age },
    { new: true }
  )
  console.log("Customer updated successfully:", updatedCustomer)
}

// View all customers
const viewCustomers = async () => {
  const customers = await Customer.find()
  console.log("All Customers:")
  customers.forEach((customer) => {
    console.log(
      `id: ${customer._id} -- Name: ${customer.name}, Age: ${customer.age}`
    )
  })
}

// Create a customer
const createCustomer = async () => {
  const name = prompt("Enter the customers name: ")
  const age = parseInt(prompt("Enter the customers age: "))

  const customer = new Customer({ name, age })
  await customer.save()
  console.log("Customer created successfully.")
}

// Delete a customer
const deleteCustomer = async () => {
  await viewCustomers()
  const id = prompt(
    "Copy and paste the id of the customer you would like to delete here: "
  )
  const deletedCustomer = await Customer.findByIdAndDelete(id)
  console.log("Customer deleted successfully:", deletedCustomer)
}

const start = async () => {
  await connect()
  await menu()
}

start()

// const prompt = require("prompt-sync")()

// const username = prompt("What is your name? ")

// console.log(`Your name is ${username}`)
