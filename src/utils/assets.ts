export const VERCEL_BLOB_BASE_URL = import.meta.env.VITE_VERCEL_BLOB_URL || "https://b1zcpgvhvegysslg.public.blob.vercel-storage.com";

export type AssetCategory = 'icons' | 'identities' | 'zodiacs' | 'geometry' | 'numerology' | 'placements' | 'starseeds';

export function getAetherAssetUrl(category: AssetCategory, filename: string): string {
  const baseUrl = VERCEL_BLOB_BASE_URL.replace(/\/$/, '');
  
  // Map internal categories to Vercel Blob folder names
  const folderMap: Record<AssetCategory, string> = {
    'icons': 'Icons',
    'identities': 'Identities',
    'zodiacs': 'Zodiacs',
    'geometry': 'Sacred%20Geometry',
    'numerology': 'Numerology',
    'placements': 'Placements',
    'starseeds': 'Starseeds'
  };

  const folder = folderMap[category] || category;
  return `${baseUrl}/${folder}/${filename}`;
}
