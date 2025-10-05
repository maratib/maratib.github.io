---
title: PL/SQL
slug: guides/sql/pl-sql
description: PL/SQL
sidebar:
  order: 4
---

**Complete PL/SQL Guide with Detailed Explanations**

## 1. PL/SQL Fundamentals

### What is PL/SQL?

**PL/SQL (Procedural Language/Structured Query Language)** is Oracle Corporation's procedural extension for SQL and the Oracle relational database. It combines the data manipulation power of SQL with the processing power of procedural languages.

**Why use PL/SQL?**

- **Block Structure**: Organize code into logical blocks
- **Procedural Capabilities**: Add loops, conditions, and error handling to SQL
- **Better Performance**: Reduce network traffic by executing blocks on server
- **Error Handling**: Robust exception handling mechanism
- **Modularity**: Create reusable procedures, functions, and packages

### PL/SQL Block Structure - Detailed Breakdown

```sql
DECLARE
    -- Declaration Section (OPTIONAL)
    -- Here you declare variables, constants, cursors, and exceptions
    -- This section is executed only once when the block starts
BEGIN
    -- Executable Section (MANDATORY)
    -- Contains SQL and PL/SQL statements
    -- This is where the main logic resides
    -- Executed sequentially
EXCEPTION
    -- Exception Handling Section (OPTIONAL)
    -- Handles runtime errors
    -- Only executed when errors occur
END;
/
```

**Real-world Example:**

```sql
DECLARE
    -- Variable declarations
    v_employee_name VARCHAR2(100);
    v_salary NUMBER;
    v_bonus NUMBER;
BEGIN
    -- Business logic
    SELECT first_name || ' ' || last_name, salary
    INTO v_employee_name, v_salary
    FROM employees
    WHERE employee_id = 100;

    -- Conditional logic
    IF v_salary > 10000 THEN
        v_bonus := v_salary * 0.15;
    ELSE
        v_bonus := v_salary * 0.10;
    END IF;

    -- Output result
    DBMS_OUTPUT.PUT_LINE(v_employee_name || ' gets bonus: $' || v_bonus);

EXCEPTION
    -- Error handling
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('Employee not found!');
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error occurred: ' || SQLERRM);
END;
/
```

## 2. Variables and Data Types

### Understanding Variables in PL/SQL

**Variables** are storage locations that hold data which can be manipulated during program execution. Proper variable declaration is crucial for type safety and performance.

### Scalar Data Types - Detailed Explanation

```sql
DECLARE
    -- NUMERIC TYPES: For storing numbers
    -- NUMBER(precision, scale) - most common numeric type
    v_emp_id NUMBER(5) := 100;           -- Stores up to 5 digits
    v_salary NUMBER(8,2) := 5000.50;     -- 8 total digits, 2 after decimal
    v_percentage NUMBER(3,2) := 0.75;    -- Stores 0.75 (75%)

    -- CHARACTER TYPES: For storing text
    -- VARCHAR2(max_length) - variable length, most efficient
    v_name VARCHAR2(50) := 'John Doe';   -- Uses only needed space

    -- CHAR(fixed_length) - fixed length, pads with spaces
    v_code CHAR(3) := 'USA';             -- Always uses 3 characters

    -- DATE/TIME TYPES: For temporal data
    v_hire_date DATE := SYSDATE;                    -- Date and time
    v_timestamp TIMESTAMP := SYSTIMESTAMP;          -- High precision timestamp
    v_birthdate DATE := TO_DATE('1990-01-15', 'YYYY-MM-DD');

    -- BOOLEAN: For logical operations
    v_is_active BOOLEAN := TRUE;         -- Can be TRUE, FALSE, or NULL
    v_has_commission BOOLEAN;            -- Defaults to NULL

BEGIN
    -- Demonstrating variable usage
    IF v_is_active AND v_salary > 4000 THEN
        DBMS_OUTPUT.PUT_LINE(v_name || ' is active with good salary');
    END IF;

    -- Date arithmetic
    DBMS_OUTPUT.PUT_LINE('Hired: ' || v_hire_date);
    DBMS_OUTPUT.PUT_LINE('5 years from hire: ' || (v_hire_date + INTERVAL '5' YEAR));
END;
/
```

### %TYPE and %ROWTYPE Attributes - Why They're Important

**%TYPE**:

- **Purpose**: Anchor a variable to a database column type
- **Benefit**: If column definition changes, variable automatically adjusts
- **Maintenance**: Reduces maintenance overhead

**%ROWTYPE**:

- **Purpose**: Declare a record that matches a table's structure
- **Benefit**: Automatically adapts to table schema changes
- **Use Case**: Perfect for holding entire row data

```sql
DECLARE
    -- %TYPE example: Variable inherits type from database column
    v_emp_name employees.first_name%TYPE;    -- Same type as first_name column
    v_emp_salary employees.salary%TYPE;      -- Same type as salary column

    -- %ROWTYPE example: Record matching entire table structure
    v_employee employees%ROWTYPE;            -- Has all columns as fields

BEGIN
    -- Using %TYPE variables
    SELECT first_name, salary
    INTO v_emp_name, v_emp_salary
    FROM employees
    WHERE employee_id = 100;

    -- Using %ROWTYPE record
    SELECT * INTO v_employee
    FROM employees
    WHERE employee_id = 100;

    -- Accessing record fields
    DBMS_OUTPUT.PUT_LINE('Employee: ' || v_employee.first_name ||
                        ' Salary: ' || v_employee.salary);

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('Employee not found');
END;
/
```

## 3. Control Structures

### Conditional Statements - Making Decisions

**IF-THEN-ELSE Statements**:

- **Purpose**: Execute different code paths based on conditions
- **Types**: Simple IF, IF-ELSE, IF-ELSIF-ELSE
- **Use Case**: Business rules, validation, workflow decisions

```sql
DECLARE
    v_salary NUMBER := 7500;
    v_grade VARCHAR2(10);
    v_bonus NUMBER;
    v_performance_rating NUMBER := 4; -- Scale 1-5

BEGIN
    -- SIMPLE IF STATEMENT
    IF v_salary > 5000 THEN
        DBMS_OUTPUT.PUT_LINE('Salary is above average');
    END IF;

    -- IF-ELSE STATEMENT
    IF v_salary > 10000 THEN
        v_grade := 'A';
        v_bonus := v_salary * 0.20;
    ELSE
        v_grade := 'B';
        v_bonus := v_salary * 0.10;
    END IF;

    -- IF-ELSIF-ELSE STATEMENT (Multiple conditions)
    IF v_performance_rating = 5 THEN
        v_bonus := v_salary * 0.25;
        v_grade := 'Excellent';
    ELSIF v_performance_rating = 4 THEN
        v_bonus := v_salary * 0.15;
        v_grade := 'Good';
    ELSIF v_performance_rating = 3 THEN
        v_bonus := v_salary * 0.10;
        v_grade := 'Average';
    ELSE
        v_bonus := 0;
        v_grade := 'Needs Improvement';
    END IF;

    DBMS_OUTPUT.PUT_LINE('Grade: ' || v_grade || ', Bonus: $' || v_bonus);

    -- CASE STATEMENT (Alternative to multiple ELSIF)
    CASE v_performance_rating
        WHEN 5 THEN v_grade := 'Outstanding'
        WHEN 4 THEN v_grade := 'Exceeds Expectations'
        WHEN 3 THEN v_grade := 'Meets Expectations'
        ELSE v_grade := 'Below Expectations'
    END CASE;

END;
/
```

### Loops - Repeating Execution

**Types of Loops in PL/SQL**:

1. **Basic LOOP**: Most flexible, requires explicit exit condition
2. **WHILE LOOP**: Check condition before each iteration
3. **FOR LOOP**: Iterate a specific number of times
4. **Cursor FOR LOOP**: Iterate through query results (covered in cursors)

```sql
DECLARE
    i NUMBER;
    v_total NUMBER := 0;
    v_counter NUMBER := 1;

BEGIN
    DBMS_OUTPUT.PUT_LINE('=== BASIC LOOP ===');
    -- BASIC LOOP: Most control, must specify exit condition
    i := 1;
    LOOP
        DBMS_OUTPUT.PUT_LINE('Iteration: ' || i);
        v_total := v_total + i;
        i := i + 1;
        EXIT WHEN i > 5;  -- Required to prevent infinite loop
    END LOOP;

    DBMS_OUTPUT.PUT_LINE('Total: ' || v_total);


    DBMS_OUTPUT.PUT_LINE('=== WHILE LOOP ===');
    -- WHILE LOOP: Check condition before iteration
    v_total := 0;
    v_counter := 1;
    WHILE v_counter <= 5 LOOP
        DBMS_OUTPUT.PUT_LINE('Counter: ' || v_counter);
        v_total := v_total + v_counter;
        v_counter := v_counter + 1;
    END LOOP;
    DBMS_OUTPUT.PUT_LINE('Total: ' || v_total);


    DBMS_OUTPUT.PUT_LINE('=== FOR LOOP ===');
    -- FOR LOOP: Automatic counter management
    v_total := 0;
    FOR i IN 1..5 LOOP
        DBMS_OUTPUT.PUT_LINE('Index: ' || i);
        v_total := v_total + i;

        -- You can use CONTINUE to skip iterations
        CONTINUE WHEN i = 3;  -- Skip iteration when i=3
    END LOOP;
    DBMS_OUTPUT.PUT_LINE('Total: ' || v_total);


    DBMS_OUTPUT.PUT_LINE('=== REVERSE FOR LOOP ===');
    -- FOR LOOP with REVERSE: Count backwards
    FOR i IN REVERSE 1..5 LOOP
        DBMS_OUTPUT.PUT_LINE('Reverse Count: ' || i);
    END LOOP;

END;
/
```

## 4. Cursors - Detailed Explanation

### What are Cursors?

**Cursors** are database objects used to retrieve and manipulate multiple rows from a SQL query. They act as pointers to context area which contains information about a SQL statement.

### Why Use Cursors?

- **Process Multiple Rows**: Handle result sets row by row
- **Row-by-Row Processing**: Apply complex logic to each row
- **Memory Management**: Control how many rows are loaded into memory
- **Flexibility**: Navigate through result sets programmatically

### Types of Cursors:

#### 1. Implicit Cursors

**Automatically created by Oracle** for all SQL DML statements and single-row queries.

**Key Attributes:**

- `SQL%FOUND`: Returns TRUE if at least one row was affected
- `SQL%NOTFOUND`: Returns TRUE if no rows were affected
- `SQL%ROWCOUNT`: Returns number of rows affected

```sql
DECLARE
    v_updated_rows NUMBER;
BEGIN
    -- Implicit cursor created automatically for UPDATE
    UPDATE employees
    SET salary = salary * 1.1
    WHERE department_id = 50;

    -- Using implicit cursor attributes
    v_updated_rows := SQL%ROWCOUNT;

    DBMS_OUTPUT.PUT_LINE('Rows updated: ' || v_updated_rows);

    IF SQL%FOUND THEN
        DBMS_OUTPUT.PUT_LINE('Update operation was successful');
    END IF;

    IF SQL%NOTFOUND THEN
        DBMS_OUTPUT.PUT_LINE('No employees found in department 50');
    END IF;

    -- For single-row SELECT (implicit cursor)
    DECLARE
        v_emp_name VARCHAR2(100);
    BEGIN
        SELECT first_name || ' ' || last_name
        INTO v_emp_name
        FROM employees
        WHERE employee_id = 100;

        DBMS_OUTPUT.PUT_LINE('Employee: ' || v_emp_name);

    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            DBMS_OUTPUT.PUT_LINE('Employee not found');
    END;

END;
/
```

#### 2. Explicit Cursors

**Programmer-defined cursors** for more control over query processing.

**Cursor Processing Steps:**

1. **DECLARE**: Define the cursor with a SQL query
2. **OPEN**: Execute the query and create active set
3. **FETCH**: Retrieve rows one by one
4. **CLOSE**: Release cursor resources

```sql
DECLARE
    -- STEP 1: DECLARE CURSOR
    CURSOR emp_cursor IS
        SELECT employee_id, first_name, last_name, salary
        FROM employees
        WHERE department_id = 50
        ORDER BY salary DESC;

    -- Variables to hold fetched data
    v_emp_id employees.employee_id%TYPE;
    v_first_name employees.first_name%TYPE;
    v_last_name employees.last_name%TYPE;
    v_salary employees.salary%TYPE;

    v_total_salary NUMBER := 0;
    v_emp_count NUMBER := 0;

BEGIN
    -- STEP 2: OPEN CURSOR
    OPEN emp_cursor;

    DBMS_OUTPUT.PUT_LINE('Employees in Department 50:');
    DBMS_OUTPUT.PUT_LINE('============================');

    -- STEP 3: FETCH ROWS in LOOP
    LOOP
        FETCH emp_cursor INTO v_emp_id, v_first_name, v_last_name, v_salary;

        -- Exit when no more rows
        EXIT WHEN emp_cursor%NOTFOUND;

        v_emp_count := v_emp_count + 1;
        v_total_salary := v_total_salary + v_salary;

        -- Process each row
        DBMS_OUTPUT.PUT_LINE(
            RPAD(v_emp_id, 8) ||
            RPAD(v_first_name || ' ' || v_last_name, 20) ||
            LPAD(TO_CHAR(v_salary, 'FM$999,999'), 12)
        );
    END LOOP;

    -- STEP 4: CLOSE CURSOR
    CLOSE emp_cursor;

    -- Display summary using cursor attributes
    DBMS_OUTPUT.PUT_LINE('============================');
    DBMS_OUTPUT.PUT_LINE('Total Employees: ' || v_emp_count);
    DBMS_OUTPUT.PUT_LINE('Total Salary: $' || v_total_salary);
    DBMS_OUTPUT.PUT_LINE('Average Salary: $' ||
                         ROUND(v_total_salary / NULLIF(v_emp_count, 0), 2));

END;
/
```

