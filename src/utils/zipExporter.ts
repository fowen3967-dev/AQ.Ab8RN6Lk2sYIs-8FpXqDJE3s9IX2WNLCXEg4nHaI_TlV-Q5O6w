import JSZip from 'jszip';

export async function downloadProjectZip(appName: string = 'pawa-market-png') {
  const zip = new JSZip();

  const fileList = [
    'package.json',
    'tsconfig.json',
    'vite.config.ts',
    'index.html',
    'metadata.json',
    '.env.example',
    'src/main.tsx',
    'src/App.tsx',
    'src/index.css',
    'src/types/marketplace.ts',
    'src/data/mockData.ts',
    'src/utils/marketplace.ts',
    'src/utils/marketplace.test.ts',
    'src/utils/usePWAInstall.ts',
    'src/components/Navbar.tsx',
    'src/components/HeroSection.tsx',
    'src/components/CategoryBar.tsx',
    'src/components/ListingCard.tsx',
    'src/components/ListingDetailModal.tsx',
    'src/components/PostAdModal.tsx',
    'src/components/AdminDashboardModal.tsx',
    'src/components/FounderSetupModal.tsx',
    'src/components/SellerRegisterModal.tsx',
    'src/components/SavedDrawer.tsx',
    'src/components/PricingSection.tsx',
    'src/components/TrustSafetySection.tsx',
    'src/components/Footer.tsx',
    'src/components/DownloadAppModal.tsx',
    'public/manifest.json',
    'public/icon.svg',
  ];

  // Read files through Vite dev server or embed fallback
  for (const filePath of fileList) {
    try {
      const response = await fetch('/' + filePath);
      if (response.ok) {
        const text = await response.text();
        zip.file(filePath, text);
      }
    } catch (err) {
      console.warn(`Could not fetch ${filePath} for zip bundle:`, err);
    }
  }

  // Add README.md
  zip.file(
    'README.md',
    `# ${appName.toUpperCase()} - Papua New Guinea Marketplace

A production-grade online marketplace for Papua New Guinea, supporting cars, real estate, electronics, coffee, bilums, and trades across all 22 provinces.

## Running Locally

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Start development server:
\`\`\`bash
npm run dev
\`\`\`

3. Run unit tests:
\`\`\`bash
npx --yes tsx --test src/utils/marketplace.test.ts
\`\`\`

4. Build for production:
\`\`\`bash
npm run build
\`\`\`
`
  );

  // Generate zip blob and trigger browser download
  const blob = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `${appName.toLowerCase().replace(/\s+/g, '-')}-source.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);
}
