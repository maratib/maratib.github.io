---
title: T-SQL
slug: guides/sql/t-sql
description: T-SQL
sidebar:
  order: 5
---

**Complete T-SQL Guide with Detailed Explanations**

## 1. T-SQL Fundamentals

### What is T-SQL?

**T-SQL (Transact-SQL)** is Microsoft's proprietary extension to SQL used in SQL Server and Azure SQL Database. It adds programming constructs, local variables, and control-flow features to standard SQL.

### Key Differences from PL/SQL:

- **Vendor**: Microsoft SQL Server vs Oracle
- **Syntax**: Different syntax for similar concepts
- **Error Handling**: TRY...CATCH blocks vs EXCEPTION sections
- **Variables**: @ prefix for variables
- **Procedural Extensions**: Different built-in functions and system procedures

### Basic T-SQL Batch Structure

```sql
-- T-SQL uses batches separated by GO
USE DatabaseName;  -- Switch database context
GO

-- Variable declarations
DECLARE @variable_name data_type;

-- Executable statements
SELECT @variable_name = column_name FROM table_name;

-- Control flow statements
IF @variable_name > 100
    BEGIN
        PRINT 'Value is greater than 100';
    END
GO
```

### Setting Up Your Environment

```sql
-- Switch to a specific database
USE AdventureWorks2019;
GO

-- Check if database exists and create if needed
IF NOT EXISTS(SELECT name FROM sys.databases WHERE name = 'TrainingDB')
BEGIN
    CREATE DATABASE TrainingDB;
END
GO

USE TrainingDB;
GO

-- Create a sample table for demonstrations
IF OBJECT_ID('Employees', 'U') IS NOT NULL
    DROP TABLE Employees;
GO

CREATE TABLE Employees (
    EmployeeID INT IDENTITY(1,1) PRIMARY KEY,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100),
    Salary DECIMAL(10,2),
    HireDate DATE DEFAULT GETDATE(),
    DepartmentID INT,
    IsActive BIT DEFAULT 1
);
GO

-- Insert sample data
INSERT INTO Employees (FirstName, LastName, Email, Salary, DepartmentID)
VALUES
    ('John', 'Doe', 'john.doe@company.com', 50000.00, 1),
    ('Jane', 'Smith', 'jane.smith@company.com', 65000.00, 1),
    ('Bob', 'Johnson', 'bob.johnson@company.com', 45000.00, 2),
    ('Alice', 'Brown', 'alice.brown@company.com', 75000.00, 2),
    ('Charlie', 'Wilson', 'charlie.wilson@company.com', 55000.00, 3);
GO
```

## 2. Variables and Data Types

### Understanding Variables in T-SQL

**Variables** in T-SQL are prefixed with @ and must be declared before use. They are scoped to the batch, stored procedure, or function.

### Scalar Data Types - Detailed Explanation

```sql
-- Demonstrating T-SQL variables and data types
DECLARE
    -- Numeric types
    @EmployeeID INT = 100,
    @Salary DECIMAL(10,2) = 50000.50,
    @Percentage FLOAT = 0.75,
    @SmallNumber SMALLINT = 32000,

    -- Character types
    @FirstName NVARCHAR(50) = N'John Doe',  -- NVARCHAR for Unicode
    @Code CHAR(3) = 'USA',                  -- CHAR for fixed length
    @Description VARCHAR(MAX) = 'Long text description', -- VARCHAR(MAX) for large text

    -- Date/Time types
    @HireDate DATE = GETDATE(),
    @BirthDate DATETIME = '1990-01-15',
    @Timestamp DATETIME2 = SYSDATETIME(),   -- Higher precision
    @TimeOnly TIME = '14:30:00',

    -- Binary types
    @BinaryData VARBINARY(MAX),

    -- Other types
    @IsActive BIT = 1,                      -- Boolean equivalent (0 or 1)
    @UniqueID UNIQUEIDENTIFIER = NEWID();   -- GUID

-- Display variable values
PRINT 'Employee: ' + @FirstName;
PRINT 'Salary: ' + CAST(@Salary AS NVARCHAR(20));
PRINT 'Hire Date: ' + CONVERT(NVARCHAR(20), @HireDate, 101);
PRINT 'Is Active: ' + CAST(@IsActive AS NVARCHAR(1));
PRINT 'GUID: ' + CAST(@UniqueID AS NVARCHAR(50));
GO
```

### Table Variables and Temporary Tables

```sql
-- TABLE VARIABLE (in-memory, scope limited to batch)
DECLARE @EmployeeTable TABLE (
    EmpID INT,
    FullName NVARCHAR(100),
    Salary DECIMAL(10,2),
    HireDate DATE
);

-- Insert into table variable
INSERT INTO @EmployeeTable (EmpID, FullName, Salary, HireDate)
SELECT
    EmployeeID,
    FirstName + ' ' + LastName,
    Salary,
    HireDate
FROM Employees
WHERE Salary > 50000;

-- Query table variable
SELECT * FROM @EmployeeTable;
GO

-- TEMPORARY TABLES (stored in tempdb, broader scope)
-- Local temporary table (prefix #, visible to current session)
CREATE TABLE #TempEmployees (
    EmpID INT,
    EmpName NVARCHAR(100),
    Department NVARCHAR(50)
);

-- Global temporary table (prefix ##, visible to all sessions)
CREATE TABLE ##GlobalTemp (
    ID INT,
    Data NVARCHAR(100)
);

-- Insert into temporary table
INSERT INTO #TempEmployees (EmpID, EmpName, Department)
SELECT EmployeeID, FirstName + ' ' + LastName, 'Department ' + CAST(DepartmentID AS NVARCHAR(10))
FROM Employees;

-- Query temporary table
SELECT * FROM #TempEmployees;
GO

-- Temporary tables are automatically dropped when session ends
-- Or you can explicitly drop them
DROP TABLE #TempEmployees;
DROP TABLE ##GlobalTemp;
GO
```

