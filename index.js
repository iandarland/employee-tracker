const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Be sure to update with your own MySQL password!
  password: 'Lexi420',
  database: 'emp_trackerDB',
});

const init = () => {
    console.log(`
    __   __  _______  __    _  ______   _______  ___      _______  __   __ 
    |  | |  ||   _   ||  |  | ||      | |   _   ||   |    |   _   ||  | |  |
    |  |_|  ||  |_|  ||   |_| ||  _    ||  |_|  ||   |    |  |_|  ||  |_|  |
    |       ||       ||       || | |   ||       ||   |    |       ||       |
    |       ||       ||  _    || |_|   ||       ||   |___ |       ||_     _|
     |     | |   _   || | |   ||       ||   _   ||       ||   _   |  |   |  
      |___|  |__| |__||_|  |__||______| |__| |__||_______||__| |__|  |___|  
      
      ___   __    _  ______   __   __  _______  _______  ______    ___   _______  _______ 
      |   | |  |  | ||      | |  | |  ||       ||       ||    _ |  |   | |       ||       |
      |   | |   |_| ||  _    ||  | |  ||  _____||_     _||   | ||  |   | |    ___||  _____|
      |   | |       || | |   ||  |_|  || |_____   |   |  |   |_||_ |   | |   |___ | |_____ 
      |   | |  _    || |_|   ||       ||_____  |  |   |  |    __  ||   | |    ___||_____  |
      |   | | | |   ||       ||       | _____| |  |   |  |   |  | ||   | |   |___  _____| |
      |___| |_|  |__||______| |_______||_______|  |___|  |___|  |_||___| |_______||_______|
                                                                                 
                                                                                 `)
    startTracker()
}

const startTracker = () => {
    inquirer
    .prompt([
        {
            type: "list",
            name: "start",
            message: "What would you like to do?",
            choices: ["View Employees", "View Department Budgets", "Add Employee", "Add Role", "Add Department", "Update an Employee", "Delete Employees", "EXIT"]
        }
    ])
    .then((answer) => {
        switch (answer.start) {
            case "View Employees":
                viewEmployees();
                break;
            
            case "View Department Budgets":
                viewBudget();
                break;

            case "Add Employee":
                addEmployee();
                break;

            case "Add Role":
                addRole();
                break;

            case "Add Department":
                addDepartment();
                break;
            
            case "Update an Employee":
                updateEmployee();
                break;

            case "Delete Employees":
                deleteEmployees();
                break;

            case "EXIT":
                connection.end()
                break;
        }
    })
};

const viewEmployees = () => {
    inquirer
    .prompt([
        {
            type: "list",
            name: "view",
            message: "How would you like to view Employees",
            choices: ["All", "By Department", "By Manager", "By Role", "Return"]
        }
    ])
    .then((answer) =>{
        switch(answer.view){
            case "All":
                viewAllEmp()
                break;

            case "By Department":
                viewEmpDep()
                break;
            
            case "By Manager":
                viewEmpMgr()
                break;

            case "By Role":
                viewEmpRole()
                break;

            case "Return":
                startTracker()
                break;
        }
    })
};

const updateEmployee = () => {
    connection.query("SELECT * FROM role", (err, data) => {
        if (err) throw err
        const roleChoices = data.map((role) => {
            return {name: role.title,
            value: role.id};
        })
    connection.query("SELECT * FROM employee", (err,data) => {
        if (err) throw err
        const empChoices = data.map((emp) => {
            return {name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id};
        })

        inquirer
        .prompt([
            {
                name: 'empSelect',
                type: 'list',
                message: 'Which employee would you like to update?',
                choices: empChoices,
            },
            {
                name: 'roleAssign',
                type: 'list',
                message: 'What role do you want to give them?',
                choices: roleChoices
            }
        ])
        .then(answers => {
            connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [answers.roleAssign, answers.empSelect], (err,data) => {
                if (err) throw err
                console.log("successfully updated employee!");
                startTracker();
            })
        })
    })
    })
}

