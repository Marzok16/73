import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface MemoryBookData {
  graduation: {
    title: string;
    events: Array<{
      title: string;
      date: string;
      time: string;
      location: string;
      description: string;
    }>;
  };
  memories: Array<{
    id: number;
    title: string;
    description: string;
    image: string;
    category: string;
    is_featured: boolean;
    created_at: string;
  }>;
  meetings: Array<{
    id: number;
    title: string;
    description: string;
    image: string;
    category: string;
    is_featured: boolean;
    created_at: string;
  }>;
  historical: Array<{
    id: number;
    title: string;
    description: string;
    image: string;
    category: string;
    is_featured: boolean;
    created_at: string;
  }>;
  colleagues: Array<{
    id: number;
    name: string;
    email: string;
    phone: string;
    graduation_year: string;
    current_job: string;
    bio: string;
    profile_image: string;
  }>;
  historyGroups?: Array<{
    title: string;
    description?: string;
    images: Array<{ src: string; caption?: string }>;
  }>;
}

class ArabicPDFService {
  private generateHTMLContent(data: MemoryBookData): string {
    const currentDate = new Date().toLocaleDateString('ar-SA');
    
    return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>كتاب الذكريات الجامعية</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Amiri', 'Cairo', 'Arial', sans-serif;
                line-height: 1.8;
                color: #2c3e50;
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                direction: rtl;
                text-align: right;
            }
            
            .page {
                width: 210mm;
                min-height: 297mm;
                padding: 25mm;
                margin: 0 auto;
                background: white;
                box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                page-break-after: always;
                page-break-inside: avoid;
                border-radius: 8px;
                position: relative;
            }
            
            /* Force each section to start on a new page */
            .section-page {
                page-break-before: always !important;
                page-break-after: always !important;
                page-break-inside: avoid !important;
                break-before: page !important;
                break-after: page !important;
                break-inside: avoid !important;
            }
            
            .cover-page {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                position: relative;
                overflow: hidden;
            }
            
