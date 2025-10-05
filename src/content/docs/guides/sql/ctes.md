---
title: CTEs
slug: guides/sql/ctes
description: CTEs
sidebar:
  order: 3
---

### **Common Table Expressions (CTEs)**

- CTEs are powerful tools for writing maintainable, readable SQL code.
- They excel at breaking down complex queries, handling recursive data structures, and creating data transformation pipelines.
- However, use them judiciously and always consider performance implications.

## 1. What are CTEs?

### Definition

**Common Table Expressions (CTEs)** are temporary named result sets that exist only within the execution scope of a single SQL statement. They improve query readability and enable recursive queries.

### Key Characteristics

- **Temporary**: Exist only during query execution
- **Named**: Referenced by name in subsequent queries
- **Scope-limited**: Only available in the immediately following SELECT, INSERT, UPDATE, or DELETE
- **Readability**: Break complex queries into simpler parts

## 2. Basic CTE Syntax

```sql
WITH cte_name (column1, column2, ...) AS (
    -- CTE query definition
    SELECT column1, column2, ...
    FROM table_name
    WHERE conditions
)
-- Main query that uses the CTE
SELECT *
FROM cte_name;
```

## 3. Simple CTE Examples

### Basic CTE for Readability

```sql
-- Without CTE (complex to read)
SELECT
    e.first_name,
    e.last_name,
    e.salary,
    d.department_name,
    (SELECT AVG(salary) FROM employees WHERE department_id = e.department_id) as avg_dept_salary
FROM employees e
JOIN departments d ON e.department_id = d.department_id
WHERE e.salary > (SELECT AVG(salary) FROM employees);

-- With CTE (much cleaner)
WITH department_stats AS (
    SELECT
        department_id,
        AVG(salary) as avg_salary,
        COUNT(*) as employee_count
    FROM employees
    GROUP BY department_id
),
employee_details AS (
    SELECT
        e.employee_id,
        e.first_name,
        e.last_name,
        e.salary,
        e.department_id,
        d.department_name
    FROM employees e
    JOIN departments d ON e.department_id = d.department_id
)
SELECT
    ed.*,
    ds.avg_salary as department_avg_salary,
    ds.employee_count
FROM employee_details ed
JOIN department_stats ds ON ed.department_id = ds.department_id
WHERE ed.salary > ds.avg_salary;
```

### Multiple CTEs in Single Query

```sql
WITH
-- First CTE: Department summaries
dept_summary AS (
    SELECT
        department_id,
        COUNT(*) as total_employees,
        AVG(salary) as avg_salary,
        MAX(salary) as max_salary
    FROM employees
    GROUP BY department_id
),

-- Second CTE: High earners
high_earners AS (
    SELECT
        e.*,
        d.department_name
    FROM employees e
    JOIN departments d ON e.department_id = d.department_id
    WHERE e.salary > 100000
),

-- Third CTE: Department rankings
dept_ranking AS (
    SELECT
        department_id,
        avg_salary,
        RANK() OVER (ORDER BY avg_salary DESC) as salary_rank
    FROM dept_summary
)

-- Main query combining all CTEs
SELECT
    he.first_name,
    he.last_name,
    he.salary,
    he.department_name,
    ds.avg_salary as department_avg,
    dr.salary_rank
FROM high_earners he
JOIN dept_summary ds ON he.department_id = ds.department_id
JOIN dept_ranking dr ON ds.department_id = dr.department_id
ORDER BY dr.salary_rank, he.salary DESC;
```

## 4. Advanced CTE Concepts

### 4.1 Recursive CTEs

#### Hierarchical Data Processing

```sql
-- Organizational hierarchy example
WITH RECURSIVE employee_hierarchy AS (
    -- Anchor member: Top-level managers (no manager)
    SELECT
        employee_id,
        first_name,
        last_name,
        title,
        manager_id,
        0 as level,
        CAST(first_name || ' ' || last_name AS VARCHAR(1000)) as hierarchy_path
    FROM employees
    WHERE manager_id IS NULL

    UNION ALL

    -- Recursive member: Subordinates
    SELECT
        e.employee_id,
        e.first_name,
        e.last_name,
        e.title,
        e.manager_id,
        eh.level + 1 as level,
        CAST(eh.hierarchy_path || ' -> ' || e.first_name || ' ' || e.last_name AS VARCHAR(1000))
    FROM employees e
    JOIN employee_hierarchy eh ON e.manager_id = eh.employee_id
)
SELECT
    employee_id,
    first_name,
    last_name,
    title,
    level,
    hierarchy_path
FROM employee_hierarchy
ORDER BY level, hierarchy_path;
```

