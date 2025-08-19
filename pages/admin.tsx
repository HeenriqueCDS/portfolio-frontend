import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { useForm } from "react-hook-form";
import { getSupabase } from "@/lib/supabaseClient";
import { DefaultLayout } from "@/shared/default-layout";

type LoginFormValues = {
  email: string;
  password: string;
};

type ProjectFormValues = {
  name: string;
  description: string;
  githubRepo: string;
  deploymentLink?: string;
};

export default function AdminPage() {
  const supabase = useMemo(() => getSupabase(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [insertError, setInsertError] = useState<string | null>(null);
  const [insertSuccess, setInsertSuccess] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session ?? null);
    });
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, [supabase]);

  // Login form
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { isSubmitting: isSubmittingLogin },
  } = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmitLogin = async (values: LoginFormValues) => {
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) {
      setAuthError(error.message);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  // Project form
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ProjectFormValues>({
    defaultValues: {
      name: "",
      description: "",
      githubRepo: "",
      deploymentLink: "",
    },
  });

  const onSubmitProject = async (values: ProjectFormValues) => {
    setInsertError(null);
    setInsertSuccess(null);

    // Upload selected files to Supabase Storage (bucket: images)
    let uploadedUrls: string[] = [];
    if (selectedFiles.length > 0) {
      try {
        const uploadResults = await Promise.all(
          selectedFiles.map(async (file) => {
            const sanitizedName = file.name.replace(/[^\w.-]/g, "_");
            const uniqueKey = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
            const path = `projects/${uniqueKey}-${sanitizedName}`;
            const { error: uploadError } = await supabase
              .storage
              .from("images")
              .upload(path, file, { contentType: file.type, cacheControl: "3600", upsert: false });
            if (uploadError) {
              throw uploadError;
            }
            const { data: publicData } = supabase.storage.from("images").getPublicUrl(path);
            return publicData.publicUrl;
          })
        );
        uploadedUrls = uploadResults.filter(Boolean);
      } catch (e: any) {
        setInsertError(e?.message ?? "Failed to upload one or more images.");
        return;
      }
    }

    const images = uploadedUrls.map((url) => ({ url, alt: null }));

    const payload = {
      name: values.name,
      description: values.description,
      githubRepo: values.githubRepo,
      deploymentLink: values.deploymentLink?.trim() || null,
      images,
    } as const;

    const { error } = await supabase.from("projects").insert(payload);
    if (error) {
      setInsertError(error.message);
      return;
    }
    setInsertSuccess("Project created successfully.");
    reset();
    setSelectedFiles([]);
  };

  return (
    <DefaultLayout meta={{ title: "Admin" }}>
      <main className="mx-auto max-w-2xl px-4 py-10 text-neutral-100">
        <h1 className="mb-6 text-2xl font-semibold">Admin</h1>
        {!session ? (
          <section className="rounded border border-neutral-700 bg-neutral-900 p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-medium text-neutral-100">Login</h2>
            {authError ? (
              <p className="mb-3 text-sm text-red-400">{authError}</p>
            ) : null}
            <form onSubmit={handleSubmitLogin(onSubmitLogin)} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-300">Email</label>
                <input
                  type="email"
                  className="w-full rounded border border-neutral-700 bg-neutral-800 text-neutral-100 placeholder-neutral-500 px-3 py-2 focus:border-green-400 focus:outline-none"
                  placeholder="you@example.com"
                  {...registerLogin("email", { required: true })}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-300">Password</label>
                <input
                  type="password"
                  className="w-full rounded border border-neutral-700 bg-neutral-800 text-neutral-100 placeholder-neutral-500 px-3 py-2 focus:border-green-400 focus:outline-none"
                  placeholder="********"
                  {...registerLogin("password", { required: true })}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmittingLogin}
                className="inline-flex items-center rounded bg-green-400 px-4 py-2 text-neutral-900 hover:bg-green-300 disabled:opacity-50"
              >
                {isSubmittingLogin ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </section>
        ) : (
          <section className="rounded border border-neutral-700 bg-neutral-900 p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-medium text-neutral-100">Create Project</h2>
              <button
                onClick={handleSignOut}
                className="text-sm text-neutral-400 underline hover:text-neutral-200"
              >
                Sign out
              </button>
            </div>
            {insertError ? (
              <p className="mb-3 text-sm text-red-400">{insertError}</p>
            ) : null}
            {insertSuccess ? (
              <p className="mb-3 text-sm text-green-400">{insertSuccess}</p>
            ) : null}
            <form onSubmit={handleSubmit(onSubmitProject)} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-300">Name</label>
                <input
                  type="text"
                  className="w-full rounded border border-neutral-700 bg-neutral-800 text-neutral-100 placeholder-neutral-500 px-3 py-2 focus:border-green-400 focus:outline-none"
                  {...register("name", { required: true })}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-300">Description</label>
                <textarea
                  className="w-full rounded border border-neutral-700 bg-neutral-800 text-neutral-100 placeholder-neutral-500 px-3 py-2 focus:border-green-400 focus:outline-none"
                  rows={4}
                  {...register("description", { required: true })}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-300">GitHub Repository URL</label>
                <input
                  type="url"
                  className="w-full rounded border border-neutral-700 bg-neutral-800 text-neutral-100 placeholder-neutral-500 px-3 py-2 focus:border-green-400 focus:outline-none"
                  placeholder="https://github.com/username/repo"
                  {...register("githubRepo", { required: true })}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-300">Deployment URL (optional)</label>
                <input
                  type="url"
                  className="w-full rounded border border-neutral-700 bg-neutral-800 text-neutral-100 placeholder-neutral-500 px-3 py-2 focus:border-green-400 focus:outline-none"
                  placeholder="https://yourapp.com"
                  {...register("deploymentLink")}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-300">Upload Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setSelectedFiles(Array.from(e.target.files ?? []))}
                  className="w-full rounded border border-neutral-700 bg-neutral-800 text-neutral-100 placeholder-neutral-500 px-3 py-2 focus:border-green-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center rounded bg-green-400 px-4 py-2 text-neutral-900 hover:bg-green-300 disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Project"}
              </button>
            </form>
          </section>
        )}
      </main>
    </DefaultLayout>
  );
}


