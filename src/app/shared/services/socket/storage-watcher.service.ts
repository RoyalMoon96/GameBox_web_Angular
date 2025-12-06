// room-watcher.service.ts
import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoomWatcherService {
  private roomSubject = new BehaviorSubject<string | null>(localStorage.getItem('room'));
  room$ = this.roomSubject.asObservable();

  constructor(private zone: NgZone) {
    window.addEventListener('storage', (event) => {
      if (event.key === 'room') {
        this.zone.run(() => this.roomSubject.next(event.newValue));
      }
    });

    // Para detectar cambios hechos por el juego dentro del mismo documento
    this.overrideLocalStorage();
  }

  private overrideLocalStorage() {
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = (...args: [key: string, value: string]) => {
      originalSetItem.apply(localStorage, args);
      if (args[0] === 'room') {
        this.roomSubject.next(args[1]);
      }
    };
  }
}