### System Functions and Variable Assignment

```sql
-- Different ways to assign values to variables
DECLARE
    @EmpCount INT,
    @TotalSalary DECIMAL(10,2),
    @AvgSalary DECIMAL(10,2),
    @MaxSalary DECIMAL(10,2),
    @CurrentDate DATETIME = GETDATE();

-- Method 1: SET (single variable assignment)
SET @EmpCount = (SELECT COUNT(*) FROM Employees);
PRINT 'Employee count: ' + CAST(@EmpCount AS NVARCHAR(10));

-- Method 2: SELECT (multiple variable assignment in single statement)
SELECT
    @TotalSalary = SUM(Salary),
    @AvgSalary = AVG(Salary),
    @MaxSalary = MAX(Salary)
FROM Employees;

PRINT 'Total Salary: ' + CAST(@TotalSalary AS NVARCHAR(20));
PRINT 'Average Salary: ' + CAST(@AvgSalary AS NVARCHAR(20));
PRINT 'Max Salary: ' + CAST(@MaxSalary AS NVARCHAR(20));

-- Method 3: Using system functions
DECLARE
    @ServerName NVARCHAR(100) = @@SERVERNAME,
    @Version NVARCHAR(100) = @@VERSION,
    @RowCount INT = @@ROWCOUNT;

PRINT 'Server: ' + @ServerName;
PRINT 'Rows affected: ' + CAST(@RowCount AS NVARCHAR(10));

-- Method 4: Using SCOPE_IDENTITY() for identity columns
INSERT INTO Employees (FirstName, LastName, Email, Salary, DepartmentID)
VALUES ('New', 'Employee', 'new.employee@company.com', 48000.00, 1);

DECLARE @NewEmployeeID INT = SCOPE_IDENTITY();
PRINT 'New Employee ID: ' + CAST(@NewEmployeeID AS NVARCHAR(10));
GO
```

## 3. Control Structures

### Conditional Statements - Making Decisions

**IF...ELSE Statements**:

- **Purpose**: Execute different code paths based on conditions
- **Syntax**: Must use BEGIN...END for multiple statements
- **Use Case**: Business rules, validation, workflow decisions

```sql
DECLARE
    @Salary DECIMAL(10,2) = 75000,
    @Grade NVARCHAR(10),
    @Bonus DECIMAL(10,2),
    @PerformanceRating INT = 4; -- Scale 1-5

PRINT '=== CONDITIONAL STATEMENTS DEMO ===';

-- SIMPLE IF STATEMENT
IF @Salary > 50000
    PRINT 'Salary is above average';

-- IF-ELSE STATEMENT
IF @Salary > 100000
BEGIN
    SET @Grade = 'A';
    SET @Bonus = @Salary * 0.20;
END
ELSE
BEGIN
    SET @Grade = 'B';
    SET @Bonus = @Salary * 0.10;
END

PRINT 'Grade: ' + @Grade + ', Bonus: $' + CAST(@Bonus AS NVARCHAR(20));

-- IF-ELSE IF-ELSE STATEMENT (Multiple conditions)
IF @PerformanceRating = 5
BEGIN
    SET @Bonus = @Salary * 0.25;
    SET @Grade = 'Excellent';
END
ELSE IF @PerformanceRating = 4
BEGIN
    SET @Bonus = @Salary * 0.15;
    SET @Grade = 'Good';
END
ELSE IF @PerformanceRating = 3
BEGIN
    SET @Bonus = @Salary * 0.10;
    SET @Grade = 'Average';
END
ELSE
BEGIN
    SET @Bonus = 0;
    SET @Grade = 'Needs Improvement';
END

PRINT 'Performance: ' + @Grade + ', Bonus: $' + CAST(@Bonus AS NVARCHAR(20));

-- CASE STATEMENT (Alternative to multiple IF-ELSE)
DECLARE @PerformanceText NVARCHAR(50);

SET @PerformanceText =
    CASE @PerformanceRating
        WHEN 5 THEN 'Outstanding'
        WHEN 4 THEN 'Exceeds Expectations'
        WHEN 3 THEN 'Meets Expectations'
        ELSE 'Below Expectations'
    END;

PRINT 'Performance Text: ' + @PerformanceText;

-- SEARCHED CASE (more flexible)
DECLARE @SalaryCategory NVARCHAR(20);

SET @SalaryCategory =
    CASE
        WHEN @Salary > 100000 THEN 'Executive'
        WHEN @Salary BETWEEN 75000 AND 100000 THEN 'Senior'
        WHEN @Salary BETWEEN 50000 AND 74999 THEN 'Mid-Level'
        ELSE 'Junior'
    END;

PRINT 'Salary Category: ' + @SalaryCategory;
GO
```

### Loops - Repeating Execution

**WHILE Loop**:

- **Purpose**: Execute code repeatedly while condition is true
- **Use Case**: Iterate until condition met, process datasets in chunks

