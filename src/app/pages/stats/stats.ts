// Angular
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Matirials
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

//Services
import { StatsService } from '../../shared/services/stats/stats-service';

//directives

//Components
import { IMatch } from '../../shared/types/imatch';
import { UserService } from '../../shared/services/user/user-service';

@Component({
  selector: 'app-stats',
  imports: [MatIconModule,MatButtonModule ],
  templateUrl: './stats.html',
  styleUrl: './stats.scss',
})
export class Stats implements OnInit{
  matches:IMatch[]=[]
  wins: Number = 0
  constructor (private statsService:StatsService, private userService: UserService){}
  ngOnInit(): void {
    this.statsService.getStats().subscribe(data => {
      this.matches = data.stats;
      this.wins = data.wins;
    });
  }

  @ViewChild('matchesContainer', { static: false }) el!: ElementRef;

  public exportToPdf(): void {
    const data = this.el.nativeElement;
    html2canvas(data).then((canvas) => {
      const imgWidth = 208; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // portrait, millimeters, A4 format
      let position = 0;

      // Add the image to the PDF
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Handle multi-page content if the cards exceed one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save('downloaded-matches.pdf'); // Download the PDF
    });
  }

}
