"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createLead } from "./action";

const initialState = {
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" aria-disabled={pending}>
      Add
    </button>
  );
}

export function AddForm() {
  // useActionState is available with React 19 (Next.js App Router)
  const [state, formAction] = useActionState(createLead, initialState);

  return (
    <form action={formAction}>
      <label htmlFor="Name">Enter Name</label>
      <input type="text" id="name" name="name" required />
      <label htmlFor="Email">Enter Email</label>
      <input type="email" id="email_address" name="email_address" required />
      <label htmlFor="Status">Status</label>
     
      <select name="status" id="status" required>
      <option value="">Select</option>
        <option value="New">New</option>
        <option value="Engaged">Engaged</option>
        <option value="Proposal Sent">Proposal Sent</option>
        <option value="Closed-Won">Closed-Won</option>
        <option value="Closed-Lost">Closed-Lost</option>
      </select>
      <SubmitButton />
      <p aria-live="polite" className="sr-only" role="status">        
        {state?.message}
      </p>
    </form>
  );
}
