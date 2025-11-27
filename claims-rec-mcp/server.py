from fastmcp import FastMCP
import json
from db import execute_query, close_connection
from functools import wraps
from inspect import signature

mcp = FastMCP("Claims Recommendation MCP")


@mcp.tool
def list_recent_claims(limit: int = 5, chatInput: str = None, toolCallId: str = None) -> str:
    """
    List the most recent claims (1-5 claims).
    
    Args:
        limit: Number of recent claims to retrieve (1-5, default: 5)
        chatInput: The original chat input (ignored)
        toolCallId: The tool call ID (ignored)
    
    Returns:
        JSON string with list of recent claims
    """
    if limit < 1 or limit > 5:
        return json.dumps({"error": "Limit must be between 1 and 5"})
    
    query = f"""
        SELECT 
            claim_id,
            claim_number,
            patient_first_name,
            patient_last_name,
            service_date,
            service_type,
            submitted_amount,
            claim_status,
            received_date
        FROM tanzania_claims
        ORDER BY received_date DESC, claim_id DESC
        LIMIT {limit}
    """
    
    try:
        results = execute_query(query)
        claims = []
        for row in results:
            claims.append({
                "claim_id": row[0],
                "claim_number": row[1],
                "patient_name": f"{row[2]} {row[3]}",
                "service_date": str(row[4]),
                "service_type": row[5],
                "submitted_amount": float(row[6]),
                "claim_status": row[7],
                "received_date": str(row[8])
            })
        
        return json.dumps({
            "success": True,
            "count": len(claims),
            "claims": claims
        }, indent=2)
    except Exception as e:
        return json.dumps({"error": str(e)})


@mcp.tool
def get_claim_by_number(claim_number: str, chatInput: str = None, toolCallId: str = None) -> str:
    """
    Get detailed information about a specific claim using claim number.
    
    Args:
        claim_number: Unique claim number (e.g., 'ZNB-2024-001')
        chatInput: The original chat input (ignored)
        toolCallId: The tool call ID (ignored)
    
    Returns:
        JSON string with complete claim details
    """
    claim_number = claim_number.replace("'", "''")
    
    query = f"""
        SELECT 
            claim_id, claim_number, patient_id,
            patient_first_name, patient_last_name, patient_dob, patient_gender,
            patient_region, patient_district, patient_ward,
            insurance_policy_number, insurance_scheme, insurance_company,
            provider_name, provider_type, provider_region,
            service_date, service_type, service_description,
            diagnosis_code, diagnosis_description,
            procedure_code, procedure_description,
            submitted_amount, allowed_amount, paid_amount, patient_responsibility,
            claim_status, received_date, processed_date, payment_date,
            referral_from, referral_reason, treatment_outcome,
            discharge_date, length_of_stay,
            malaria_test_done, hiv_status_known, tb_screening_done,
            maternal_health, child_under_5, emergency_case,
            claim_type, authorization_number,
            created_at, updated_at, notes, reviewed_by, reviewed_date
        FROM tanzania_claims
        WHERE claim_number = '{claim_number}'
        LIMIT 10
    """
    
    try:
        results = execute_query(query)
        
        if not results:
            return json.dumps({
                "success": False,
                "message": "No claims found matching the criteria"
            })
        
        claims = []
        for row in results:
            claims.append({
                "claim_id": row[0],
                "claim_number": row[1],
                "patient": {
                    "patient_id": row[2],
                    "name": f"{row[3]} {row[4]}",
                    "dob": str(row[5]) if row[5] else None,
                    "gender": row[6],
                    "region": row[7],
                    "district": row[8],
                    "ward": row[9]
                },
                "insurance": {
                    "policy_number": row[10],
                    "scheme": row[11],
                    "company": row[12]
                },
                "provider": {
                    "name": row[13],
                    "type": row[14],
                    "region": row[15]
                },
                "service": {
                    "date": str(row[16]),
                    "type": row[17],
                    "description": row[18]
                },
                "diagnosis": {
                    "code": row[19],
                    "description": row[20]
                },
                "procedure": {
                    "code": row[21],
                    "description": row[22]
                },
                "financial": {
                    "submitted_amount": float(row[23]) if row[23] else 0,
                    "allowed_amount": float(row[24]) if row[24] else 0,
                    "paid_amount": float(row[25]) if row[25] else 0,
                    "patient_responsibility": float(row[26]) if row[25] else 0
                },
                "status": {
                    "claim_status": row[27],
                    "received_date": str(row[28]) if row[28] else None,
                    "processed_date": str(row[29]) if row[29] else None,
                    "payment_date": str(row[30]) if row[30] else None
                },
                "clinical_details": {
                    "referral_from": row[31],
                    "referral_reason": row[32],
                    "treatment_outcome": row[33],
                    "discharge_date": str(row[34]) if row[34] else None,
                    "length_of_stay": row[35]
                },
                "health_indicators": {
                    "malaria_test_done": row[36],
                    "hiv_status_known": row[37],
                    "tb_screening_done": row[38],
                    "maternal_health": row[39],
                    "child_under_5": row[40],
                    "emergency_case": row[41]
                },
                "additional": {
                    "claim_type": row[42],
                    "authorization_number": row[43],
                    "created_at": str(row[44]) if row[44] else None,
                    "updated_at": str(row[45]) if row[45] else None,
                    "notes": row[46],
                    "reviewed_by": row[47],
                    "reviewed_date": str(row[48]) if row[48] else None
                }
            })
        
        return json.dumps({
            "success": True,
            "count": len(claims),
            "claims": claims
        }, indent=2)
    except Exception as e:
        return json.dumps({"error": str(e)})


