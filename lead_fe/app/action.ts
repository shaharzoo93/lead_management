"use server";
import { revalidatePath } from "next/cache";
import { ApiResponse } from "./models/api_response";
import { LeadModel } from "./models/lead.model";

export async function getLeads() {  
    const response = await fetch(`http://localhost:4000/api/v1/leads/getAll`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result =  <ApiResponse<LeadModel[]>> await response.json();
    return <LeadModel[]>result.data;
  }

  export async function createLead(
    prevState: {
      message: string;
    },
    formData: FormData,
  ) {
    await fetch(`http://localhost:4000/api/v1/leads/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
       body: JSON.stringify({  name: formData.get("name"),
        email_address: formData.get("email_address"),
        status: formData.get("status"), }),
    });     
     
     revalidatePath("/");
     
     return {message:'Successfully Added.'}
  }

  