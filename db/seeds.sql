USE emp_trackerDB;

INSERT INTO department (department_name)
VALUES ("marine biology"),
("importing"),
("exporting"),
("architecture");

INSERT INTO role (title, salary, department_id)
VALUES ("Lead Architect", 120000, 4),
("Assistant Architect", 80000, 4),
("Developer", 90000, 4),
("Foreign Export Manager", 130000, 3),
("Latex Salesman", 80000, 3),
("Domestic Export Specialist", 110000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Art", "Vandalay", 1, NULL),
("Lloyd", "Braun", 6, 3),
("H.E", "Pennypacker", 4, NULL),
("Kal", "Varnsen", 3, 1);


 SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.department_name
    from employee
    inner join role 
    on employee.role_id = role.id
    inner join department 
    on role.department_id = department.id
    order by employee.id