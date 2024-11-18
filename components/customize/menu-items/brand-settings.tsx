import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useCustomizeStore } from "@/stores/customize";
import { ImageUpload } from "@/components/customize/image-upload";

export function BrandSettings() {
  const { settings, updateGeneralSettings } = useCustomizeStore();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={settings.general.title}
          onChange={(e) => updateGeneralSettings({ title: e.target.value })}
          placeholder="Enter knowledge base title"
        />
        <p className="text-sm text-muted-foreground">
          The main title of your knowledge base
        </p>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Input
          value={settings.general.description}
          onChange={(e) => updateGeneralSettings({ description: e.target.value })}
          placeholder="Enter knowledge base description"
        />
        <p className="text-sm text-muted-foreground">
          A brief description of your knowledge base
        </p>
      </div>

      <div className="space-y-2">
        <Label>Logo</Label>
        <ImageUpload
          value={settings.general.logo}
          onChange={(url) => updateGeneralSettings({ logo: url })}
          accept="image/*"
          maxSize={2}
        />
        <p className="text-sm text-muted-foreground">
          Your company logo (recommended size: 200x50px, PNG or SVG)
        </p>
      </div>

      <div className="space-y-2">
        <Label>Favicon</Label>
        <ImageUpload
          value={settings.general.favicon}
          onChange={(url) => updateGeneralSettings({ favicon: url })}
          accept="image/x-icon,image/png"
          maxSize={1}
        />
        <p className="text-sm text-muted-foreground">
          Icon shown in browser tabs (recommended size: 32x32px, ICO or PNG)
        </p>
      </div>

      <div className="space-y-2">
        <Label>Header Image</Label>
        <ImageUpload
          value={settings.general.headerImage}
          onChange={(url) => updateGeneralSettings({ headerImage: url })}
          accept="image/*"
          maxSize={5}
        />
        <p className="text-sm text-muted-foreground">
          Banner image for your knowledge base (recommended size: 1920x300px)
        </p>
      </div>

      <div className="space-y-2">
        <Label>Social Image</Label>
        <ImageUpload
          value={settings.general.socialImage}
          onChange={(url) => updateGeneralSettings({ socialImage: url })}
          accept="image/*"
          maxSize={2}
        />
        <p className="text-sm text-muted-foreground">
          Image shown when sharing your knowledge base (recommended size: 1200x630px)
        </p>
      </div>
    </div>
  );
}