```sql
PRINT '=== LOOPING CONSTRUCTS DEMO ===';

-- BASIC WHILE LOOP
DECLARE
    @Counter INT = 1,
    @Total INT = 0;

PRINT '=== BASIC WHILE LOOP ===';
WHILE @Counter <= 5
BEGIN
    SET @Total = @Total + @Counter;
    PRINT 'Counter: ' + CAST(@Counter AS NVARCHAR(10)) + ', Total: ' + CAST(@Total AS NVARCHAR(10));
    SET @Counter = @Counter + 1;
END

PRINT 'Final Total: ' + CAST(@Total AS NVARCHAR(10));

-- WHILE LOOP with BREAK and CONTINUE
PRINT '=== WHILE LOOP WITH BREAK/CONTINUE ===';
DECLARE @i INT = 1;

WHILE @i <= 10
BEGIN
    IF @i = 3
    BEGIN
        SET @i = @i + 1;
        CONTINUE; -- Skip iteration when i=3
    END

    IF @i = 8
        BREAK; -- Exit loop when i=8

    PRINT 'Current value: ' + CAST(@i AS NVARCHAR(10));
    SET @i = @i + 1;
END

-- Practical example: Process employees in batches
PRINT '=== BATCH PROCESSING EXAMPLE ===';
DECLARE
    @BatchSize INT = 2,
    @Offset INT = 0,
    @Processed INT = 0;

WHILE 1 = 1
BEGIN
    -- Process employees in batches
    UPDATE TOP (@BatchSize) Employees
    SET Salary = Salary * 1.05
    WHERE EmployeeID > @Offset
    AND EmployeeID <= @Offset + @BatchSize;

    SET @Processed = @Processed + @@ROWCOUNT;
    SET @Offset = @Offset + @BatchSize;

    IF @@ROWCOUNT = 0
        BREAK;

    PRINT 'Processed batch, total so far: ' + CAST(@Processed AS NVARCHAR(10));
END

PRINT 'Total employees processed: ' + CAST(@Processed AS NVARCHAR(10));
GO
```

### Dynamic SQL - Building Queries at Runtime

```sql
PRINT '=== DYNAMIC SQL DEMO ===';

DECLARE
    @TableName NVARCHAR(100) = N'Employees',
    @ColumnName NVARCHAR(100) = N'Salary',
    @MinValue DECIMAL(10,2) = 50000,
    @SQLQuery NVARCHAR(MAX);

-- Build dynamic SQL query
SET @SQLQuery = N'
SELECT
    EmployeeID,
    FirstName,
    LastName,
    ' + @ColumnName + '
FROM ' + @TableName + '
WHERE ' + @ColumnName + ' >= @MinValue
ORDER BY ' + @ColumnName + ' DESC';

PRINT 'Dynamic Query:';
PRINT @SQLQuery;

-- Execute dynamic SQL with parameters
DECLARE @ParamDefinition NVARCHAR(500) = N'@MinValue DECIMAL(10,2)';

EXEC sp_executesql
    @SQLQuery,
    @ParamDefinition,
    @MinValue = @MinValue;
GO
```

## 4. Cursors - Row-by-Row Processing

### What are Cursors?

**Cursors** in T-SQL allow row-by-row processing of result sets. They provide a way to retrieve and manipulate rows sequentially.

### Why Use Cursors?

- **Row Processing**: Handle complex logic for each row
- **Sequential Access**: Process data in specific order
- **Complex Calculations**: Perform calculations that require row context
- **Data Migration**: Move data between tables with transformations

### Types of Cursors:

#### 1. Basic Cursor Operations

```sql
PRINT '=== BASIC CURSOR OPERATIONS ===';

DECLARE
    @EmployeeID INT,
    @FirstName NVARCHAR(50),
    @LastName NVARCHAR(50),
    @Salary DECIMAL(10,2),
    @TotalSalary DECIMAL(10,2) = 0,
    @EmployeeCount INT = 0;

-- Step 1: DECLARE cursor
DECLARE employee_cursor CURSOR FOR
    SELECT EmployeeID, FirstName, LastName, Salary
    FROM Employees
    WHERE DepartmentID = 1
    ORDER BY Salary DESC;

-- Step 2: OPEN cursor
OPEN employee_cursor;

-- Step 3: FETCH first row
FETCH NEXT FROM employee_cursor INTO @EmployeeID, @FirstName, @LastName, @Salary;

-- Step 4: Process rows in loop
WHILE @@FETCH_STATUS = 0
BEGIN
    SET @EmployeeCount = @EmployeeCount + 1;
    SET @TotalSalary = @TotalSalary + @Salary;

    PRINT 'Employee: ' + @FirstName + ' ' + @LastName +
          ' - Salary: $' + CAST(@Salary AS NVARCHAR(20));

    -- Fetch next row
    FETCH NEXT FROM employee_cursor INTO @EmployeeID, @FirstName, @LastName, @Salary;
END

-- Step 5: CLOSE cursor
CLOSE employee_cursor;

-- Step 6: DEALLOCATE cursor
DEALLOCATE employee_cursor;

PRINT '=== CURSOR SUMMARY ===';
PRINT 'Total Employees: ' + CAST(@EmployeeCount AS NVARCHAR(10));
PRINT 'Total Salary: $' + CAST(@TotalSalary AS NVARCHAR(20));
PRINT 'Average Salary: $' + CAST(@TotalSalary / NULLIF(@EmployeeCount, 0) AS NVARCHAR(20));
GO
```

#### 2. Cursor Types and Options

