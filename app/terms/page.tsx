import { Card } from "@/components/ui/card";
import { Footer } from "@/components/footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Terms of Use</h1>
          <Card className="p-6">
            <div className="prose prose-neutral dark:prose-invert">
              <p className="text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </p>
              
              {/* Terms content will go here */}
              <div className="h-96 flex items-center justify-center text-muted-foreground">
                Terms of Use content coming soon...
              </div>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}