#### 3. Cursor FOR Loops (Simplified Explicit Cursors)

**Automates cursor handling** - Oracle automatically opens, fetches, and closes the cursor.

```sql
DECLARE
    v_total_salary NUMBER := 0;
    v_emp_count NUMBER := 0;

BEGIN
    DBMS_OUTPUT.PUT_LINE('Processing with Cursor FOR Loop:');
    DBMS_OUTPUT.PUT_LINE('================================');

    -- Cursor FOR Loop: Oracle handles open, fetch, close automatically
    FOR emp_rec IN (
        SELECT employee_id, first_name, last_name, salary
        FROM employees
        WHERE department_id = 50
        ORDER BY salary DESC
    ) LOOP
        v_emp_count := v_emp_count + 1;
        v_total_salary := v_total_salary + emp_rec.salary;

        DBMS_OUTPUT.PUT_LINE(
            'ID: ' || emp_rec.employee_id ||
            ', Name: ' || emp_rec.first_name || ' ' || emp_rec.last_name ||
            ', Salary: $' || emp_rec.salary
        );

        -- You can add business logic here
        IF emp_rec.salary > 10000 THEN
            DBMS_OUTPUT.PUT_LINE('   *** High earner ***');
        END IF;
    END LOOP;

    DBMS_OUTPUT.PUT_LINE('================================');
    DBMS_OUTPUT.PUT_LINE('Processed ' || v_emp_count || ' employees');

END;
/
```

#### 4. Parameterized Cursors

**Cursors that accept parameters** for dynamic filtering.

```sql
DECLARE
    -- Cursor with parameters
    CURSOR dept_emp_cursor(p_dept_id NUMBER, p_min_salary NUMBER) IS
        SELECT employee_id, first_name, last_name, salary
        FROM employees
        WHERE department_id = p_dept_id
        AND salary >= p_min_salary
        ORDER BY salary DESC;

BEGIN
    DBMS_OUTPUT.PUT_LINE('Department 50 employees with salary >= $5000:');
    DBMS_OUTPUT.PUT_LINE('==============================================');

    -- Using parameterized cursor
    FOR emp_rec IN dept_emp_cursor(50, 5000) LOOP
        DBMS_OUTPUT.PUT_LINE(
            emp_rec.first_name || ' ' || emp_rec.last_name ||
            ' - Salary: $' || emp_rec.salary
        );
    END LOOP;

    DBMS_OUTPUT.PUT_LINE('==============================================');
    DBMS_OUTPUT.PUT_LINE('Department 80 employees with salary >= $8000:');
    DBMS_OUTPUT.PUT_LINE('==============================================');

    -- Same cursor, different parameters
    FOR emp_rec IN dept_emp_cursor(80, 8000) LOOP
        DBMS_OUTPUT.PUT_LINE(
            emp_rec.first_name || ' ' || emp_rec.last_name ||
            ' - Salary: $' || emp_rec.salary
        );
    END LOOP;

END;
/
```

### Cursor Attributes - Monitoring Cursor State

```sql
DECLARE
    CURSOR emp_cursor IS
        SELECT employee_id, first_name FROM employees
        WHERE department_id = 50;

    v_emp_id employees.employee_id%TYPE;
    v_name employees.first_name%TYPE;

BEGIN
    OPEN emp_cursor;

    DBMS_OUTPUT.PUT_LINE('Cursor Attributes:');
    DBMS_OUTPUT.PUT_LINE('Is Open: ' || CASE WHEN emp_cursor%ISOPEN THEN 'YES' ELSE 'NO' END);
    DBMS_OUTPUT.PUT_LINE('Rows Fetched: ' || emp_cursor%ROWCOUNT);

    LOOP
        FETCH emp_cursor INTO v_emp_id, v_name;
        EXIT WHEN emp_cursor%NOTFOUND;

        DBMS_OUTPUT.PUT_LINE('Processing employee ' || v_emp_id ||
                           ' - Rows processed: ' || emp_cursor%ROWCOUNT);
    END LOOP;

    DBMS_OUTPUT.PUT_LINE('Total rows processed: ' || emp_cursor%ROWCOUNT);
    DBMS_OUTPUT.PUT_LINE('Found data: ' || CASE WHEN emp_cursor%FOUND THEN 'YES' ELSE 'NO' END);

    CLOSE emp_cursor;
    DBMS_OUTPUT.PUT_LINE('Is Open after close: ' || CASE WHEN emp_cursor%ISOPEN THEN 'YES' ELSE 'NO' END);

END;
/
```

### When to Use Which Cursor Type:

- **Implicit Cursors**: Simple DML operations and single-row queries
- **Explicit Cursors**: Need fine-grained control over row processing
- **Cursor FOR Loops**: Most common for multi-row queries - simplest syntax
- **Parameterized Cursors**: Same query with different parameter values

# Complete PL/SQL Tutorial (Continued)

## 5. Exceptions - Error Handling

### What are Exceptions?

**Exceptions** are runtime errors or warning conditions that disrupt the normal flow of program execution. PL/SQL provides a robust mechanism to handle these exceptions gracefully.

### Why Handle Exceptions?

- **Prevent Program Crashes**: Graceful error recovery
- **Improve User Experience**: Meaningful error messages
- **Maintain Data Integrity**: Proper rollback and cleanup
- **Debugging**: Better error tracking and logging

### Exception Handling Structure

```sql
BEGIN
    -- Executable statements
EXCEPTION
    WHEN exception1 THEN
        -- Handler for exception1
    WHEN exception2 THEN
        -- Handler for exception2
    WHEN OTHERS THEN
        -- Handler for all other exceptions
END;
```

### Types of Exceptions

#### 1. Predefined Oracle Exceptions

**Common built-in exceptions** with predefined names

```sql
DECLARE
    v_employee_name VARCHAR2(100);
    v_salary NUMBER;
    v_division_result NUMBER;
    v_department_id NUMBER := 999; -- Non-existent department
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== DEMONSTRATING PREDEFINED EXCEPTIONS ===');

    -- 1. NO_DATA_FOUND: Single-row SELECT returns no rows
    BEGIN
        SELECT first_name INTO v_employee_name
        FROM employees WHERE employee_id = 9999; -- Non-existent ID
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            DBMS_OUTPUT.PUT_LINE('Error: Employee not found!');
    END;

    -- 2. TOO_MANY_ROWS: Single-row SELECT returns multiple rows
    BEGIN
        SELECT first_name INTO v_employee_name
        FROM employees WHERE department_id = 50; -- Returns multiple rows
    EXCEPTION
        WHEN TOO_MANY_ROWS THEN
            DBMS_OUTPUT.PUT_LINE('Error: Query returned multiple rows!');
    END;

    -- 3. ZERO_DIVIDE: Division by zero
    BEGIN
        v_division_result := 100 / 0;
    EXCEPTION
        WHEN ZERO_DIVIDE THEN
            DBMS_OUTPUT.PUT_LINE('Error: Cannot divide by zero!');
    END;

    -- 4. DUP_VAL_ON_INDEX: Unique constraint violation
    BEGIN
        INSERT INTO departments (department_id, department_name)
        VALUES (10, 'Administration'); -- Assuming ID 10 already exists
    EXCEPTION
        WHEN DUP_VAL_ON_INDEX THEN
            DBMS_OUTPUT.PUT_LINE('Error: Department ID already exists!');
    END;

    -- 5. INVALID_NUMBER: Invalid character to number conversion
    BEGIN
        UPDATE employees SET salary = 'NOT_A_NUMBER' WHERE employee_id = 100;
    EXCEPTION
        WHEN INVALID_NUMBER THEN
            DBMS_OUTPUT.PUT_LINE('Error: Invalid number format!');
    END;

END;
/
```

#### 2. User-Defined Exceptions

**Custom exceptions** for application-specific errors

```sql
DECLARE
    -- Declare user-defined exceptions
    insufficient_salary EXCEPTION;
    invalid_department EXCEPTION;

    -- Associate exceptions with error codes
    PRAGMA EXCEPTION_INIT(invalid_department, -20001);

    v_emp_salary NUMBER := 2000;
    v_min_salary NUMBER := 2500;
    v_dept_count NUMBER;

BEGIN
    DBMS_OUTPUT.PUT_LINE('=== USER-DEFINED EXCEPTIONS ===');

    -- Example 1: Simple user-defined exception
    IF v_emp_salary < v_min_salary THEN
        RAISE insufficient_salary;
    END IF;

EXCEPTION
    WHEN insufficient_salary THEN
        DBMS_OUTPUT.PUT_LINE('Error: Salary $' || v_emp_salary ||
                           ' is below minimum $' || v_min_salary);
        DBMS_OUTPUT.PUT_LINE('Recommendation: Adjust salary or get approval');

    WHEN invalid_department THEN
        DBMS_OUTPUT.PUT_LINE('Error: Invalid department specified');

END;
/
```

#### 3. RAISE_APPLICATION_ERROR Procedure

**Create custom error messages** with user-defined error codes (-20000 to -20999)

```sql
DECLARE
    v_employee_salary NUMBER := 5000;
    v_bonus_percentage NUMBER;
    v_hire_date DATE := DATE '2020-01-15';
    v_years_of_service NUMBER;

BEGIN
    DBMS_OUTPUT.PUT_LINE('=== USING RAISE_APPLICATION_ERROR ===');

    -- Calculate years of service
    v_years_of_service := FLOOR(MONTHS_BETWEEN(SYSDATE, v_hire_date) / 12);

    -- Business rule: Minimum 2 years for bonus
    IF v_years_of_service < 2 THEN
        RAISE_APPLICATION_ERROR(-20001,
            'Employee must have at least 2 years of service. Current: ' ||
            v_years_of_service || ' years');
    END IF;

    -- Business rule: Salary-based bonus percentage
    IF v_employee_salary < 3000 THEN
        v_bonus_percentage := 0.10;
    ELSIF v_employee_salary BETWEEN 3000 AND 7000 THEN
        v_bonus_percentage := 0.15;
    ELSIF v_employee_salary > 7000 THEN
        v_bonus_percentage := 0.20;
    ELSE
        RAISE_APPLICATION_ERROR(-20002, 'Invalid salary amount: ' || v_employee_salary);
    END IF;

    DBMS_OUTPUT.PUT_LINE('Bonus Percentage: ' || (v_bonus_percentage * 100) || '%');
    DBMS_OUTPUT.PUT_LINE('Bonus Amount: $' || (v_employee_salary * v_bonus_percentage));

EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error Code: ' || SQLCODE);
        DBMS_OUTPUT.PUT_LINE('Error Message: ' || SQLERRM);
END;
/
```

### Advanced Exception Handling Techniques

```sql
DECLARE
    v_emp_id NUMBER := 100;
    v_emp_name VARCHAR2(100);
    v_salary NUMBER;
    v_department VARCHAR2(100);

    -- User-defined exceptions
    salary_too_high EXCEPTION;
    PRAGMA EXCEPTION_INIT(salary_too_high, -20010);

BEGIN
    DBMS_OUTPUT.PUT_LINE('=== ADVANCED EXCEPTION HANDLING ===');

    BEGIN -- Nested block for specific error handling
        SELECT e.first_name, e.salary, d.department_name
        INTO v_emp_name, v_salary, v_department
        FROM employees e
        JOIN departments d ON e.department_id = d.department_id
        WHERE e.employee_id = v_emp_id;

        DBMS_OUTPUT.PUT_LINE('Employee: ' || v_emp_name);
        DBMS_OUTPUT.PUT_LINE('Department: ' || v_department);
        DBMS_OUTPUT.PUT_LINE('Salary: $' || v_salary);

        -- Custom business rule validation
        IF v_salary > 20000 THEN
            RAISE salary_too_high;
        END IF;

    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            DBMS_OUTPUT.PUT_LINE('Nested Block: Employee ID ' || v_emp_id || ' not found');
            RETURN; -- Exit main block

        WHEN salary_too_high THEN
            DBMS_OUTPUT.PUT_LINE('Nested Block: Salary $' || v_salary || ' exceeds maximum allowed');
            RAISE; -- Re-raise to outer block
    END;

    DBMS_OUTPUT.PUT_LINE('Main block continues execution...');

EXCEPTION
    WHEN salary_too_high THEN
        DBMS_OUTPUT.PUT_LINE('Main Block: Handling re-raised salary error');
        DBMS_OUTPUT.PUT_LINE('Action: Salary requires executive approval');

    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Unexpected error occurred:');
        DBMS_OUTPUT.PUT_LINE('Error Code: ' || SQLCODE);
        DBMS_OUTPUT.PUT_LINE('Error Message: ' || SQLERRM);

        -- Log error details for debugging
        DBMS_OUTPUT.PUT_LINE('Backtrace: ' || DBMS_UTILITY.FORMAT_ERROR_BACKTRACE);
        DBMS_OUTPUT.PUT_LINE('Call Stack: ' || DBMS_UTILITY.FORMAT_CALL_STACK);
END;
/
```

### Exception Propagation

```sql
CREATE OR REPLACE PROCEDURE process_employee(p_emp_id NUMBER) IS
    v_name VARCHAR2(100);
BEGIN
    DBMS_OUTPUT.PUT_LINE('Starting process_employee for ID: ' || p_emp_id);

    SELECT first_name INTO v_name
    FROM employees WHERE employee_id = p_emp_id;

    DBMS_OUTPUT.PUT_LINE('Processing: ' || v_name);

    -- Simulate an error
    IF p_emp_id = 100 THEN
        RAISE_APPLICATION_ERROR(-20010, 'Special handling required for employee 100');
    END IF;

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('process_employee: Employee not found');
        RAISE; -- Propagate to caller
END;
/

DECLARE
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== EXCEPTION PROPAGATION DEMO ===');

    -- This will be handled internally
    process_employee(999); -- Non-existent ID

EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Main: Caught propagated error');
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END;
/

-- Test with employee 100
BEGIN
    process_employee(100); -- Will raise custom error
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Main: Custom error handled - ' || SQLERRM);
END;
/
```