```sql
PRINT '=== CURSOR TYPES AND OPTIONS ===';

-- Different cursor types with their characteristics
DECLARE
    @EmpID INT,
    @EmpName NVARCHAR(100),
    @EmpSalary DECIMAL(10,2);

-- FORWARD_ONLY cursor (default) - fastest, only move forward
PRINT '=== FORWARD_ONLY CURSOR ===';
DECLARE fast_cursor CURSOR FORWARD_ONLY FOR
    SELECT EmployeeID, FirstName + ' ' + LastName, Salary
    FROM Employees;

OPEN fast_cursor;
FETCH NEXT FROM fast_cursor INTO @EmpID, @EmpName, @EmpSalary;

WHILE @@FETCH_STATUS = 0
BEGIN
    PRINT 'Fast - ID: ' + CAST(@EmpID AS NVARCHAR(10)) + ', Name: ' + @EmpName;
    FETCH NEXT FROM fast_cursor INTO @EmpID, @EmpName, @EmpSalary;
END

CLOSE fast_cursor;
DEALLOCATE fast_cursor;

-- SCROLL cursor - can move in any direction
PRINT '=== SCROLL CURSOR ===';
DECLARE scroll_cursor CURSOR SCROLL FOR
    SELECT EmployeeID, FirstName + ' ' + LastName, Salary
    FROM Employees
    ORDER BY Salary DESC;

OPEN scroll_cursor;

-- Fetch first row
FETCH FIRST FROM scroll_cursor INTO @EmpID, @EmpName, @EmpSalary;
PRINT 'First: ' + @EmpName + ' - $' + CAST(@EmpSalary AS NVARCHAR(20));

-- Fetch last row
FETCH LAST FROM scroll_cursor INTO @EmpID, @EmpName, @EmpSalary;
PRINT 'Last: ' + @EmpName + ' - $' + CAST(@EmpSalary AS NVARCHAR(20));

-- Fetch previous row
FETCH PRIOR FROM scroll_cursor INTO @EmpID, @EmpName, @EmpSalary;
PRINT 'Previous: ' + @EmpName + ' - $' + CAST(@EmpSalary AS NVARCHAR(20));

-- Fetch absolute position
FETCH ABSOLUTE 2 FROM scroll_cursor INTO @EmpID, @EmpName, @EmpSalary;
PRINT 'Second: ' + @EmpName + ' - $' + CAST(@EmpSalary AS NVARCHAR(20));

CLOSE scroll_cursor;
DEALLOCATE scroll_cursor;

-- STATIC cursor - snapshot of data at cursor open time
PRINT '=== STATIC CURSOR ===';
DECLARE static_cursor CURSOR STATIC FOR
    SELECT EmployeeID, FirstName, Salary
    FROM Employees;

OPEN static_cursor;

-- Changes to data won't affect static cursor
UPDATE Employees SET FirstName = 'Updated' WHERE EmployeeID = 1;

FETCH NEXT FROM static_cursor INTO @EmpID, @EmpName, @EmpSalary;
WHILE @@FETCH_STATUS = 0
BEGIN
    PRINT 'Static - ID: ' + CAST(@EmpID AS NVARCHAR(10)) + ', Name: ' + @EmpName;
    FETCH NEXT FROM static_cursor INTO @EmpID, @EmpName, @EmpSalary;
END

CLOSE static_cursor;
DEALLOCATE static_cursor;
GO
```

#### 3. Cursor with Updates and Error Handling

```sql
PRINT '=== CURSOR WITH UPDATES AND ERROR HANDLING ===';

-- Create a log table for cursor operations
IF OBJECT_ID('CursorLog', 'U') IS NOT NULL
    DROP TABLE CursorLog;

CREATE TABLE CursorLog (
    LogID INT IDENTITY PRIMARY KEY,
    EmployeeID INT,
    Operation NVARCHAR(50),
    OldSalary DECIMAL(10,2),
    NewSalary DECIMAL(10,2),
    LogDate DATETIME DEFAULT GETDATE()
);

DECLARE
    @EmpID INT,
    @CurrentSalary DECIMAL(10,2),
    @NewSalary DECIMAL(10,2),
    @ErrorCount INT = 0;

BEGIN TRY
    -- Declare cursor for update
    DECLARE update_cursor CURSOR FOR
        SELECT EmployeeID, Salary
        FROM Employees
        WHERE DepartmentID = 1
        FOR UPDATE OF Salary;  -- Specify which column can be updated

    OPEN update_cursor;
    FETCH NEXT FROM update_cursor INTO @EmpID, @CurrentSalary;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        BEGIN TRY
            -- Calculate new salary (10% raise)
            SET @NewSalary = @CurrentSalary * 1.10;

            -- Update employee salary
            UPDATE Employees
            SET Salary = @NewSalary
            WHERE CURRENT OF update_cursor;

            -- Log the operation
            INSERT INTO CursorLog (EmployeeID, Operation, OldSalary, NewSalary)
            VALUES (@EmpID, 'SALARY_UPDATE', @CurrentSalary, @NewSalary);

            PRINT 'Updated Employee ' + CAST(@EmpID AS NVARCHAR(10)) +
                  ': $' + CAST(@CurrentSalary AS NVARCHAR(20)) +
                  ' -> $' + CAST(@NewSalary AS NVARCHAR(20));

        END TRY
        BEGIN CATCH
            SET @ErrorCount = @ErrorCount + 1;
            PRINT 'Error updating employee ' + CAST(@EmpID AS NVARCHAR(10)) +
                  ': ' + ERROR_MESSAGE();

            -- Log error
            INSERT INTO CursorLog (EmployeeID, Operation, OldSalary, NewSalary)
            VALUES (@EmpID, 'UPDATE_ERROR', @CurrentSalary, @NewSalary);
        END CATCH

        FETCH NEXT FROM update_cursor INTO @EmpID, @CurrentSalary;
    END

    CLOSE update_cursor;
    DEALLOCATE update_cursor;

    PRINT 'Cursor update completed. Errors: ' + CAST(@ErrorCount AS NVARCHAR(10));

END TRY
BEGIN CATCH
    PRINT 'Critical error in cursor processing: ' + ERROR_MESSAGE();

    IF CURSOR_STATUS('local', 'update_cursor') >= 0
    BEGIN
        CLOSE update_cursor;
        DEALLOCATE update_cursor;
    END
END CATCH

-- Display log results
SELECT * FROM CursorLog;
GO
```

### When to Use Cursors vs Set-Based Operations

