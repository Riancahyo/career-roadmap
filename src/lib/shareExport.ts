import { Roadmap, UserProgress } from '@/types/roadmap';

export const shareRoadmap = async (roadmap: Roadmap, progress?: UserProgress) => {
  const url = `${window.location.origin}/roadmap/${roadmap.id}`;
  const progressText = progress 
    ? `\n\n📊 My Progress: ${Math.round((progress.completedNodes.length / roadmap.nodes.length) * 100)}%`
    : '';
  
  const shareData = {
    title: `${roadmap.title} Roadmap`,
    text: `Check out this ${roadmap.title} roadmap! ${roadmap.description}${progressText}`,
    url: url,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return { success: true, method: 'native' };
    } else {
      await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
      return { success: true, method: 'clipboard' };
    }
  } catch (error) {
    console.error('Error sharing:', error);
    return { success: false, error };
  }
};

export const shareToSocial = (platform: 'twitter' | 'linkedin' | 'facebook', roadmap: Roadmap) => {
  const url = `${window.location.origin}/roadmap/${roadmap.id}`;
  const text = `Check out this ${roadmap.title} roadmap!`;
  
  let shareUrl = '';
  
  switch (platform) {
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      break;
    case 'linkedin':
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
      break;
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      break;
  }
  
  window.open(shareUrl, '_blank', 'width=600,height=400');
};

export const exportAsJSON = (roadmap: Roadmap, progress?: UserProgress) => {
  const data = {
    roadmap: {
      id: roadmap.id,
      title: roadmap.title,
      description: roadmap.description,
      totalWeeks: roadmap.totalWeeks,
      totalNodes: roadmap.nodes.length,
    },
    progress: progress ? {
      completedNodes: progress.completedNodes.length,
      percentage: Math.round((progress.completedNodes.length / roadmap.nodes.length) * 100),
      lastUpdated: progress.lastUpdated,
    } : null,
    exportedAt: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${roadmap.id}-progress.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportAsMarkdown = (roadmap: Roadmap, progress?: UserProgress) => {
  const completedNodes = progress?.completedNodes || [];
  const progressPercentage = progress 
    ? Math.round((completedNodes.length / roadmap.nodes.length) * 100)
    : 0;

  let markdown = `# ${roadmap.title} Roadmap\n\n`;
  markdown += `${roadmap.description}\n\n`;
  markdown += `**Total Duration:** ${roadmap.totalWeeks} weeks\n`;
  markdown += `**Total Topics:** ${roadmap.nodes.length}\n\n`;
  
  if (progress) {
    markdown += `## My Progress\n\n`;
    markdown += `- Completed: ${completedNodes.length}/${roadmap.nodes.length} topics (${progressPercentage}%)\n`;
    markdown += `- Last Updated: ${new Date(progress.lastUpdated).toLocaleDateString()}\n\n`;
  }

  const categories = ['fundamentals', 'core', 'advanced', 'specialization'] as const;
  
  categories.forEach(category => {
    const nodes = roadmap.nodes.filter(n => n.category === category);
    if (nodes.length === 0) return;
    
    markdown += `## ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n`;
    
    nodes.forEach(node => {
      const isCompleted = completedNodes.includes(node.id);
      const checkbox = isCompleted ? '[x]' : '[ ]';
      markdown += `${checkbox} **${node.title}** (${node.estimatedWeeks} weeks)\n`;
      markdown += `   - ${node.description}\n`;
      
      if (node.resources.length > 0) {
        markdown += `   - Resources:\n`;
        node.resources.forEach(resource => {
          markdown += `     - [${resource.title}](${resource.url})${resource.isFree ? ' (Free)' : ''}\n`;
        });
      }
      markdown += `\n`;
    });
  });

  markdown += `\n---\n`;
  markdown += `*Exported from Career Path Finder on ${new Date().toLocaleDateString()}*\n`;

  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${roadmap.id}-roadmap.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportAsPDF = (roadmap: Roadmap, progress?: UserProgress) => {
  const completedNodes = progress?.completedNodes || [];
  const progressPercentage = progress 
    ? Math.round((completedNodes.length / roadmap.nodes.length) * 100)
    : 0;

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${roadmap.title} Roadmap</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 40px auto;
          padding: 20px;
          line-height: 1.6;
        }
        h1 { color: #9c40ff; }
        h2 { color: #ffaa40; margin-top: 30px; }
        .meta { background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .node { margin: 20px 0; padding: 15px; border-left: 3px solid #9c40ff; }
        .completed { background: #e8f5e9; border-left-color: #4caf50; }
        .resource { margin-left: 20px; }
        @media print {
          body { margin: 0; padding: 20px; }
        }
      </style>
    </head>
    <body>
      <h1>${roadmap.title} Roadmap</h1>
      <p>${roadmap.description}</p>
      
      <div class="meta">
        <p><strong>Total Duration:</strong> ${roadmap.totalWeeks} weeks</p>
        <p><strong>Total Topics:</strong> ${roadmap.nodes.length}</p>
        ${progress ? `
          <p><strong>Your Progress:</strong> ${completedNodes.length}/${roadmap.nodes.length} topics (${progressPercentage}%)</p>
          <p><strong>Last Updated:</strong> ${new Date(progress.lastUpdated).toLocaleDateString()}</p>
        ` : ''}
      </div>

      ${['fundamentals', 'core', 'advanced', 'specialization'].map(category => {
        const nodes = roadmap.nodes.filter(n => n.category === category);
        if (nodes.length === 0) return '';
        
        return `
          <h2>${category.charAt(0).toUpperCase() + category.slice(1)}</h2>
          ${nodes.map(node => {
            const isCompleted = completedNodes.includes(node.id);
            return `
              <div class="node ${isCompleted ? 'completed' : ''}">
                <h3>${isCompleted ? '✓ ' : ''}${node.title} (${node.estimatedWeeks} weeks)</h3>
                <p>${node.description}</p>
                ${node.resources.length > 0 ? `
                  <div class="resource">
                    <strong>Resources:</strong>
                    <ul>
                      ${node.resources.map(r => `<li><a href="${r.url}">${r.title}</a>${r.isFree ? ' (Free)' : ''}</li>`).join('')}
                    </ul>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        `;
      }).join('')}

      <hr style="margin: 40px 0;">
      <p style="text-align: center; color: #666;">
        <em>Exported from Career Path Finder on ${new Date().toLocaleDateString()}</em>
      </p>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();

  setTimeout(() => {
    printWindow.print();
  }, 500);
};