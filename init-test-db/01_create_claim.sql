CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE IF NOT EXISTS tanzania_claims (
    claim_id SERIAL PRIMARY KEY,
    claim_number VARCHAR(50) UNIQUE NOT NULL,
    patient_id VARCHAR(50) NOT NULL,
    patient_first_name VARCHAR(100),
    patient_last_name VARCHAR(100),
    patient_dob DATE,
    patient_gender VARCHAR(10) CHECK (patient_gender IN ('M', 'F')),
    patient_nationality VARCHAR(50) DEFAULT 'Tanzanian',
    patient_region VARCHAR(50) CHECK (patient_region IN ('Dar es Salaam', 'Mwanza', 'Arusha', 'Dodoma', 'Mbeya', 'Morogoro', 'Pwani', 'Tanga', 'Kilimanjaro', 'Manyara', 'Singida', 'Ruvuma', 'Rukwa', 'Shinyanga', 'Tabora', 'Zanzibar North', 'Zanzibar Central', 'Zanzibar South', 'Other')),
    patient_district VARCHAR(100),
    patient_ward VARCHAR(100),
    
    insurance_policy_number VARCHAR(50),
    insurance_scheme VARCHAR(100) CHECK (insurance_scheme IN ('National Health Insurance Fund (NHIF)', 'National Social Security Fund (NSSF)', 'Private Insurance', 'Community Health Fund (CHF)', 'Employer Scheme', 'Government Employee', 'Self-Pay', 'Other')),
    insurance_company VARCHAR(100),
    insurance_group_number VARCHAR(50),
    insurance_card_number VARCHAR(50),
    
    provider_national_id VARCHAR(20),
    provider_npi VARCHAR(15),
    provider_name VARCHAR(200),
    provider_type VARCHAR(100) CHECK (provider_type IN ('District Hospital', 'Regional Hospital', 'Referral Hospital', 'Private Hospital', 'Health Center', 'Dispensary', 'Private Clinic', 'Mission Hospital', 'Zanzibar Health Facility', 'Other')),
    provider_region VARCHAR(50) CHECK (provider_region IN ('Dar es Salaam', 'Mwanza', 'Arusha', 'Dodoma', 'Mbeya', 'Morogoro', 'Pwani', 'Tanga', 'Kilimanjaro', 'Manyara', 'Singida', 'Ruvuma', 'Rukwa', 'Shinyanga', 'Tabora', 'Zanzibar North', 'Zanzibar Central', 'Zanzibar South', 'Other')),
    provider_district VARCHAR(100),
    provider_ward VARCHAR(100),
    provider_tin VARCHAR(20),
    
    service_date DATE NOT NULL,
    service_type VARCHAR(100) CHECK (service_type IN ('Outpatient Consultation', 'Inpatient Admission', 'Emergency Care', 'Surgery', 'Laboratory Test', 'Radiology', 'Pharmacy', 'Maternal Health', 'Child Health', 'Dental', 'Mental Health', 'Traditional Medicine', 'Preventive Care', 'Other')),
    service_description TEXT,
    diagnosis_code VARCHAR(20),
    diagnosis_description VARCHAR(200),
    procedure_code VARCHAR(20),
    procedure_description VARCHAR(200),
    
    submitted_amount DECIMAL(12,2),
    allowed_amount DECIMAL(12,2),
    paid_amount DECIMAL(12,2),
    patient_responsibility DECIMAL(12,2),
    currency VARCHAR(3) DEFAULT 'TZS',
    
    claim_status VARCHAR(20) DEFAULT 'Pending' 
        CHECK (claim_status IN ('Approved', 'Rejected', 'Pending')),
    received_date DATE DEFAULT CURRENT_DATE,
    processed_date DATE,
    payment_date DATE,
    
    referral_from VARCHAR(200),
    referral_reason TEXT,
    treatment_outcome VARCHAR(50) CHECK (treatment_outcome IN ('Cured', 'Improved', 'No Change', 'Deteriorated', 'Referred', 'Died', 'Left Against Advice', 'Other')),
    discharge_date DATE,
    length_of_stay INTEGER,
    
    malaria_test_done BOOLEAN DEFAULT FALSE,
    hiv_status_known BOOLEAN DEFAULT FALSE,
    tb_screening_done BOOLEAN DEFAULT FALSE,
    maternal_health BOOLEAN DEFAULT FALSE,
    child_under_5 BOOLEAN DEFAULT FALSE,
    emergency_case BOOLEAN DEFAULT FALSE,
    
    claim_type VARCHAR(20) CHECK (claim_type IN ('Inpatient', 'Outpatient', 'Emergency', 'Dental', 'Vision', 'Prescription', 'Traditional Medicine', 'Other')),
    authorization_number VARCHAR(50),
    referring_provider_national_id VARCHAR(20),
    referring_provider_name VARCHAR(200),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    reviewed_by VARCHAR(100),
    reviewed_date DATE
);

