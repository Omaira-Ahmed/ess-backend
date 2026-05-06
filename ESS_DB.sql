CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    role_id VARCHAR(20) UNIQUE NOT NULL,
    role_name VARCHAR(50) NOT NULL,
    status BOOLEAN DEFAULT TRUE
);

CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    role_id INT REFERENCES roles(id)
);

CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    department_name VARCHAR(100) NOT NULL
);

CREATE TABLE sections (
    section_id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    section_name VARCHAR(100) NOT NULL,
    department_id INT REFERENCES departments(department_id)
);

CREATE TABLE designations (
    designation_id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    designation_name VARCHAR(100) NOT NULL
);

CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(user_id),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    profile_picture TEXT, 
    dob DATE,
    nationality VARCHAR(50),
    contact_number VARCHAR(30),
    email VARCHAR(150),
    address TEXT,
    company_name VARCHAR(100),
    date_of_joining DATE,
    designation_id INT REFERENCES designations(designation_id),
    department_id INT REFERENCES departments(department_id),
    section_id INT REFERENCES sections(section_id),
    line_manager_id INT REFERENCES employees(employee_id),
    employment_status VARCHAR(20) DEFAULT 'ACTIVE'
        CHECK (employment_status IN ('ACTIVE', 'LEFT', 'TERMINATED')),
    termination_date DATE NULL
);

CREATE TABLE no_series (
    no_series_id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    description VARCHAR(100),
    prefix VARCHAR(10),
    starting_no INT DEFAULT 1,
    current_no INT DEFAULT 1,
    ending_no INT,
    manual_allocation BOOLEAN DEFAULT FALSE,
    default_series BOOLEAN DEFAULT FALSE,
    company_code VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE leave_types (
    leave_type_id SERIAL PRIMARY KEY,
    code VARCHAR(25) UNIQUE NOT NULL,
    description VARCHAR(100) NOT NULL
);

CREATE TABLE cause_of_absence (
    cause_id SERIAL PRIMARY KEY,
    code VARCHAR(25) UNIQUE NOT NULL,
    description VARCHAR(100) NOT NULL,
    leave_type_id INT REFERENCES leave_types(leave_type_id),
    is_paid BOOLEAN DEFAULT TRUE,
    is_half_paid BOOLEAN DEFAULT FALSE,
    requires_document BOOLEAN DEFAULT FALSE,
    max_days_per_year INT,
    max_days_probation INT,
    max_days_less_than_one_year INT,
    is_hourly_allowed BOOLEAN DEFAULT FALSE,
    max_hours_per_day INT,
    deduct_salary BOOLEAN DEFAULT FALSE,
    affects_attendance BOOLEAN DEFAULT TRUE,
    auto_approve BOOLEAN DEFAULT FALSE,
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE employee_leave_setup (
    setup_id SERIAL PRIMARY KEY,
    employee_id INT NOT NULL REFERENCES employees(employee_id),
    leave_type_id INT NOT NULL REFERENCES leave_types(leave_type_id),
    allocated_days INT DEFAULT 0,
    year INT NOT NULL,
    UNIQUE (employee_id, leave_type_id, year),
    allocated_hours DECIMAL(5,2) DEFAULT 0,
    buffer_days INT DEFAULT 0,
    adjusted_days INT GENERATED ALWAYS AS (
        allocated_days + buffer_days
    ) STORED,
    paid_days INT DEFAULT 0,
    half_paid_days INT DEFAULT 0,
    days_if_less_than_one_year INT DEFAULT 0,
    is_eligible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE leave_application (
    application_id SERIAL PRIMARY KEY,
    employee_id INT NOT NULL REFERENCES employees(employee_id),
    leave_type_id INT NOT NULL REFERENCES leave_types(leave_type_id),
    from_date DATE,
    to_date DATE,
    from_time TIME NULL,
    to_time TIME NULL,
    total_days DECIMAL(5,2),
    total_hours DECIMAL(5,2),
    reason TEXT,
    status VARCHAR(20) DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELED')),
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    canceled_at TIMESTAMP NULL,
    cancel_reason TEXT NULL,
    cancel_requested BOOLEAN DEFAULT FALSE,
    cancel_request_date TIMESTAMP,
    cancel_status VARCHAR(20)
    CHECK (cancel_status IS NULL OR cancel_status IN ('PENDING', 'APPROVED', 'REJECTED')),
    no_series_id INT REFERENCES no_series(no_series_id),
    CHECK (to_date IS NULL OR from_date IS NULL OR to_date >= from_date)
);


CREATE TABLE leave_requests (
    request_id SERIAL PRIMARY KEY,
    application_id INT REFERENCES leave_application(application_id),
    action VARCHAR(20)
        CHECK (action IN ('APPROVED', 'REJECTED', 'CANCELED')),
    performed_by INT REFERENCES employees(employee_id),
    action_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    remarks TEXT
);

CREATE TABLE leave_registration (
    registration_id SERIAL PRIMARY KEY,
    application_id INT REFERENCES leave_application(application_id),
    registration_no VARCHAR(30) UNIQUE,
    no_series_id INT REFERENCES no_series(no_series_id),
    employee_id INT NOT NULL REFERENCES employees(employee_id),
    leave_type_id INT NOT NULL REFERENCES leave_types(leave_type_id),
    from_date DATE,
    to_date DATE,
    from_time TIME NULL,
    to_time TIME NULL,
    total_days DECIMAL(5,2),
    total_hours DECIMAL(5,2),
    approved_by INT REFERENCES employees(employee_id),
    approved_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'APPROVED',
    is_cancelled BOOLEAN DEFAULT FALSE,
    cancelled_date TIMESTAMP,
    cancelled_by INT REFERENCES employees(employee_id),
    cancel_reason TEXT,
    CHECK (to_date IS NULL OR from_date IS NULL OR to_date >= from_date)
);

CREATE TABLE leave_balance (
    balance_id SERIAL PRIMARY KEY,
    employee_id INT NOT NULL REFERENCES employees(employee_id),
    leave_type_id INT NOT NULL REFERENCES leave_types(leave_type_id),
    year INT NOT NULL,
    allocated INT DEFAULT 0,
    used INT DEFAULT 0,
    carried_forward INT DEFAULT 0,
    remaining INT GENERATED ALWAYS AS (
        allocated + carried_forward - used
    ) STORED,
    UNIQUE (employee_id, leave_type_id, year)  
);


CREATE TABLE employee_status_history (
    history_id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES employees(employee_id),
    status VARCHAR(20),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reason TEXT
);

CREATE TABLE leave_request_logs (
    log_id SERIAL PRIMARY KEY,
    leave_request_id INT REFERENCES leave_requests(request_id),
    action VARCHAR(20),
    performed_by INT REFERENCES employees(employee_id),
    action_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    remarks TEXT
);
