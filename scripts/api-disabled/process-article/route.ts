import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { processArticleFrontmatter } from '../../../utils/frontmatter';

/**
 * API 端点：处理单篇文章，自动补全 frontmatter
 * POST /api/process-article
 * Body: { filePath: "ai/gemini3-pro-使用感受.md" }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filePath } = body;

    if (!filePath) {
      return NextResponse.json(
        { error: 'filePath is required' },
        { status: 400 }
      );
    }

    // 构建完整文件路径
    const fullPath = path.join(process.cwd(), 'public', 'docs', filePath);
    
    // 检查文件是否存在
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // 读取文件内容
    const content = fs.readFileSync(fullPath, 'utf-8');
    const filename = path.basename(filePath);

    // 处理 frontmatter
    const processedContent = await processArticleFrontmatter(
      content,
      filename,
      filePath
    );

    // 写回文件
    fs.writeFileSync(fullPath, processedContent, 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Article processed successfully',
      filePath,
    });
  } catch (error: any) {
    console.error('Error processing article:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process article' },
      { status: 500 }
    );
  }
}

/**
 * API 端点：批量处理所有文章
 * GET /api/process-article?all=true
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const processAll = searchParams.get('all') === 'true';

    if (!processAll) {
      return NextResponse.json(
        { error: 'Use ?all=true to process all articles' },
        { status: 400 }
      );
    }

    const docsPath = path.join(process.cwd(), 'public', 'docs');
    const processedFiles: string[] = [];
    const errors: string[] = [];

    // 递归查找所有 .md 文件
    const findMarkdownFiles = (dir: string, basePath: string = ''): string[] => {
      const files: string[] = [];
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.join(basePath, entry.name).replace(/\\/g, '/');

        if (entry.isDirectory()) {
          files.push(...findMarkdownFiles(fullPath, relativePath));
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          files.push(relativePath);
        }
      }

      return files;
    };

    const markdownFiles = findMarkdownFiles(docsPath);

    // 处理每个文件
    for (const filePath of markdownFiles) {
      try {
        const fullPath = path.join(docsPath, filePath);
        const content = fs.readFileSync(fullPath, 'utf-8');
        const filename = path.basename(filePath);

        const processedContent = await processArticleFrontmatter(
          content,
          filename,
          filePath
        );

        fs.writeFileSync(fullPath, processedContent, 'utf-8');
        processedFiles.push(filePath);
      } catch (error: any) {
        errors.push(`${filePath}: ${error.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      processed: processedFiles.length,
      total: markdownFiles.length,
      processedFiles,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error('Error processing articles:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process articles' },
      { status: 500 }
    );
  }
}