const addEmployee = () => {
    connection.query("SELECT * FROM role", (err, data) => {
        if (err) throw err
        const roleChoices = data.map((role) => {
            return {name: role.title,
            value: role.id}
        })
    connection.query("SELECT * FROM employee", (err,data) => {
        if (err) throw err
        const mgrChoices = data.map((emp) => {
            return {name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id}
        })
        mgrChoices.push("none")
        inquirer
        .prompt([
            {
                name: "firstName",
                type: "input",
                message: "What is the first name of the employee you would like to add?"
            },
            {
                name: "lastName",
                type: "input",
                message: "What is the last name of the employee you would like to add?"
            },
            {
                name: "empRole",
                type: "list",
                message: "What is this employee's role?",
                choices: roleChoices
            },
            {
                name: "managerName",
                type: "list",
                message: "Who is this employees manager?",
                choices: mgrChoices
            }
        ])
        .then(answers => {
            if (answers.managerName === 'none'){
                connection.query("INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)",
                [answers.firstName, answers.lastName, answers.empRole], (err, data) => {
                    if (err) throw err
                    console.log(answers.firstName, answers.lastName, "has been added to employees")
                    return startTracker()
            })
            } else {
            connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
            [answers.firstName, answers.lastName, answers.empRole, answers.managerName], (err, data) => {
                if (err) throw err
                console.log(answers.firstName, answers.lastName, "has been added to employees")
                startTracker()
            })}
        })
    })
    })
}

const addRole = () => {
    connection.query("SELECT * FROM department", (err, data) => {
        if (err) throw err
        const departmentChoices = data.map(dept => {
            return {name: dept.department_name,
            value: dept.id};
        })

        inquirer
        .prompt([
            {
                name: "roleName",
                type: "input",
                message: "What would you like to name this new role?"
            },
            {
                name: "salary",
                type: "input",
                message: "What is the annual salary for this role (USD)?"
            },
            {
                name: "deptAssign",
                type: "list",
                message: "Which department does this role belong to?",
                choices: departmentChoices
            }
        ])
        .then(answers => {
            connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", 
            [answers.roleName, answers.salary, answers. deptAssign], (err, data) => {
                if (err) throw err
                console.log(answers.roleName, "has been added to roles!")
                startTracker()
            })
        })
    })
};

const addDepartment = () =>{
    inquirer
    .prompt([
        {
            type: "input",
            name: "deptName",
            message: "What would you like to name this department?"
        }
    ])
    .then(answer => {
        connection.query("INSERT INTO department (department_name) VALUES (?)", answer.deptName, (err, data) => {
            if (err) throw err
            console.log(answer.deptName, "has been added to departments!")
            startTracker()
        })
    })
};