-- indexes
CREATE INDEX IF NOT EXISTS idx_tanzania_claims_claim_number ON tanzania_claims(claim_number);
CREATE INDEX IF NOT EXISTS idx_tanzania_claims_patient_id ON tanzania_claims(patient_id);
CREATE INDEX IF NOT EXISTS idx_tanzania_claims_service_date ON tanzania_claims(service_date);
CREATE INDEX IF NOT EXISTS idx_tanzania_claims_claim_status ON tanzania_claims(claim_status);
CREATE INDEX IF NOT EXISTS idx_tanzania_claims_insurance_scheme ON tanzania_claims(insurance_scheme);
CREATE INDEX IF NOT EXISTS idx_tanzania_claims_patient_region ON tanzania_claims(patient_region);
CREATE INDEX IF NOT EXISTS idx_tanzania_claims_provider_region ON tanzania_claims(provider_region);
CREATE INDEX IF NOT EXISTS idx_tanzania_claims_service_type ON tanzania_claims(service_type);

-- comments
COMMENT ON COLUMN tanzania_claims.claim_id IS 'primary key for the claim record';
COMMENT ON COLUMN tanzania_claims.claim_number IS 'unique identifier for the insurance claim';
COMMENT ON COLUMN tanzania_claims.patient_id IS 'unique identifier for the patient';
COMMENT ON COLUMN tanzania_claims.patient_first_name IS 'patient first name';
COMMENT ON COLUMN tanzania_claims.patient_last_name IS 'patient last name';
COMMENT ON COLUMN tanzania_claims.patient_dob IS 'date of birth of the patient';
COMMENT ON COLUMN tanzania_claims.patient_gender IS 'gender of the patient (m, f)';
COMMENT ON COLUMN tanzania_claims.patient_nationality IS 'nationality of the patient, defaults to tanzanian';
COMMENT ON COLUMN tanzania_claims.patient_region IS 'region of the patient';
COMMENT ON COLUMN tanzania_claims.patient_district IS 'district of the patient';
COMMENT ON COLUMN tanzania_claims.patient_ward IS 'ward of the patient';

COMMENT ON COLUMN tanzania_claims.insurance_policy_number IS 'patient insurance policy number';
COMMENT ON COLUMN tanzania_claims.insurance_scheme IS 'insurance scheme covering the patient';
COMMENT ON COLUMN tanzania_claims.insurance_company IS 'insurance company providing coverage';
COMMENT ON COLUMN tanzania_claims.insurance_group_number IS 'insurance group number if applicable';
COMMENT ON COLUMN tanzania_claims.insurance_card_number IS 'insurance card number of the patient';

COMMENT ON COLUMN tanzania_claims.provider_national_id IS 'national id of the healthcare provider';
COMMENT ON COLUMN tanzania_claims.provider_npi IS 'national provider identifier of the healthcare provider';
COMMENT ON COLUMN tanzania_claims.provider_name IS 'name of the healthcare provider';
COMMENT ON COLUMN tanzania_claims.provider_type IS 'type of healthcare provider (hospital, clinic, dispensary, etc.)';
COMMENT ON COLUMN tanzania_claims.provider_region IS 'region of the healthcare provider';
COMMENT ON COLUMN tanzania_claims.provider_district IS 'district of the healthcare provider';
COMMENT ON COLUMN tanzania_claims.provider_ward IS 'ward of the healthcare provider';
COMMENT ON COLUMN tanzania_claims.provider_tin IS 'tax identification number of the provider';