@mcp.tool
def get_claim_by_patient_id(patient_id: str, chatInput: str = None, toolCallId: str = None) -> str:
    """
    Get detailed information about claims for a specific patient using patient ID.
    
    Args:
        patient_id: Patient ID (e.g., 'PAT-001')
        chatInput: The original chat input (ignored)
        toolCallId: The tool call ID (ignored)
    
    Returns:
        JSON string with complete claim details
    """
    # prevent SQL injection
    patient_id = patient_id.replace("'", "''")
    
    query = f"""
        SELECT 
            claim_id, claim_number, patient_id,
            patient_first_name, patient_last_name, patient_dob, patient_gender,
            patient_region, patient_district, patient_ward,
            insurance_policy_number, insurance_scheme, insurance_company,
            provider_name, provider_type, provider_region,
            service_date, service_type, service_description,
            diagnosis_code, diagnosis_description,
            procedure_code, procedure_description,
            submitted_amount, allowed_amount, paid_amount, patient_responsibility,
            claim_status, received_date, processed_date, payment_date,
            referral_from, referral_reason, treatment_outcome,
            discharge_date, length_of_stay,
            malaria_test_done, hiv_status_known, tb_screening_done,
            maternal_health, child_under_5, emergency_case,
            claim_type, authorization_number,
            created_at, updated_at, notes, reviewed_by, reviewed_date
        FROM tanzania_claims
        WHERE patient_id = '{patient_id}'
        ORDER BY service_date DESC
        LIMIT 10
    """
    
    try:
        results = execute_query(query)
        
        if not results:
            return json.dumps({
                "success": False,
                "message": "No claims found matching the criteria"
            })
        
        claims = []
        for row in results:
            claims.append({
                "claim_id": row[0],
                "claim_number": row[1],
                "patient": {
                    "patient_id": row[2],
                    "name": f"{row[3]} {row[4]}",
                    "dob": str(row[5]) if row[5] else None,
                    "gender": row[6],
                    "region": row[7],
                    "district": row[8],
                    "ward": row[9]
                },
                "insurance": {
                    "policy_number": row[10],
                    "scheme": row[11],
                    "company": row[12]
                },
                "provider": {
                    "name": row[13],
                    "type": row[14],
                    "region": row[15]
                },
                "service": {
                    "date": str(row[16]),
                    "type": row[17],
                    "description": row[18]
                },
                "diagnosis": {
                    "code": row[19],
                    "description": row[20]
                },
                "procedure": {
                    "code": row[21],
                    "description": row[22]
                },
                "financial": {
                    "submitted_amount": float(row[23]) if row[23] else 0,
                    "allowed_amount": float(row[24]) if row[24] else 0,
                    "paid_amount": float(row[25]) if row[25] else 0,
                    "patient_responsibility": float(row[26]) if row[25] else 0
                },
                "status": {
                    "claim_status": row[27],
                    "received_date": str(row[28]) if row[28] else None,
                    "processed_date": str(row[29]) if row[29] else None,
                    "payment_date": str(row[30]) if row[30] else None
                },
                "clinical_details": {
                    "referral_from": row[31],
                    "referral_reason": row[32],
                    "treatment_outcome": row[33],
                    "discharge_date": str(row[34]) if row[34] else None,
                    "length_of_stay": row[35]
                },
                "health_indicators": {
                    "malaria_test_done": row[36],
                    "hiv_status_known": row[37],
                    "tb_screening_done": row[38],
                    "maternal_health": row[39],
                    "child_under_5": row[40],
                    "emergency_case": row[41]
                },
                "additional": {
                    "claim_type": row[42],
                    "authorization_number": row[43],
                    "created_at": str(row[44]) if row[44] else None,
                    "updated_at": str(row[45]) if row[45] else None,
                    "notes": row[46],
                    "reviewed_by": row[47],
                    "reviewed_date": str(row[48]) if row[48] else None
                }
            })
        
        return json.dumps({
            "success": True,
            "count": len(claims),
            "claims": claims
        }, indent=2)
    except Exception as e:
        return json.dumps({"error": str(e)})


