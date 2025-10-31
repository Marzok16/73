import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';

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
}

class PDFService {
  private doc: jsPDF;
  private currentY: number = 20;
  private pageHeight: number = 280; // A4 page height in mm
  private margin: number = 20;

  constructor() {
    this.doc = new jsPDF('p', 'mm', 'a4');
    this.setupFonts();
  }

  private setupFonts() {
    // Add Arabic font support
    this.doc.setFont('helvetica');
  }

  private addNewPageIfNeeded(requiredHeight: number = 50) {
    if (this.currentY + requiredHeight > this.pageHeight) {
      this.doc.addPage();
      this.currentY = 20;
    }
  }

  private async loadImageAsBase64(imageUrl: string): Promise<string> {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error loading image:', error);
      return '';
    }
  }

  private addTitle(title: string, fontSize: number = 20) {
    this.addNewPageIfNeeded(30);
    this.doc.setFontSize(fontSize);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.margin, this.currentY);
    this.currentY += 15;
  }

  private addSubtitle(subtitle: string, fontSize: number = 16) {
    this.addNewPageIfNeeded(25);
    this.doc.setFontSize(fontSize);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(subtitle, this.margin, this.currentY);
    this.currentY += 10;
  }

  private addText(text: string, fontSize: number = 12, maxWidth: number = 170) {
    this.addNewPageIfNeeded(20);
    this.doc.setFontSize(fontSize);
    this.doc.setFont('helvetica', 'normal');
    
    const lines = this.doc.splitTextToSize(text, maxWidth);
    this.doc.text(lines, this.margin, this.currentY);
    this.currentY += lines.length * 5 + 5;
  }

  private async addImage(imageUrl: string, width: number = 80, height: number = 60) {
    this.addNewPageIfNeeded(height + 10);
    
    try {
      const base64 = await this.loadImageAsBase64(imageUrl);
      if (base64) {
        this.doc.addImage(base64, 'JPEG', this.margin, this.currentY, width, height);
        this.currentY += height + 10;
      }
    } catch (error) {
      console.error('Error adding image:', error);
      this.addText('صورة غير متاحة', 10);
    }
  }

  private addDivider() {
    this.addNewPageIfNeeded(10);
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, this.currentY, this.margin + 170, this.currentY);
    this.currentY += 10;
  }

  async generateMemoryBook(data: MemoryBookData): Promise<Blob> {
    // Reset document
    this.doc = new jsPDF('p', 'mm', 'a4');
    this.currentY = 20;
    this.setupFonts();

    // Cover Page
    this.addTitle('كتاب الذكريات الجامعية', 24);
    this.currentY += 20;
    this.addText('مجموعة شاملة من الذكريات واللحظات المميزة', 16);
    this.currentY += 30;
    this.addText(`تاريخ الإنشاء: ${new Date().toLocaleDateString('ar-SA')}`, 12);
    
    this.addDivider();

    // Graduation Section
    this.addTitle('حفلة التخرج', 20);
    this.addText(data.graduation.title, 16);
    
    data.graduation.events.forEach((event, index) => {
      this.addSubtitle(`${index + 1}. ${event.title}`, 14);
      this.addText(`التاريخ: ${event.date}`, 12);
      this.addText(`الوقت: ${event.time}`, 12);
      this.addText(`المكان: ${event.location}`, 12);
      this.addText(event.description, 12);
      this.currentY += 5;
    });

    this.addDivider();

    // Memories Section
    this.addTitle('الصور التذكارية', 20);
    
    for (const memory of data.memories) {
      this.addSubtitle(memory.title, 14);
      if (memory.description) {
        this.addText(memory.description, 12);
      }
      this.addText(`الفئة: ${memory.category}`, 10);
      this.addText(`تاريخ الإنشاء: ${new Date(memory.created_at).toLocaleDateString('ar-SA')}`, 10);
      
      if (memory.is_featured) {
        this.addText('⭐ صورة مميزة', 10);
      }
      
      if (memory.image) {
        await this.addImage(memory.image, 80, 60);
      }
      
      this.addDivider();
    }

    // Meetings Section
    this.addTitle('صور اللقاءات', 20);
    
    for (const meeting of data.meetings) {
      this.addSubtitle(meeting.title, 14);
      if (meeting.description) {
        this.addText(meeting.description, 12);
      }
      this.addText(`الفئة: ${meeting.category}`, 10);
      this.addText(`تاريخ الإنشاء: ${new Date(meeting.created_at).toLocaleDateString('ar-SA')}`, 10);
      
      if (meeting.is_featured) {
        this.addText('⭐ صورة مميزة', 10);
      }
      
      if (meeting.image) {
        await this.addImage(meeting.image, 80, 60);
      }
      
      this.addDivider();
    }

    // Historical Photos Section
    this.addTitle('الصور التاريخية', 20);
    
    for (const photo of data.historical) {
      this.addSubtitle(photo.title, 14);
      if (photo.description) {
        this.addText(photo.description, 12);
      }
      this.addText(`الفئة: ${photo.category}`, 10);
      this.addText(`تاريخ الإنشاء: ${new Date(photo.created_at).toLocaleDateString('ar-SA')}`, 10);
      
      if (photo.is_featured) {
        this.addText('⭐ صورة مميزة', 10);
      }
      
      if (photo.image) {
        await this.addImage(photo.image, 80, 60);
      }
      
      this.addDivider();
    }

    // Colleagues Section
    this.addTitle('الزملاء', 20);
    
    for (const colleague of data.colleagues) {
      this.addSubtitle(colleague.name, 14);
      this.addText(`سنة التخرج: ${colleague.graduation_year}`, 12);
      this.addText(`الوظيفة الحالية: ${colleague.current_job}`, 12);
      if (colleague.bio) {
        this.addText(colleague.bio, 12);
      }
      this.addText(`البريد الإلكتروني: ${colleague.email}`, 10);
      this.addText(`الهاتف: ${colleague.phone}`, 10);
      
      if (colleague.profile_image) {
        await this.addImage(colleague.profile_image, 60, 45);
      }
      
      this.addDivider();
    }

    // Footer
    this.addNewPageIfNeeded(30);
    this.addText('--- نهاية الكتاب ---', 12);
    this.addText('تم إنشاء هذا الكتاب تلقائياً من نظام الذكريات الجامعية', 10);

    return this.doc.output('blob');
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

export default new PDFService();
