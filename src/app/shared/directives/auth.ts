import { OnInit, OnDestroy, Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';

// Services
import { UserService } from '../services/user/user-service';

@Directive({
  selector: '[appAuth]',
})

export class Auth implements OnInit, OnDestroy {
  private subscription?: Subscription;
  private hasView = false;

  constructor(
    private userService: UserService,
    private templateRef: TemplateRef<any>,
    private containerRef: ViewContainerRef
  ) { }

  ngOnInit(): void {
    //--- Evitar duplicado
    this.subscription = this.userService.authStatus
      .subscribe((isLogueado) => {
        if (isLogueado) {
          //--- Crear vista si no existe
          if (!this.hasView) {
            console.log('Sí está logueado, creando vista');
            this.containerRef.createEmbeddedView(this.templateRef);
            this.hasView = true;
          }
        } else {
          //--- Limpiar vista si existe
          if (this.hasView) {
            console.log('No está logueado, limpiando vista');
            this.containerRef.clear();
            this.hasView = false;
          }
        }
      });
  }

  ngOnDestroy(): void {
    // Importante: limpiar suscripción
    this.subscription?.unsubscribe();
  }
}
