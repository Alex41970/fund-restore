import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";

interface CaseRow {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  status: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["cases", user?.id],
    queryFn: async (): Promise<CaseRow[]> => {
      const { data, error } = await supabase
        .from("cases")
        .select("id, title, description, created_at, status")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as any;
    },
    enabled: !!user,
  });

  const canSubmit = useMemo(() => title.trim().length > 2, [title]);

  const handleCreate = async () => {
    if (!user) return;
    if (!canSubmit) return toast.error("Please enter a title (min 3 chars)");

    const { data: inserted, error } = await supabase
      .from("cases")
      .insert({ title, description: description || null, user_id: user.id })
      .select("id")
      .maybeSingle();

    if (error) return toast.error(error.message);
    if (!inserted) return;

    const caseId = inserted.id;

    if (files && files.length && caseId) {
      for (const file of Array.from(files)) {
        const filePath = `${user.id}/${caseId}/${Date.now()}-${file.name}`;
        const { error: upErr } = await supabase.storage
          .from("case-attachments")
          .upload(filePath, file, { contentType: file.type });
        if (upErr) {
          toast.error(`Upload failed: ${file.name}`);
          continue;
        }
        await supabase.from("attachments").insert({
          case_id: caseId,
          user_id: user.id,
          size: file.size,
          content_type: file.type,
          file_path: filePath,
          file_name: file.name,
        });
      }
    }

    setTitle("");
    setDescription("");
    setFiles(null);
    toast.success("Case created");
    qc.invalidateQueries({ queryKey: ["cases", user.id] });
  };

  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>Dashboard | Case Manager</title>
        <meta name="description" content="Create and manage your cases and attachments." />
        <link rel="canonical" href={window.location.origin + "/dashboard"} />
      </Helmet>

      <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Create a new case</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <Input placeholder="Case title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <Textarea placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
                <input
                  aria-label="Attachments"
                  type="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                  className="text-sm text-muted-foreground"
                />
                <Button onClick={handleCreate} disabled={!canSubmit}>Create case</Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">My cases</h2>
          {isLoading ? (
            <div className="text-muted-foreground">Loading...</div>
          ) : data && data.length ? (
            <ul className="grid gap-3">
              {data.map((c) => (
                <li key={c.id} className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{c.title}</div>
                      {c.description && (
                        <p className="text-sm text-muted-foreground mt-1">{c.description}</p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground uppercase">{c.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-muted-foreground">No cases yet.</div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