@mcp.tool
def check_claim_status(claim_number: str, chatInput: str = None, toolCallId: str = None) -> str:
    """
    Check the current status of a claim (Approved, Rejected, or Pending).
    
    Args:
        claim_number: Unique claim number (e.g., 'ZNB-2024-001')
        chatInput: The original chat input (ignored)
        toolCallId: The tool call ID (ignored)
    
    Returns:
        JSON string with claim status information
    """
    claim_number = claim_number.replace("'", "''")
    
    query = f"""
        SELECT 
            claim_id,
            claim_number,
            patient_first_name,
            patient_last_name,
            claim_status,
            received_date,
            processed_date,
            payment_date,
            submitted_amount,
            allowed_amount,
            paid_amount,
            reviewed_by,
            reviewed_date,
            notes
        FROM tanzania_claims
        WHERE claim_number = '{claim_number}'
    """
    
    try:
        results = execute_query(query)
        
        if not results:
            return json.dumps({
                "success": False,
                "message": f"No claim found with number: {claim_number}"
            })
        
        row = results[0]
        
        return json.dumps({
            "success": True,
            "claim": {
                "claim_id": row[0],
                "claim_number": row[1],
                "patient_name": f"{row[2]} {row[3]}",
                "claim_status": row[4],
                "received_date": str(row[5]) if row[5] else None,
                "processed_date": str(row[6]) if row[6] else None,
                "payment_date": str(row[7]) if row[7] else None,
                "submitted_amount": float(row[8]) if row[8] else 0,
                "allowed_amount": float(row[9]) if row[9] else 0,
                "paid_amount": float(row[10]) if row[10] else 0,
                "reviewed_by": row[11],
                "reviewed_date": str(row[12]) if row[12] else None,
                "notes": row[13]
            }
        }, indent=2)
    except Exception as e:
        return json.dumps({"error": str(e)})


@mcp.tool
def approve_claim(claim_number: str, reviewed_by: str = "", notes: str = "", chatInput: str = None, toolCallId: str = None) -> str:
    """
    Approve a claim and update its status to 'Approved'.
    
    Args:
        claim_number: Unique claim number (e.g., 'ZNB-2024-001')
        reviewed_by: Name of the person reviewing the claim (optional)
        notes: Notes about the decision (optional)
        chatInput: The original chat input (ignored)
        toolCallId: The tool call ID (ignored)
    
    Returns:
        JSON string with updated claim details
    """
    return _update_claim_status_internal(claim_number, "Approved", reviewed_by, notes)