COMMENT ON COLUMN tanzania_claims.service_date IS 'date the service was provided';
COMMENT ON COLUMN tanzania_claims.service_type IS 'type of healthcare service provided';
COMMENT ON COLUMN tanzania_claims.service_description IS 'detailed description of the service';
COMMENT ON COLUMN tanzania_claims.diagnosis_code IS 'diagnosis code (icd-10 or similar)';
COMMENT ON COLUMN tanzania_claims.diagnosis_description IS 'description of the diagnosis';
COMMENT ON COLUMN tanzania_claims.procedure_code IS 'procedure code (if any)';
COMMENT ON COLUMN tanzania_claims.procedure_description IS 'description of the procedure performed';

COMMENT ON COLUMN tanzania_claims.submitted_amount IS 'amount submitted for the claim';
COMMENT ON COLUMN tanzania_claims.allowed_amount IS 'amount allowed by insurance';
COMMENT ON COLUMN tanzania_claims.paid_amount IS 'amount actually paid';
COMMENT ON COLUMN tanzania_claims.patient_responsibility IS 'amount to be paid by patient';
COMMENT ON COLUMN tanzania_claims.currency IS 'currency of claim amounts, default tzs';

COMMENT ON COLUMN tanzania_claims.claim_status IS 'current status of the claim (Approved, Rejected, Pending)';
COMMENT ON COLUMN tanzania_claims.received_date IS 'date the claim was received';
COMMENT ON COLUMN tanzania_claims.processed_date IS 'date the claim was processed';
COMMENT ON COLUMN tanzania_claims.payment_date IS 'date the claim was paid';

COMMENT ON COLUMN tanzania_claims.referral_from IS 'referring provider or facility';
COMMENT ON COLUMN tanzania_claims.referral_reason IS 'reason for patient referral';
COMMENT ON COLUMN tanzania_claims.treatment_outcome IS 'outcome of the treatment provided';
COMMENT ON COLUMN tanzania_claims.discharge_date IS 'date the patient was discharged';
COMMENT ON COLUMN tanzania_claims.length_of_stay IS 'length of hospital stay in days';

COMMENT ON COLUMN tanzania_claims.malaria_test_done IS 'indicates if malaria test was performed';
COMMENT ON COLUMN tanzania_claims.hiv_status_known IS 'indicates if patient hiv status is known';
COMMENT ON COLUMN tanzania_claims.tb_screening_done IS 'indicates if tb screening was performed';
COMMENT ON COLUMN tanzania_claims.maternal_health IS 'indicates if service is related to maternal health';
COMMENT ON COLUMN tanzania_claims.child_under_5 IS 'indicates if patient is under 5 years old';
COMMENT ON COLUMN tanzania_claims.emergency_case IS 'indicates if the case was an emergency';

COMMENT ON COLUMN tanzania_claims.claim_type IS 'type of claim (inpatient, outpatient, emergency, etc.)';
COMMENT ON COLUMN tanzania_claims.authorization_number IS 'authorization number for the claim if required';
COMMENT ON COLUMN tanzania_claims.referring_provider_national_id IS 'national id of the referring provider';
COMMENT ON COLUMN tanzania_claims.referring_provider_name IS 'name of the referring provider';

COMMENT ON COLUMN tanzania_claims.created_at IS 'timestamp when the claim record was created';
COMMENT ON COLUMN tanzania_claims.updated_at IS 'timestamp when the claim record was last updated';
COMMENT ON COLUMN tanzania_claims.notes IS 'additional notes about the claim';
COMMENT ON COLUMN tanzania_claims.reviewed_by IS 'user who reviewed the claim';
COMMENT ON COLUMN tanzania_claims.reviewed_date IS 'date the claim was reviewed';