### Best Practices for Exception Handling

```sql
DECLARE
    v_operation VARCHAR2(50) := 'PROCESS_SALARY_ADJUSTMENT';
    v_log_message VARCHAR2(4000);

    PROCEDURE log_error(p_error_code NUMBER, p_error_msg VARCHAR2) IS
    BEGIN
        v_log_message := 'Operation: ' || v_operation ||
                        ', Error: ' || p_error_code ||
                        ', Message: ' || p_error_msg ||
                        ', Time: ' || TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS');

        DBMS_OUTPUT.PUT_LINE('LOG: ' || v_log_message);
        -- In real application, insert into error log table
    END log_error;

BEGIN
    DBMS_OUTPUT.PUT_LINE('=== BEST PRACTICES DEMONSTRATION ===');

    -- Example with comprehensive error handling
    BEGIN
        -- Business operation that might fail
        UPDATE employees
        SET salary = salary * 1.1
        WHERE department_id = 50;

        DBMS_OUTPUT.PUT_LINE('Update successful: ' || SQL%ROWCOUNT || ' rows affected');

        -- Simulate an error
        RAISE_APPLICATION_ERROR(-20015, 'Simulated business rule violation');

    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            log_error(SQLCODE, SQLERRM);
            DBMS_OUTPUT.PUT_LINE('Action: No employees found for update');

        WHEN OTHERS THEN
            log_error(SQLCODE, SQLERRM);

            -- Different actions based on error codes
            CASE
                WHEN SQLCODE = -20015 THEN
                    DBMS_OUTPUT.PUT_LINE('Action: Review business rules');
                WHEN SQLCODE = -1400 THEN -- NULL constraint
                    DBMS_OUTPUT.PUT_LINE('Action: Check required fields');
                ELSE
                    DBMS_OUTPUT.PUT_LINE('Action: Contact system administrator');
            END CASE;

            ROLLBACK; -- Important: Rollback on error
            RAISE; -- Re-raise after logging
    END;

END;
/
```

## 6. Procedures and Functions

### What are Procedures and Functions?

- **Procedures** and **Functions** are named PL/SQL blocks that are stored in the database and can be reused.
- **Procedures** are referred to as **Stored Procedures**

### Key Differences:

- **Procedures**: Perform actions, don't return values
- **Functions**: Perform calculations, return a single value

### Procedures - Detailed Explanation

#### Creating and Using Procedures

```sql
-- Create a procedure
CREATE OR REPLACE PROCEDURE increase_salary (
    p_emp_id IN NUMBER,
    p_percentage IN NUMBER,
    p_updated_count OUT NUMBER
) IS
    v_current_salary NUMBER;
    v_new_salary NUMBER;
    v_department_id NUMBER;
BEGIN
    DBMS_OUTPUT.PUT_LINE('Starting salary increase for employee: ' || p_emp_id);

    -- Get current salary and department
    SELECT salary, department_id INTO v_current_salary, v_department_id
    FROM employees WHERE employee_id = p_emp_id;

    -- Calculate new salary
    v_new_salary := v_current_salary * (1 + p_percentage/100);

    -- Update salary
    UPDATE employees
    SET salary = v_new_salary
    WHERE employee_id = p_emp_id;

    p_updated_count := SQL%ROWCOUNT;

    -- Log the change
    DBMS_OUTPUT.PUT_LINE('Salary updated: $' || v_current_salary ||
                        ' -> $' || v_new_salary);
    DBMS_OUTPUT.PUT_LINE('Increase: ' || p_percentage || '%');

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('Error: Employee ' || p_emp_id || ' not found');
        p_updated_count := 0;
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Unexpected error: ' || SQLERRM);
        p_updated_count := 0;
        RAISE;
END increase_salary;
/

-- Using the procedure
DECLARE
    v_updated_rows NUMBER;
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== USING PROCEDURES ===');

    increase_salary(p_emp_id => 100, p_percentage => 10, p_updated_count => v_updated_rows);

    DBMS_OUTPUT.PUT_LINE('Rows updated: ' || v_updated_rows);

    -- Test with invalid employee
    increase_salary(p_emp_id => 9999, p_percentage => 10, p_updated_count => v_updated_rows);
    DBMS_OUTPUT.PUT_LINE('Rows updated: ' || v_updated_rows);
END;
/
```

#### Procedure with Multiple Parameters and Default Values

```sql
CREATE OR REPLACE PROCEDURE hire_employee (
    p_first_name IN VARCHAR2,
    p_last_name IN VARCHAR2,
    p_email IN VARCHAR2,
    p_phone_number IN VARCHAR2 DEFAULT NULL,
    p_hire_date IN DATE DEFAULT SYSDATE,
    p_job_id IN VARCHAR2,
    p_salary IN NUMBER,
    p_commission_pct IN NUMBER DEFAULT NULL,
    p_manager_id IN NUMBER DEFAULT NULL,
    p_department_id IN NUMBER DEFAULT NULL,
    p_emp_id OUT NUMBER
) IS
    v_next_emp_id NUMBER;
BEGIN
    DBMS_OUTPUT.PUT_LINE('Hiring new employee: ' || p_first_name || ' ' || p_last_name);

    -- Get next employee ID from sequence (assuming sequence exists)
    SELECT employees_seq.NEXTVAL INTO v_next_emp_id FROM DUAL;

    -- Insert new employee
    INSERT INTO employees (
        employee_id, first_name, last_name, email, phone_number,
        hire_date, job_id, salary, commission_pct, manager_id, department_id
    ) VALUES (
        v_next_emp_id, p_first_name, p_last_name, p_email, p_phone_number,
        p_hire_date, p_job_id, p_salary, p_commission_pct, p_manager_id, p_department_id
    );

    p_emp_id := v_next_emp_id;

    DBMS_OUTPUT.PUT_LINE('Employee hired successfully with ID: ' || p_emp_id);
    DBMS_OUTPUT.PUT_LINE('Salary: $' || p_salary || ', Job: ' || p_job_id);

EXCEPTION
    WHEN DUP_VAL_ON_INDEX THEN
        DBMS_OUTPUT.PUT_LINE('Error: Email already exists');
        p_emp_id := -1;
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error hiring employee: ' || SQLERRM);
        p_emp_id := -1;
        RAISE;
END hire_employee;
/

-- Using the procedure with different parameter styles
DECLARE
    v_new_emp_id NUMBER;
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== HIRING EMPLOYEES ===');

    -- Method 1: Positional notation
    hire_employee('John', 'Doe', 'JDOE', '650.505.1234', SYSDATE,
                 'IT_PROG', 5000, NULL, 103, 60, v_new_emp_id);

    -- Method 2: Named notation (recommended for clarity)
    hire_employee(
        p_first_name => 'Jane',
        p_last_name => 'Smith',
        p_email => 'JSMITH',
        p_job_id => 'SA_REP',
        p_salary => 4000,
        p_commission_pct => 0.2,
        p_department_id => 80,
        p_emp_id => v_new_emp_id
    );

    -- Method 3: Mixed notation
    hire_employee('Bob', 'Wilson', 'BWILSON', p_job_id => 'ST_CLERK',
                 p_salary => 3000, p_department_id => 50,
                 p_emp_id => v_new_emp_id);

END;
/
```

### Functions - Detailed Explanation

#### Creating and Using Functions

```sql
-- Create a function to calculate annual bonus
CREATE OR REPLACE FUNCTION calculate_annual_bonus (
    p_emp_id IN NUMBER,
    p_bonus_rate IN NUMBER DEFAULT 0.1
) RETURN NUMBER IS
    v_salary NUMBER;
    v_hire_date DATE;
    v_years_service NUMBER;
    v_bonus NUMBER;
    v_performance_factor NUMBER := 1.0;
BEGIN
    DBMS_OUTPUT.PUT_LINE('Calculating bonus for employee: ' || p_emp_id);

    -- Get employee details
    SELECT salary, hire_date
    INTO v_salary, v_hire_date
    FROM employees
    WHERE employee_id = p_emp_id;

    -- Calculate years of service
    v_years_service := FLOOR(MONTHS_BETWEEN(SYSDATE, v_hire_date) / 12);

    -- Adjust bonus based on years of service
    IF v_years_service > 10 THEN
        v_performance_factor := 1.5;
    ELSIF v_years_service > 5 THEN
        v_performance_factor := 1.2;
    ELSIF v_years_service < 1 THEN
        v_performance_factor := 0.5; -- Probation period
    END IF;

    -- Calculate final bonus
    v_bonus := v_salary * p_bonus_rate * v_performance_factor;

    DBMS_OUTPUT.PUT_LINE('Base Salary: $' || v_salary);
    DBMS_OUTPUT.PUT_LINE('Years Service: ' || v_years_service);
    DBMS_OUTPUT.PUT_LINE('Performance Factor: ' || v_performance_factor);
    DBMS_OUTPUT.PUT_LINE('Calculated Bonus: $' || v_bonus);

    RETURN v_bonus;

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('Employee not found');
        RETURN 0;
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error calculating bonus: ' || SQLERRM);
        RETURN 0;
END calculate_annual_bonus;
/

-- Using the function
DECLARE
    v_bonus_amount NUMBER;
    v_total_payout NUMBER := 0;
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== USING FUNCTIONS ===');

    -- Use function in assignment
    v_bonus_amount := calculate_annual_bonus(p_emp_id => 100, p_bonus_rate => 0.15);
    DBMS_OUTPUT.PUT_LINE('Bonus for employee 100: $' || v_bonus_amount);
    v_total_payout := v_total_payout + v_bonus_amount;

    -- Use function in output directly
    DBMS_OUTPUT.PUT_LINE('Bonus for employee 101: $' || calculate_annual_bonus(101, 0.12));
    v_total_payout := v_total_payout + calculate_annual_bonus(101, 0.12);

    -- Use function in SQL statement
    SELECT calculate_annual_bonus(102, 0.1) INTO v_bonus_amount FROM DUAL;
    DBMS_OUTPUT.PUT_LINE('Bonus for employee 102: $' || v_bonus_amount);
    v_total_payout := v_total_payout + v_bonus_amount;

    DBMS_OUTPUT.PUT_LINE('Total Bonus Payout: $' || v_total_payout);
END;
/

-- Function used in SQL queries
SELECT
    employee_id,
    first_name,
    salary,
    calculate_annual_bonus(employee_id, 0.1) as annual_bonus
FROM employees
WHERE department_id = 50
AND calculate_annual_bonus(employee_id, 0.1) > 1000;
```

#### Advanced Function Example with Multiple Return Types

```sql
-- Function that returns complex calculation with OUT parameters
CREATE OR REPLACE FUNCTION analyze_employee_salary (
    p_emp_id IN NUMBER,
    p_salary_analysis OUT VARCHAR2,
    p_salary_grade OUT VARCHAR2
) RETURN NUMBER IS
    v_salary NUMBER;
    v_avg_dept_salary NUMBER;
    v_department_id NUMBER;
    v_ratio NUMBER;
BEGIN
    -- Get employee salary and department
    SELECT salary, department_id INTO v_salary, v_department_id
    FROM employees WHERE employee_id = p_emp_id;

    -- Get department average salary
    SELECT AVG(salary) INTO v_avg_dept_salary
    FROM employees WHERE department_id = v_department_id;

    -- Calculate ratio
    v_ratio := v_salary / v_avg_dept_salary;

    -- Determine salary analysis
    IF v_ratio > 1.5 THEN
        p_salary_analysis := 'Well above department average';
        p_salary_grade := 'A';
    ELSIF v_ratio > 1.2 THEN
        p_salary_analysis := 'Above department average';
        p_salary_grade := 'B';
    ELSIF v_ratio > 0.8 THEN
        p_salary_analysis := 'At department average';
        p_salary_grade := 'C';
    ELSE
        p_salary_analysis := 'Below department average';
        p_salary_grade := 'D';
    END IF;

    RETURN v_salary;

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        p_salary_analysis := 'Employee not found';
        p_salary_grade := 'N/A';
        RETURN 0;
END analyze_employee_salary;
/

-- Using the advanced function
DECLARE
    v_salary NUMBER;
    v_analysis VARCHAR2(100);
    v_grade VARCHAR2(10);
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== ADVANCED FUNCTION USAGE ===');

    v_salary := analyze_employee_salary(100, v_analysis, v_grade);

    DBMS_OUTPUT.PUT_LINE('Salary: $' || v_salary);
    DBMS_OUTPUT.PUT_LINE('Analysis: ' || v_analysis);
    DBMS_OUTPUT.PUT_LINE('Grade: ' || v_grade);
END;
/
```

### IN, OUT, and IN OUT Parameters

