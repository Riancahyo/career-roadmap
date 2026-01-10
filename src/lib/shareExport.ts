import { Roadmap, UserProgress } from '@/types/roadmap';

export const shareRoadmap = async (roadmap: Roadmap, progress?: UserProgress) => {
  const url = `${window.location.origin}/roadmap/${roadmap.id}`;
  const progressText = progress 
    ? `\n\nProgress Saya: ${Math.round((progress.completedNodes.length / roadmap.nodes.length) * 100)}% (${progress.completedNodes.length}/${roadmap.nodes.length} topik selesai)`
    : '';
  
  const shareData = {
    title: `Roadmap ${roadmap.title}`,
    text: `Lihat roadmap ${roadmap.title} ini! ${roadmap.description}${progressText}`,
    url: url,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return { success: true, method: 'native' };
    } else {
      await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n\n${shareData.url}`);
      return { success: true, method: 'clipboard' };
    }
  } catch (error) {
    console.error('Error sharing:', error);
    return { success: false, error };
  }
};

export const shareToSocial = (platform: 'twitter' | 'linkedin' | 'facebook', roadmap: Roadmap) => {
  const url = `${window.location.origin}/roadmap/${roadmap.id}`;
  const text = `Lihat roadmap ${roadmap.title} ini!`;
  
  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  };
  
  window.open(shareUrls[platform], '_blank', 'width=600,height=400,noopener,noreferrer');
};

export const exportAsJSON = (roadmap: Roadmap, progress?: UserProgress) => {
  const completedCount = progress?.completedNodes.length || 0;
  const totalCount = roadmap.nodes.length;
  
  const data = {
    roadmap: {
      id: roadmap.id,
      title: roadmap.title,
      description: roadmap.description,
      totalWeeks: roadmap.totalWeeks,
      totalNodes: totalCount,
      categories: roadmap.nodes.reduce((acc, node) => {
        acc[node.category] = (acc[node.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    },
    progress: progress ? {
      completedNodes: progress.completedNodes,
      completedCount,
      totalCount,
      percentage: Math.round((completedCount / totalCount) * 100),
      lastUpdated: progress.lastUpdated,
    } : null,
    metadata: {
      exportedAt: new Date().toISOString(),
      exportedBy: 'Career Roadmap',
      version: '1.0',
    },
  };

  downloadFile(
    JSON.stringify(data, null, 2),
    `${roadmap.id}-progress-${formatDate()}.json`,
    'application/json'
  );
};

export const exportAsMarkdown = (roadmap: Roadmap, progress?: UserProgress) => {
  const completedNodes = progress?.completedNodes || [];
  const completedCount = completedNodes.length;
  const totalCount = roadmap.nodes.length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  let md = `# Roadmap ${roadmap.title}\n\n`;
  md += `> ${roadmap.description}\n\n`;
  md += `## Informasi Umum\n\n`;
  md += `| Item | Detail |\n`;
  md += `|------|--------|\n`;
  md += `| **Durasi Total** | ${roadmap.totalWeeks} minggu |\n`;
  md += `| **Total Topik** | ${totalCount} topik |\n`;
  md += `| **Terakhir Diupdate** | ${formatDateIndonesia(new Date())} |\n\n`;
  
  if (progress) {
    md += `## Progress Pembelajaran\n\n`;
    md += `\`\`\`\n`;
    md += `Progress: ${completedCount}/${totalCount} topik (${progressPercentage}%)\n`;
    md += `${'█'.repeat(Math.floor(progressPercentage / 5))}${'░'.repeat(20 - Math.floor(progressPercentage / 5))} ${progressPercentage}%\n`;
    md += `\`\`\`\n\n`;
    md += `- **Selesai:** ${completedCount} topik\n`;
    md += `- **Belum Selesai:** ${totalCount - completedCount} topik\n`;
    md += `- **Terakhir Update:** ${formatDateIndonesia(new Date(progress.lastUpdated))}\n\n`;
  }

  const categoryNames = {
    fundamentals: 'Fundamental',
    core: 'Core',
    advanced: 'Advanced',
    specialization: 'Spesialisasi',
  };

  const categories = ['fundamentals', 'core', 'advanced', 'specialization'] as const;
  
  categories.forEach(category => {
    const nodes = roadmap.nodes.filter(n => n.category === category);
    if (nodes.length === 0) return;
    
    const categoryCompleted = nodes.filter(n => completedNodes.includes(n.id)).length;
    const categoryProgress = Math.round((categoryCompleted / nodes.length) * 100);
    
    md += `## ${categoryNames[category]}\n\n`;
    md += `**Progress:** ${categoryCompleted}/${nodes.length} (${categoryProgress}%)\n\n`;
    
    nodes.forEach((node, index) => {
      const isCompleted = completedNodes.includes(node.id);
      const checkbox = isCompleted ? '[x]' : '[ ]';
      
      md += `### ${index + 1}. ${checkbox} ${node.title}\n\n`;
      md += `- **Estimasi:** ${node.estimatedWeeks} minggu\n`;
      md += `- **Deskripsi:** ${node.description}\n`;
      
      if (node.resources.length > 0) {
        md += `- **Sumber Belajar:**\n`;
        node.resources.forEach(resource => {
          const badge = resource.isFree ? '(Gratis)' : '(Berbayar)';
          md += `  - [${resource.title}](${resource.url}) ${badge}\n`;
        });
      }
      md += `\n`;
    });
    md += `---\n\n`;
  });

  md += `## Catatan\n\n`;
  md += `- Roadmap ini adalah panduan pembelajaran yang dapat disesuaikan dengan kebutuhan Anda\n`;
  md += `- Estimasi waktu bersifat fleksibel tergantung kecepatan belajar masing-masing\n`;
  md += `- Jangan ragu untuk mengeksplorasi sumber belajar tambahan\n\n`;
  md += `---\n\n`;
  md += `<div align="center">\n`;
  md += `<sub>Career Roadmap | ${formatDateIndonesia(new Date())}</sub>\n`;
  md += `</div>\n`;

  downloadFile(md, `${roadmap.id}-roadmap-${formatDate()}.md`, 'text/markdown');
};

export const exportAsPDF = (roadmap: Roadmap, progress?: UserProgress) => {
  const completedNodes = progress?.completedNodes || [];
  const completedCount = completedNodes.length;
  const totalCount = roadmap.nodes.length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Popup diblokir! Izinkan popup untuk mengekspor PDF.');
    return;
  }

  const categoryNames = {
    fundamentals: 'Fundamental',
    core: 'Core',
    advanced: 'Advanced',
    specialization: 'Spesialisasi',
  };

  const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Roadmap ${roadmap.title}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 30px;
          line-height: 1.8;
          color: #333;
        }
        header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 30px;
          border-bottom: 3px solid #9c40ff;
        }
        h1 {
          color: #9c40ff;
          font-size: 2.5em;
          margin-bottom: 15px;
        }
        .subtitle {
          color: #666;
          font-size: 1.1em;
          margin-bottom: 20px;
        }
        .meta-box {
          background: linear-gradient(135deg, #f5f3ff 0%, #fff5f0 100%);
          padding: 25px;
          border-radius: 12px;
          margin: 30px 0;
          border-left: 5px solid #9c40ff;
        }
        .meta-box h3 {
          color: #9c40ff;
          margin-bottom: 15px;
          font-size: 1.3em;
        }
        .meta-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .meta-label {
          font-weight: 600;
          color: #555;
        }
        .progress-bar {
          width: 100%;
          height: 30px;
          background: #e0e0e0;
          border-radius: 15px;
          overflow: hidden;
          margin: 15px 0;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #4caf50 0%, #8bc34a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          transition: width 0.3s;
        }
        h2 {
          color: #ffaa40;
          margin: 40px 0 20px 0;
          padding-bottom: 10px;
          border-bottom: 2px solid #ffaa40;
          font-size: 1.8em;
        }
        .category-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .category-progress {
          font-size: 0.9em;
          color: #666;
          background: #f0f0f0;
          padding: 5px 15px;
          border-radius: 20px;
        }
        .node {
          margin: 25px 0;
          padding: 20px;
          border-left: 4px solid #9c40ff;
          background: #fafafa;
          border-radius: 8px;
          page-break-inside: avoid;
        }
        .node.completed {
          background: #e8f5e9;
          border-left-color: #4caf50;
        }
        .node h3 {
          color: #333;
          margin-bottom: 10px;
          font-size: 1.3em;
        }
        .node-meta {
          color: #666;
          font-size: 0.9em;
          margin-bottom: 10px;
        }
        .node-description {
          margin: 15px 0;
          color: #555;
        }
        .resources {
          margin-top: 15px;
          padding: 15px;
          background: white;
          border-radius: 6px;
        }
        .resources h4 {
          color: #9c40ff;
          margin-bottom: 10px;
          font-size: 1em;
        }
        .resources ul {
          list-style: none;
          padding-left: 0;
        }
        .resources li {
          margin: 8px 0;
          padding-left: 25px;
          position: relative;
        }
        .resources li::before {
          content: "•";
          position: absolute;
          left: 0;
        }
        .resources a {
          color: #9c40ff;
          text-decoration: none;
        }
        .badge {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 12px;
          font-size: 0.85em;
          margin-left: 8px;
        }
        .badge-free {
          background: #e8f5e9;
          color: #4caf50;
        }
        .badge-paid {
          background: #fff3e0;
          color: #ff9800;
        }
        footer {
          margin-top: 60px;
          padding-top: 30px;
          border-top: 2px solid #e0e0e0;
          text-align: center;
          color: #999;
          font-size: 0.9em;
        }
        .status-badge {
          display: inline-block;
          padding: 5px 12px;
          border-radius: 15px;
          font-size: 0.85em;
          font-weight: 600;
          margin-right: 10px;
        }
        .status-completed {
          background: #4caf50;
          color: white;
        }
        .status-pending {
          background: #ff9800;
          color: white;
        }
        @media print {
          body { padding: 20px; }
          .node { page-break-inside: avoid; }
          @page { margin: 2cm; }
        }
      </style>
    </head>
    <body>
      <header>
        <h1>Roadmap ${roadmap.title}</h1>
        <p class="subtitle">${roadmap.description}</p>
      </header>
      
      <div class="meta-box">
        <h3>Informasi Roadmap</h3>
        <div class="meta-grid">
          <div class="meta-item">
            <span class="meta-label">Durasi Total:</span>
            <span>${roadmap.totalWeeks} minggu</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Total Topik:</span>
            <span>${totalCount} topik</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Diekspor:</span>
            <span>${formatDateIndonesia(new Date())}</span>
          </div>
          ${progress ? `
            <div class="meta-item">
              <span class="meta-label">Terakhir Update:</span>
              <span>${formatDateIndonesia(new Date(progress.lastUpdated))}</span>
            </div>
          ` : ''}
        </div>
        
        ${progress ? `
          <div style="margin-top: 20px;">
            <h4 style="margin-bottom: 10px;">Progress Pembelajaran</h4>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progressPercentage}%">
                ${progressPercentage}%
              </div>
            </div>
            <p style="text-align: center; color: #666;">
              ${completedCount} dari ${totalCount} topik selesai
            </p>
          </div>
        ` : ''}
      </div>

      ${(['fundamentals', 'core', 'advanced', 'specialization'] as const).map(category => {
        const nodes = roadmap.nodes.filter(n => n.category === category);
        if (nodes.length === 0) return '';
        
        const categoryCompleted = nodes.filter(n => completedNodes.includes(n.id)).length;
        const categoryProgress = Math.round((categoryCompleted / nodes.length) * 100);
        
        return `
          <div class="category-header">
            <h2>${categoryNames[category]}</h2>
            <span class="category-progress">
              ${categoryCompleted}/${nodes.length} topik (${categoryProgress}%)
            </span>
          </div>
          
          ${nodes.map((node, index) => {
            const isCompleted = completedNodes.includes(node.id);
            return `
              <div class="node ${isCompleted ? 'completed' : ''}">
                <h3>
                  ${isCompleted ? '<span class="status-badge status-completed">Selesai</span>' : '<span class="status-badge status-pending">Belum</span>'}
                  ${index + 1}. ${node.title}
                </h3>
                <div class="node-meta">
                  Estimasi: ${node.estimatedWeeks} minggu
                </div>
                <div class="node-description">${node.description}</div>
                
                ${node.resources.length > 0 ? `
                  <div class="resources">
                    <h4>Sumber Belajar:</h4>
                    <ul>
                      ${node.resources.map(r => `
                        <li>
                          <a href="${r.url}" target="_blank">${r.title}</a>
                          <span class="badge ${r.isFree ? 'badge-free' : 'badge-paid'}">
                            ${r.isFree ? 'Gratis' : 'Berbayar'}
                          </span>
                        </li>
                      `).join('')}
                    </ul>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        `;
      }).join('')}

      <footer>
        <p><strong>Career Roadmap</strong></p>
        <p>Roadmap pembelajaran untuk mahasiswa IT</p>
        <p style="margin-top: 10px;">Career Roadmap | ${formatDateIndonesia(new Date())}</p>
      </footer>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();

  setTimeout(() => {
    printWindow.print();
  }, 750);
};

const downloadFile = (content: string, filename: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const formatDate = () => {
  const now = new Date();
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
};

const formatDateIndonesia = (date: Date) => {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};