import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";

export default function KnowledgeBaseNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">Knowledge Base Not Found</h2>
        <p className="mt-2 text-muted-foreground">
          The knowledge base you're looking for doesn't exist or hasn't been published yet.
        </p>
        <Link href="/" className="mt-8 inline-block">
          <Button>
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}