```sql
CREATE OR REPLACE PROCEDURE process_employee_status (
    p_emp_id IN NUMBER,                    -- Input only
    p_salary_increase IN OUT NUMBER,       -- Input and output
    p_status_message OUT VARCHAR2,         -- Output only
    p_success_flag OUT BOOLEAN             -- Output only (Boolean)
) IS
    v_current_salary NUMBER;
    v_new_salary NUMBER;
BEGIN
    DBMS_OUTPUT.PUT_LINE('Processing employee: ' || p_emp_id);

    -- Get current salary
    SELECT salary INTO v_current_salary
    FROM employees WHERE employee_id = p_emp_id;

    -- Calculate new salary
    v_new_salary := v_current_salary + p_salary_increase;

    -- Validate new salary
    IF v_new_salary > v_current_salary * 2 THEN
        p_status_message := 'Salary increase too large. Adjusted to maximum 100%';
        p_salary_increase := v_current_salary; -- Double the salary max
        v_new_salary := v_current_salary * 2;
        p_success_flag := FALSE;
    ELSE
        p_status_message := 'Salary increase processed successfully';
        p_success_flag := TRUE;
    END IF;

    -- Update salary
    UPDATE employees SET salary = v_new_salary
    WHERE employee_id = p_emp_id;

    DBMS_OUTPUT.PUT_LINE('Old Salary: $' || v_current_salary);
    DBMS_OUTPUT.PUT_LINE('Increase: $' || p_salary_increase);
    DBMS_OUTPUT.PUT_LINE('New Salary: $' || v_new_salary);

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        p_status_message := 'Employee not found';
        p_success_flag := FALSE;
    WHEN OTHERS THEN
        p_status_message := 'Error: ' || SQLERRM;
        p_success_flag := FALSE;
END process_employee_status;
/

-- Testing parameter modes
DECLARE
    v_salary_increase NUMBER := 10000;  -- Will be modified
    v_status_message VARCHAR2(100);
    v_success BOOLEAN;
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== PARAMETER MODES DEMO ===');

    DBMS_OUTPUT.PUT_LINE('Initial increase amount: $' || v_salary_increase);

    process_employee_status(
        p_emp_id => 100,
        p_salary_increase => v_salary_increase,
        p_status_message => v_status_message,
        p_success_flag => v_success
    );

    DBMS_OUTPUT.PUT_LINE('Status: ' || v_status_message);
    DBMS_OUTPUT.PUT_LINE('Adjusted increase: $' || v_salary_increase);
    DBMS_OUTPUT.PUT_LINE('Success: ' || CASE WHEN v_success THEN 'YES' ELSE 'NO' END);
END;
/
```

## 7. Packages - Modular Programming

### What are Packages?

**Packages** are schema objects that group logically related PL/SQL types, variables, constants, subprograms, cursors, and exceptions. A package has two parts:

- **Specification**: The interface (public items)
- **Body**: The implementation (private items and public subprogram code)

### Why Use Packages?

- **Modularity**: Organize related functionality
- **Encapsulation**: Hide implementation details
- **Better Performance**: Package state persists in memory
- **Global Variables**: Maintain session-level data
- **Overloading**: Multiple subprograms with same name

### Package Specification (Public Interface)

```sql
CREATE OR REPLACE PACKAGE employee_mgmt AS
    -- Public constants
    g_min_salary CONSTANT NUMBER := 2000;
    g_max_salary CONSTANT NUMBER := 50000;

    -- Public exceptions
    salary_out_of_range EXCEPTION;
    PRAGMA EXCEPTION_INIT(salary_out_of_range, -20001);

    -- Public types
    TYPE emp_rec IS RECORD (
        emp_id NUMBER,
        full_name VARCHAR2(100),
        salary NUMBER,
        department VARCHAR2(50)
    );

    TYPE emp_tab IS TABLE OF emp_rec INDEX BY PLS_INTEGER;

    -- Public cursor
    CURSOR get_department_emps(p_dept_id NUMBER) RETURN employees%ROWTYPE;

    -- Public procedures and functions
    PROCEDURE hire_employee(
        p_first_name IN VARCHAR2,
        p_last_name IN VARCHAR2,
        p_email IN VARCHAR2,
        p_job_id IN VARCHAR2,
        p_salary IN NUMBER,
        p_dept_id IN NUMBER,
        p_emp_id OUT NUMBER
    );

    PROCEDURE update_salary(
        p_emp_id IN NUMBER,
        p_new_salary IN NUMBER
    );

    PROCEDURE terminate_employee(
        p_emp_id IN NUMBER,
        p_effective_date IN DATE DEFAULT SYSDATE
    );

    FUNCTION get_employee_info(p_emp_id NUMBER) RETURN emp_rec;

    FUNCTION calculate_annual_bonus(p_emp_id NUMBER) RETURN NUMBER;

    FUNCTION get_department_stats(p_dept_id NUMBER) RETURN VARCHAR2;

    -- Overloaded procedures (same name, different parameters)
    PROCEDURE search_employees(p_dept_id IN NUMBER);
    PROCEDURE search_employees(p_job_id IN VARCHAR2);
    PROCEDURE search_employees(p_salary_min IN NUMBER, p_salary_max IN NUMBER);

END employee_mgmt;
/
```

### Package Body (Implementation)

```sql
CREATE OR REPLACE PACKAGE BODY employee_mgmt AS
    -- Private global variables (not accessible outside package)
    v_employee_count NUMBER := 0;
    v_last_hire_date DATE;

    -- Private constants
    c_bonus_rate CONSTANT NUMBER := 0.10;

    -- Private function (only accessible within package)
    FUNCTION validate_salary(p_salary NUMBER) RETURN BOOLEAN IS
    BEGIN
        RETURN p_salary BETWEEN g_min_salary AND g_max_salary;
    END validate_salary;

    -- Private procedure
    PROCEDURE log_employee_action(
        p_emp_id NUMBER,
        p_action VARCHAR2,
        p_details VARCHAR2
    ) IS
    BEGIN
        INSERT INTO employee_audit (
            audit_id, employee_id, action_type, action_details, action_date
        ) VALUES (
            audit_seq.NEXTVAL, p_emp_id, p_action, p_details, SYSDATE
        );
        COMMIT;
    EXCEPTION
        WHEN OTHERS THEN
            NULL; -- Logging failure shouldn't break main operation
    END log_employee_action;

    -- Implement public cursor
    CURSOR get_department_emps(p_dept_id NUMBER) RETURN employees%ROWTYPE IS
        SELECT * FROM employees
        WHERE department_id = p_dept_id
        ORDER BY salary DESC;

    -- Implement public procedures and functions
    PROCEDURE hire_employee(
        p_first_name IN VARCHAR2,
        p_last_name IN VARCHAR2,
        p_email IN VARCHAR2,
        p_job_id IN VARCHAR2,
        p_salary IN NUMBER,
        p_dept_id IN NUMBER,
        p_emp_id OUT NUMBER
    ) IS
        v_next_emp_id NUMBER;
    BEGIN
        DBMS_OUTPUT.PUT_LINE('Starting hire process for: ' || p_first_name || ' ' || p_last_name);

        -- Validate salary
        IF NOT validate_salary(p_salary) THEN
            RAISE salary_out_of_range;
        END IF;

        -- Get next employee ID
        SELECT employees_seq.NEXTVAL INTO v_next_emp_id FROM DUAL;

        -- Insert new employee
        INSERT INTO employees (
            employee_id, first_name, last_name, email,
            hire_date, job_id, salary, department_id
        ) VALUES (
            v_next_emp_id, p_first_name, p_last_name, p_email,
            SYSDATE, p_job_id, p_salary, p_dept_id
        );

        p_emp_id := v_next_emp_id;
        v_employee_count := v_employee_count + 1;
        v_last_hire_date := SYSDATE;

        -- Log the action
        log_employee_action(
            p_emp_id => v_next_emp_id,
            p_action => 'HIRE',
            p_details => 'New hire: ' || p_first_name || ' ' || p_last_name ||
                        ', Salary: ' || p_salary || ', Dept: ' || p_dept_id
        );

        DBMS_OUTPUT.PUT_LINE('Employee hired successfully with ID: ' || p_emp_id);

    EXCEPTION
        WHEN salary_out_of_range THEN
            DBMS_OUTPUT.PUT_LINE('Error: Salary ' || p_salary || ' is out of acceptable range');
            p_emp_id := -1;
        WHEN DUP_VAL_ON_INDEX THEN
            DBMS_OUTPUT.PUT_LINE('Error: Email already exists');
            p_emp_id := -1;
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('Error hiring employee: ' || SQLERRM);
            p_emp_id := -1;
            RAISE;
    END hire_employee;

    PROCEDURE update_salary(
        p_emp_id IN NUMBER,
        p_new_salary IN NUMBER
    ) IS
        v_old_salary NUMBER;
        v_emp_name VARCHAR2(100);
    BEGIN
        -- Get current salary and name
        SELECT salary, first_name || ' ' || last_name
        INTO v_old_salary, v_emp_name
        FROM employees
        WHERE employee_id = p_emp_id;

        -- Validate new salary
        IF NOT validate_salary(p_new_salary) THEN
            RAISE salary_out_of_range;
        END IF;

        -- Update salary
        UPDATE employees SET salary = p_new_salary
        WHERE employee_id = p_emp_id;

        -- Log the action
        log_employee_action(
            p_emp_id => p_emp_id,
            p_action => 'SALARY_UPDATE',
            p_details => 'Salary changed: ' || v_old_salary || ' -> ' || p_new_salary
        );

        DBMS_OUTPUT.PUT_LINE('Salary updated for ' || v_emp_name ||
                           ': $' || v_old_salary || ' -> $' || p_new_salary);

    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            DBMS_OUTPUT.PUT_LINE('Error: Employee ' || p_emp_id || ' not found');
        WHEN salary_out_of_range THEN
            DBMS_OUTPUT.PUT_LINE('Error: New salary ' || p_new_salary || ' is invalid');
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('Error updating salary: ' || SQLERRM);
            RAISE;
    END update_salary;

    PROCEDURE terminate_employee(
        p_emp_id IN NUMBER,
        p_effective_date IN DATE DEFAULT SYSDATE
    ) IS
        v_emp_name VARCHAR2(100);
        v_job_id VARCHAR2(20);
    BEGIN
        -- Get employee details
        SELECT first_name || ' ' || last_name, job_id
        INTO v_emp_name, v_job_id
        FROM employees
        WHERE employee_id = p_emp_id;

        -- In real scenario, you might move to terminated_employees table
        DELETE FROM employees WHERE employee_id = p_emp_id;

        -- Log the action
        log_employee_action(
            p_emp_id => p_emp_id,
            p_action => 'TERMINATION',
            p_details => 'Employee terminated: ' || v_emp_name ||
                        ', Job: ' || v_job_id ||
                        ', Effective: ' || TO_CHAR(p_effective_date, 'YYYY-MM-DD')
        );

        DBMS_OUTPUT.PUT_LINE('Employee terminated: ' || v_emp_name);

    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            DBMS_OUTPUT.PUT_LINE('Error: Employee ' || p_emp_id || ' not found');
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('Error terminating employee: ' || SQLERRM);
            RAISE;
    END terminate_employee;

    FUNCTION get_employee_info(p_emp_id NUMBER) RETURN emp_rec IS
        v_result emp_rec;
    BEGIN
        SELECT
            e.employee_id,
            e.first_name || ' ' || e.last_name,
            e.salary,
            d.department_name
        INTO v_result
        FROM employees e
        JOIN departments d ON e.department_id = d.department_id
        WHERE e.employee_id = p_emp_id;

        RETURN v_result;

    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            v_result.emp_id := -1;
            v_result.full_name := 'Not Found';
            RETURN v_result;
    END get_employee_info;

    FUNCTION calculate_annual_bonus(p_emp_id NUMBER) RETURN NUMBER IS
        v_salary NUMBER;
        v_hire_date DATE;
        v_years_service NUMBER;
        v_bonus NUMBER;
    BEGIN
        SELECT salary, hire_date
        INTO v_salary, v_hire_date
        FROM employees
        WHERE employee_id = p_emp_id;

        v_years_service := FLOOR(MONTHS_BETWEEN(SYSDATE, v_hire_date) / 12);

        -- Bonus calculation logic
        v_bonus := v_salary * c_bonus_rate;

        -- Adjust for years of service
        IF v_years_service > 5 THEN
            v_bonus := v_bonus * 1.2;
        ELSIF v_years_service > 10 THEN
            v_bonus := v_bonus * 1.5;
        END IF;

        RETURN ROUND(v_bonus, 2);

    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN 0;
    END calculate_annual_bonus;

    FUNCTION get_department_stats(p_dept_id NUMBER) RETURN VARCHAR2 IS
        v_emp_count NUMBER;
        v_avg_salary NUMBER;
        v_max_salary NUMBER;
        v_dept_name VARCHAR2(50);
    BEGIN
        SELECT
            COUNT(*),
            AVG(salary),
            MAX(salary),
            department_name
        INTO v_emp_count, v_avg_salary, v_max_salary, v_dept_name
        FROM employees e
        JOIN departments d ON e.department_id = d.department_id
        WHERE e.department_id = p_dept_id
        GROUP BY department_name;

        RETURN 'Department: ' || v_dept_name ||
               ', Employees: ' || v_emp_count ||
               ', Avg Salary: $' || ROUND(v_avg_salary, 2) ||
               ', Max Salary: $' || v_max_salary;

    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN 'Department not found or has no employees';
    END get_department_stats;

    -- Implement overloaded procedures
    PROCEDURE search_employees(p_dept_id IN NUMBER) IS
    BEGIN
        DBMS_OUTPUT.PUT_LINE('=== Employees in Department ' || p_dept_id || ' ===');
        FOR emp IN (SELECT * FROM employees WHERE department_id = p_dept_id) LOOP
            DBMS_OUTPUT.PUT_LINE(emp.employee_id || ': ' || emp.first_name || ' ' ||
                               emp.last_name || ' - $' || emp.salary);
        END LOOP;
    END search_employees;

    PROCEDURE search_employees(p_job_id IN VARCHAR2) IS
    BEGIN
        DBMS_OUTPUT.PUT_LINE('=== Employees with Job ' || p_job_id || ' ===');
        FOR emp IN (SELECT * FROM employees WHERE job_id = p_job_id) LOOP
            DBMS_OUTPUT.PUT_LINE(emp.employee_id || ': ' || emp.first_name || ' ' ||
                               emp.last_name || ' - $' || emp.salary);
        END LOOP;
    END search_employees;

    PROCEDURE search_employees(p_salary_min IN NUMBER, p_salary_max IN NUMBER) IS
    BEGIN
        DBMS_OUTPUT.PUT_LINE('=== Employees with Salary $' || p_salary_min || ' - $' || p_salary_max || ' ===');
        FOR emp IN (SELECT * FROM employees
                   WHERE salary BETWEEN p_salary_min AND p_salary_max) LOOP
            DBMS_OUTPUT.PUT_LINE(emp.employee_id || ': ' || emp.first_name || ' ' ||
                               emp.last_name || ' - $' || emp.salary);
        END LOOP;
    END search_employees;

    -- Package initialization section (runs once per session)
    BEGIN
        DBMS_OUTPUT.PUT_LINE('Employee Management Package initialized');
        SELECT COUNT(*) INTO v_employee_count FROM employees;
        DBMS_OUTPUT.PUT_LINE('Total employees in system: ' || v_employee_count);

END employee_mgmt;
/
```

