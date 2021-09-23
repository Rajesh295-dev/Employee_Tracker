
//Dependencies
const  {prompt} = require("inquirer");
const dataB= require("./utils");
require("console.table");

//Dependencies for ascii font
const ascii = require('ascii-art-font');

//ascii logo 
logoDisplay();


//creates the ascii logo
function  logoDisplay (){
    ascii.create('    Employee','Doom',  (err, result) => {
        if (err) throw err;
           console.log(result);
        ascii.create('      Manager','Doom',(err, result) => {
            if (err) throw err;
            console.log(result);
            
            showPrompts();
        });
    });
     
}

//Initialize the company Application
init();

function init(){
    showPrompts
}

function  showPrompts () {
  prompt([
      {
          // TODO list which displays when npm runs
          type: "list",
          name: "choice",
          message: "What would you like to do?",
          choices: [
              {
                  name: "View All Departments", value: "VIEW_DEPARTMENTS"
              },
              {
                  name: "View All Roles", value: "VIEW_ROLES"
              },
              {
                  name: "View All Employees", value: "VIEW_EMPLOYEES"
              },

              {
                  name: "Add a Department", value: "ADD_DEPARTMENT"
              },
              {
                  name: "Add a Role", value: "ADD_ROLE"
              },
              {
                  name: "Add an Employee", value: "ADD_EMPLOYEE"
              },
              {
                  name: "Update Employee Role", value: "UPDATE_EMPLOYEE_ROLE"
              },
              {
                  name: "Quit", value: "QUIT"
              }
          ]
      }

  ]).then(res => {
      let choice = res.choice;
      // Excutes one of the function corresponing to user slection
      switch (choice) {
          case "VIEW_DEPARTMENTS":
              viewAllDepartments();
              break;
          case "VIEW_ROLES":
              viewAllRoles();
              break;
          case "VIEW_EMPLOYEES":
              viewAllEmployees();
              break;
          case "ADD_DEPARTMENT":
              createDepartment();
              break;
          case "ADD_ROLE":
              createRole();
              break;
          case "ADD_EMPLOYEE":
              createEmployee();
              break;
          case "UPDATE_EMPLOYEE_ROLE":
              updateEmployeeRole();
              break;
          default:
              quit();
      }
  }
  )
}


// Function to show all employees
function viewAllEmployees() {
  dataB.allEmployees()
      .then(([rows]) => {
          let employees = rows;
          console.log("\n");
          console.table(employees);
      })
      .then(() => showPrompts());
}

// Function to show all roles
function viewAllRoles() {
  dataB.allRoles()
      .then(([rows]) => {
          let roles = rows;
          console.log("\n");
          console.table(roles);
      })
      .then(() => showPrompts());
}

// Function to show all deparments
function viewAllDepartments() {
  dataB.allDepartments()
      .then(([rows]) => {
          let departments = rows;
          console.log("\n");
          console.table(departments);
      })
      .then(() => showPrompts());
}

// This function add a role
function createRole() {
  dataB.allDepartments()
      .then(([rows]) => {
          let departments = rows;
          const departmentChoices = departments.map(({ id, name }) => ({
              name: name,
              value: id
          }));

          prompt([
              {
                  name: "title",
                  message: "What is the name of the role?"
              },
              {
                  name: "salary",
                  message: "What is the salary of the role?"
              },
              {
                  type: "list",
                  name: "department_id",
                  message: "Which department does the role  belong to?",
                  choices: departmentChoices
              }
          ])
              .then(role => {
                  dataB.addRole(role)
                      .then(() => console.log(`Added ${role.title} to the database`))
                      .then(() => showPrompts())
              })
      })
}


// This function will add a department
function createDepartment() {
  prompt([
      {
          name: "name",
          message: "What is the name of the department?"
      }
   ])
      .then(res => {
          let name = res;
          dataB.addDepartment(name)
              .then(() => console.log(`Added ${name.name} to the database`))
              .then(() => showPrompts())
      })
}

// This function will add employee
function createEmployee() {
  prompt([
      {
          name: "first_name",
          message: "What's the employee's first name?"
      },
      {
          name: "last_name",
          message: "What's the employee's last name?"
      }
  ])
      .then(res => {
          let firstName = res.first_name;
          let lastName = res.last_name;

          dataB.allRoles()
              .then(([rows]) => {
                  let roles = rows;
                  const roleChoices = roles.map(({ id, title }) => ({
                      name: title,
                      value: id
                  }));

                  prompt({
                      type: "list",
                      name: "roleId",
                      message: "What's the employee's role?",
                      choices: roleChoices
                  })
                      .then(res => {
                          let roleId = res.roleId;

                          dataB.allEmployees()
                              .then(([rows]) => {
                                  let employees = rows;
                                  const managerChoices = employees.map(({ id, first_name, last_name }) => ({
                                      name: `${first_name} ${last_name}`,
                                      value: id
                                  }));

                                  managerChoices.unshift({ name: "None", value: null });

                                  prompt({
                                      type: "list",
                                      name: "managerId",
                                      message: "Who's the employee's manager?",
                                      choices: managerChoices
                                  })
                                      .then(res => {
                                          let employee = {
                                              manager_id: res.managerId,
                                              role_id: roleId,
                                              first_name: firstName,
                                              last_name: lastName
                                          }

                                          dataB.addEmployee(employee);
                                      })
                                      .then(() => console.log(
                                          `Added ${firstName} ${lastName} to the database`
                                      ))
                                      .then(() => showPrompts())
                              })
                      })
              })
      })
}



// This function Update the employee
function updateEmployeeRole() {
  dataB.allEmployees()
      .then(([rows]) => {
          let employees = rows;
          const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
              name: `${first_name} ${last_name}`,
              value: id
          }));

          prompt([
              {
                  type: "list",
                  name: "employeeId",
                  message: "Which employee's role do you want to update?",
                  choices: employeeChoices
              }
          ])
              .then(res => {
                  let employeeId = res.employeeId;
                  dataB.allRoles()
                      .then(([rows]) => {
                          let roles = rows;
                          const roleChoices = roles.map(({ id, title }) => ({
                              name: title,
                              value: id
                          }));

                          prompt([
                              {
                                  type: "list",
                                  name: "roleId",
                                  message: "What's the new role of this employee?",
                                  choices: roleChoices
                              }
                          ])
                              .then(res => dataB.updateEmployeeRole(employeeId, res.roleId))
                              .then(() => console.log("Employee's role is updated"))
                              .then(() => showPrompts())
                      });
              });
      })
}

// Stopped the application
function quit() {
  process.exit();
}