            .cover-page::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
                opacity: 0.3;
            }
            
            .cover-title {
                font-size: 3rem;
                font-weight: bold;
                margin-bottom: 2rem;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            
            .cover-subtitle {
                font-size: 1.5rem;
                margin-bottom: 3rem;
                opacity: 0.9;
            }
            
            .cover-date {
                font-size: 1.2rem;
                opacity: 0.8;
            }
            
            .section-title {
                font-size: 2.8rem;
                font-weight: 700;
                color: #2c3e50;
                margin: 3rem 0 2rem 0;
                padding-bottom: 1.5rem;
                border-bottom: 4px solid #3498db;
                text-align: center;
                position: relative;
                text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .section-title::after {
                content: '';
                position: absolute;
                bottom: -2px;
                left: 50%;
                transform: translateX(-50%);
                width: 60px;
                height: 4px;
                background: linear-gradient(90deg, #3498db, #9b59b6);
                border-radius: 2px;
            }
            
            .subsection-title {
                font-size: 1.5rem;
                font-weight: bold;
                color: #34495e;
                margin: 1.5rem 0 0.5rem 0;
            }
            
            .event-card {
                background: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 8px;
                padding: 1rem;
                margin: 1rem 0;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                page-break-inside: avoid;
                break-inside: avoid;
            }
            
            .event-title {
                font-size: 1.3rem;
                font-weight: bold;
                color: #2c3e50;
                margin-bottom: 0.5rem;
            }
            
            .event-details {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 0.5rem;
                margin: 0.5rem 0;
                font-size: 0.9rem;
                color: #6c757d;
            }
            
            .event-description {
                margin-top: 0.5rem;
                font-style: italic;
                color: #495057;
            }
            
            .photo-card {
                background: #fff;
                border: 1px solid #e9ecef;
                border-radius: 8px;
                padding: 1rem;
                margin: 1rem 0;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                page-break-inside: avoid;
                break-inside: avoid;
            }
            
            .photo-title {
                font-size: 1.2rem;
                font-weight: bold;
                color: #2c3e50;
                margin-bottom: 0.5rem;
            }
            
            .photo-meta {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 0.5rem 0;
                font-size: 0.9rem;
                color: #6c757d;
            }
            
            .photo-category {
                background: #3498db;
                color: white;
                padding: 0.2rem 0.5rem;
                border-radius: 4px;
                font-size: 0.8rem;
            }
            
            .photo-featured {
                background: #f39c12;
                color: white;
                padding: 0.2rem 0.5rem;
                border-radius: 4px;
                font-size: 0.8rem;
            }
            
            .photo-description {
                margin: 0.5rem 0;
                color: #495057;
                line-height: 1.6;
            }
            
            .photo-image {
                width: 100%;
                max-width: 300px;
                height: auto;
                border-radius: 8px;
                margin: 0.5rem 0;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                page-break-inside: avoid;
                break-inside: avoid;
            }
            
            .colleague-card {
                background: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 8px;
                padding: 1rem;
                margin: 1rem 0;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                page-break-inside: avoid;
                break-inside: avoid;
            }
            
            .colleague-name {
                font-size: 1.3rem;
                font-weight: bold;
                color: #2c3e50;
                margin-bottom: 0.5rem;
            }
            
            .colleague-info {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 0.5rem;
                margin: 0.5rem 0;
                font-size: 0.9rem;
                color: #6c757d;
            }
            
            .colleague-bio {
                margin-top: 0.5rem;
                font-style: italic;
                color: #495057;
                line-height: 1.6;
            }
            
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 1rem;
                margin: 2rem 0;
            }
            
            .stat-card {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 1.5rem;
                border-radius: 8px;
                text-align: center;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            
            .stat-number {
                font-size: 2rem;
                font-weight: bold;
                margin-bottom: 0.5rem;
            }
            
            .stat-label {
                font-size: 1rem;
                opacity: 0.9;
            }
            
            .divider {
                height: 2px;
                background: linear-gradient(to right, transparent, #3498db, transparent);
                margin: 2rem 0;
            }
            
            .footer {
                text-align: center;
                margin-top: 3rem;
                padding-top: 2rem;
                border-top: 2px solid #e9ecef;
                color: #6c757d;
                font-size: 0.9rem;
            }
            
            @media print {
                .page {
                    box-shadow: none;
                    margin: 0;
                }
                
                /* Prevent page breaks inside important elements - STRONGEST PROTECTION */
                .photo-card,
                .event-card,
                .colleague-card,
                .photo-image,
                img {
                    page-break-inside: avoid !important;
                    break-inside: avoid !important;
                    break-before: avoid !important;
                    break-after: avoid !important;
                }
                
                /* STRONGEST PROTECTION - NO IMAGE SPLITTING */
                .images-grid {
                    page-break-inside: avoid !important;
                    break-inside: avoid !important;
                    break-before: avoid !important;
                    break-after: avoid !important;
                    orphans: 6 !important;
                    widows: 6 !important;
                }
                
                .image-container {
                    page-break-inside: avoid !important;
                    break-inside: avoid !important;
                    break-before: avoid !important;
                    break-after: avoid !important;
                    orphans: 1 !important;
                    widows: 1 !important;
                }
                
                /* 4 IMAGES PER PAGE - 20% HEIGHT EACH WITH ASPECT RATIO PRESERVED */
                img {
                    max-width: 100% !important;
                    max-height: 100% !important;
                    width: auto !important;
                    height: auto !important;
                    object-fit: contain !important;
                    page-break-inside: avoid !important;
                    break-inside: avoid !important;
                    break-before: avoid !important;
                    break-after: avoid !important;
                    display: block !important;
                    margin: 0 auto !important;
                    border-radius: 4px !important;
                    position: relative !important;
                    isolation: isolate !important;
                    flex-shrink: 0 !important;
                    flex-grow: 0 !important;
                }
                
                /* 4 images per page - vertical layout with 20% height each */
                .images-grid {
                    display: flex !important;
                    flex-direction: column !important;
                    gap: 20px !important;
                    page-break-inside: avoid !important;
                    break-inside: avoid !important;
                    break-before: avoid !important;
                    break-after: avoid !important;
                    margin: 20px 0 !important;
                    padding: 20px !important;
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
                    border-radius: 12px !important;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
                    position: relative !important;
                    min-height: 400px !important;
                }
                
                .image-row {
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: center !important;
                    justify-content: center !important;
                    height: 20vh !important;
                    min-height: 120px !important;
                    max-height: 120px !important;
                    page-break-inside: avoid !important;
                    break-inside: avoid !important;
                    break-before: avoid !important;
                    break-after: avoid !important;
                    position: relative !important;
                    margin-bottom: 15px !important;
                    padding: 10px !important;
                    border: 1px solid #e0e0e0 !important;
                    border-radius: 8px !important;
                    background: white !important;
                }
                
                .image-container {
                    width: 100% !important;
                    height: 80px !important;
                    margin: 0 auto !important;
                    page-break-inside: avoid !important;
                    break-inside: avoid !important;
                    break-before: avoid !important;
                    break-after: avoid !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    overflow: hidden !important;
                    border-radius: 6px !important;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
                    background: white !important;
                    border: 1px solid #e9ecef !important;
                    position: relative !important;
                    isolation: isolate !important;
                    flex-shrink: 0 !important;
                    flex-grow: 0 !important;
                }
                
                .image-container:hover {
                    transform: scale(1.05) !important;
                    box-shadow: 0 6px 20px rgba(0,0,0,0.2) !important;
                }
                
                /* Force page breaks before large content */
                .photo-card:has(img),
                .event-card:has(img),
                .colleague-card:has(img) {
                    page-break-before: auto;
                    page-break-after: auto;
                    page-break-inside: avoid !important;
                    break-inside: avoid !important;
                    margin-bottom: 20px;
                }
                
                /* Ensure each image group stays together */
                .history-group,
                .photo-group {
                    page-break-inside: avoid !important;
                    break-inside: avoid !important;
                    margin-bottom: 30px;
                }
                
                /* Force sections to start on new pages */
                .section-title {
                    page-break-before: always !important;
                    break-before: page !important;
                    margin-top: 0 !important;
                }
                
                /* Prevent orphaned content */
                .photo-card + .photo-card,
                .event-card + .event-card,
                .colleague-card + .colleague-card {
                    page-break-before: auto;
                }
                
                /* Force page breaks before large content */
                .photo-card:has(img) {
                    page-break-before: auto;
                    page-break-after: auto;
                    page-break-inside: avoid !important;
                }
                
                /* Ensure each image group stays together */
                .history-group {
                    page-break-inside: avoid !important;
                    break-inside: avoid !important;
                }
            }
        </style>
    </head>
    <body>
        <!-- Cover Page -->
        <div class="page cover-page">
            <div style="position: relative; z-index: 2;">
                <h1 class="cover-title">📚 كتاب الذكريات الجامعية</h1>
                <p class="cover-subtitle">مجموعة شاملة من الذكريات واللحظات المميزة</p>
                <div style="margin: 2rem 0; padding: 1.5rem; background: rgba(255,255,255,0.15); border-radius: 15px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2);">
                    <p style="font-size: 1.2rem; margin-bottom: 0.8rem; font-weight: 600;">🎓 رحلة تعليمية مليئة بالإنجازات والنجاحات</p>
                    <p style="font-size: 1.2rem; margin-bottom: 0.8rem; font-weight: 600;">📸 لحظات لا تُنسى مع الزملاء والأصدقاء</p>
                    <p style="font-size: 1.2rem; font-weight: 600;">🌟 ذكريات ستبقى في القلب للأبد</p>
                </div>
                <p class="cover-date">تاريخ الإنشاء: ${currentDate}</p>
            </div>
        </div>
        
        <!-- Statistics Page -->
        <div class="page">
            <h2 class="section-title">📊 إحصائيات الكتاب</h2>
            <div class="stats-grid">
                <div class="stat-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                    <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📸</div>
                    <div class="stat-number">${data.memories.length + data.meetings.length + data.historical.length}</div>
                    <div class="stat-label">صورة</div>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white;">
                    <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">👥</div>
                    <div class="stat-number">${data.colleagues.length}</div>
                    <div class="stat-label">زميل</div>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white;">
                    <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🎓</div>
                    <div class="stat-number">${data.graduation.events.length}</div>
                    <div class="stat-label">فعالية</div>
                </div>
            </div>
            <div style="margin-top: 3rem; padding: 2rem; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 15px; text-align: center;">
                <h3 style="color: #2c3e50; margin-bottom: 1rem;">🎯 المجموع الكلي</h3>
                <p style="font-size: 2rem; font-weight: bold; color: #3498db;">${data.memories.length + data.meetings.length + data.historical.length + data.colleagues.length + data.graduation.events.length} عنصر</p>
                <p style="color: #6c757d; margin-top: 0.5rem;">من الذكريات واللحظات المميزة</p>
            </div>
        </div>
        
        <!-- Graduation Section -->
        <div class="page section-page">
            <h2 class="section-title">حفلة التخرج</h2>
            <p style="font-size: 1.2rem; margin-bottom: 2rem; color: #2c3e50;">${data.graduation.title}</p>
            
            ${data.graduation.events.map((event, index) => `
                <div class="event-card">
                    <h3 class="event-title">${index + 1}. ${event.title}</h3>
                    <div class="event-details">
                        <div><strong>التاريخ:</strong> ${event.date}</div>
                        <div><strong>الوقت:</strong> ${event.time}</div>
                        <div><strong>المكان:</strong> ${event.location}</div>
                    </div>
                    <p class="event-description">${event.description}</p>
                </div>
            `).join('')}
        </div>
        
        <!-- History (Timeline) Section -->
        ${Array.isArray(data.historyGroups) && data.historyGroups.length > 0 ? `
        <div class="page section-page">
            <h2 class="section-title">المسيرة التاريخية</h2>
            ${data.historyGroups.map(group => `
                <div class="history-group photo-card" style="page-break-inside: avoid !important; break-inside: avoid !important; margin-bottom: 2rem;">
                    <h3 class="photo-title">${group.title}</h3>
                    ${group.description ? `<p class="photo-description">${group.description}</p>` : ''}
                    <div class="images-grid">
                        ${group.images.slice(0, 4).map(img => `
                            <div class="image-row">
                                <div class="image-container">
                                    <img src="${img.src}" alt="${img.caption || group.title}" />
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
        ` : ''}

        <!-- Memories Section - 4 images per page -->
        ${(() => {
            const totalPages = Math.ceil(data.memories.length / 4);
            let html = '';
            
            for (let page = 0; page < totalPages; page++) {
                const startIndex = page * 4;
                const endIndex = startIndex + 4;
                const pageMemories = data.memories.slice(startIndex, endIndex);
                
                html += `
                    <div class="page section-page">
                        <h2 class="section-title">الصور التذكارية ${totalPages > 1 ? `- الصفحة ${page + 1}` : ''}</h2>
                        <div class="images-grid">
                            ${pageMemories.map(photo => `
                                <div class="image-row">
                                    <div class="image-container">
                                        <img src="${photo.image}" alt="${photo.title}" />
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
            
            return html;
        })()}
        
        <!-- Meetings Section - 4 images per page -->
        ${(() => {
            const totalPages = Math.ceil(data.meetings.length / 4);
            let html = '';
            
            for (let page = 0; page < totalPages; page++) {
                const startIndex = page * 4;
                const endIndex = startIndex + 4;
                const pageMeetings = data.meetings.slice(startIndex, endIndex);
                
                html += `
                    <div class="page section-page">
                        <h2 class="section-title">صور اللقاءات ${totalPages > 1 ? `- الصفحة ${page + 1}` : ''}</h2>
                        <div class="images-grid">
                            ${pageMeetings.map(photo => `
                                <div class="image-row">
                                    <div class="image-container">
                                        <img src="${photo.image}" alt="${photo.title}" />
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
            
            return html;
        })()}
        
        <!-- Historical Photos Section - 4 images per page -->
        ${(() => {
            const totalPages = Math.ceil(data.historical.length / 4);
            let html = '';
            
            for (let page = 0; page < totalPages; page++) {
                const startIndex = page * 4;
                const endIndex = startIndex + 4;
                const pageHistorical = data.historical.slice(startIndex, endIndex);
                
                html += `
                    <div class="page section-page">
                        <h2 class="section-title">الصور التاريخية ${totalPages > 1 ? `- الصفحة ${page + 1}` : ''}</h2>
                        <div class="images-grid">
                            ${pageHistorical.map(photo => `
                                <div class="image-row">
                                    <div class="image-container">
                                        <img src="${photo.image}" alt="${photo.title}" />
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
            
            return html;
        })()}
        
        <!-- Colleagues Section -->
        <div class="page section-page">
            <h2 class="section-title">الزملاء</h2>
            ${data.colleagues.map(colleague => `
                <div class="colleague-card">
                    <h3 class="colleague-name">${colleague.name}</h3>
                    <div class="colleague-info">
                        <div><strong>سنة التخرج:</strong> ${colleague.graduation_year}</div>
                        <div><strong>الوظيفة الحالية:</strong> ${colleague.current_job}</div>
                        <div><strong>البريد الإلكتروني:</strong> ${colleague.email}</div>
                        <div><strong>الهاتف:</strong> ${colleague.phone}</div>
                    </div>
                    ${colleague.bio ? `<p class="colleague-bio">${colleague.bio}</p>` : ''}
                    ${colleague.profile_image ? `<img src="${colleague.profile_image}" alt="${colleague.name}" class="photo-image" style="max-width: 150px;" />` : ''}
                </div>
            `).join('')}
        </div>
        
        <!-- Footer Page -->
        <div class="page">
            <div class="footer">
                <h2 style="color: #2c3e50; margin-bottom: 2rem;">نهاية الكتاب</h2>
                <p style="font-size: 1.1rem; margin-bottom: 1rem;">تم إنشاء هذا الكتاب تلقائياً من نظام الذكريات الجامعية</p>
                <p style="color: #6c757d;">جميع الحقوق محفوظة © ${new Date().getFullYear()}</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  async generateMemoryBook(data: MemoryBookData): Promise<Blob> {
    const htmlContent = this.generateHTMLContent(data);
    
    // Create a temporary container
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = htmlContent;
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    document.body.appendChild(tempContainer);

    try {
      // Convert HTML to canvas
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794, // A4 width in pixels at 96 DPI
        height: tempContainer.scrollHeight
      });

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      return pdf.output('blob');
    } finally {
      // Clean up
      document.body.removeChild(tempContainer);
    }
  }

  async generateFromHTML(elementId: string, filename: string = 'memory-book.pdf'): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  }
}

export default new ArabicPDFService();