### Using the Package

```sql
-- Demonstration of package usage
DECLARE
    v_new_emp_id NUMBER;
    v_emp_info employee_mgmt.emp_rec;
    v_bonus NUMBER;
    v_stats VARCHAR2(500);
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== EMPLOYEE MANAGEMENT PACKAGE DEMO ===');

    -- Use package constants
    DBMS_OUTPUT.PUT_LINE('Minimum Salary: $' || employee_mgmt.g_min_salary);
    DBMS_OUTPUT.PUT_LINE('Maximum Salary: $' || employee_mgmt.g_max_salary);

    -- Hire a new employee
    employee_mgmt.hire_employee(
        p_first_name => 'Sarah',
        p_last_name => 'Johnson',
        p_email => 'SJOHNSON',
        p_job_id => 'IT_PROG',
        p_salary => 6000,
        p_dept_id => 60,
        p_emp_id => v_new_emp_id
    );

    -- Update salary
    employee_mgmt.update_salary(
        p_emp_id => 100,
        p_new_salary => 25000
    );

    -- Get employee information
    v_emp_info := employee_mgmt.get_employee_info(100);
    DBMS_OUTPUT.PUT_LINE('Employee Info: ' || v_emp_info.full_name ||
                        ', Salary: $' || v_emp_info.salary ||
                        ', Dept: ' || v_emp_info.department);

    -- Calculate bonus
    v_bonus := employee_mgmt.calculate_annual_bonus(100);
    DBMS_OUTPUT.PUT_LINE('Annual Bonus: $' || v_bonus);

    -- Get department statistics
    v_stats := employee_mgmt.get_department_stats(50);
    DBMS_OUTPUT.PUT_LINE('Department Stats: ' || v_stats);

    -- Use overloaded procedures
    employee_mgmt.search_employees(p_dept_id => 50);
    employee_mgmt.search_employees(p_job_id => 'SA_REP');
    employee_mgmt.search_employees(p_salary_min => 5000, p_salary_max => 10000);

    -- Test exception handling
    BEGIN
        employee_mgmt.update_salary(p_emp_id => 100, p_new_salary => 100000);
    EXCEPTION
        WHEN employee_mgmt.salary_out_of_range THEN
            DBMS_OUTPUT.PUT_LINE('Caught salary range exception as expected');
    END;

END;
/
```

### Package State and Persistence

```sql
CREATE OR REPLACE PACKAGE session_stats AS
    -- Public variables that maintain state across calls
    g_session_start_time TIMESTAMP := SYSTIMESTAMP;
    g_operation_count NUMBER := 0;
    g_last_operation VARCHAR2(100);

    PROCEDURE record_operation(p_operation VARCHAR2);
    FUNCTION get_session_duration RETURN VARCHAR2;
    PROCEDURE show_session_stats;

END session_stats;
/

CREATE OR REPLACE PACKAGE BODY session_stats AS

    -- Private variable
    v_total_processing_time NUMBER := 0;

    PROCEDURE record_operation(p_operation VARCHAR2) IS
        v_start_time TIMESTAMP := SYSTIMESTAMP;
    BEGIN
        g_operation_count := g_operation_count + 1;
        g_last_operation := p_operation;

        -- Simulate some processing
        DBMS_LOCK.SLEEP(0.1); -- 0.1 second delay

        v_total_processing_time := v_total_processing_time +
            (SYSTIMESTAMP - v_start_time);

        DBMS_OUTPUT.PUT_LINE('Recorded operation: ' || p_operation);
    END record_operation;

    FUNCTION get_session_duration RETURN VARCHAR2 IS
        v_duration INTERVAL DAY TO SECOND;
    BEGIN
        v_duration := SYSTIMESTAMP - g_session_start_time;
        RETURN EXTRACT(MINUTE FROM v_duration) || ' minutes ' ||
               EXTRACT(SECOND FROM v_duration) || ' seconds';
    END get_session_duration;

    PROCEDURE show_session_stats IS
    BEGIN
        DBMS_OUTPUT.PUT_LINE('=== SESSION STATISTICS ===');
        DBMS_OUTPUT.PUT_LINE('Session started: ' || g_session_start_time);
        DBMS_OUTPUT.PUT_LINE('Duration: ' || get_session_duration);
        DBMS_OUTPUT.PUT_LINE('Operations performed: ' || g_operation_count);
        DBMS_OUTPUT.PUT_LINE('Last operation: ' || g_last_operation);
        DBMS_OUTPUT.PUT_LINE('Total processing time: ' ||
                           ROUND(v_total_processing_time, 2) || ' seconds');
    END show_session_stats;

END session_stats;
/

-- Demonstrate package state persistence
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== PACKAGE STATE PERSISTENCE DEMO ===');

    -- First call
    session_stats.record_operation('Data Load');
    session_stats.record_operation('Data Validation');
    session_stats.show_session_stats;

    DBMS_OUTPUT.PUT_LINE('--- Waiting 2 seconds ---');
    DBMS_LOCK.SLEEP(2);

    -- Second call - package state is maintained
    session_stats.record_operation('Data Processing');
    session_stats.record_operation('Report Generation');
    session_stats.show_session_stats;

END;
/
```

## 8. Triggers - Automated Actions

### What are Triggers?

**Triggers** are stored programs that are automatically executed (fired) when specified events occur in the database. They're used to enforce business rules, maintain audit trails, and ensure data integrity.

### Types of Triggers:

1. **DML Triggers**: On INSERT, UPDATE, DELETE
2. **DDL Triggers**: On CREATE, ALTER, DROP
3. **Database Events**: On LOGON, LOGOFF, STARTUP, SHUTDOWN

### DML Triggers - Detailed Examples

#### 1. BEFORE Trigger - Data Validation

```sql
-- Create audit table for tracking
CREATE TABLE employee_audit (
    audit_id NUMBER PRIMARY KEY,
    employee_id NUMBER,
    action_type VARCHAR2(20),
    old_salary NUMBER,
    new_salary NUMBER,
    changed_by VARCHAR2(100),
    change_date DATE
);

CREATE SEQUENCE audit_seq START WITH 1;

-- BEFORE trigger for salary validation
CREATE OR REPLACE TRIGGER validate_employee_salary
    BEFORE INSERT OR UPDATE OF salary ON employees
    FOR EACH ROW
DECLARE
    v_min_salary NUMBER;
    v_max_salary NUMBER;
    v_department_avg NUMBER;
BEGIN
    DBMS_OUTPUT.PUT_LINE('Validating salary for employee: ' || :NEW.employee_id);

    -- Get job salary range
    SELECT min_salary, max_salary
    INTO v_min_salary, v_max_salary
    FROM jobs
    WHERE job_id = :NEW.job_id;

    -- Validate against job range
    IF :NEW.salary NOT BETWEEN v_min_salary AND v_max_salary THEN
        RAISE_APPLICATION_ERROR(-20001,
            'Salary ' || :NEW.salary || ' not in valid range (' ||
            v_min_salary || ' - ' || v_max_salary || ') for job ' || :NEW.job_id);
    END IF;

    -- Prevent excessive raises (more than 50%)
    IF UPDATING AND :OLD.salary IS NOT NULL THEN
        IF :NEW.salary > :OLD.salary * 1.5 THEN
            RAISE_APPLICATION_ERROR(-20002,
                'Salary increase cannot exceed 50%. Current: ' || :OLD.salary ||
                ', Proposed: ' || :NEW.salary);
        END IF;
    END IF;

    DBMS_OUTPUT.PUT_LINE('Salary validation passed');

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('Warning: Job information not found');
    WHEN OTHERS THEN
        RAISE;
END validate_employee_salary;
/
```

#### 2. AFTER Trigger - Audit Trail

```sql
-- AFTER trigger for auditing salary changes
CREATE OR REPLACE TRIGGER audit_salary_changes
    AFTER INSERT OR UPDATE OR DELETE ON employees
    FOR EACH ROW
DECLARE
    v_action_type VARCHAR2(20);
    v_user VARCHAR2(100);
BEGIN
    -- Determine action type
    IF INSERTING THEN
        v_action_type := 'INSERT';
        DBMS_OUTPUT.PUT_LINE('Auditing new employee: ' || :NEW.employee_id);
    ELSIF UPDATING THEN
        v_action_type := 'UPDATE';
        DBMS_OUTPUT.PUT_LINE('Auditing update for employee: ' || :OLD.employee_id);
    ELSIF DELETING THEN
        v_action_type := 'DELETE';
        DBMS_OUTPUT.PUT_LINE('Auditing deletion of employee: ' || :OLD.employee_id);
    END IF;

    -- Get current user
    v_user := USER;

    -- For INSERT and UPDATE, log salary information
    IF INSERTING OR UPDATING THEN
        INSERT INTO employee_audit (
            audit_id, employee_id, action_type,
            old_salary, new_salary, changed_by, change_date
        ) VALUES (
            audit_seq.NEXTVAL,
            NVL(:NEW.employee_id, :OLD.employee_id),
            v_action_type,
            :OLD.salary,
            :NEW.salary,
            v_user,
            SYSDATE
        );
    ELSIF DELETING THEN
        INSERT INTO employee_audit (
            audit_id, employee_id, action_type,
            old_salary, new_salary, changed_by, change_date
        ) VALUES (
            audit_seq.NEXTVAL,
            :OLD.employee_id,
            v_action_type,
            :OLD.salary,
            NULL,
            v_user,
            SYSDATE
        );
    END IF;

    DBMS_OUTPUT.PUT_LINE('Audit record created for ' || v_action_type || ' operation');

EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error in audit trigger: ' || SQLERRM);
        -- Don't re-raise or it will prevent the original DML
END audit_salary_changes;
/
```

#### 3. INSTEAD OF Trigger - For Views

```sql
-- Create a complex view
CREATE OR REPLACE VIEW employee_details AS
SELECT
    e.employee_id,
    e.first_name,
    e.last_name,
    e.email,
    e.phone_number,
    e.hire_date,
    e.salary,
    e.commission_pct,
    j.job_title,
    d.department_name,
    m.first_name || ' ' || m.last_name AS manager_name
FROM employees e
JOIN jobs j ON e.job_id = j.job_id
JOIN departments d ON e.department_id = d.department_id
LEFT JOIN employees m ON e.manager_id = m.employee_id;

-- INSTEAD OF trigger to handle view updates
CREATE OR REPLACE TRIGGER instead_of_employee_details
    INSTEAD OF INSERT OR UPDATE ON employee_details
    FOR EACH ROW
BEGIN
    DBMS_OUTPUT.PUT_LINE('Processing INSTEAD OF trigger for employee_details view');

    IF INSERTING THEN
        -- Insert into base table
        INSERT INTO employees (
            employee_id, first_name, last_name, email, phone_number,
            hire_date, salary, commission_pct, job_id, department_id
        ) VALUES (
            :NEW.employee_id, :NEW.first_name, :NEW.last_name, :NEW.email,
            :NEW.phone_number, :NEW.hire_date, :NEW.salary, :NEW.commission_pct,
            (SELECT job_id FROM jobs WHERE job_title = :NEW.job_title),
            (SELECT department_id FROM departments WHERE department_name = :NEW.department_name)
        );

        DBMS_OUTPUT.PUT_LINE('New employee inserted via view');

    ELSIF UPDATING THEN
        -- Update base table
        UPDATE employees
        SET first_name = :NEW.first_name,
            last_name = :NEW.last_name,
            email = :NEW.email,
            phone_number = :NEW.phone_number,
            salary = :NEW.salary,
            commission_pct = :NEW.commission_pct
        WHERE employee_id = :OLD.employee_id;

        DBMS_OUTPUT.PUT_LINE('Employee updated via view');
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error in INSTEAD OF trigger: ' || SQLERRM);
        RAISE;
END instead_of_employee_details;
/
```

### Testing the Triggers

```sql
-- Test the triggers
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== TESTING TRIGGERS ===');

    -- Test BEFORE trigger (validation)
    BEGIN
        DBMS_OUTPUT.PUT_LINE('1. Testing salary validation...');
        UPDATE employees SET salary = 100 WHERE employee_id = 100; -- Too low
    EXCEPTION
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('Expected error: ' || SQLERRM);
    END;

    -- Test valid update
    BEGIN
        DBMS_OUTPUT.PUT_LINE('2. Testing valid salary update...');
        UPDATE employees SET salary = 25000 WHERE employee_id = 100;
        DBMS_OUTPUT.PUT_LINE('Salary updated successfully');
    EXCEPTION
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('Unexpected error: ' || SQLERRM);
    END;

    -- Test audit trigger
    BEGIN
        DBMS_OUTPUT.PUT_LINE('3. Testing audit trail...');
        UPDATE employees SET salary = 26000 WHERE employee_id = 101;
        DBMS_OUTPUT.PUT_LINE('Update completed - check audit table');
    EXCEPTION
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
    END;

    -- Test INSTEAD OF trigger with view
    BEGIN
        DBMS_OUTPUT.PUT_LINE('4. Testing INSTEAD OF trigger...');
        /*
        INSERT INTO employee_details (
            employee_id, first_name, last_name, email, hire_date,
            salary, job_title, department_name
        ) VALUES (
            999, 'Test', 'User', 'TESTUSER', SYSDATE,
            5000, 'Programmer', 'IT'
        );
        */
        DBMS_OUTPUT.PUT_LINE('View insertion test completed');
    EXCEPTION
        WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('View insertion error (expected if dependencies missing): ' || SQLERRM);
    END;

    -- Show audit results
    DBMS_OUTPUT.PUT_LINE('5. Audit records created:');
    FOR audit_rec IN (SELECT * FROM employee_audit ORDER BY audit_id) LOOP
        DBMS_OUTPUT.PUT_LINE('   ' || audit_rec.action_type || ' - Employee ' ||
                           audit_rec.employee_id || ' - Old: ' ||
                           NVL(TO_CHAR(audit_rec.old_salary), 'NULL') ||
                           ' New: ' || NVL(TO_CHAR(audit_rec.new_salary), 'NULL'));
    END LOOP;

    COMMIT;
END;
/
```