#### Bill of Materials (BOM) Example

```sql
-- Product assembly hierarchy
WITH RECURSIVE product_bom AS (
    -- Anchor: Top-level product
    SELECT
        component_id,
        parent_component_id,
        component_name,
        quantity,
        1 as level,
        CAST(component_name AS VARCHAR(1000)) as assembly_path,
        quantity as total_quantity
    FROM product_components
    WHERE parent_component_id IS NULL  -- Top-level assembly

    UNION ALL

    -- Recursive: Child components
    SELECT
        pc.component_id,
        pc.parent_component_id,
        pc.component_name,
        pc.quantity,
        pb.level + 1 as level,
        CAST(pb.assembly_path || ' -> ' || pc.component_name AS VARCHAR(1000)),
        pb.total_quantity * pc.quantity as total_quantity
    FROM product_components pc
    JOIN product_bom pb ON pc.parent_component_id = pb.component_id
)
SELECT
    component_id,
    component_name,
    level,
    assembly_path,
    total_quantity
FROM product_bom
ORDER BY level, assembly_path;
```

### 4.2 CTEs with Window Functions

```sql
WITH sales_analysis AS (
    SELECT
        salesperson_id,
        product_category,
        sale_date,
        sale_amount,
        -- Running total by salesperson
        SUM(sale_amount) OVER (
            PARTITION BY salesperson_id
            ORDER BY sale_date
            ROWS UNBOUNDED PRECEDING
        ) as running_total,

        -- Rank within category
        RANK() OVER (
            PARTITION BY product_category
            ORDER BY sale_amount DESC
        ) as category_rank,

        -- Moving average (3-month)
        AVG(sale_amount) OVER (
            PARTITION BY salesperson_id
            ORDER BY sale_date
            ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
        ) as moving_avg_3mo,

        -- Percent of total by salesperson
        sale_amount * 100.0 / SUM(sale_amount) OVER (
            PARTITION BY salesperson_id
        ) as percent_of_total,

        -- Difference from average
        sale_amount - AVG(sale_amount) OVER (
            PARTITION BY salesperson_id
        ) as diff_from_avg

    FROM sales
    WHERE sale_date >= DATE '2023-01-01'
),
top_performers AS (
    SELECT
        salesperson_id,
        product_category,
        SUM(sale_amount) as total_sales,
        RANK() OVER (ORDER BY SUM(sale_amount) DESC) as overall_rank
    FROM sales
    GROUP BY salesperson_id, product_category
)
SELECT
    sa.*,
    tp.overall_rank
FROM sales_analysis sa
JOIN top_performers tp ON sa.salesperson_id = tp.salesperson_id
                      AND sa.product_category = tp.product_category
WHERE tp.overall_rank <= 10
ORDER BY tp.overall_rank, sa.category_rank;
```

### 4.3 CTEs for Data Transformation

```sql
-- Data cleaning and transformation pipeline
WITH
-- Step 1: Raw data extraction
raw_customer_data AS (
    SELECT
        customer_id,
        TRIM(UPPER(first_name)) as first_name,
        TRIM(UPPER(last_name)) as last_name,
        CASE
            WHEN email LIKE '%@%' THEN LOWER(TRIM(email))
            ELSE NULL
        END as cleaned_email,
        CASE
            WHEN phone ~ '^[0-9]{10}$' THEN phone
            ELSE NULL
        END as valid_phone
    FROM raw_customers
    WHERE created_date >= CURRENT_DATE - INTERVAL '1 year'
),

-- Step 2: Data enrichment
enriched_data AS (
    SELECT
        rcd.*,
        c.segment,
        c.credit_score,
        CASE
            WHEN c.credit_score >= 800 THEN 'EXCELLENT'
            WHEN c.credit_score >= 700 THEN 'GOOD'
            WHEN c.credit_score >= 600 THEN 'FAIR'
            ELSE 'POOR'
        END as credit_rating
    FROM raw_customer_data rcd
    LEFT JOIN customer_credit c ON rcd.customer_id = c.customer_id
),

-- Step 3: Aggregation and filtering
customer_summary AS (
    SELECT
        credit_rating,
        segment,
        COUNT(*) as customer_count,
        AVG(credit_score) as avg_credit_score,
        COUNT(valid_phone) as customers_with_valid_phone,
        COUNT(cleaned_email) as customers_with_valid_email
    FROM enriched_data
    GROUP BY credit_rating, segment
)

-- Final output
SELECT
    credit_rating,
    segment,
    customer_count,
    ROUND(avg_credit_score, 2) as avg_credit_score,
    customers_with_valid_phone,
    customers_with_valid_email,
    ROUND(customers_with_valid_phone * 100.0 / customer_count, 2) as phone_coverage_pct,
    ROUND(customers_with_valid_email * 100.0 / customer_count, 2) as email_coverage_pct
FROM customer_summary
ORDER BY credit_rating, customer_count DESC;
```

