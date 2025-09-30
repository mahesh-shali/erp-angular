import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRights } from './user-rights';

describe('UserRights', () => {
  let component: UserRights;
  let fixture: ComponentFixture<UserRights>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRights]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRights);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