### Statement-Level vs Row-Level Triggers

```sql
-- Statement-level trigger (fires once per statement)
CREATE OR REPLACE TRIGGER statement_level_trigger
    AFTER UPDATE ON employees
DECLARE
    v_updated_rows NUMBER;
BEGIN
    v_updated_rows := SQL%ROWCOUNT;
    DBMS_OUTPUT.PUT_LINE('Statement-level trigger: ' || v_updated_rows || ' rows updated');

    INSERT INTO system_log (log_message, log_date)
    VALUES ('Bulk update on employees: ' || v_updated_rows || ' rows', SYSDATE);
END statement_level_trigger;
/

-- Row-level trigger (fires once for each row)
CREATE OR REPLACE TRIGGER row_level_trigger
    AFTER UPDATE ON employees
    FOR EACH ROW
BEGIN
    DBMS_OUTPUT.PUT_LINE('Row-level trigger: Employee ' || :OLD.employee_id ||
                        ' salary changed from ' || :OLD.salary || ' to ' || :NEW.salary);
END row_level_trigger;
/

-- Test both trigger types
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== TESTING TRIGGER LEVELS ===');

    -- This will fire:
    -- - Row-level trigger for EACH row
    -- - Statement-level trigger ONCE after all rows
    UPDATE employees
    SET salary = salary * 1.05
    WHERE department_id = 50;

    DBMS_OUTPUT.PUT_LINE('Update completed - check trigger output above');

    ROLLBACK; -- To avoid actual changes in demo
END;
/
```

### Database Event Triggers

```sql
-- Note: These require DBA privileges in many environments

-- Logon trigger (track user logins)
CREATE OR REPLACE TRIGGER logon_audit_trigger
    AFTER LOGON ON DATABASE
BEGIN
    INSERT INTO login_audit (
        login_id, username, login_time, session_info
    ) VALUES (
        login_seq.NEXTVAL, USER, SYSDATE,
        'Session: ' || SYS_CONTEXT('USERENV', 'SESSIONID')
    );
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        NULL; -- Don't prevent login if audit fails
END logon_audit_trigger;
/

-- DDL trigger (track schema changes)
CREATE OR REPLACE TRIGGER ddl_audit_trigger
    AFTER DDL ON SCHEMA
DECLARE
    v_event VARCHAR2(100);
    v_object_type VARCHAR2(100);
    v_object_name VARCHAR2(100);
BEGIN
    v_event := ORA_SYSEVENT;
    v_object_type := ORA_DICT_OBJ_TYPE;
    v_object_name := ORA_DICT_OBJ_NAME;

    INSERT INTO ddl_audit (
        audit_id, username, event_type, object_type,
        object_name, event_time, sql_text
    ) VALUES (
        ddl_audit_seq.NEXTVAL, USER, v_event, v_object_type,
        v_object_name, SYSDATE, ORA_SQL_TXT(1)
    );
    COMMIT;

    DBMS_OUTPUT.PUT_LINE('DDL Event: ' || v_event || ' on ' ||
                        v_object_type || ' ' || v_object_name);
EXCEPTION
    WHEN OTHERS THEN
        NULL; -- Don't prevent DDL if audit fails
END ddl_audit_trigger;
/
```

### Best Practices for Triggers

```sql
-- Example of a well-designed trigger with best practices
CREATE OR REPLACE TRIGGER maintain_employee_history
    AFTER UPDATE OR DELETE ON employees
    FOR EACH ROW
DECLARE
    v_action CHAR(1);
    v_timestamp TIMESTAMP := SYSTIMESTAMP;
BEGIN
    -- Determine action
    IF UPDATING THEN
        v_action := 'U';
        DBMS_OUTPUT.PUT_LINE('Maintaining history for update on employee ' || :OLD.employee_id);
    ELSIF DELETING THEN
        v_action := 'D';
        DBMS_OUTPUT.PUT_LINE('Maintaining history for deletion of employee ' || :OLD.employee_id);
    END IF;

    -- Only proceed if meaningful changes occurred
    IF UPDATING AND (
        :OLD.first_name != :NEW.first_name OR
        :OLD.last_name != :NEW.last_name OR
        :OLD.salary != :NEW.salary OR
        :OLD.department_id != :NEW.department_id OR
        :OLD.job_id != :NEW.job_id
    ) THEN
        INSERT INTO employee_history (
            history_id, employee_id, action_type,
            old_first_name, new_first_name,
            old_last_name, new_last_name,
            old_salary, new_salary,
            old_department_id, new_department_id,
            old_job_id, new_job_id,
            change_timestamp, changed_by
        ) VALUES (
            history_seq.NEXTVAL, :OLD.employee_id, v_action,
            :OLD.first_name, :NEW.first_name,
            :OLD.last_name, :NEW.last_name,
            :OLD.salary, :NEW.salary,
            :OLD.department_id, :NEW.department_id,
            :OLD.job_id, :NEW.job_id,
            v_timestamp, USER
        );

        DBMS_OUTPUT.PUT_LINE('History record created');

    ELSIF DELETING THEN
        INSERT INTO employee_history (
            history_id, employee_id, action_type,
            old_first_name, old_last_name, old_salary,
            old_department_id, old_job_id,
            change_timestamp, changed_by
        ) VALUES (
            history_seq.NEXTVAL, :OLD.employee_id, v_action,
            :OLD.first_name, :OLD.last_name, :OLD.salary,
            :OLD.department_id, :OLD.job_id,
            v_timestamp, USER
        );

        DBMS_OUTPUT.PUT_LINE('Deletion history record created');
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't prevent original operation
        DBMS_OUTPUT.PUT_LINE('Error in history trigger: ' || SQLERRM);
        -- In production, insert into error log table
END maintain_employee_history;
/
```

## 9. Advanced PL/SQL Features

### 9.1 Dynamic SQL

#### What is Dynamic SQL?

**Dynamic SQL** allows you to construct and execute SQL statements dynamically at runtime. This provides flexibility when you don't know the exact SQL statement at compile time.

#### EXECUTE IMMEDIATE - Basic Usage

```sql
DECLARE
    v_sql_stmt VARCHAR2(1000);
    v_emp_count NUMBER;
    v_dept_id NUMBER := 50;
    v_emp_name VARCHAR2(100);
    v_emp_salary NUMBER;
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== DYNAMIC SQL BASIC USAGE ===');

    -- Example 1: Dynamic SELECT with single result
    v_sql_stmt := 'SELECT COUNT(*) FROM employees WHERE department_id = :dept_id';
    EXECUTE IMMEDIATE v_sql_stmt INTO v_emp_count USING v_dept_id;
    DBMS_OUTPUT.PUT_LINE('Employees in department ' || v_dept_id || ': ' || v_emp_count);

    -- Example 2: Dynamic SELECT with multiple columns
    v_sql_stmt := 'SELECT first_name, salary FROM employees WHERE employee_id = 100';
    EXECUTE IMMEDIATE v_sql_stmt INTO v_emp_name, v_emp_salary;
    DBMS_OUTPUT.PUT_LINE('Employee 100: ' || v_emp_name || ', Salary: $' || v_emp_salary);

    -- Example 3: Dynamic DML with parameters
    v_sql_stmt := 'UPDATE employees SET salary = salary * 1.1 WHERE department_id = :dept';
    EXECUTE IMMEDIATE v_sql_stmt USING v_dept_id;
    DBMS_OUTPUT.PUT_LINE('Salary updated for department ' || v_dept_id);

    -- Example 4: Dynamic DDL
    BEGIN
        v_sql_stmt := 'CREATE TABLE temp_employees AS SELECT * FROM employees WHERE 1=0';
        EXECUTE IMMEDIATE v_sql_stmt;
        DBMS_OUTPUT.PUT_LINE('Temporary table created');
    EXCEPTION
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('Table might already exist: ' || SQLERRM);
    END;

END;
/
```

#### Dynamic SQL with Dynamic WHERE Clauses

```sql
CREATE OR REPLACE PROCEDURE dynamic_employee_search(
    p_department_id IN NUMBER DEFAULT NULL,
    p_job_id IN VARCHAR2 DEFAULT NULL,
    p_min_salary IN NUMBER DEFAULT NULL,
    p_max_salary IN NUMBER DEFAULT NULL
) IS
    v_sql_stmt VARCHAR2(2000);
    v_where_clause VARCHAR2(1000) := ' WHERE 1=1';
    v_emp_id employees.employee_id%TYPE;
    v_emp_name VARCHAR2(100);
    v_salary employees.salary%TYPE;
    v_dept_name departments.department_name%TYPE;
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== DYNAMIC EMPLOYEE SEARCH ===');

    -- Build WHERE clause dynamically based on provided parameters
    IF p_department_id IS NOT NULL THEN
        v_where_clause := v_where_clause || ' AND e.department_id = :dept_id';
    END IF;

    IF p_job_id IS NOT NULL THEN
        v_where_clause := v_where_clause || ' AND e.job_id = :job_id';
    END IF;

    IF p_min_salary IS NOT NULL THEN
        v_where_clause := v_where_clause || ' AND e.salary >= :min_sal';
    END IF;

    IF p_max_salary IS NOT NULL THEN
        v_where_clause := v_where_clause || ' AND e.salary <= :max_sal';
    END IF;

    -- Construct full SQL statement
    v_sql_stmt := 'SELECT e.employee_id, e.first_name || '' '' || e.last_name, ' ||
                  'e.salary, d.department_name ' ||
                  'FROM employees e ' ||
                  'JOIN departments d ON e.department_id = d.department_id' ||
                  v_where_clause ||
                  ' ORDER BY e.salary DESC';

    DBMS_OUTPUT.PUT_LINE('Executing: ' || v_sql_stmt);
    DBMS_OUTPUT.PUT_LINE('--- Search Results ---');

    -- Execute dynamic query with appropriate bind variables
    IF p_department_id IS NOT NULL AND p_job_id IS NOT NULL AND
       p_min_salary IS NOT NULL AND p_max_salary IS NOT NULL THEN
        FOR rec IN (
            EXECUTE IMMEDIATE v_sql_stmt
            USING p_department_id, p_job_id, p_min_salary, p_max_salary
        ) LOOP
            DBMS_OUTPUT.PUT_LINE('ID: ' || rec.employee_id || ', Name: ' || rec.full_name ||
                               ', Salary: $' || rec.salary || ', Dept: ' || rec.department_name);
        END LOOP;
    ELSIF p_department_id IS NOT NULL AND p_min_salary IS NOT NULL THEN
        FOR rec IN (
            EXECUTE IMMEDIATE v_sql_stmt
            USING p_department_id, p_min_salary
        ) LOOP
            DBMS_OUTPUT.PUT_LINE('ID: ' || rec.employee_id || ', Name: ' || rec.full_name ||
                               ', Salary: $' || rec.salary || ', Dept: ' || rec.department_name);
        END LOOP;
    ELSE
        FOR rec IN (EXECUTE IMMEDIATE v_sql_stmt) LOOP
            DBMS_OUTPUT.PUT_LINE('ID: ' || rec.employee_id || ', Name: ' || rec.full_name ||
                               ', Salary: $' || rec.salary || ', Dept: ' || rec.department_name);
        END LOOP;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error in dynamic search: ' || SQLERRM);
        DBMS_OUTPUT.PUT_LINE('SQL: ' || v_sql_stmt);
END dynamic_employee_search;
/

-- Test the dynamic search procedure
BEGIN
    dynamic_employee_search(p_department_id => 50);
    DBMS_OUTPUT.PUT_LINE('---');
    dynamic_employee_search(p_min_salary => 5000, p_max_salary => 10000);
    DBMS_OUTPUT.PUT_LINE('---');
    dynamic_employee_search(p_job_id => 'SA_REP', p_min_salary => 6000);
END;
/
```

#### DBMS_SQL Package - Advanced Dynamic SQL