## 5. Performance Considerations

### CTE vs Subquery vs Temporary Table

```sql
-- Method 1: CTE (Recommended for readability)
WITH high_value_orders AS (
    SELECT order_id, customer_id, total_amount
    FROM orders
    WHERE total_amount > 1000
    AND order_date >= CURRENT_DATE - INTERVAL '30 days'
)
SELECT
    hvo.*,
    c.customer_name,
    c.customer_segment
FROM high_value_orders hvo
JOIN customers c ON hvo.customer_id = c.customer_id;

-- Method 2: Subquery (Less readable)
SELECT
    o.*,
    c.customer_name,
    c.customer_segment
FROM (
    SELECT order_id, customer_id, total_amount
    FROM orders
    WHERE total_amount > 1000
    AND order_date >= CURRENT_DATE - INTERVAL '30 days'
) o
JOIN customers c ON o.customer_id = c.customer_id;

-- Method 3: Temporary Table (Better for complex reuse)
CREATE TEMPORARY TABLE temp_high_value_orders AS
SELECT order_id, customer_id, total_amount
FROM orders
WHERE total_amount > 1000
AND order_date >= CURRENT_DATE - INTERVAL '30 days';

SELECT
    t.*,
    c.customer_name,
    c.customer_segment
FROM temp_high_value_orders t
JOIN customers c ON t.customer_id = c.customer_id;

DROP TABLE temp_high_value_orders;
```

### Optimization Tips

```sql
-- Good: CTE with proper indexing
WITH recent_orders AS (
    SELECT
        customer_id,
        COUNT(*) as order_count,
        SUM(total_amount) as total_spent
    FROM orders
    -- Index on order_date improves performance
    WHERE order_date >= CURRENT_DATE - INTERVAL '90 days'
    GROUP BY customer_id
    HAVING COUNT(*) >= 3  -- Filter in CTE to reduce data
)
SELECT
    c.customer_id,
    c.customer_name,
    ro.order_count,
    ro.total_spent
FROM customers c
JOIN recent_orders ro ON c.customer_id = ro.customer_id
WHERE c.status = 'ACTIVE';

-- Bad: CTE without optimization
WITH all_orders AS (
    SELECT * FROM orders  -- Avoid SELECT *
),
all_customers AS (
    SELECT * FROM customers
)
SELECT
    c.customer_name,
    COUNT(o.order_id) as order_count
FROM all_customers c
JOIN all_orders o ON c.customer_id = o.customer_id
WHERE o.order_date >= CURRENT_DATE - INTERVAL '90 days'
AND c.status = 'ACTIVE'
GROUP BY c.customer_name
HAVING COUNT(o.order_id) >= 3;  -- Filter too late
```

## 6. Real-World Use Cases

### 6.1 Customer Behavior Analysis

```sql
WITH customer_behavior AS (
    SELECT
        customer_id,
        -- Recency: Days since last purchase
        CURRENT_DATE - MAX(order_date) as recency_days,
        -- Frequency: Total orders
        COUNT(DISTINCT order_id) as frequency,
        -- Monetary: Total spending
        SUM(total_amount) as monetary,
        -- Product variety
        COUNT(DISTINCT product_category) as category_count
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    WHERE order_date >= CURRENT_DATE - INTERVAL '1 year'
    GROUP BY customer_id
),
rfm_scores AS (
    SELECT
        customer_id,
        -- Recency score (lower days = better)
        NTILE(5) OVER (ORDER BY recency_days DESC) as recency_score,
        -- Frequency score
        NTILE(5) OVER (ORDER BY frequency) as frequency_score,
        -- Monetary score
        NTILE(5) OVER (ORDER BY monetary) as monetary_score,
        recency_days,
        frequency,
        monetary,
        category_count
    FROM customer_behavior
),
rfm_segments AS (
    SELECT
        customer_id,
        recency_score,
        frequency_score,
        monetary_score,
        recency_days,
        frequency,
        monetary,
        category_count,
        CASE
            WHEN recency_score >= 4 AND frequency_score >= 4 AND monetary_score >= 4 THEN 'Champions'
            WHEN recency_score >= 3 AND frequency_score >= 3 THEN 'Loyal Customers'
            WHEN recency_score >= 4 THEN 'New Customers'
            WHEN recency_score <= 2 AND frequency_score <= 2 THEN 'At Risk'
            ELSE 'Need Attention'
        END as customer_segment
    FROM rfm_scores
)
SELECT
    customer_segment,
    COUNT(*) as customer_count,
    ROUND(AVG(monetary), 2) as avg_spending,
    ROUND(AVG(frequency), 2) as avg_orders,
    ROUND(AVG(recency_days), 2) as avg_recency_days
FROM rfm_segments
GROUP BY customer_segment
ORDER BY customer_count DESC;
```

