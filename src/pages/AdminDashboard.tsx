import React from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CaseRow {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  status: string;
  user_id: string;
}

const AdminDashboard: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-cases"],
    queryFn: async (): Promise<CaseRow[]> => {
      const { data, error } = await supabase
        .from("cases")
        .select("id, title, description, created_at, status, user_id")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as any;
    },
  });

  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>Admin | Case Manager</title>
        <meta name="description" content="Admin dashboard to manage all cases." />
        <link rel="canonical" href={window.location.origin + "/admin"} />
      </Helmet>

      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold">All cases</h1>
        {isLoading && <div className="text-muted-foreground">Loading...</div>}
        {error && <div className="text-destructive">{String((error as any).message || error)}</div>}
        {data && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-4">Title</th>
                  <th className="py-2 pr-4">User</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Created</th>
                </tr>
              </thead>
              <tbody>
                {data.map((c) => (
                  <tr key={c.id} className="border-b last:border-0">
                    <td className="py-2 pr-4">{c.title}</td>
                    <td className="py-2 pr-4 text-muted-foreground">{c.user_id}</td>
                    <td className="py-2 pr-4 uppercase text-xs">{c.status}</td>
                    <td className="py-2 pr-4 text-muted-foreground">{new Date(c.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminDashboard;
