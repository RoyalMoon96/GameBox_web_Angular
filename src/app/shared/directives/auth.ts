import { AfterViewInit, Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

// Services
import { UserService } from '../services/user/user-service';

@Directive({
  selector: '[appAuth]'
})

export class Auth implements AfterViewInit {

  @Input() appAuth = "";

  constructor(
    private userService: UserService,
    private templateRef: TemplateRef<any>,
    private containerRef: ViewContainerRef
  ) { }

  ngAfterViewInit(): void {
    this.userService.authStatus.subscribe((isLogueado) => {
      if (isLogueado) {
        console.log('Sí está logueado, debo crear el component');
        this.containerRef.createEmbeddedView(this.templateRef);
      } else {
        console.log('No está logueado, debo destruir el component');
        this.containerRef.clear();
      }
    });
  }
}