### 6.2 Financial Reporting

```sql
WITH monthly_financials AS (
    SELECT
        EXTRACT(YEAR FROM transaction_date) as year,
        EXTRACT(MONTH FROM transaction_date) as month,
        account_type,
        SUM(CASE WHEN transaction_type = 'CREDIT' THEN amount ELSE 0 END) as credits,
        SUM(CASE WHEN transaction_type = 'DEBIT' THEN amount ELSE 0 END) as debits,
        COUNT(*) as transaction_count
    FROM financial_transactions
    WHERE transaction_date >= DATE '2023-01-01'
    GROUP BY
        EXTRACT(YEAR FROM transaction_date),
        EXTRACT(MONTH FROM transaction_date),
        account_type
),
running_totals AS (
    SELECT
        year,
        month,
        account_type,
        credits,
        debits,
        credits - debits as net_amount,
        SUM(credits - debits) OVER (
            PARTITION BY account_type
            ORDER BY year, month
            ROWS UNBOUNDED PRECEDING
        ) as running_balance,
        transaction_count,
        -- Month-over-month growth
        LAG(credits - debits) OVER (
            PARTITION BY account_type
            ORDER BY year, month
        ) as prev_month_net
    FROM monthly_financials
)
SELECT
    year,
    month,
    account_type,
    credits,
    debits,
    net_amount,
    running_balance,
    transaction_count,
    CASE
        WHEN prev_month_net IS NOT NULL THEN
            ROUND((net_amount - prev_month_net) * 100.0 / NULLIF(ABS(prev_month_net), 0), 2)
        ELSE NULL
    END as growth_percentage
FROM running_totals
ORDER BY account_type, year, month;
```

## 7. Best Practices and Pitfalls

### Do's and Don'ts

```sql
-- ✅ GOOD: Use CTEs for complex logic breakdown
WITH
filtered_data AS (
    SELECT * FROM sales WHERE amount > 1000
),
aggregated_data AS (
    SELECT
        customer_id,
        COUNT(*) as order_count,
        AVG(amount) as avg_order_value
    FROM filtered_data
    GROUP BY customer_id
)
SELECT * FROM aggregated_data;

-- ❌ BAD: Overusing CTEs for simple queries
WITH
simple_query AS (
    SELECT name, salary FROM employees
)
SELECT * FROM simple_query;  -- CTE not needed here

-- ✅ GOOD: Use CTEs for multiple references
WITH customer_stats AS (
    SELECT
        customer_id,
        COUNT(*) as order_count
    FROM orders
    GROUP BY customer_id
)
SELECT
    c.customer_name,
    cs.order_count,
    CASE
        WHEN cs.order_count > 10 THEN 'VIP'
        WHEN cs.order_count > 5 THEN 'Regular'
        ELSE 'Occasional'
    END as customer_type
FROM customers c
JOIN customer_stats cs ON c.customer_id = cs.customer_id
WHERE cs.order_count > 0;

-- ❌ BAD: CTE that's only used once and doesn't improve readability
WITH complicated_cte AS (
    -- Very complex logic that's hard to understand
    SELECT ...
    FROM ...
    JOIN ... ON ...
    WHERE ...
    GROUP BY ...
    HAVING ...
)
SELECT * FROM complicated_cte;
```

### Performance Optimization

```sql
-- Use WHERE clauses early in CTEs
WITH
-- Good: Filter early
filtered_orders AS (
    SELECT order_id, customer_id, total_amount
    FROM orders
    WHERE order_date >= '2023-01-01'  -- Early filter
    AND status = 'COMPLETED'
),

-- Bad: Filter late
unfiltered_orders AS (
    SELECT order_id, customer_id, total_amount, order_date, status
    FROM orders  -- No filter, processes all data
),
late_filtered AS (
    SELECT * FROM unfiltered_orders
    WHERE order_date >= '2023-01-01'  -- Filter applied late
    AND status = 'COMPLETED'
)

SELECT COUNT(*) FROM filtered_orders;  -- More efficient
```