```sql
PRINT '=== CURSOR VS SET-BASED OPERATIONS ===';

-- Example where CURSOR might be necessary
PRINT 'SCENARIO: Complex row-by-row calculation';

-- Using CURSOR (when necessary)
DECLARE
    @EmployeeID INT,
    @Salary DECIMAL(10,2),
    @PreviousSalary DECIMAL(10,2) = 0,
    @SalaryIncrease DECIMAL(10,2);

PRINT '=== CURSOR APPROACH (Complex Logic) ===';
DECLARE complex_cursor CURSOR FOR
    SELECT EmployeeID, Salary
    FROM Employees
    ORDER BY Salary;

OPEN complex_cursor;
FETCH NEXT FROM complex_cursor INTO @EmployeeID, @Salary;

WHILE @@FETCH_STATUS = 0
BEGIN
    -- Complex calculation that depends on previous row
    IF @PreviousSalary > 0
        SET @SalaryIncrease = @Salary - @PreviousSalary;
    ELSE
        SET @SalaryIncrease = 0;

    PRINT 'Employee ' + CAST(@EmployeeID AS NVARCHAR(10)) +
          ': Salary $' + CAST(@Salary AS NVARCHAR(20)) +
          ', Increase from previous: $' + CAST(@SalaryIncrease AS NVARCHAR(20));

    SET @PreviousSalary = @Salary;
    FETCH NEXT FROM complex_cursor INTO @EmployeeID, @Salary;
END

CLOSE complex_cursor;
DEALLOCATE complex_cursor;

-- Example where SET-BASED is better
PRINT '=== SET-BASED APPROACH (Better Performance) ===';

-- Same operation using set-based approach (usually faster)
UPDATE Employees
SET Salary = Salary * 1.10
WHERE DepartmentID = 1;

PRINT 'Set-based update completed for all employees in department 1';
PRINT 'Rows affected: ' + CAST(@@ROWCOUNT AS NVARCHAR(10));

-- Demonstrate why set-based is usually better
PRINT '=== PERFORMANCE COMPARISON ===';
PRINT 'CURSORS:';
PRINT '  - Process rows one by one';
PRINT '  - Higher overhead (lock, fetch, process)';
PRINT '  - Slower for large datasets';
PRINT '  - Use only when necessary for complex row-specific logic';
PRINT '';
PRINT 'SET-BASED:';
PRINT '  - Process all rows at once';
PRINT '  - Lower overhead';
PRINT '  - Much faster for large datasets';
PRINT '  - Preferred approach in most cases';
GO
```

## 5. Error Handling

### What is Error Handling in T-SQL?

**Error handling** in T-SQL is primarily done using TRY...CATCH blocks, which provide structured exception handling similar to modern programming languages.

### Why Handle Errors?

- **Prevent Data Corruption**: Ensure data integrity
- **Improve User Experience**: Provide meaningful error messages
- **Maintain Application Stability**: Graceful error recovery
- **Audit and Logging**: Track errors for debugging

### TRY...CATCH Blocks

```sql
PRINT '=== BASIC TRY...CATCH DEMO ===';

-- Example 1: Handling division by zero
BEGIN TRY
    DECLARE @Result DECIMAL(10,2);
    SET @Result = 100 / 0;  -- This will cause an error
    PRINT 'Result: ' + CAST(@Result AS NVARCHAR(20));
END TRY
BEGIN CATCH
    PRINT 'Error occurred: ' + ERROR_MESSAGE();
    PRINT 'Error Number: ' + CAST(ERROR_NUMBER() AS NVARCHAR(10));
    PRINT 'Error Severity: ' + CAST(ERROR_SEVERITY() AS NVARCHAR(10));
    PRINT 'Error State: ' + CAST(ERROR_STATE() AS NVARCHAR(10));
END CATCH
GO

-- Example 2: Handling database errors
BEGIN TRY
    -- This will fail if table doesn't exist
    SELECT * FROM NonExistentTable;
END TRY
BEGIN CATCH
    PRINT 'Database error: ' + ERROR_MESSAGE();
    PRINT 'Procedure: ' + ISNULL(ERROR_PROCEDURE(), 'Not in procedure');
    PRINT 'Line: ' + CAST(ERROR_LINE() AS NVARCHAR(10));
END CATCH
GO
```

### Advanced Error Handling Techniques

