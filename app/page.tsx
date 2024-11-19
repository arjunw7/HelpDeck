"use client";

import { Button } from "@/components/ui/button";
import { BookOpen, Github, Mail, Search, Users, Zap, BookMarked, Globe, Layout, Bot, BarChart2, Palette, Code2, Sparkles, CheckCircle2, Blocks, FileText, Shield, Puzzle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/footer";

const features = [
  {
    title: "Content Management",
    description: "Organize and manage your documentation with ease using our intuitive content management system.",
    icon: FileText,
  },
  {
    title: "Change Logs",
    description: "Keep your users informed about updates and changes with beautiful change logs.",
    icon: BookMarked,
  },
  {
    title: "AI-Powered Search",
    description: "Help users find exactly what they need with our intelligent search powered by advanced algorithms.",
    icon: Search,
  },
  {
    title: "Custom Branding",
    description: "Make your help center truly yours with customizable themes, logos, and domain settings.",
    icon: Palette,
  },
  {
    title: "Advanced Analytics",
    description: "Gain insights into how users interact with your documentation to improve content strategy.",
    icon: BarChart2,
  },
  {
    title: "Robust Security",
    description: "Keep your content secure with role-based access control and enterprise-grade security.",
    icon: Shield,
  },
  {
    title: "Seamless Integrations",
    description: "Connect with your favorite tools including Slack, GitHub, and more.",
    icon: Puzzle,
  },
  {
    title: "AI Assistance",
    description: "Let AI help you create, improve, and maintain your documentation.",
    icon: Sparkles,
  },
];

const productTypes = [
  {
    title: "Standalone Help Center",
    description: "Create a dedicated knowledge base portal for your product or service.",
    icon: Layout,
    features: [
      "Custom domain support",
      "Fully customizable design",
      "SEO optimized",
      "Analytics dashboard",
    ],
  },
  {
    title: "Embeddable Widget",
    description: "Embed your help center directly into your application.",
    icon: Code2,
    features: [
      "Easy integration",
      "Customizable appearance",
      "Contextual help",
      "Seamless user experience",
    ],
  },
];

const layouts = [
  {
    title: "Help Center",
    description: "Perfect for product documentation and support.",
    image: "/help-center-layout.png",
    active: true,
  },
  {
    title: "Documentation",
    description: "Ideal for technical documentation and API references.",
    image: "/docs-layout.png",
    comingSoon: true,
  },
];

const detailedFeatures = [
  {
    title: "Professional Design",
    description: "Create a stunning knowledge base that reflects your brand with our highly customizable themes and layouts.",
    image: "/features/design.png",
    features: [
      "Custom themes and colors",
      "Multiple layouts",
      "Responsive design",
      "Brand consistency",
    ],
  },
  {
    title: "Custom Domain",
    description: "Use your own domain to provide a seamless experience for your users.",
    image: "/features/domain.png",
    features: [
      "Easy DNS configuration",
      "SSL certificates",
      "Domain verification",
      "Subdomain support",
    ],
  },
  {
    title: "AI-Powered Search",
    description: "Help users find exactly what they need with our semantic search powered by advanced AI.",
    image: "/features/search.png",
    features: [
      "Semantic understanding",
      "Typo tolerance",
      "Instant results",
      "Search analytics",
    ],
  },
  {
    title: "Detailed Analytics",
    description: "Understand how users interact with your content and improve your documentation.",
    image: "/features/analytics.png",
    features: [
      "Page views tracking",
      "Search analytics",
      "User feedback",
      "Content performance",
    ],
  },
  {
    title: "SEO Optimization",
    description: "Make your content discoverable with built-in SEO tools and optimizations.",
    image: "/features/seo.png",
    features: [
      "Meta tags management",
      "Sitemap generation",
      "Social media previews",
      "SEO best practices",
    ],
  },
];

const modules = ["Help Centers", "Change Logs", "Product Roadmap"];

export default function Home() {
  const [moduleIndex, setModuleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setModuleIndex((current) => (current + 1) % modules.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-[5%] py-24 sm:py-32 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.900),theme(colors.background))]" />
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl leading-tight">
            Create Beautiful{" "}
            <span className="text-slide-container inline-flex h-[1.2em] min-w-[200px]">
              <span
                key={moduleIndex}
                className="text-slide whitespace-nowrap"
              >
                {modules[moduleIndex]}
              </span>
            </span>
            {" "}for Your SaaS
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Build a knowledge base that your customers will love. Easy to set up, customize, and maintain.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/auth">
              <Button size="lg" className="min-w-[200px]">
                <Zap className="mr-2 h-4 w-4" />
                Get Started Free
              </Button>
            </Link>
            <Link href="/demo" className="text-sm font-semibold leading-6">
              View Demo <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-8">
            {[
              { text: "Free 14-day trial", icon: CheckCircle2 },
              { text: "No credit card required", icon: CheckCircle2 },
              { text: "24/7 support", icon: CheckCircle2 },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <item.icon className="h-4 w-4 text-primary" />
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Features Grid */}
      <section className="px-[5%]  py-12">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Everything you need</h2>
          <p className="text-muted-foreground">
            Powerful features to make your documentation shine
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="rounded-lg border bg-card p-8">
                <Icon className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
      {/* Product Types */}
      <section className="px-[5%]  py-24">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Choose Your Format</h2>
          <p className="text-muted-foreground">
            Deploy HelpDeck in a way that best suits your needs
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {productTypes.map((type) => (
            <div key={type.title} className="rounded-lg border bg-card p-8">
              <type.icon className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 text-xl font-bold">{type.title}</h3>
              <p className="mb-6 text-muted-foreground">{type.description}</p>
              <ul className="space-y-2">
                {type.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Layouts */}
      <section className="px-[5%] py-24">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Multiple Layouts</h2>
          <p className="text-muted-foreground">
            Choose the perfect layout for your documentation
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {layouts.map((layout) => (
            <div
              key={layout.title}
              className={cn(
                "relative rounded-lg border bg-card p-8",
                layout.comingSoon && "opacity-75"
              )}
            >
              {layout.comingSoon && (
                <div className="absolute right-4 top-4">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    Coming Soon
                  </span>
                </div>
              )}
              <div className="aspect-video rounded-lg border bg-muted">
                {layout.image && (
                  <Image
                    src={layout.image}
                    alt={layout.title}
                    width={800}
                    height={450}
                    className="rounded-lg"
                  />
                )}
              </div>
              <h3 className="mt-4 text-xl font-bold">{layout.title}</h3>
              <p className="mt-2 text-muted-foreground">{layout.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Features */}
      <section className="px-[8%] py-24">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Built for modern teams
          </h2>
          <p className="text-muted-foreground">
            Everything you need to create and manage world-class documentation
          </p>
        </div>

        <div className="space-y-24">
          {detailedFeatures.map((feature, index) => (
            <div
              key={feature.title}
              className={cn(
                "grid gap-8 items-center",
                index % 2 === 0 ? "md:grid-cols-[2fr,1fr]" : "md:grid-cols-[1fr,2fr]"
              )}
            >
              {index % 2 === 0 ? (
                <>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.features.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg bg-muted p-2">
                    {feature.image && (
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        width={500}
                        height={300}
                        className="rounded-lg"
                      />
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-lg bg-muted p-2">
                    {feature.image && (
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        width={500}
                        height={300}
                        className="rounded-lg"
                      />
                    )}
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.features.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}