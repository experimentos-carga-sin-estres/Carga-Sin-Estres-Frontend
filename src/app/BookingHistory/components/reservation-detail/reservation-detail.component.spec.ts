import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationDetailComponent } from './reservation-detail.component';

describe('ReservationDetailComponent', () => {
  let component: ReservationDetailComponent;
  let fixture: ComponentFixture<ReservationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReservationDetailComponent]
    });
    fixture = TestBed.createComponent(ReservationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