const viewAllEmp = () => {
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.department_name, COALESCE(CONCAT(manager.first_name, " ", manager.last_name), 'None')  AS Manager_Name
    FROM employee
    LEFT JOIN role 
    ON employee.role_id = role.id
    LEFT JOIN department 
    ON role.department_id = department.id
    LEFT JOIN employee manager
    ON manager.id = employee.manager_id
    ORDER BY employee.id;`
    connection.query(query, (err, data) => {
        if (err) throw err
        console.table(data)
        startTracker()
    })
}

const viewEmpDep = () => {
    connection.query("SELECT * FROM department", (err, data) => {
        if (err) throw err
        const depChoices = data.map(dep => {
            return {name: dep.department_name,
            value: dep.id}
        })
        inquirer
        .prompt([
            {
                name: "deptSelect",
                type: "list",
                message: "Which department would you like to view?",
                choices: depChoices
            }
        ])
        .then(answer => {
            const query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.department_name, COALESCE(CONCAT(manager.first_name, ' ', manager.last_name), 'None')  AS Manager_Name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id WHERE department_id = ? ORDER BY employee.id;"
            connection.query(query, answer.deptSelect, (err, data) => {
                if (err) throw err
                console.table(data)
                startTracker()
            })
        })
    })
}

const viewEmpMgr = () => {
    const query = "SELECT * FROM employee WHERE manager_id IS NULL"
    connection.query(query, (err, data) => {
        if (err) throw err
        const mgrChoices = data.map(mgr => {
            return {name: `${mgr.first_name} ${mgr.last_name}`,
            value: mgr.id}
        })
        inquirer
        .prompt([
            {
                name: "mgrSelect",
                type: "list",
                message: "Which mananger would you like to view?",
                choices: mgrChoices
            }
        ])
        .then(answer => {
            const query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.department_name, COALESCE(CONCAT(manager.first_name, ' ', manager.last_name), 'None')  AS Manager_Name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id WHERE employee.manager_id = ? ORDER BY employee.id;"
            connection.query(query, answer.mgrSelect, (err, data) =>{
                if (err) throw err
                console.table(data)
                startTracker()
            })
        })
    })
}

const deleteEmployees = () =>{
    inquirer
    .prompt([
        {
            name: "methodSelect",
            type: "list",
            message: "How would you like to delete employees?",
            choices: ["Individual Employee", "By Role", "By Department", "Return"]
        }
    ])
    .then(answer => {
        switch(answer.methodSelect){
            case "Individual Employee":
                deleteIndv()
                break;
            case "By Role":
                deleteRole()
                break;
            case "By Department":
                deleteDept()
                break;
            case "Return":
                startTracker()
                break;
        }
    })
}

const deleteIndv = () => {
    connection.query("SELECT * FROM employee", (err, data) => {
        if (err) throw err
        const empChoices = data.map((emp) => {
            return {name: `${emp.first_name} ${emp.last_name}`, 
            value: emp.id};
        }) 
        inquirer
        .prompt([
            {
                name: "empSelect",
                type: "list",
                message: "Which employee would you like to delete?",
                choices: empChoices
            },
            {
                name: "confirm",
                type: "confirm",
                message: "Are you SURE you want delete this employee?"
            }
        ])
        .then(answer => {
            if(answer.confirm === false){
                return startTracker();
            }else{
                connection.query("DELETE FROM employee WHERE id = ?", answer.empSelect, (err, data) => {
                    if(err) throw err
                    console.log("WOW, now that guy got canned!!")
                    startTracker()
                })
            }
        })
    })
}

const deleteRole = () => {
    connection.query("SELECT * FROM role", (err, data) => {
        if (err) throw err
        const roleChoices = data.map((role) => {
            return {name: role.title, 
            value: role.id};
        }) 
        inquirer
        .prompt([
            {
                name: "roleSelect",
                type: "list",
                message: "Which role would you like to delete?",
                choices: roleChoices
            },
            {
                name: "confirm",
                type: "confirm",
                message: "Are you SURE you want delete this role and all employees currently assigned?"
            }
        ])
        .then(answer => {
            if(answer.confirm === false){
                return startTracker();
            }else{
                connection.query("DELETE FROM employee WHERE role_id = ?", answer.roleSelect, (err, data) => {
                    if(err) throw err
                })
                connection.query("DELETE FROM role WHERE id = ?", answer.roleSelect, (err, data) => {
                    if(err) throw err
                    console.log("I can think of nothing more fitting than for the four of you to spend a year removed from society so that you can contemplate the manner in which you have conducted yourselves. I know I will.")
                    startTracker()
                })

            }
        })
    })
}

const deleteDept = () => {
    connection.query("SELECT * FROM department", (err, data) => {
        if (err) throw err
        const deptChoices = data.map((dept) => {
            return {name: dept.department_name, 
            value: dept.id};
        }) 
        inquirer
        .prompt([
            {
                name: "deptSelect",
                type: "list",
                message: "Which role would you like to delete?",
                choices: deptChoices
            },
            {
                name: "confirm",
                type: "confirm",
                message: "Are you SURE you want delete this department and all roles and employees currently assigned?"
            }
        ])
        .then(answer => {
            if(answer.confirm === false){
                return startTracker();
            }else{
                connection.query("DELETE department, role, employee FROM department INNER JOIN role ON department.id = role.department_id INNER JOIN employee ON role.id = employee.role_id WHERE department.id = ?", answer.deptSelect, (err, data) => {
                    if(err) throw err
                    console.log("I can think of nothing more fitting than for you all to spend a year removed from society so that you can contemplate the manner in which you have conducted yourselves. I know I will.")
                    startTracker()
                })

            }
        })
    })
}

const viewBudget = () => {
    connection.query("SELECT * FROM department", (err, data)=> {
        if(err) throw err
        const depChoices = data.map(dep => {
            return {name: dep.department_name,
            value: dep.id}
        })
        inquirer
        .prompt([
            {
                name: "deptSelect",
                type: "list",
                message: "Which department would you like to view?",
                choices: depChoices
            }
        ])
        .then(answer=> {
            const query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.department_name, COALESCE(CONCAT(manager.first_name, ' ', manager.last_name), 'None')  AS Manager_Name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id WHERE department_id = ? ORDER BY employee.id;"
            connection.query(query, answer.deptSelect, (err, data) => {
                if (err) throw err
                let totalSalary = data.map(sal => sal.salary)
                totalSalary = totalSalary.reduce((a, b) => a + b, 0)
                console.log(`Total employee budget | $${totalSalary}`)
                startTracker()
            })
        })
    })
}


init();