```sql
PRINT '=== ADVANCED ERROR HANDLING ===';

-- Create error log table
IF OBJECT_ID('ErrorLog', 'U') IS NOT NULL
    DROP TABLE ErrorLog;

CREATE TABLE ErrorLog (
    ErrorID INT IDENTITY PRIMARY KEY,
    ErrorNumber INT,
    ErrorSeverity INT,
    ErrorState INT,
    ErrorProcedure NVARCHAR(200),
    ErrorLine INT,
    ErrorMessage NVARCHAR(4000),
    ErrorDateTime DATETIME DEFAULT GETDATE(),
    UserName NVARCHAR(100) DEFAULT SYSTEM_USER
);

-- Comprehensive error handling procedure
CREATE OR REPLACE PROCEDURE LogError
AS
BEGIN
    INSERT INTO ErrorLog (
        ErrorNumber, ErrorSeverity, ErrorState,
        ErrorProcedure, ErrorLine, ErrorMessage
    )
    VALUES (
        ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(),
        ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE()
    );

    -- Return the error log ID
    SELECT SCOPE_IDENTITY() AS ErrorLogID;
END;
GO

-- Demonstration of comprehensive error handling
CREATE OR REPLACE PROCEDURE ProcessEmployeeSalary
    @EmployeeID INT,
    @SalaryIncrease DECIMAL(5,2)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE
        @OldSalary DECIMAL(10,2),
        @NewSalary DECIMAL(10,2),
        @ErrorLogID INT;

    BEGIN TRY
        PRINT 'Starting salary processing for employee: ' + CAST(@EmployeeID AS NVARCHAR(10));

        -- Validate input parameters
        IF @EmployeeID IS NULL OR @SalaryIncrease IS NULL
        BEGIN
            RAISERROR('EmployeeID and SalaryIncrease cannot be NULL', 16, 1);
        END

        IF @SalaryIncrease <= 0 OR @SalaryIncrease > 1.0  -- 100% max increase
        BEGIN
            RAISERROR('Salary increase must be between 0 and 1.0 (0%% to 100%%)', 16, 1);
        END

        -- Get current salary
        SELECT @OldSalary = Salary
        FROM Employees
        WHERE EmployeeID = @EmployeeID;

        IF @OldSalary IS NULL
        BEGIN
            RAISERROR('Employee not found with ID: %d', 16, 1, @EmployeeID);
        END

        -- Calculate new salary
        SET @NewSalary = @OldSalary * (1 + @SalaryIncrease);

        -- Business rule: Salary cannot exceed $200,000
        IF @NewSalary > 200000
        BEGIN
            RAISERROR('New salary $%0.2f exceeds maximum allowed ($200,000)', 16, 1, @NewSalary);
        END

        -- Update salary
        UPDATE Employees
        SET Salary = @NewSalary
        WHERE EmployeeID = @EmployeeID;

        PRINT 'Salary updated successfully: $' + CAST(@OldSalary AS NVARCHAR(20)) +
              ' -> $' + CAST(@NewSalary AS NVARCHAR(20));

    END TRY
    BEGIN CATCH
        PRINT 'Error in ProcessEmployeeSalary: ' + ERROR_MESSAGE();

        -- Log the error
        EXEC LogError;

        -- Re-raise the error if it's a business logic error
        IF ERROR_NUMBER() >= 50000
            THROW;  -- Re-raise custom errors

        -- For system errors, you might want to handle differently
        PRINT 'System error handled gracefully';
    END CATCH
END;
GO

-- Test the error handling
PRINT '=== TESTING ERROR HANDLING ===';

-- Test 1: Valid case
EXEC ProcessEmployeeSalary @EmployeeID = 1, @SalaryIncrease = 0.10;

-- Test 2: Invalid employee
EXEC ProcessEmployeeSalary @EmployeeID = 999, @SalaryIncrease = 0.10;

-- Test 3: Invalid salary increase
EXEC ProcessEmployeeSalary @EmployeeID = 1, @SalaryIncrease = 1.50;

-- Test 4: NULL parameters
EXEC ProcessEmployeeSalary @EmployeeID = NULL, @SalaryIncrease = 0.10;

-- Check error log
SELECT * FROM ErrorLog;
GO
```

### RAISERROR and THROW Statements

```sql
PRINT '=== RAISERROR vs THROW ===';

-- RAISERROR (older method, more control)
BEGIN TRY
    RAISERROR('This is a custom error message with RAISERROR', 16, 1);
END TRY
BEGIN CATCH
    PRINT 'Caught RAISERROR: ' + ERROR_MESSAGE();
END CATCH

-- THROW (newer method, simpler syntax)
BEGIN TRY
    THROW 50000, 'This is a custom error message with THROW', 1;
END TRY
BEGIN CATCH
    PRINT 'Caught THROW: ' + ERROR_MESSAGE();
    PRINT 'Error Number: ' + CAST(ERROR_NUMBER() AS NVARCHAR(10));
END CATCH

-- Using THROW to re-throw caught exceptions
BEGIN TRY
    BEGIN TRY
        SELECT 1/0;  -- Cause division by zero
    END TRY
    BEGIN CATCH
        PRINT 'Inner catch: ' + ERROR_MESSAGE();
        THROW;  -- Re-throw the original error
    END CATCH
END TRY
BEGIN CATCH
    PRINT 'Outer catch: ' + ERROR_MESSAGE();
END CATCH
GO
```

### Transaction Management with Error Handling

```sql
PRINT '=== TRANSACTIONS WITH ERROR HANDLING ===';

-- Create audit table
IF OBJECT_ID('SalaryAudit', 'U') IS NOT NULL
    DROP TABLE SalaryAudit;

CREATE TABLE SalaryAudit (
    AuditID INT IDENTITY PRIMARY KEY,
    EmployeeID INT,
    OldSalary DECIMAL(10,2),
    NewSalary DECIMAL(10,2),
    ChangeDate DATETIME DEFAULT GETDATE(),
    ChangedBy NVARCHAR(100) DEFAULT SYSTEM_USER
);

-- Procedure with transaction and error handling
CREATE OR REPLACE PROCEDURE UpdateSalaryWithTransaction
    @EmployeeID INT,
    @NewSalary DECIMAL(10,2)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;  -- Automatically rollback on error

    DECLARE @OldSalary DECIMAL(10,2);

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Get current salary
        SELECT @OldSalary = Salary
        FROM Employees
        WHERE EmployeeID = @EmployeeID;

        IF @OldSalary IS NULL
        BEGIN
            RAISERROR('Employee not found: %d', 16, 1, @EmployeeID);
        END

        -- Validate new salary
        IF @NewSalary <= 0
        BEGIN
            RAISERROR('Salary must be positive: %0.2f', 16, 1, @NewSalary);
        END

        -- Update salary
        UPDATE Employees
        SET Salary = @NewSalary
        WHERE EmployeeID = @EmployeeID;

        -- Log to audit table
        INSERT INTO SalaryAudit (EmployeeID, OldSalary, NewSalary)
        VALUES (@EmployeeID, @OldSalary, @NewSalary);

        -- Commit transaction
        COMMIT TRANSACTION;

        PRINT 'Salary updated successfully for employee ' + CAST(@EmployeeID AS NVARCHAR(10));
        PRINT 'Old: $' + CAST(@OldSalary AS NVARCHAR(20)) + ', New: $' + CAST(@NewSalary AS NVARCHAR(20));

    END TRY
    BEGIN CATCH
        -- Rollback transaction if it's still active
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        -- Log error
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        PRINT 'Transaction rolled back due to error: ' + @ErrorMessage;

        -- Re-raise error
        THROW;
    END CATCH
END;
GO

-- Test transaction handling
PRINT '=== TESTING TRANSACTION HANDLING ===';

-- Test 1: Successful transaction
EXEC UpdateSalaryWithTransaction @EmployeeID = 1, @NewSalary = 60000.00;

-- Test 2: Failed transaction (invalid salary)
BEGIN TRY
    EXEC UpdateSalaryWithTransaction @EmployeeID = 1, @NewSalary = -1000.00;
END TRY
BEGIN CATCH
    PRINT 'Expected error: ' + ERROR_MESSAGE();
END CATCH

-- Verify data integrity
PRINT '=== VERIFYING DATA INTEGRITY ===';
SELECT
    e.EmployeeID,
    e.FirstName,
    e.Salary as CurrentSalary,
    sa.OldSalary,
    sa.NewSalary as PreviousNewSalary,
    sa.ChangeDate
FROM Employees e
LEFT JOIN SalaryAudit sa ON e.EmployeeID = sa.EmployeeID
WHERE e.EmployeeID = 1;
GO
```

