
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, ViewChild, viewChild } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { TokenService } from '../../../shared/services/token/token-service';
import { UserService } from '../../../shared/services/user/user-service';
import { Iuser } from '../../../shared/types/iuser';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UploadService } from '../../../shared/services/uploader/upload-service';


@Component({
  selector: 'app-uploader',
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './uploader.html',
  styleUrl: './uploader.scss',
})

export class Uploader {
  isLoading: boolean = false;
  previewUrl: string = '';
  uploadedImg: string = ''
  @Input() usuario: Iuser
  @ViewChild('avatarImg') userImg!: HTMLImageElement;

  constructor(private http: HttpClient, private userService: UserService , private tokenService: TokenService, private uploadService: UploadService) {
    this.usuario = this.userService.CleanUser()
    
  }

  onFileSelected(input: HTMLInputElement) {
    if (input.files && input.files.length === 1) {
      this.uploadService.setFile(input.files[0]);
      if (this.uploadService.file) {
        if (this.uploadedImg) URL.revokeObjectURL(this.uploadedImg);
        this.uploadedImg = URL.createObjectURL(this.uploadService.file)
        this.userImg.src = this.uploadedImg
      }
    } else {
      this.userImg.src = this.usuario.img
      console.log('Seleccion invalida. Debes seleccionar solo un archivo')
    }
  }

  clearFile(input: HTMLInputElement) {
    if (this.uploadService.file) {
      this.uploadService.file = undefined;
      input.value = '';
      this.previewUrl = '';
    }
  }

  triggerUpload(input: HTMLInputElement) {
    this.clearFile(input)
    this.uploadService.file=undefined
    input.click();
  }

}