```sql
DECLARE
    v_cursor INTEGER;
    v_rows_processed INTEGER;
    v_emp_id NUMBER;
    v_emp_name VARCHAR2(100);
    v_salary NUMBER;
    v_department_id NUMBER := 50;
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== DBMS_SQL PACKAGE DEMO ===');

    -- Step 1: Open cursor
    v_cursor := DBMS_SQL.OPEN_CURSOR;

    -- Step 2: Parse SQL statement
    DBMS_SQL.PARSE(v_cursor,
        'SELECT employee_id, first_name || '' '' || last_name, salary ' ||
        'FROM employees WHERE department_id = :dept_id',
        DBMS_SQL.NATIVE);

    -- Step 3: Bind variables
    DBMS_SQL.BIND_VARIABLE(v_cursor, ':dept_id', v_department_id);

    -- Step 4: Define columns for output
    DBMS_SQL.DEFINE_COLUMN(v_cursor, 1, v_emp_id);
    DBMS_SQL.DEFINE_COLUMN(v_cursor, 2, v_emp_name, 100);
    DBMS_SQL.DEFINE_COLUMN(v_cursor, 3, v_salary);

    -- Step 5: Execute cursor
    v_rows_processed := DBMS_SQL.EXECUTE(v_cursor);

    -- Step 6: Fetch and process rows
    DBMS_OUTPUT.PUT_LINE('Employees in Department ' || v_department_id || ':');
    WHILE DBMS_SQL.FETCH_ROWS(v_cursor) > 0 LOOP
        DBMS_SQL.COLUMN_VALUE(v_cursor, 1, v_emp_id);
        DBMS_SQL.COLUMN_VALUE(v_cursor, 2, v_emp_name);
        DBMS_SQL.COLUMN_VALUE(v_cursor, 3, v_salary);

        DBMS_OUTPUT.PUT_LINE('  ID: ' || v_emp_id || ', Name: ' || v_emp_name ||
                           ', Salary: $' || v_salary);
    END LOOP;

    -- Step 7: Close cursor
    DBMS_SQL.CLOSE_CURSOR(v_cursor);

    DBMS_OUTPUT.PUT_LINE('Total rows processed: ' || v_rows_processed);

EXCEPTION
    WHEN OTHERS THEN
        IF DBMS_SQL.IS_OPEN(v_cursor) THEN
            DBMS_SQL.CLOSE_CURSOR(v_cursor);
        END IF;
        RAISE;
END;
/
```

### 9.2 Bulk Processing

#### What is Bulk Processing?

**Bulk processing** allows you to process multiple rows simultaneously, significantly improving performance by reducing context switches between SQL and PL/SQL engines.

#### BULK COLLECT - Fetch Multiple Rows

```sql
DECLARE
    -- Define collection types
    TYPE emp_id_table IS TABLE OF employees.employee_id%TYPE;
    TYPE emp_name_table IS TABLE OF employees.first_name%TYPE;
    TYPE emp_salary_table IS TABLE OF employees.salary%TYPE;

    -- Declare collection variables
    v_emp_ids emp_id_table;
    v_emp_names emp_name_table;
    v_emp_salaries emp_salary_table;

    v_start_time NUMBER;
    v_end_time NUMBER;
    v_dept_id NUMBER := 50;
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== BULK COLLECT DEMO ===');

    v_start_time := DBMS_UTILITY.GET_TIME;

    -- Method 1: BULK COLLECT into multiple collections
    SELECT employee_id, first_name, salary
    BULK COLLECT INTO v_emp_ids, v_emp_names, v_emp_salaries
    FROM employees
    WHERE department_id = v_dept_id;

    v_end_time := DBMS_UTILITY.GET_TIME;

    DBMS_OUTPUT.PUT_LINE('BULK COLLECT fetched ' || v_emp_ids.COUNT || ' rows in ' ||
                        (v_end_time - v_start_time) || ' centiseconds');

    -- Display first 5 results
    DBMS_OUTPUT.PUT_LINE('First 5 employees:');
    FOR i IN 1..LEAST(5, v_emp_ids.COUNT) LOOP
        DBMS_OUTPUT.PUT_LINE('  ' || v_emp_ids(i) || ': ' || v_emp_names(i) ||
                           ' - $' || v_emp_salaries(i));
    END LOOP;

    -- Method 2: BULK COLLECT with LIMIT (for large datasets)
    DECLARE
        CURSOR emp_cursor IS
            SELECT employee_id, first_name, salary
            FROM employees
            WHERE department_id = v_dept_id;

        v_batch_size NUMBER := 100; -- Process 100 rows at a time
    BEGIN
        DBMS_OUTPUT.PUT_LINE('--- BULK COLLECT with LIMIT (' || v_batch_size || ' rows/batch) ---');

        OPEN emp_cursor;
        LOOP
            FETCH emp_cursor
            BULK COLLECT INTO v_emp_ids, v_emp_names, v_emp_salaries
            LIMIT v_batch_size;

            EXIT WHEN v_emp_ids.COUNT = 0;

            DBMS_OUTPUT.PUT_LINE('Processing batch of ' || v_emp_ids.COUNT || ' rows');

            -- Process the batch
            FOR i IN 1..v_emp_ids.COUNT LOOP
                -- Simulate processing
                NULL;
            END LOOP;
        END LOOP;
        CLOSE emp_cursor;
    END;

END;
/
```

#### FORALL - Bulk DML Operations

```sql
-- Create a test table for bulk operations
CREATE TABLE employee_bonus (
    bonus_id NUMBER PRIMARY KEY,
    employee_id NUMBER,
    bonus_amount NUMBER,
    bonus_date DATE,
    status VARCHAR2(20) DEFAULT 'PENDING'
);

CREATE SEQUENCE bonus_seq START WITH 1;

DECLARE
    TYPE id_table IS TABLE OF employees.employee_id%TYPE;
    TYPE bonus_table IS TABLE OF employee_bonus.bonus_amount%TYPE;
    TYPE date_table IS TABLE OF employee_bonus.bonus_date%TYPE;

    v_emp_ids id_table;
    v_bonuses bonus_table;
    v_bonus_dates date_table;

    v_start_time NUMBER;
    v_end_time NUMBER;
    v_dept_id NUMBER := 50;
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== FORALL BULK DML DEMO ===');

    -- Get employees for bonus calculation
    SELECT employee_id, salary * 0.1, SYSDATE
    BULK COLLECT INTO v_emp_ids, v_bonuses, v_bonus_dates
    FROM employees
    WHERE department_id = v_dept_id;

    DBMS_OUTPUT.PUT_LINE('Calculating bonuses for ' || v_emp_ids.COUNT || ' employees');

    -- Method 1: Regular FOR loop (slow)
    v_start_time := DBMS_UTILITY.GET_TIME;

    /*
    FOR i IN 1..v_emp_ids.COUNT LOOP
        INSERT INTO employee_bonus (bonus_id, employee_id, bonus_amount, bonus_date)
        VALUES (bonus_seq.NEXTVAL, v_emp_ids(i), v_bonuses(i), v_bonus_dates(i));
    END LOOP;
    */

    v_end_time := DBMS_UTILITY.GET_TIME;
    -- DBMS_OUTPUT.PUT_LINE('FOR loop time: ' || (v_end_time - v_start_time) || ' centiseconds');

    -- Clear table for next test
    DELETE FROM employee_bonus;
    COMMIT;

    -- Method 2: FORALL (fast)
    v_start_time := DBMS_UTILITY.GET_TIME;

    FORALL i IN 1..v_emp_ids.COUNT
        INSERT INTO employee_bonus (bonus_id, employee_id, bonus_amount, bonus_date)
        VALUES (bonus_seq.NEXTVAL, v_emp_ids(i), v_bonuses(i), v_bonus_dates(i));

    v_end_time := DBMS_UTILITY.GET_TIME;

    DBMS_OUTPUT.PUT_LINE('FORALL time: ' || (v_end_time - v_start_time) || ' centiseconds');
    DBMS_OUTPUT.PUT_LINE('Inserted ' || SQL%ROWCOUNT || ' records using FORALL');

    -- Verify results
    SELECT COUNT(*) INTO v_start_time FROM employee_bonus;
    DBMS_OUTPUT.PUT_LINE('Total records in table: ' || v_start_time);

    -- FORALL with SAVE EXCEPTIONS
    BEGIN
        -- Create a duplicate to cause error
        INSERT INTO employee_bonus VALUES (1, 100, 1000, SYSDATE, 'TEST');
        COMMIT;

        -- This will fail for employee_id 100 due to unique constraint
        FORALL i IN 1..v_emp_ids.COUNT SAVE EXCEPTIONS
            UPDATE employee_bonus
            SET bonus_amount = v_bonuses(i)
            WHERE employee_id = v_emp_ids(i);

    EXCEPTION
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('FORALL completed with errors');
            DBMS_OUTPUT.PUT_LINE('Error count: ' || SQL%BULK_EXCEPTIONS.COUNT);

            FOR i IN 1..SQL%BULK_EXCEPTIONS.COUNT LOOP
                DBMS_OUTPUT.PUT_LINE('Error ' || i || ': Index ' ||
                    SQL%BULK_EXCEPTIONS(i).ERROR_INDEX || ', Code ' ||
                    SQL%BULK_EXCEPTIONS(i).ERROR_CODE);
            END LOOP;
    END;

    ROLLBACK; -- Cleanup

END;
/
```

### 9.3 Advanced Data Types

#### Collections: VARRAY, Nested Tables, Associative Arrays

```sql
DECLARE
    -- VARRAY (Variable-size array) - fixed maximum size
    TYPE phone_list IS VARRAY(5) OF VARCHAR2(15);
    v_phones phone_list := phone_list('555-0001', '555-0002');

    -- Nested Table - unbounded, can be stored in database
    TYPE project_table IS TABLE OF VARCHAR2(100);
    v_projects project_table := project_table('Website Redesign', 'Mobile App');

    -- Associative Array (index-by table) - key-value pairs
    TYPE salary_table IS TABLE OF NUMBER INDEX BY VARCHAR2(50);
    v_salaries salary_table;

    -- Record type with collections
    TYPE emp_record IS RECORD (
        emp_id NUMBER,
        emp_name VARCHAR2(100),
        skills project_table
    );

    v_employee emp_record;

BEGIN
    DBMS_OUTPUT.PUT_LINE('=== ADVANCED COLLECTIONS DEMO ===');

    -- VARRAY operations
    DBMS_OUTPUT.PUT_LINE('--- VARRAY Example ---');
    DBMS_OUTPUT.PUT_LINE('Phone count: ' || v_phones.COUNT);
    DBMS_OUTPUT.PUT_LINE('Limit: ' || v_phones.LIMIT);

    -- Add more phones
    v_phones.EXTEND(2);
    v_phones(3) := '555-0003';
    v_phones(4) := '555-0004';

    FOR i IN 1..v_phones.COUNT LOOP
        DBMS_OUTPUT.PUT_LINE('Phone ' || i || ': ' || v_phones(i));
    END LOOP;

    -- Nested Table operations
    DBMS_OUTPUT.PUT_LINE('--- Nested Table Example ---');
    v_projects.EXTEND;
    v_projects(3) := 'Database Migration';

    DBMS_OUTPUT.PUT_LINE('Projects: ' || v_projects.COUNT);
    FOR i IN 1..v_projects.COUNT LOOP
        DBMS_OUTPUT.PUT_LINE('Project ' || i || ': ' || v_projects(i));
    END LOOP;

    -- Delete from nested table
    v_projects.DELETE(2);
    DBMS_OUTPUT.PUT_LINE('After deletion - Projects: ' || v_projects.COUNT);

    -- Associative Array operations
    DBMS_OUTPUT.PUT_LINE('--- Associative Array Example ---');
    v_salaries('John') := 50000;
    v_salaries('Jane') := 60000;
    v_salaries('Bob') := 55000;

    DBMS_OUTPUT.PUT_LINE('Salary entries: ' || v_salaries.COUNT);

    -- Iterate through associative array
    DECLARE
        v_index VARCHAR2(50);
    BEGIN
        v_index := v_salaries.FIRST;
        WHILE v_index IS NOT NULL LOOP
            DBMS_OUTPUT.PUT_LINE(v_index || ': $' || v_salaries(v_index));
            v_index := v_salaries.NEXT(v_index);
        END LOOP;
    END;

    -- Complex record with collection
    DBMS_OUTPUT.PUT_LINE('--- Complex Record Example ---');
    v_employee.emp_id := 1001;
    v_employee.emp_name := 'Alice Cooper';
    v_employee.skills := project_table('Java', 'Python', 'SQL', 'PL/SQL');

    DBMS_OUTPUT.PUT_LINE('Employee: ' || v_employee.emp_name);
    DBMS_OUTPUT.PUT_LINE('Skills: ' || v_employee.skills.COUNT);
    FOR i IN 1..v_employee.skills.COUNT LOOP
        DBMS_OUTPUT.PUT_LINE('  - ' || v_employee.skills(i));
    END LOOP;

    -- Collection methods demonstration
    DBMS_OUTPUT.PUT_LINE('--- Collection Methods ---');
    DBMS_OUTPUT.PUT_LINE('First skill: ' || v_employee.skills(v_employee.skills.FIRST));
    DBMS_OUTPUT.PUT_LINE('Last skill: ' || v_employee.skills(v_employee.skills.LAST));
    DBMS_OUTPUT.PUT_LINE('Exists skill 2: ' || CASE WHEN v_employee.skills.EXISTS(2) THEN 'YES' ELSE 'NO' END);

    -- Trim collection
    v_employee.skills.TRIM(1);
    DBMS_OUTPUT.PUT_LINE('After trim - Skills count: ' || v_employee.skills.COUNT);

END;
/
```

#### Object Types - Creating Custom Data Structures