## 6. Stored Procedures and Functions

### Stored Procedures - Reusable Code Blocks

```sql
-- Create stored procedure
CREATE PROCEDURE GetEmployeeDetails
    @EmployeeID INT = NULL,
    @DepartmentID INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        EmployeeID,
        FirstName + ' ' + LastName AS FullName,
        Salary,
        HireDate,
        DepartmentID
    FROM Employees
    WHERE (@EmployeeID IS NULL OR EmployeeID = @EmployeeID)
      AND (@DepartmentID IS NULL OR DepartmentID = @DepartmentID)
    ORDER BY Salary DESC;
END;
GO

-- Execute procedure
EXEC GetEmployeeDetails @DepartmentID = 1;
EXEC GetEmployeeDetails @EmployeeID = 1;
```

### Procedures with Output Parameters

```sql
CREATE PROCEDURE GetEmployeeStats
    @DepartmentID INT,
    @EmployeeCount INT OUTPUT,
    @TotalSalary DECIMAL(10,2) OUTPUT,
    @AvgSalary DECIMAL(10,2) OUTPUT
AS
BEGIN
    SELECT
        @EmployeeCount = COUNT(*),
        @TotalSalary = SUM(Salary),
        @AvgSalary = AVG(Salary)
    FROM Employees
    WHERE DepartmentID = @DepartmentID;
END;
GO

-- Use output parameters
DECLARE
    @Count INT,
    @Total DECIMAL(10,2),
    @Avg DECIMAL(10,2);

EXEC GetEmployeeStats
    @DepartmentID = 1,
    @EmployeeCount = @Count OUTPUT,
    @TotalSalary = @Total OUTPUT,
    @AvgSalary = @Avg OUTPUT;

SELECT @Count AS EmployeeCount, @Total AS TotalSalary, @Avg AS AverageSalary;
```

### Functions - Return Single Value or Table

```sql
-- Scalar function (returns single value)
CREATE FUNCTION CalculateBonus(
    @Salary DECIMAL(10,2),
    @PerformanceRating INT
)
RETURNS DECIMAL(10,2)
AS
BEGIN
    DECLARE @Bonus DECIMAL(10,2);

    SET @Bonus = @Salary *
        CASE @PerformanceRating
            WHEN 5 THEN 0.20
            WHEN 4 THEN 0.15
            WHEN 3 THEN 0.10
            ELSE 0.05
        END;

    RETURN @Bonus;
END;
GO

-- Use scalar function
SELECT
    FirstName,
    Salary,
    dbo.CalculateBonus(Salary, 4) AS Bonus
FROM Employees;
```

### Table-Valued Functions

```sql
-- Inline table-valued function
CREATE FUNCTION GetEmployeesBySalaryRange(
    @MinSalary DECIMAL(10,2),
    @MaxSalary DECIMAL(10,2)
)
RETURNS TABLE
AS
RETURN
    SELECT
        EmployeeID,
        FirstName + ' ' + LastName AS FullName,
        Salary
    FROM Employees
    WHERE Salary BETWEEN @MinSalary AND @MaxSalary;
GO

-- Use table-valued function
SELECT * FROM dbo.GetEmployeesBySalaryRange(40000, 70000);
```

## 7. Triggers

### DML Triggers - Automatic Actions

```sql
-- Create audit table
CREATE TABLE EmployeeAudit (
    AuditID INT IDENTITY PRIMARY KEY,
    EmployeeID INT,
    ActionType VARCHAR(10),
    OldSalary DECIMAL(10,2),
    NewSalary DECIMAL(10,2),
    ChangeDate DATETIME DEFAULT GETDATE()
);

-- AFTER trigger for auditing
CREATE TRIGGER trg_EmployeeSalaryAudit
ON Employees
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF UPDATE(Salary)
    BEGIN
        INSERT INTO EmployeeAudit (EmployeeID, ActionType, OldSalary, NewSalary)
        SELECT
            d.EmployeeID,
            'UPDATE',
            d.Salary,
            i.Salary
        FROM deleted d
        INNER JOIN inserted i ON d.EmployeeID = i.EmployeeID
        WHERE d.Salary <> i.Salary;
    END
END;
GO

-- Test trigger
UPDATE Employees SET Salary = Salary * 1.1 WHERE EmployeeID = 1;
SELECT * FROM EmployeeAudit;
```

### INSTEAD OF Triggers

```sql
-- INSTEAD OF trigger for complex validation
CREATE TRIGGER trg_PreventSalaryDecrease
ON Employees
INSTEAD OF UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS(
        SELECT 1
        FROM inserted i
        JOIN deleted d ON i.EmployeeID = d.EmployeeID
        WHERE i.Salary < d.Salary
    )
    BEGIN
        RAISERROR('Salary cannot be decreased', 16, 1);
        RETURN;
    END

    -- Perform the actual update
    UPDATE e
    SET
        FirstName = i.FirstName,
        LastName = i.LastName,
        Salary = i.Salary,
        DepartmentID = i.DepartmentID
    FROM Employees e
    INNER JOIN inserted i ON e.EmployeeID = i.EmployeeID;
END;
GO
```

