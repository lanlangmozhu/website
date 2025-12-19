import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { NAV_CONFIG } from '../../../constants';

export async function GET() {
  try {
    const docsPath = path.join(process.cwd(), 'public', 'docs');
    const allFiles: string[] = [];

    // 遍历所有配置的目录
    for (const config of NAV_CONFIG) {
      const dirPath = path.join(docsPath, config.folder);
      
      if (!fs.existsSync(dirPath)) {
        continue;
      }

      const files = fs.readdirSync(dirPath);
      const mdFiles = files
        .filter(file => file.endsWith('.md') && !file.startsWith('.'))
        .map(file => `${config.folder}/${file}`);

      allFiles.push(...mdFiles);
    }

    return NextResponse.json(allFiles);
  } catch (error) {
    console.error('Error reading posts directory:', error);
    return NextResponse.json([], { status: 500 });
  }
}