```sql
-- Create object type (like a class in OOP)
CREATE OR REPLACE TYPE address_obj AS OBJECT (
    street VARCHAR2(100),
    city VARCHAR2(50),
    state VARCHAR2(50),
    zip_code VARCHAR2(20),

    -- Member function
    MEMBER FUNCTION get_formatted_address RETURN VARCHAR2,

    -- Member procedure
    MEMBER PROCEDURE update_address(
        p_street VARCHAR2,
        p_city VARCHAR2,
        p_state VARCHAR2,
        p_zip VARCHAR2
    )
);
/

CREATE OR REPLACE TYPE BODY address_obj AS
    MEMBER FUNCTION get_formatted_address RETURN VARCHAR2 IS
    BEGIN
        RETURN street || ', ' || city || ', ' || state || ' ' || zip_code;
    END get_formatted_address;

    MEMBER PROCEDURE update_address(
        p_street VARCHAR2,
        p_city VARCHAR2,
        p_state VARCHAR2,
        p_zip VARCHAR2
    ) IS
    BEGIN
        street := p_street;
        city := p_city;
        state := p_state;
        zip_code := p_zip;
    END update_address;
END;
/

-- Create another object type that uses address_obj
CREATE OR REPLACE TYPE person_obj AS OBJECT (
    person_id NUMBER,
    first_name VARCHAR2(50),
    last_name VARCHAR2(50),
    email VARCHAR2(100),
    home_address address_obj,

    -- Constructor
    CONSTRUCTOR FUNCTION person_obj(
        p_id NUMBER,
        p_first_name VARCHAR2,
        p_last_name VARCHAR2
    ) RETURN SELF AS RESULT,

    -- Member functions
    MEMBER FUNCTION get_full_name RETURN VARCHAR2,
    MEMBER FUNCTION get_person_info RETURN VARCHAR2,

    -- Static function
    STATIC FUNCTION get_person_count RETURN NUMBER
);
/

CREATE OR REPLACE TYPE BODY person_obj AS
    -- Constructor implementation
    CONSTRUCTOR FUNCTION person_obj(
        p_id NUMBER,
        p_first_name VARCHAR2,
        p_last_name VARCHAR2
    ) RETURN SELF AS RESULT IS
    BEGIN
        SELF.person_id := p_id;
        SELF.first_name := p_first_name;
        SELF.last_name := p_last_name;
        SELF.email := LOWER(p_first_name) || '.' || LOWER(p_last_name) || '@company.com';
        RETURN;
    END;

    MEMBER FUNCTION get_full_name RETURN VARCHAR2 IS
    BEGIN
        RETURN first_name || ' ' || last_name;
    END get_full_name;

    MEMBER FUNCTION get_person_info RETURN VARCHAR2 IS
    BEGIN
        RETURN 'ID: ' || person_id || ', Name: ' || get_full_name() ||
               ', Email: ' || email;
    END get_person_info;

    STATIC FUNCTION get_person_count RETURN NUMBER IS
        v_count NUMBER;
    BEGIN
        SELECT COUNT(*) INTO v_count FROM employees;
        RETURN v_count;
    END get_person_count;
END;
/

-- Using object types in PL/SQL
DECLARE
    v_address address_obj;
    v_person1 person_obj;
    v_person2 person_obj;
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== OBJECT TYPES DEMO ===');

    -- Create address object
    v_address := address_obj('123 Main St', 'New York', 'NY', '10001');
    DBMS_OUTPUT.PUT_LINE('Address: ' || v_address.get_formatted_address);

    -- Update address using member procedure
    v_address.update_address('456 Oak Ave', 'Boston', 'MA', '02101');
    DBMS_OUTPUT.PUT_LINE('Updated Address: ' || v_address.get_formatted_address);

    -- Create person objects
    v_person1 := person_obj(1001, 'John', 'Doe');
    v_person1.home_address := address_obj('789 Pine Rd', 'Chicago', 'IL', '60601');

    v_person2 := person_obj(1002, 'Jane', 'Smith');

    -- Use member functions
    DBMS_OUTPUT.PUT_LINE('Person 1: ' || v_person1.get_person_info);
    DBMS_OUTPUT.PUT_LINE('Person 2: ' || v_person2.get_person_info);
    DBMS_OUTPUT.PUT_LINE('Person 1 Full Name: ' || v_person1.get_full_name);

    -- Use static function
    DBMS_OUTPUT.PUT_LINE('Total people in system: ' || person_obj.get_person_count);

    -- Access nested object
    IF v_person1.home_address IS NOT NULL THEN
        DBMS_OUTPUT.PUT_LINE('Person 1 Address: ' || v_person1.home_address.get_formatted_address);
    END IF;

END;
/
```

### 9.4 Performance Tuning Features

#### Autonomous Transactions

```sql
-- Autonomous transaction procedure (runs independently of main transaction)
CREATE OR REPLACE PROCEDURE log_audit_trail(
    p_action VARCHAR2,
    p_details VARCHAR2,
    p_user VARCHAR2 DEFAULT USER
) IS
    PRAGMA AUTONOMOUS_TRANSACTION; -- This makes it independent
BEGIN
    INSERT INTO employee_audit (
        audit_id, employee_id, action_type, action_details, changed_by, change_date
    ) VALUES (
        audit_seq.NEXTVAL, NULL, p_action, p_details, p_user, SYSDATE
    );

    COMMIT; -- Can commit independently

    DBMS_OUTPUT.PUT_LINE('Audit logged: ' || p_action);

EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END log_audit_trail;
/

-- Demonstrate autonomous transactions
DECLARE
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== AUTONOMOUS TRANSACTIONS DEMO ===');

    -- Start a main transaction
    UPDATE employees SET salary = salary * 1.05 WHERE employee_id = 100;
    DBMS_OUTPUT.PUT_LINE('Main transaction: Salary updated');

    -- Call autonomous procedure - this commits independently
    log_audit_trail('SALARY_TEST', 'Testing autonomous transaction');

    -- The main transaction is still active and can be rolled back
    ROLLBACK;

    DBMS_OUTPUT.PUT_LINE('Main transaction rolled back, but audit record persists');

    -- Verify: Salary change was rolled back, but audit record remains
    SELECT salary INTO DBMS_OUTPUT.PUT_LINE FROM employees WHERE employee_id = 100;
    DBMS_OUTPUT.PUT_LINE('Current salary: ' || salary);

    -- Check audit table
    SELECT COUNT(*) INTO DBMS_OUTPUT.PUT_LINE FROM employee_audit
    WHERE action_type = 'SALARY_TEST';
    DBMS_OUTPUT.PUT_LINE('Audit records found: ' || COUNT(*));

END;
/
```

#### Result Cache - Function Result Caching

```sql
-- Result cache function (Oracle 11g+)
CREATE OR REPLACE FUNCTION get_department_stats_cached(
    p_dept_id NUMBER
) RETURN VARCHAR2
RESULT_CACHE RELIES_ON (employees, departments) -- Declare dependencies
IS
    v_emp_count NUMBER;
    v_avg_salary NUMBER;
    v_dept_name VARCHAR2(50);
    v_result VARCHAR2(500);
BEGIN
    DBMS_OUTPUT.PUT_LINE('Computing department stats for ID: ' || p_dept_id);

    SELECT
        COUNT(*),
        AVG(salary),
        department_name
    INTO v_emp_count, v_avg_salary, v_dept_name
    FROM employees e
    JOIN departments d ON e.department_id = d.department_id
    WHERE e.department_id = p_dept_id
    GROUP BY department_name;

    v_result := 'Department: ' || v_dept_name ||
                ', Employees: ' || v_emp_count ||
                ', Avg Salary: $' || ROUND(v_avg_salary, 2);

    RETURN v_result;

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RETURN 'Department not found or has no employees';
END get_department_stats_cached;
/

-- Demonstrate result caching
DECLARE
    v_start_time NUMBER;
    v_end_time NUMBER;
    v_result VARCHAR2(500);
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== RESULT CACHE DEMO ===');

    -- First call - will compute
    v_start_time := DBMS_UTILITY.GET_TIME;
    v_result := get_department_stats_cached(50);
    v_end_time := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('First call: ' || v_result);
    DBMS_OUTPUT.PUT_LINE('Time: ' || (v_end_time - v_start_time) || ' centiseconds');

    -- Second call - should use cache
    v_start_time := DBMS_UTILITY.GET_TIME;
    v_result := get_department_stats_cached(50);
    v_end_time := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('Second call: ' || v_result);
    DBMS_OUTPUT.PUT_LINE('Time: ' || (v_end_time - v_start_time) || ' centiseconds (cached)');

    -- Different parameter - will compute again
    v_start_time := DBMS_UTILITY.GET_TIME;
    v_result := get_department_stats_cached(60);
    v_end_time := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('Different param: ' || v_result);
    DBMS_OUTPUT.PUT_LINE('Time: ' || (v_end_time - v_start_time) || ' centiseconds');

END;
/
```

### 9.5 Advanced Error Handling and Logging

#### Comprehensive Error Management Framework

```sql
-- Create error logging table
CREATE TABLE error_log (
    error_id NUMBER PRIMARY KEY,
    error_code NUMBER,
    error_message VARCHAR2(4000),
    back_trace CLOB,
    call_stack CLOB,
    raised_by VARCHAR2(100),
    error_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    additional_info VARCHAR2(4000)
);

CREATE SEQUENCE error_log_seq START WITH 1;

-- Advanced error handling package
CREATE OR REPLACE PACKAGE error_mgmt AS
    -- Log levels
    c_log_level_debug CONSTANT NUMBER := 1;
    c_log_level_info CONSTANT NUMBER := 2;
    c_log_level_warn CONSTANT NUMBER := 3;
    c_log_level_error CONSTANT NUMBER := 4;

    -- Public procedures
    PROCEDURE log_error(
        p_error_code NUMBER DEFAULT NULL,
        p_error_message VARCHAR2 DEFAULT NULL,
        p_additional_info VARCHAR2 DEFAULT NULL,
        p_log_level NUMBER DEFAULT c_log_level_error
    );

    PROCEDURE log_and_raise(
        p_error_code NUMBER,
        p_error_message VARCHAR2,
        p_additional_info VARCHAR2 DEFAULT NULL
    );

    FUNCTION get_error_context RETURN VARCHAR2;

    PROCEDURE cleanup_on_error;

END error_mgmt;
/

CREATE OR REPLACE PACKAGE BODY error_mgmt AS

    PROCEDURE log_error(
        p_error_code NUMBER DEFAULT NULL,
        p_error_message VARCHAR2 DEFAULT NULL,
        p_additional_info VARCHAR2 DEFAULT NULL,
        p_log_level NUMBER DEFAULT c_log_level_error
    ) IS
        PRAGMA AUTONOMOUS_TRANSACTION;
        v_error_code NUMBER := p_error_code;
        v_error_message VARCHAR2(4000) := p_error_message;
    BEGIN
        -- If no parameters provided, use current error
        IF v_error_code IS NULL AND v_error_message IS NULL THEN
            v_error_code := SQLCODE;
            v_error_message := SQLERRM;
        END IF;

        INSERT INTO error_log (
            error_id, error_code, error_message, back_trace,
            call_stack, raised_by, additional_info
        ) VALUES (
            error_log_seq.NEXTVAL,
            v_error_code,
            v_error_message,
            DBMS_UTILITY.FORMAT_ERROR_BACKTRACE,
            DBMS_UTILITY.FORMAT_CALL_STACK,
            USER,
            p_additional_info
        );

        COMMIT;

        -- Also output to console for immediate visibility
        DBMS_OUTPUT.PUT_LINE('ERROR LOGGED: ' || v_error_code || ' - ' || v_error_message);

    EXCEPTION
        WHEN OTHERS THEN
            -- If error logging fails, at least output to console
            DBMS_OUTPUT.PUT_LINE('CRITICAL: Error logging failed: ' || SQLERRM);
            ROLLBACK;
    END log_error;

    PROCEDURE log_and_raise(
        p_error_code NUMBER,
        p_error_message VARCHAR2,
        p_additional_info VARCHAR2 DEFAULT NULL
    ) IS
    BEGIN
        log_error(p_error_code, p_error_message, p_additional_info);
        RAISE_APPLICATION_ERROR(p_error_code, p_error_message);
    END log_and_raise;

    FUNCTION get_error_context RETURN VARCHAR2 IS
        v_context VARCHAR2(4000);
    BEGIN
        v_context := 'Backtrace: ' || DBMS_UTILITY.FORMAT_ERROR_BACKTRACE ||
                    CHR(10) || 'Call Stack: ' || DBMS_UTILITY.FORMAT_CALL_STACK;
        RETURN v_context;
    END get_error_context;

    PROCEDURE cleanup_on_error IS
    BEGIN
        -- Perform any necessary cleanup here
        -- For example: close open cursors, reset package state, etc.
        DBMS_OUTPUT.PUT_LINE('Performing error cleanup...');
        -- Add specific cleanup logic as needed
    END cleanup_on_error;

END error_mgmt;
/

-- Demonstration of advanced error handling
CREATE OR REPLACE PROCEDURE complex_operation_with_errors IS
    v_temp_table_count NUMBER;
    v_processed_records NUMBER := 0;
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== COMPLEX OPERATION WITH ERROR HANDLING ===');

    BEGIN
        -- Operation 1: Check temporary table
        SELECT COUNT(*) INTO v_temp_table_count FROM user_tables
        WHERE table_name = 'TEMP_PROCESSING_DATA';

        IF v_temp_table_count = 0 THEN
            error_mgmt.log_and_raise(
                -20010,
                'Required temporary table not found',
                'Table: TEMP_PROCESSING_DATA'
            );
        END IF;

        -- Operation 2: Process data (simulate error)
        v_processed_records := 100;
        DBMS_OUTPUT.PUT_LINE('Processed ' || v_processed_records || ' records');

        -- Simulate a data error
        IF v_processed_records > 50 THEN
            RAISE_APPLICATION_ERROR(-20011, 'Data validation failed: Too many records');
        END IF;

        DBMS_OUTPUT.PUT_LINE('Operation completed successfully');

    EXCEPTION
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('Error in complex operation: ' || SQLERRM);

            -- Log the error with context
            error_mgmt.log_error(
                p_additional_info => 'Processed records: ' || v_processed_records ||
                                   ', Temp table exists: ' || v_temp_table_count
            );

            -- Perform cleanup
            error_mgmt.cleanup_on_error;

            -- Re-raise to caller
            RAISE;
    END;

END complex_operation_with_errors;
/

-- Test the error handling
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== TESTING ADVANCED ERROR HANDLING ===');

    BEGIN
        complex_operation_with_errors;
    EXCEPT
```