## 8. Advanced Features

### Common Table Expressions (CTEs)

```sql
-- Recursive CTE for hierarchy
WITH EmployeeCTE AS (
    -- Anchor member
    SELECT
        EmployeeID,
        FirstName,
        LastName,
        ManagerID,
        0 AS Level
    FROM Employees
    WHERE ManagerID IS NULL

    UNION ALL

    -- Recursive member
    SELECT
        e.EmployeeID,
        e.FirstName,
        e.LastName,
        e.ManagerID,
        Level + 1
    FROM Employees e
    INNER JOIN EmployeeCTE cte ON e.ManagerID = cte.EmployeeID
)
SELECT * FROM EmployeeCTE ORDER BY Level, EmployeeID;
```

### Window Functions

```sql
-- Advanced analytics with window functions
SELECT
    EmployeeID,
    FirstName + ' ' + LastName AS FullName,
    Salary,
    DepartmentID,
    -- Ranking
    ROW_NUMBER() OVER (PARTITION BY DepartmentID ORDER BY Salary DESC) AS DeptRank,
    -- Running total
    SUM(Salary) OVER (PARTITION BY DepartmentID ORDER BY Salary DESC) AS RunningTotal,
    -- Department averages
    AVG(Salary) OVER (PARTITION BY DepartmentID) AS DeptAvgSalary,
    -- Compare to department average
    Salary - AVG(Salary) OVER (PARTITION BY DepartmentID) AS DiffFromAvg
FROM Employees
ORDER BY DepartmentID, Salary DESC;
```

### MERGE Statement - Upsert Operations

```sql
-- MERGE for insert/update operations
MERGE Employees AS target
USING (VALUES
    (1, 'John', 'Doe', 55000, 1),
    (6, 'New', 'Employee', 48000, 2)
) AS source (EmployeeID, FirstName, LastName, Salary, DepartmentID)
ON target.EmployeeID = source.EmployeeID

-- Update if exists
WHEN MATCHED THEN
    UPDATE SET
        Salary = source.Salary,
        FirstName = source.FirstName

-- Insert if doesn't exist
WHEN NOT MATCHED THEN
    INSERT (FirstName, LastName, Salary, DepartmentID)
    VALUES (source.FirstName, source.LastName, source.Salary, source.DepartmentID);
```

### Dynamic SQL

```sql
-- Dynamic SQL for flexible queries
CREATE PROCEDURE DynamicEmployeeSearch
    @ColumnName NVARCHAR(50),
    @SearchValue NVARCHAR(100)
AS
BEGIN
    DECLARE @SQL NVARCHAR(MAX);

    SET @SQL = '
        SELECT EmployeeID, FirstName, LastName, Salary, DepartmentID
        FROM Employees
        WHERE ' + @ColumnName + ' = @Value';

    EXEC sp_executesql @SQL, N'@Value NVARCHAR(100)', @SearchValue;
END;
GO

EXEC DynamicEmployeeSearch 'DepartmentID', '1';
```

### Error Handling with THROW

```sql
-- Modern error handling
CREATE PROCEDURE SafeDataUpdate
    @EmployeeID INT,
    @NewSalary DECIMAL(10,2)
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Validate input
        IF @NewSalary <= 0
            THROW 50001, 'Salary must be positive', 1;

        -- Check employee exists
        IF NOT EXISTS(SELECT 1 FROM Employees WHERE EmployeeID = @EmployeeID)
            THROW 50002, 'Employee not found', 1;

        -- Perform update
        UPDATE Employees SET Salary = @NewSalary WHERE EmployeeID = @EmployeeID;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        THROW; -- Re-throw the error
    END CATCH
END;
GO
```

### Temporal Tables (SQL Server 2016+)

```sql
-- System-versioned temporal tables
CREATE TABLE EmployeeHistory (
    EmployeeID INT PRIMARY KEY,
    FirstName NVARCHAR(50),
    LastName NVARCHAR(50),
    Salary DECIMAL(10,2),
    ValidFrom DATETIME2 GENERATED ALWAYS AS ROW START,
    ValidTo DATETIME2 GENERATED ALWAYS AS ROW END,
    PERIOD FOR SYSTEM_TIME (ValidFrom, ValidTo)
)
WITH (SYSTEM_VERSIONING = ON);
```

## Key T-SQL Best Practices

### Performance Tips

```sql
-- 1. Use SET NOCOUNT ON
-- 2. Avoid cursors when possible
-- 3. Use proper indexing
-- 4. Use EXISTS instead of COUNT(*)
-- 5. Parameterize queries to avoid SQL injection

-- Good: Uses EXISTS
IF EXISTS(SELECT 1 FROM Employees WHERE DepartmentID = 1)
    PRINT 'Department has employees';

-- Bad: Uses COUNT
IF (SELECT COUNT(*) FROM Employees WHERE DepartmentID = 1) > 0
    PRINT 'Department has employees';
```

### Security Best Practices

```sql
-- Use parameterized queries
CREATE PROCEDURE GetEmployee
    @EmployeeID INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM Employees WHERE EmployeeID = @EmployeeID;
END;

-- Grant minimal permissions
GRANT EXECUTE ON GetEmployee TO UserRole;
```

This covers the essential T-SQL concepts. The key differences from PL/SQL are:

- **Syntax**: @ prefix for variables, different control structures
- **Error Handling**: TRY...CATCH instead of EXCEPTION blocks
- **Procedural Code**: Batches separated by GO
- **Functions**: Different types (scalar, table-valued)
- **Temporal Features**: Built-in system versioning
