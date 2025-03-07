
import { AddForm } from "@/app/add-form";
import { getLeads } from "./action";

export default async function Home() {
  let leads = await getLeads();

  return (
    <main>
      <h1>Leads</h1>
      <AddForm />
      <div>
      <table>
        <thead><tr>
          <th>Name</th>
          <th>Email</th>
          <th>Status</th>
          </tr>
        </thead>
        <tbody>
        {leads.map((lead,index) => (
          <tr  key={index}><td>
            {lead.name}
          </td><td>
              {lead.email_address}
            </td><td>
              {lead.status}
            </td></tr>
        ))}
      </tbody>
      </table>
      </div>
    </main>
  );
}