@mcp.tool
def reject_claim(claim_number: str, reviewed_by: str = "", notes: str = "", chatInput: str = None, toolCallId: str = None) -> str:
    """
    Reject a claim and update its status to 'Rejected'.
    
    Args:
        claim_number: Unique claim number (e.g., 'ZNB-2024-001')
        reviewed_by: Name of the person reviewing the claim (optional)
        notes: Notes about the decision (optional)
        chatInput: The original chat input (ignored)
        toolCallId: The tool call ID (ignored)
    
    Returns:
        JSON string with updated claim details
    """
    return _update_claim_status_internal(claim_number, "Rejected", reviewed_by, notes)


def _update_claim_status_internal(claim_number: str, new_status: str, reviewed_by: str, notes: str) -> str:
    """Internal function to update claim status"""
    claim_number = claim_number.replace("'", "''")
    reviewed_by = reviewed_by.replace("'", "''") if reviewed_by else ""
    notes = notes.replace("'", "''") if notes else ""
    
    check_query = f"""
        SELECT claim_id, claim_status, submitted_amount, allowed_amount
        FROM tanzania_claims
        WHERE claim_number = '{claim_number}'
    """
    
    try:
        results = execute_query(check_query)
        
        if not results:
            return json.dumps({
                "success": False,
                "message": f"No claim found with number: {claim_number}"
            })
        
        claim_id, current_status, submitted_amount, allowed_amount = results[0]
        
        reviewed_by_clause = f", reviewed_by = '{reviewed_by}'" if reviewed_by else ""
        notes_clause = f", notes = '{notes}'" if notes else ""
        
        if new_status == "Approved":
            paid_amount = allowed_amount if allowed_amount else submitted_amount
            update_query = f"""
                UPDATE tanzania_claims
                SET 
                    claim_status = '{new_status}',
                    processed_date = CURRENT_DATE,
                    payment_date = CURRENT_DATE + INTERVAL '2 days',
                    paid_amount = {paid_amount},
                    reviewed_date = CURRENT_DATE,
                    updated_at = CURRENT_TIMESTAMP
                    {reviewed_by_clause}
                    {notes_clause}
                WHERE claim_number = '{claim_number}'
            """
        else:
            update_query = f"""
                UPDATE tanzania_claims
                SET 
                    claim_status = '{new_status}',
                    processed_date = CURRENT_DATE,
                    paid_amount = 0,
                    reviewed_date = CURRENT_DATE,
                    updated_at = CURRENT_TIMESTAMP
                    {reviewed_by_clause}
                    {notes_clause}
                WHERE claim_number = '{claim_number}'
            """
        
        execute_query(update_query)
        
        details_query = f"""
            SELECT 
                claim_id, claim_number, patient_first_name, patient_last_name,
                service_date, service_type, service_description,
                diagnosis_description, submitted_amount, allowed_amount, 
                paid_amount, patient_responsibility,
                claim_status, received_date, processed_date, payment_date,
                reviewed_by, reviewed_date, notes
            FROM tanzania_claims
            WHERE claim_number = '{claim_number}'
        """
        
        updated_results = execute_query(details_query)
        row = updated_results[0]
        
        return json.dumps({
            "success": True,
            "message": f"Claim {new_status.lower()} successfully",
            "previous_status": current_status,
            "updated_claim": {
                "claim_id": row[0],
                "claim_number": row[1],
                "patient_name": f"{row[2]} {row[3]}",
                "service_date": str(row[4]),
                "service_type": row[5],
                "service_description": row[6],
                "diagnosis": row[7],
                "financial": {
                    "submitted_amount": float(row[8]) if row[8] else 0,
                    "allowed_amount": float(row[9]) if row[9] else 0,
                    "paid_amount": float(row[10]) if row[10] else 0,
                    "patient_responsibility": float(row[11]) if row[11] else 0
                },
                "status": {
                    "claim_status": row[12],
                    "received_date": str(row[13]) if row[13] else None,
                    "processed_date": str(row[14]) if row[14] else None,
                    "payment_date": str(row[15]) if row[15] else None
                },
                "review": {
                    "reviewed_by": row[16],
                    "reviewed_date": str(row[17]) if row[17] else None,
                    "notes": row[18]
                }
            }
        }, indent=2)
    except Exception as e:
        return json.dumps({"error": str(e)})


if __name__ == "__main__":
    try:
        mcp.run()
    finally:
        close_connection()