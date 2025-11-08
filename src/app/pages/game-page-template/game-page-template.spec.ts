import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamePageTemplate } from './game-page-template';

describe('GamePageTemplate', () => {
  let component: GamePageTemplate;
  let fixture: ComponentFixture<GamePageTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamePageTemplate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamePageTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
