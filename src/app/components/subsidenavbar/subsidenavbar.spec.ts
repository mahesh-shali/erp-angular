import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subsidenavbar } from './subsidenavbar';

describe('Subsidenavbar', () => {
  let component: Subsidenavbar;
  let fixture: ComponentFixture<Subsidenavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subsidenavbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Subsidenavbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
